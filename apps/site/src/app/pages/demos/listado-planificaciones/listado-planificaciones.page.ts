import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  BadgeComponent,
  ButtonComponent,
  IconButtonComponent,
  InputComponent,
  ModalComponent,
  PageHeaderComponent,
  type BadgeIntent,
} from '@coherence/ui';

import { NotificationStore } from '../../../services/notification.store';
import {
  ProductIdentityBarComponent,
  type IdentityBreadcrumbStep,
} from '../../../components/product-identity-bar';
import { DemoShellComponent } from '../demo-shell/demo-shell.component';
import { PlannerTopBarComponent } from '../shared/planner-top-bar.component';
import { AWP_PERSONAS } from '../wealth-planner-2026/data/personas';
import {
  WealthPlannerStore,
  type Planificacion,
  type PlanificacionEstado,
} from '../wealth-planner-2026/store';

/**
 * Listado de planificaciones — per-cliente hub.
 *
 * Sits OUT of the simulación flow (top-level `/listado-planificaciones`
 * route, not under `/wealth-planner-2026`). No planner sidebar — the §1-§6
 * navigation only makes sense once a planificación is open. Chrome:
 * `<site-demo-shell>` + `<site-planner-top-bar>` + page header + table.
 *
 * Table is hand-rolled per the brief's allowance — `<afi-table>` cells lock
 * badge intent at column level, but each row's estado needs a different
 * intent (success / info / neutral).
 */
@Component({
  selector: 'site-listado-planificaciones',
  standalone: true,
  imports: [
    BadgeComponent,
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    ModalComponent,
    PageHeaderComponent,
    DemoShellComponent,
    PlannerTopBarComponent,
    ProductIdentityBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './listado-planificaciones.page.html',
  styleUrls: ['./listado-planificaciones.page.scss'],
})
export class ListadoPlanificacionesPage {
  readonly store = inject(WealthPlannerStore);
  private readonly router = inject(Router);
  private readonly notif = inject(NotificationStore);

  readonly demoSlug = 'listado-planificaciones';
  readonly demoRoute = '/listado-planificaciones';

  readonly clientName = computed<string>(
    () => this.store.cliente().alias || 'Sin cliente',
  );

  readonly identityTitle = computed<string>(
    () => `Listado del cliente · ${this.clientName()}`,
  );

  readonly identityBreadcrumb: IdentityBreadcrumbStep[] = [
    { label: 'Clientes', route: '/clientes' },
  ];

  /** Personas exposed as {id, name} for the top-bar client-picker preview. */
  readonly clientPickerList: { id: string; name: string }[] = AWP_PERSONAS.map(
    (p) => ({ id: p.id, name: p.alias }),
  );

  /** The currently active cliente in the picker — matches the seeded alias. */
  readonly activeClientId = computed<string | null>(() => {
    const alias = this.store.cliente().alias;
    return this.clientPickerList.find((c) => c.name === alias)?.id ?? null;
  });

  readonly rows = computed<Planificacion[]>(() => this.store.planificacionesSorted());
  readonly isEmpty = computed<boolean>(() => this.store.planificaciones().length === 0);

  // ── Modal state ───────────────────────────────────────────────────────
  readonly nuevaModalOpen = signal<boolean>(false);
  readonly nuevaNombre = signal<string>('');

  readonly archivarTarget = signal<Planificacion | null>(null);
  readonly archivarModalOpen = computed<boolean>(
    () => this.archivarTarget() !== null,
  );

  // ── Inline rename state ───────────────────────────────────────────────
  readonly renamingId = signal<string | null>(null);
  readonly renameValue = signal<string>('');
  readonly renameInputEl = viewChild<ElementRef<HTMLInputElement>>('renameInput');

  // ── Date formatter (es-ES) ────────────────────────────────────────────
  private readonly fechaFormatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  formatFecha(iso: string): string {
    return this.fechaFormatter.format(new Date(iso));
  }

  // ── Estado → badge mapping ────────────────────────────────────────────
  //
  // status-chip's native vocabulary doesn't include 'activa', so the brief's
  // locked semantics (activa=success, borrador=info, archivada=neutral) is
  // expressed via <afi-badge>. Borrador gets `info` (not `neutral`) so the
  // three estados stay visually distinct — neutral is reserved for archivada.
  private readonly estadoCopy: Record<PlanificacionEstado, string> = {
    activa: 'Activa',
    borrador: 'Borrador',
    archivada: 'Archivada',
  };

  private readonly estadoIntentMap: Record<PlanificacionEstado, BadgeIntent> = {
    activa: 'success',
    borrador: 'info',
    archivada: 'neutral',
  };

  estadoLabel(estado: PlanificacionEstado): string {
    return this.estadoCopy[estado];
  }

  estadoIntent(estado: PlanificacionEstado): BadgeIntent {
    return this.estadoIntentMap[estado];
  }

  // ── Row interactions ──────────────────────────────────────────────────
  openRow(plan: Planificacion, event?: Event): void {
    if (this.renamingId() !== null) return; // ignore row activation while renaming
    event?.stopPropagation();
    this.router.navigateByUrl(plan.route);
  }

  duplicateRow(plan: Planificacion, event?: Event): void {
    event?.stopPropagation();
    this.store.duplicarPlanificacion(plan.id);
  }

  archiveRow(plan: Planificacion, event?: Event): void {
    event?.stopPropagation();
    this.archivarTarget.set(plan);
  }

  // ── Nueva planificación ───────────────────────────────────────────────
  openNueva(): void {
    this.nuevaNombre.set('');
    this.nuevaModalOpen.set(true);
  }

  closeNueva(): void {
    this.nuevaModalOpen.set(false);
  }

  setNuevaNombre(value: string | number | null): void {
    this.nuevaNombre.set(value == null ? '' : String(value));
  }

  submitNueva(): void {
    const nombre = this.nuevaNombre().trim();
    if (!nombre) return;
    const plan = this.store.addPlanificacion(nombre);
    this.nuevaModalOpen.set(false);
    // Queue the prefill notice; the destination page (Familia) consumes
    // it on init and surfaces it via its existing <afi-toast>.
    this.notif.queue(
      'Información del cliente prerellenada — puedes editarla si cambió.',
    );
    this.router.navigateByUrl(plan.route);
  }

  // ── Archivar confirm ──────────────────────────────────────────────────
  cancelArchivar(): void {
    this.archivarTarget.set(null);
  }

  confirmArchivar(): void {
    const plan = this.archivarTarget();
    if (!plan) return;
    this.store.archivarPlanificacion(plan.id);
    this.archivarTarget.set(null);
  }

  // ── Inline rename ─────────────────────────────────────────────────────
  startRename(plan: Planificacion, event?: Event): void {
    event?.stopPropagation();
    this.renamingId.set(plan.id);
    this.renameValue.set(plan.nombre);
    setTimeout(() => {
      const el = this.renameInputEl()?.nativeElement;
      el?.focus();
      el?.select?.();
    }, 0);
  }

  setRenameValue(value: string | number | null): void {
    this.renameValue.set(value == null ? '' : String(value));
  }

  commitRename(): void {
    const id = this.renamingId();
    if (!id) return;
    const value = this.renameValue().trim();
    if (value) {
      this.store.renamePlanificacion(id, value);
    }
    this.cancelRename();
  }

  cancelRename(): void {
    this.renamingId.set(null);
    this.renameValue.set('');
  }

  onRenameKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.commitRename();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelRename();
    }
  }

  /** Demo-only — used by the empty-state preview to clear the seed. */
  clearAll(): void {
    this.store.clearPlanificaciones();
  }
}
