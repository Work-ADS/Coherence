import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ActionToastComponent } from './action-toast.component';
import { NotesDropdownComponent, PlanNote } from './notes-dropdown.component';
import { SettingsDropdownComponent, SimulationSettings } from './settings-dropdown.component';

type PlanState = 'borrador' | 'cumplimentada' | 'descargada' | 'entregada';

/**
 * Top bar for the Wealth Planner proposal pages.
 *
 * 3-file shape (LOCKED 2026-05-18). See docs/rules/component-skill.md § 2.
 */
@Component({
  selector: 'site-planner-top-bar',
  standalone: true,
  imports: [
    RouterLink,
    ActionToastComponent,
    NotesDropdownComponent,
    SettingsDropdownComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './planner-top-bar.component.html',
  styleUrls: ['./planner-top-bar.component.scss'],
})
export class PlannerTopBarComponent {
  readonly decisionesRoute = input.required<string>();
  readonly listadoRoute = input<string>('/novedades');
  readonly clientName = input<string>('Ricard Vazquez Fajardo');

  readonly plansOpen = signal(false);
  readonly stateOpen = signal(false);
  readonly renaming = signal(false);
  readonly notesOpen = signal(false);
  readonly configOpen = signal(false);
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
  readonly simIdDraft = signal('SIM-2025-0011');
  readonly currentState = signal<PlanState>('borrador');

  // Toast state
  readonly toastVisible = signal(false);
  readonly toastMessage = signal<string>('');
  private undoAction: (() => void) | null = null;
  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly renameInput = viewChild<ElementRef<HTMLInputElement>>('renameInput');

  readonly plans = [
    { id: 'SIM-2025-0011', name: 'Plan 1 — Familia Torres' },
    { id: 'SIM-2025-0010', name: 'Plan 2 — Escenario conservador' },
    { id: 'SIM-2025-0009', name: 'Plan 3 — Pre-jubilación' },
    { id: 'SIM-2025-0008', name: 'Plan 4 — Legado familiar' },
  ];

  readonly states: { value: PlanState; label: string; bg: string; fg: string }[] = [
    { value: 'borrador', label: 'Borrador', bg: '#EEEEEE', fg: '#525252' },
    { value: 'cumplimentada', label: 'Cumplimentada', bg: '#DFF0FF', fg: '#0066AE' },
    { value: 'descargada', label: 'Descargada', bg: '#EFE6FE', fg: '#6B3BD6' },
    { value: 'entregada', label: 'Entregada al cliente', bg: '#DDF4E6', fg: '#187A47' },
  ];

  stateLabelFor(v: PlanState): string {
    return this.states.find((s) => s.value === v)?.label ?? '';
  }

  stateStyleFor(v: PlanState): string {
    const s = this.states.find((x) => x.value === v);
    if (!s) return '';
    return `background:${s.bg}; color:${s.fg};`;
  }

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

  setState(v: PlanState): void {
    const previous = this.currentState();
    if (v === previous) {
      this.stateOpen.set(false);
      return;
    }
    this.currentState.set(v);
    this.stateOpen.set(false);
    this.showToast(`Estado cambiado a ${this.stateLabelFor(v)}`, () =>
      this.currentState.set(previous),
    );
  }

  startRename(): void {
    this.simIdDraft.set(this.simId());
    this.renaming.set(true);
    queueMicrotask(() => this.renameInput()?.nativeElement?.focus());
  }

  commitRename(): void {
    const v = this.simIdDraft().trim();
    const previous = this.simId();
    if (v && v !== previous) {
      this.simId.set(v);
      this.showToast(`Nombre actualizado a "${v}"`, () => this.simId.set(previous));
    }
    this.renaming.set(false);
  }

  cancelRename(): void {
    this.renaming.set(false);
  }

  inputValue(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.plansOpen()) this.plansOpen.set(false);
    if (this.stateOpen()) this.stateOpen.set(false);
    if (this.renaming()) this.cancelRename();
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
    this.notes.set(this.notes().filter(n => n.id !== id));
  }

  onSettingsChanged(s: SimulationSettings): void {
    this.simulationSettings.set(s);
  }
}
