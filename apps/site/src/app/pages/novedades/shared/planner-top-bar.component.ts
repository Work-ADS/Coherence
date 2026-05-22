import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  DropdownPanelComponent,
  IconButtonComponent,
  InlineEditComponent,
  MenuDividerComponent,
  MenuItemComponent,
  StatusChipComponent,
  ToastComponent,
  TooltipComponent,
} from '@coherence/ui';
import type { Estado } from '@coherence/ui';

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
  readonly decisionesRoute = input.required<string>();
  readonly listadoRoute = input<string>('/novedades');
  readonly clientName = input<string>('Ricard Vazquez Fajardo');

  readonly plansOpen = signal(false);
  readonly stateOpen = signal(false);
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
