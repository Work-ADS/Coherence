// external
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// internal (libs)
import {
  BadgeV2Component,
  InlineEditComponent,
  IconButtonV2Component,
  MenuDividerV2Component,
  MenuItemV2Component,
  MenuV2Component,
  ToastComponent,
} from '@coherence/ui';
import type { BadgeV2Tone, Estado } from '@coherence/ui';

// relative
import { MobileDrawerService } from '../../../services/mobile-drawer.service';
import type { PlanNote } from './notes-dropdown.component';
import { NotesPanelV2Component } from './notes-panel-v2.component';
import type { SimulationSettings } from './settings-dropdown.component';
import { SettingsPanelV2Component } from './settings-panel-v2.component';

const ESTADO_TONE: Record<Estado, BadgeV2Tone> = {
  borrador: 'neutral',
  pendiente: 'warning',
  'en-revision': 'warning',
  aprobada: 'success',
  ejecutada: 'info',
  rechazada: 'critical',
  cancelada: 'neutral',
  archivada: 'neutral',
};

/**
 * Planner navbar — identity v2 (foundations-modern).
 *
 * The v2 successor of `site-planner-top-bar`, following Figma
 * AFI-FOUNDATIONS-MODERN node 2938:6946: breadcrumb trail on the left
 * (cliente → simulación → estado → vista actual), ghost icon actions +
 * advisor avatar on the right, over the coherence glass recipe
 * (token blur + surface tint, same mix as `afi-top-bar[variant=glass]`).
 *
 * Behavior carried over from v1 (planner-top-bar), per the 2026-07-22 spec:
 * - Client name links back to the client list.
 * - Simulation name renames inline (`afi-editable-text`, pencil on hover).
 * - Estado chip opens a menu-v2 with the four estados; changes get an
 *   undo toast (v1 pattern).
 * - Notes + settings open dropdown panels (not drawers).
 * - Avatar shows the advisor — display-only for now (profile TBD).
 *
 * Overlay behavior is component-local (document-click close), same pattern
 * as notes-dropdown, until menu-v2 grows its shared overlay harness.
 */
