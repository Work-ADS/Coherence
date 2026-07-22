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
import { RouterLink } from '@angular/router';

// internal (libs)
import {
  BadgeV2Component,
  EditableTextComponent,
  IconButtonV2Component,
  MenuDividerV2Component,
  MenuItemV2Component,
  MenuV2Component,
  ToastComponent,
} from '@coherence/ui';
import type { BadgeV2Tone, Estado } from '@coherence/ui';

// relative
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
    EditableTextComponent,
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

  readonly clientName = input.required<string>();
  readonly clientRoute = input<string>('/listado-planificaciones');
  readonly simName = input<string>('SIM-2025-0011');
  readonly currentView = input<string>('Panel');
  readonly advisorName = input<string>('Marc Puig');

  readonly estado = signal<Estado>('aprobada');
  readonly estadoOpen = signal(false);
  readonly notesOpen = signal(false);
  readonly settingsOpen = signal(false);

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
    if (this.estadoOpen() && !this.el.nativeElement.contains(event.target)) {
      this.estadoOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.estadoOpen.set(false);
  }

  toggleEstado(event: MouseEvent): void {
    event.stopPropagation();
    this.estadoOpen.update((v) => !v);
    this.notesOpen.set(false);
    this.settingsOpen.set(false);
  }

  toggleNotes(payload: { event: MouseEvent }): void {
    payload.event.stopPropagation();
    this.notesOpen.update((v) => !v);
    this.settingsOpen.set(false);
    this.estadoOpen.set(false);
  }

  toggleSettings(payload: { event: MouseEvent }): void {
    payload.event.stopPropagation();
    this.settingsOpen.update((v) => !v);
    this.notesOpen.set(false);
    this.estadoOpen.set(false);
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
