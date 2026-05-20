import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PatternPageComponent } from '../../_shared/pattern-page.component';
import {
  AtomCardComponent,
  type AtomSpec,
} from '../../_shared/atom-card.component';

import {
  TooltipComponent,
  InlineEditComponent,
  StatusChipComponent,
  ToastComponent,
  IconButtonComponent,
  DropdownPanelComponent,
} from '@coherence/ui';
import type { Estado } from '@coherence/ui';

@Component({
  selector: 'site-top-nav-page',
  standalone: true,
  imports: [
    PatternPageComponent,
    AtomCardComponent,
    TooltipComponent,
    InlineEditComponent,
    StatusChipComponent,
    ToastComponent,
    IconButtonComponent,
    DropdownPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-nav.page.html',
  styleUrl: './top-nav.page.scss',
})
export class TopNavPage {
  // ─── Live preview state ──────────────────────────────────────────────────
  readonly clientName = signal('Ricard Vazquez Fajardo');
  readonly simId = signal('SIM-2025-0011');
  readonly estado = signal<Estado>('borrador');

  // Dropdowns
  readonly plansOpen = signal(false);
  readonly stateOpen = signal(false);
  readonly notesOpen = signal(false);
  readonly settingsOpen = signal(false);

  // Toast
  readonly toastVisible = signal(false);
  readonly toastMessage = signal('');

  // Plans list (demo data)
  readonly plans = [
    { id: 'SIM-2025-0011', name: 'Plan 1 — Familia Torres' },
    { id: 'SIM-2025-0010', name: 'Plan 2 — Escenario conservador' },
    { id: 'SIM-2025-0009', name: 'Plan 3 — Pre-jubilación' },
  ];

  // States
  readonly states: { value: Estado; label: string }[] = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'aprobada', label: 'Aprobada' },
    { value: 'ejecutada', label: 'Ejecutada' },
  ];

  onRename(newName: string): void {
    this.simId.set(newName);
    this.showToast(`Nombre actualizado a "${newName}"`);
  }

  onEstadoChange(newEstado: Estado): void {
    this.estado.set(newEstado);
    this.stateOpen.set(false);
    this.showToast(`Estado cambiado a "${newEstado}"`);
  }

  selectPlan(id: string): void {
    this.simId.set(id);
    this.plansOpen.set(false);
    this.showToast(`Planificación cambiada a ${id}`);
  }

  onToastUndo(): void {
    this.toastVisible.set(false);
  }

  private showToast(message: string): void {
    this.toastMessage.set(message);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 5000);
  }

  // ─── Atoms ───────────────────────────────────────────────────────────────
  readonly atoms: readonly AtomSpec[] = [
    {
      number: 1,
      name: 'Plan Switcher (nav trigger)',
      description:
        'Botón con dos iconos (chevron-left + list). Click abre dropdown con lista de planificaciones. Tooltip al hover.',
      backingPrimitives: [
        { name: 'afi-icon-button', slug: 'icon-button' },
        { name: 'afi-tooltip', slug: 'tooltip' },
        { name: 'afi-dropdown-panel', slug: 'dropdown-panel' },
      ],
      figmaAttrs: [
        { key: 'variant', value: 'ghost' },
        { key: 'size', value: 'md' },
        { key: 'icons', value: 'chevron-left + list (dual icon)' },
        { key: 'aria-label', value: '"Cambiar planificación"' },
      ],
      codeSnippet: `<afi-tooltip text="Cambiar planificación" position="bottom">
  <afi-icon-button ariaLabel="Cambiar planificación" variant="ghost" size="md"
    (clicked)="plansOpen.set(!plansOpen())">
    <svg slot="icon"><!-- chevron-left + list --></svg>
  </afi-icon-button>
</afi-tooltip>`,
    },
    {
      number: 2,
      name: 'Identity + Inline Rename',
      description:
        'Nombre del cliente seguido de "planificación:" y el ID editable. Click en el ID abre inline-edit. Enter guarda, Esc cancela.',
      backingPrimitives: [
        { name: 'afi-inline-edit', slug: 'inline-edit' },
        { name: 'afi-tooltip', slug: 'tooltip' },
        { name: 'afi-toast', slug: 'toast' },
      ],
      figmaAttrs: [
        { key: 'client', value: 'type-body-sm-500, foreground-primary' },
        { key: 'label', value: '"planificación:" type-body-sm, foreground-secondary' },
        { key: 'simId', value: 'type-body-sm-600, foreground-primary' },
      ],
      codeSnippet: `<span class="top-nav__client">{{ clientName() }}</span>
<span class="top-nav__label">planificación:</span>
<afi-inline-edit
  [value]="simId()"
  ariaLabel="nombre de la planificación"
  (committed)="onRename($event)"
/>`,
    },
    {
      number: 3,
      name: 'Estado chip (interactive)',
      description:
        'Chip clicable con estado actual. Click abre dropdown de estados. Selección dispara toast deshacible.',
      backingPrimitives: [
        { name: 'afi-status-chip', slug: 'status-chip' },
        { name: 'afi-dropdown-panel', slug: 'dropdown-panel' },
        { name: 'afi-toast', slug: 'toast' },
      ],
      figmaAttrs: [
        { key: 'interactive', value: 'true' },
        { key: 'variant', value: 'subtle' },
        { key: 'estados', value: 'borrador | pendiente | aprobada | ejecutada' },
      ],
      codeSnippet: `<afi-status-chip
  [estado]="estado()"
  [interactive]="true"
  (triggered)="stateOpen.set(!stateOpen())"
/>
<afi-dropdown-panel [open]="stateOpen()" (closed)="stateOpen.set(false)">
  <!-- State options -->
</afi-dropdown-panel>`,
    },
    {
      number: 4,
      name: 'Notas (icon-button + dropdown)',
      description:
        'Icon-only button (file-text icon) en el lado derecho. Click abre panel dropdown con lista de notas.',
      backingPrimitives: [
        { name: 'afi-icon-button', slug: 'icon-button' },
        { name: 'afi-tooltip', slug: 'tooltip' },
        { name: 'afi-dropdown-panel', slug: 'dropdown-panel' },
      ],
      figmaAttrs: [
        { key: 'variant', value: 'ghost' },
        { key: 'size', value: 'md' },
        { key: 'icon', value: 'lucide-file-text' },
      ],
      codeSnippet: `<afi-tooltip text="Notas" position="bottom">
  <afi-icon-button ariaLabel="Notas" variant="ghost" size="md"
    (clicked)="notesOpen.set(!notesOpen())">
    <svg slot="icon"><!-- file-text --></svg>
  </afi-icon-button>
</afi-tooltip>
<afi-dropdown-panel [open]="notesOpen()" (closed)="notesOpen.set(false)">
  <!-- Notes content -->
</afi-dropdown-panel>`,
    },
    {
      number: 5,
      name: 'Ajustes (icon-button + dropdown)',
      description:
        'Icon-only button (settings icon) en el lado derecho. Click abre panel dropdown con ajustes de simulación.',
      backingPrimitives: [
        { name: 'afi-icon-button', slug: 'icon-button' },
        { name: 'afi-tooltip', slug: 'tooltip' },
        { name: 'afi-dropdown-panel', slug: 'dropdown-panel' },
      ],
      figmaAttrs: [
        { key: 'variant', value: 'ghost' },
        { key: 'size', value: 'md' },
        { key: 'icon', value: 'lucide-settings' },
      ],
      codeSnippet: `<afi-tooltip text="Ajustes de simulación" position="bottom">
  <afi-icon-button ariaLabel="Ajustes de simulación" variant="ghost" size="md"
    (clicked)="settingsOpen.set(!settingsOpen())">
    <svg slot="icon"><!-- settings --></svg>
  </afi-icon-button>
</afi-tooltip>
<afi-dropdown-panel [open]="settingsOpen()" (closed)="settingsOpen.set(false)">
  <!-- Settings content -->
</afi-dropdown-panel>`,
    },
  ];
}