@Component({
  selector: 'site-planner-navbar-v2',
  standalone: true,
  imports: [
    RouterLink,
    BadgeV2Component,
    InlineEditComponent,
    IconButtonV2Component,
    MenuV2Component,
    MenuItemV2Component,
    MenuDividerV2Component,
    ToastComponent,
    NotesPanelV2Component,
    SettingsPanelV2Component,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './planner-navbar-v2.component.html',
  styleUrls: ['./planner-navbar-v2.component.scss'],
})
export class PlannerNavbarV2Component {
  private readonly el = inject(ElementRef);
  private readonly router = inject(Router);
  /** Shared with planner-sidebar: the hamburger toggles the same drawer. */
  protected readonly drawer = inject(MobileDrawerService);

  readonly clientName = input.required<string>();
  readonly clientRoute = input<string>('/listado-planificaciones');
  readonly simName = input<string>('SIM-2025-0011');
  readonly currentView = input<string>('Panel');
  readonly advisorName = input<string>('Marc Puig');

  /** Where "Ir al listado" goes, and the client link's target. */
  readonly listadoRoute = input<string>('/listado-planificaciones');
  /** Nested-page trail after the simulation name. Empty renders nothing. */
  readonly currentPath = input<{ label: string; route?: string }[]>([]);
  /** Swaps the switcher menu from planificaciones to recent clients. */
  readonly clientPickerMode = input<boolean>(false);
  readonly clientList = input<{ id: string; name: string }[] | null>(null);
  readonly activeClientId = input<string | null>(null);

  readonly estado = signal<Estado>('aprobada');
  readonly estadoOpen = signal(false);
  readonly notesOpen = signal(false);
  readonly settingsOpen = signal(false);
  readonly plansOpen = signal(false);
  /** Narrow-viewport overflow holding estado + notas + ajustes. */
  readonly overflowOpen = signal(false);

  readonly plans = [
    { id: 'SIM-2025-0011', name: 'Plan 1 — Familia Torres' },
    { id: 'SIM-2025-0010', name: 'Plan 2 — Escenario conservador' },
    { id: 'SIM-2025-0009', name: 'Plan 3 — Pre-jubilación' },
    { id: 'SIM-2025-0008', name: 'Plan 4 — Legado familiar' },
  ];

  /** Local editable copy of the simulation name (seeded from the input). */
  readonly simNameValue = signal<string | null>(null);
  readonly simNameShown = computed(() => this.simNameValue() ?? this.simName());

  readonly estados: { value: Estado; label: string }[] = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'aprobada', label: 'Aprobada' },
    { value: 'ejecutada', label: 'Ejecutada' },
  ];

  readonly estadoLabel = computed(
    () => this.estados.find((s) => s.value === this.estado())?.label ?? this.estado(),
  );
  readonly estadoTone = computed<BadgeV2Tone>(() => ESTADO_TONE[this.estado()]);

  readonly advisorInitials = computed(() =>
    this.advisorName()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join(''),
  );

  readonly notes = signal<PlanNote[]>([
    {
      id: '1',
      text: 'Cliente prefiere enfoque conservador para los próximos 3 años.',
      timestamp: new Date('2026-06-15T10:30:00'),
    },
    {
      id: '2',
      text: 'Confirmar tasación de la primera vivienda de Andalucía.',
      timestamp: new Date('2026-07-18T14:15:00'),
    },
  ]);

  readonly simulationSettings = signal<SimulationSettings>({
    currency: 'EUR',
    riskProfile: 'moderate',
    inflationRate: 2.1,
    lifeExpectancy: 88,
  });

  readonly toastVisible = signal(false);
  readonly toastMessage = signal('');
  private undoAction: (() => void) | null = null;
  private toastTimer?: ReturnType<typeof setTimeout>;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.el.nativeElement.contains(event.target)) return;
    this.estadoOpen.set(false);
    this.plansOpen.set(false);
    this.overflowOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeAllMenus();
  }

  /** Only one overlay at a time — every trigger closes its siblings first. */
  private closeAllMenus(): void {
    this.estadoOpen.set(false);
    this.plansOpen.set(false);
    this.overflowOpen.set(false);
  }

  toggleEstado(event: MouseEvent): void {
    event.stopPropagation();
    const next = !this.estadoOpen();
    this.closeAllMenus();
    this.notesOpen.set(false);
    this.settingsOpen.set(false);
    this.estadoOpen.set(next);
  }

  /** Plain-button variant of togglePlans — the switcher isn't an icon-button. */
  togglePlansFromButton(event: MouseEvent): void {
    this.togglePlans({ event });
  }

  togglePlans(payload: { event: MouseEvent }): void {
    payload.event.stopPropagation();
    const next = !this.plansOpen();
    this.closeAllMenus();
    this.notesOpen.set(false);
    this.settingsOpen.set(false);
    this.plansOpen.set(next);
  }

  toggleOverflow(payload: { event: MouseEvent }): void {
    payload.event.stopPropagation();
    const next = !this.overflowOpen();
    this.closeAllMenus();
    this.overflowOpen.set(next);
  }

  toggleNotes(payload: { event: MouseEvent }): void {
    payload.event.stopPropagation();
    const next = !this.notesOpen();
    this.closeAllMenus();
    this.settingsOpen.set(false);
    this.notesOpen.set(next);
  }

  toggleSettings(payload: { event: MouseEvent }): void {
    payload.event.stopPropagation();
    const next = !this.settingsOpen();
    this.closeAllMenus();
    this.notesOpen.set(false);
    this.settingsOpen.set(next);
  }

  onHamburger(payload: { event: MouseEvent }): void {
    payload.event.stopPropagation();
    this.closeAllMenus();
    this.drawer.toggle();
  }

  // ── Plan switcher ─────────────────────────────────────────────────────────

  goToListado(): void {
    this.plansOpen.set(false);
    void this.router.navigateByUrl(this.listadoRoute());
  }

  selectPlan(id: string): void {
    const previous = this.simNameShown();
    this.plansOpen.set(false);
    if (id === previous) return;
    const picked = this.plans.find((p) => p.id === id);
    this.simNameValue.set(id);
    this.showToast(`Planificación ${picked?.name ?? id}`, () =>
      this.simNameValue.set(previous),
    );
  }

  selectClient(id: string): void {
    this.plansOpen.set(false);
    if (id === this.activeClientId()) return;
    const picked = this.clientList()?.find((c) => c.id === id);
    this.showToast(`Multi-cliente disponible próximamente — ${picked?.name ?? id}`, () => {
      /* nothing to undo — the switch isn't wired yet */
    });
  }

  // ── Narrow-viewport overflow entries ──────────────────────────────────────

  changeEstadoFromOverflow(next: Estado): void {
    this.overflowOpen.set(false);
    this.onEstadoChange(next);
  }

  openNotesFromOverflow(): void {
    this.overflowOpen.set(false);
    this.settingsOpen.set(false);
    this.notesOpen.set(true);
  }

  openSettingsFromOverflow(): void {
    this.overflowOpen.set(false);
    this.notesOpen.set(false);
    this.settingsOpen.set(true);
  }

  onEstadoChange(next: Estado): void {
    const previous = this.estado();
    this.estadoOpen.set(false);
    if (next === previous) return;
    this.estado.set(next);
    const label = this.estados.find((s) => s.value === next)?.label ?? next;
    this.showToast(`Estado cambiado a ${label}`, () => this.estado.set(previous));
  }

  onRename(next: string): void {
    const value = next.trim();
    const previous = this.simNameShown();
    if (!value || value === previous) return;
    this.simNameValue.set(value);
    this.showToast(`Nombre actualizado a «${value}»`, () =>
      this.simNameValue.set(previous),
    );
  }

  addNote(text: string): void {
    this.notes.set([
      { id: crypto.randomUUID(), text, timestamp: new Date() },
      ...this.notes(),
    ]);
  }

  deleteNote(id: string): void {
    this.notes.set(this.notes().filter((n) => n.id !== id));
  }

  onSettingsChanged(s: SimulationSettings): void {
    this.simulationSettings.set(s);
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
}
