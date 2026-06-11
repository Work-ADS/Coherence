import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  DropdownPanelComponent,
  IconButtonComponent,
  InlineEditComponent,
  LogoComponent,
  MenuDividerComponent,
  MenuItemComponent,
  StatusChipComponent,
  ToastComponent,
  TooltipComponent,
} from '@coherence/ui';
import type { Estado } from '@coherence/ui';

import { MobileDrawerService } from '../../../services/mobile-drawer.service';

import { NotesDropdownComponent, PlanNote } from './notes-dropdown.component';
import { SettingsDropdownComponent, SimulationSettings } from './settings-dropdown.component';

@Component({
  selector: 'site-planner-top-bar',
  standalone: true,
  imports: [
    RouterLink,
    DropdownPanelComponent,
    IconButtonComponent,
    InlineEditComponent,
    LogoComponent,
    MenuDividerComponent,
    MenuItemComponent,
    StatusChipComponent,
    ToastComponent,
    TooltipComponent,
    NotesDropdownComponent,
    SettingsDropdownComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './planner-top-bar.component.html',
  styleUrls: ['./planner-top-bar.component.scss'],
})
export class PlannerTopBarComponent {
  protected readonly drawer = inject(MobileDrawerService);

  readonly decisionesRoute = input.required<string>();
  readonly listadoRoute = input<string>('/listado-planificaciones');
  readonly clientName = input<string>('Ricardo Vázquez Pérez');

  /**
   * Nested-page breadcrumb path appended after the simulation name. Each step
   * renders as a slash-separated segment; intermediate steps with a `route`
   * become RouterLinks, the last step is the current page (plain text).
   *
   * Empty by default — consumers opt in per nested page:
   *
   *   <site-planner-top-bar
   *     [clientName]="..."
   *     [currentPath]="[
   *       { label: 'Patrimonio', route: '/demos/wealth-planner-2026/patrimonial' },
   *       { label: 'Cuenta de inversión' }
   *     ]" />
   *
   * Existing actions (plan switcher, status chip, notes, settings, hamburger,
   * toast) are unaffected.
   */
  readonly currentPath = input<{ label: string; route?: string }[]>([]);

  /**
   * When true, the plan-switcher dropdown morphs into a client-picker
   * preview: heading reads "Clientes recientes", the "Ir al listado" link
   * is hidden (you're already on it), and the items come from
   * `clientList()` instead of the hardcoded `plans` array. Used by the
   * /listado-planificaciones page as a preview of the full multi-cliente
   * flow (Brief 4). v1 selection just emits a toast; no store switching.
   */
  readonly clientPickerMode = input<boolean>(false);
  readonly clientList = input<{ id: string; name: string }[] | null>(null);
  readonly activeClientId = input<string | null>(null);

  readonly plansOpen = signal(false);
  readonly stateOpen = signal(false);
  readonly notesOpen = signal(false);
  readonly configOpen = signal(false);
  /**
   * Mobile-only overflow menu below the tablet breakpoint that holds the notes + settings entry
   * points. On desktop the two icon buttons sit directly in `.ptb__end`;
   * on mobile they collapse into a single `⋮` trigger that opens this drop-
   * down sheet, which then routes to the existing notes / settings panels.
   */
  readonly overflowOpen = signal(false);

  toggleOverflow(payload: { event: MouseEvent }): void {
    // The dropdown-panel listens to document:click and would treat this
    // trigger click as an outside-click — stop propagation so the open
    // signal flip survives.
    payload.event.stopPropagation();
    this.overflowOpen.update((v) => !v);
  }

  openNotesFromOverflow(): void {
    this.overflowOpen.set(false);
    this.notesOpen.set(true);
  }

  openSettingsFromOverflow(): void {
    this.overflowOpen.set(false);
    this.configOpen.set(true);
  }

  changeEstadoFromOverflow(value: Estado): void {
    this.overflowOpen.set(false);
    this.onEstadoChange(value);
  }

  readonly notes = signal<PlanNote[]>([
    { id: '1', text: 'Cliente prefiere enfoque conservador para los próximos 3 años.', timestamp: new Date('2025-05-15T10:30:00') },
    { id: '2', text: 'Revisar aportaciones al plan de pensiones en septiembre.', timestamp: new Date('2025-05-18T14:15:00') },
  ]);
  readonly simulationSettings = signal<SimulationSettings>({
    currency: 'EUR',
    rounding: 'thousands',
    riskProfile: 'moderate',
    inflationRate: 2.1,
    lifeExpectancy: 88,
  });

  readonly simId = signal('SIM-2025-0011');
  readonly estado = signal<Estado>('borrador');

  readonly toastVisible = signal(false);
  readonly toastMessage = signal<string>('');
  private undoAction: (() => void) | null = null;
  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly plans = [
    { id: 'SIM-2025-0011', name: 'Plan 1 — Familia Torres' },
    { id: 'SIM-2025-0010', name: 'Plan 2 — Escenario conservador' },
    { id: 'SIM-2025-0009', name: 'Plan 3 — Pre-jubilación' },
    { id: 'SIM-2025-0008', name: 'Plan 4 — Legado familiar' },
  ];

  readonly estados: { value: Estado; label: string }[] = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'aprobada', label: 'Aprobada' },
    { value: 'ejecutada', label: 'Ejecutada' },
  ];

  selectPlan(id: string): void {
    const previous = this.simId();
    if (id === previous) {
      this.plansOpen.set(false);
      return;
    }
    const picked = this.plans.find((p) => p.id === id);
    this.simId.set(id);
    this.plansOpen.set(false);
    this.showToast(`Planificación cambiada a ${picked?.name ?? id}`, () =>
      this.simId.set(previous),
    );
  }

  /**
   * v1 client-picker selection. Multi-cliente switching infrastructure
   * lands in Brief 4 (clientes-multi-cliente); until then the click just
   * acknowledges via a toast so the affordance is visible without
   * silently breaking the page.
   */
  selectClient(id: string): void {
    if (id === this.activeClientId()) {
      this.plansOpen.set(false);
      return;
    }
    const picked = this.clientList()?.find((c) => c.id === id);
    this.plansOpen.set(false);
    this.showToast(
      `Multi-cliente disponible próximamente — ${picked?.name ?? id}`,
      () => undefined,
    );
  }

  onEstadoChange(next: Estado): void {
    const previous = this.estado();
    if (next === previous) {
      this.stateOpen.set(false);
      return;
    }
    this.estado.set(next);
    this.stateOpen.set(false);
    const label = this.estados.find((s) => s.value === next)?.label ?? next;
    this.showToast(`Estado cambiado a ${label}`, () => this.estado.set(previous));
  }

  onRename(next: string): void {
    const value = next.trim();
    const previous = this.simId();
    if (!value || value === previous) return;
    this.simId.set(value);
    this.showToast(`Nombre actualizado a "${value}"`, () => this.simId.set(previous));
  }

  private showToast(message: string, undo: () => void): void {
    this.toastMessage.set(message);
    this.undoAction = undo;
    this.toastVisible.set(true);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible.set(false), 5000);
  }

  hideToast(): void {
    this.toastVisible.set(false);
    clearTimeout(this.toastTimer);
    this.undoAction = null;
  }

  onToastUndo(): void {
    this.undoAction?.();
    this.hideToast();
  }

  addNote(text: string): void {
    const note: PlanNote = {
      id: crypto.randomUUID(),
      text,
      timestamp: new Date(),
    };
    this.notes.set([note, ...this.notes()]);
  }

  deleteNote(id: string): void {
    this.notes.set(this.notes().filter((n) => n.id !== id));
  }

  onSettingsChanged(s: SimulationSettings): void {
    this.simulationSettings.set(s);
  }
}
