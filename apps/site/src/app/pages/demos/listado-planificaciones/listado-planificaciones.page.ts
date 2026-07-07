import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  BadgeComponent,
  ButtonComponent,
  InlineEditComponent,
  InputComponent,
  ModalComponent,
  PageHeaderComponent,
  TableComponent,
  type BadgeIntent,
  type TableColumn,
  type TableRowAction,
} from '@coherence/ui';

import { NotificationStore } from '../../../services/notification.store';
import {
  ProductIdentityBarComponent,
  type IdentityBreadcrumbStep,
} from '../../../components/product-identity-bar';
import { DemoShellComponent } from '../demo-shell/demo-shell.component';
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
 * `<site-demo-shell>` + page header + table.
 *
 * Table uses `<afi-table>` with `cellTemplates` for the per-row estado
 * badge intent and the inline-edit name.
 */
@Component({
  selector: 'site-listado-planificaciones',
  standalone: true,
  imports: [
    BadgeComponent,
    ButtonComponent,
    InlineEditComponent,
    InputComponent,
    ModalComponent,
    PageHeaderComponent,
    TableComponent,
    DemoShellComponent,
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

  readonly identityBreadcrumb = computed<IdentityBreadcrumbStep[]>(() => [
    { label: 'Clientes', route: '/clientes' },
    { label: this.clientName() },
  ]);

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

  // ── Table config ──────────────────────────────────────────────────────
  readonly columns: TableColumn[] = [
    { key: 'fecha', label: 'Fecha creación', width: 'var(--dimension-44)' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'estado', label: 'Estado', width: 'var(--dimension-32)' },
    { key: 'gestor', label: 'Gestor' },
  ];

  readonly rowActions: TableRowAction[] = [
    { key: 'duplicate', label: 'Duplicar', icon: 'duplicate', ariaLabel: 'Duplicar planificación' },
    { key: 'archive', label: 'Archivar', icon: 'archive', ariaLabel: 'Archivar planificación' },
  ];

  // Row view-model: adds the es-ES formatted `fecha`, and for archived rows
  // the reserved `actions: []` (hide actions) + `muted: true` keys.
  readonly tableRows = computed<Record<string, unknown>[]>(() =>
    this.rows().map((p) => ({
      id: p.id,
      nombre: p.nombre,
      estado: p.estado,
      gestor: p.gestor,
      route: p.route,
      fecha: this.formatFecha(p.createdAt),
      ...(p.estado === 'archivada' ? { actions: [], muted: true } : {}),
    })),
  );

  // ── Modal state ───────────────────────────────────────────────────────
  readonly nuevaModalOpen = signal<boolean>(false);
  readonly nuevaNombre = signal<string>('');

  readonly archivarTarget = signal<Planificacion | null>(null);
  readonly archivarModalOpen = computed<boolean>(
    () => this.archivarTarget() !== null,
  );

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
  onRowClicked(e: { row: Record<string, unknown>; event: MouseEvent }): void {
    const plan = this.rows().find((p) => p.id === e.row['id']);
    if (plan) this.router.navigateByUrl(plan.route);
  }

  onRowAction(e: { action: TableRowAction; row: Record<string, unknown> }): void {
    const plan = this.rows().find((p) => p.id === e.row['id']);
    if (!plan) return;
    if (e.action.key === 'duplicate') this.store.duplicarPlanificacion(plan.id);
    else if (e.action.key === 'archive') this.archivarTarget.set(plan);
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
  onRenameCommit(row: Record<string, unknown>, value: string): void {
    const plan = this.rows().find((p) => p.id === row['id']);
    if (plan) this.store.renamePlanificacion(plan.id, value);
  }

  /** Demo-only — used by the empty-state preview to clear the seed. */
  clearAll(): void {
    this.store.clearPlanificaciones();
  }
}
