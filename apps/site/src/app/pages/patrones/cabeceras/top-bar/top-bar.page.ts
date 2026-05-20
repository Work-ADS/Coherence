import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PatternPageComponent } from '../../_shared/pattern-page.component';
import {
  AtomCardComponent,
  type AtomSpec,
} from '../../_shared/atom-card.component';
import type { PrimitiveRef } from '../../_shared/primitives-used.component';

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
  selector: 'site-top-bar-pattern-page',
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
  templateUrl: './top-bar.page.html',
  styleUrl: './top-bar.page.scss',
})
export class TopBarPatternPage {
  // ─── Live preview state ──────────────────────────────────────────────────
  readonly clienteName = signal('García Martínez, Elena');
  readonly planName = signal('Planificación patrimonial 2025');
  readonly estado = signal<Estado>('borrador');
  readonly toastVisible = signal(false);
  readonly toastMessage = signal('');

  onRename(newName: string): void {
    this.planName.set(newName);
    this.showToast(`Nombre actualizado a "${newName}"`);
  }

  onEstadoChange(newEstado: Estado): void {
    this.estado.set(newEstado);
    this.showToast(`Estado actualizado a "${newEstado}"`);
  }

  onToastUndo(): void {
    this.toastVisible.set(false);
  }

  private showToast(message: string): void {
    this.toastMessage.set(message);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 5000);
  }

  // ─── Primitives ──────────────────────────────────────────────────────────
  readonly primitives: readonly PrimitiveRef[] = [
    { name: 'afi-button', slug: 'button', status: 'exists', note: 'Variante ghost + size sm para los icon-only buttons del top bar.' },
    { name: 'afi-status-chip', slug: 'status-chip', status: 'exists', note: 'Variante interactiva con (triggered) output.' },
    { name: 'afi-menu', slug: 'menu', status: 'exists', note: 'Para el menú de selección de estado.' },
    { name: 'afi-dropdown-panel', slug: 'dropdown-panel', status: 'exists', note: 'Para Notas y Ajustes de simulación (dropdown panels).' },
    { name: 'afi-kbd', slug: 'kbd', status: 'exists', note: 'Para mostrar atajos en tooltips (Enter / Esc) durante el rename inline.' },
    { name: 'afi-tooltip', slug: 'tooltip', status: 'exists', note: 'Cada icon-only button necesita tooltip. Soporta shortcut hints via afi-kbd.' },
    { name: 'afi-inline-edit', slug: 'inline-edit', status: 'exists', note: 'Renombrar-en-sitio del nombre de la planificación.' },
    { name: 'afi-toast', slug: 'toast', status: 'exists', note: 'Feedback de confirmación con undo.' },
  ];

  // ─── Atoms ───────────────────────────────────────────────────────────────
  readonly atoms: readonly AtomSpec[] = [
    {
      number: 1,
      name: 'Botón "Cambiar planificación"',
      description: 'Botón único con dos iconos (líneas + flecha atrás), sin texto. Tooltip al hover muestra "Cambiar planificación". Click navega al listado de planificaciones del cliente.',
      backingPrimitives: [
        { name: 'afi-button', slug: 'button' },
        { name: 'afi-tooltip', slug: 'tooltip' },
      ],
      figmaAttrs: [
        { key: 'variant', value: 'ghost' },
        { key: 'size', value: 'sm' },
        { key: 'iconStart', value: 'lucide-menu' },
        { key: 'iconEnd', value: 'lucide-arrow-left' },
        { key: 'aria-label', value: '"Cambiar planificación"' },
        { key: 'tooltip', value: '"Cambiar planificación"' },
      ],
      codeSnippet: `<afi-tooltip text="Cambiar planificación" position="bottom">
  <afi-icon-button
    ariaLabel="Cambiar planificación"
    variant="ghost"
    size="sm"
    (clicked)="navigateToPlans()"
  >
    <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  </afi-icon-button>
</afi-tooltip>`,
    },
    {
      number: 2,
      name: 'Identidad: Cliente · Plan',
      description: 'Composición tipográfica que muestra el cliente activo y el nombre de la planificación.',
      backingPrimitives: [],
      figmaAttrs: [
        { key: 'cliente · clase', value: 'type-body-sm-500, foreground-primary' },
        { key: 'separador', value: '" · " (middot, foreground-tertiary)' },
        { key: 'plan · clase', value: 'type-body-sm, foreground-primary' },
      ],
      codeSnippet: `<div class="top-bar__identity">
  <span class="top-bar__client">{{ clienteName() }}</span>
  <span class="top-bar__separator" aria-hidden="true">·</span>
  <afi-inline-edit
    [value]="planName()"
    ariaLabel="nombre del plan"
    (committed)="onRename($event)"
  />
</div>`,
    },
    {
      number: 3,
      name: 'Renombrar planificación inline',
      description: 'Click sobre el nombre del plan → input. Enter guarda; Esc cancela. Toast deshacible al confirmar.',
      backingPrimitives: [
        { name: 'afi-inline-edit', slug: 'inline-edit' },
        { name: 'afi-tooltip', slug: 'tooltip' },
        { name: 'afi-kbd', slug: 'kbd' },
        { name: 'afi-toast', slug: 'toast' },
      ],
      figmaAttrs: [
        { key: 'estado · idle', value: 'texto + icono lápiz al hover' },
        { key: 'estado · editing', value: 'input + check + X · auto-focus' },
        { key: 'shortcut · guardar', value: 'Enter' },
        { key: 'shortcut · cancelar', value: 'Esc' },
      ],
      codeSnippet: `<afi-tooltip text="Renombrar" [shortcut]="['Enter']" position="bottom">
  <afi-inline-edit
    [value]="planName()"
    ariaLabel="nombre de la planificación"
    (committed)="onRename($event)"
  />
</afi-tooltip>
<afi-toast
  [message]="'Nombre actualizado a ' + planName()"
  [visible]="toastVisible()"
  (undo)="onUndoRename()"
  (dismissed)="toastVisible.set(false)"
/>`,
    },
    {
      number: 4,
      name: 'Estado de la planificación',
      description: 'Chip clicable que muestra el estado actual. Click abre menú; selección dispara toast deshacible.',
      backingPrimitives: [
        { name: 'afi-status-chip', slug: 'status-chip' },
        { name: 'afi-menu', slug: 'menu' },
        { name: 'afi-toast', slug: 'toast' },
      ],
      figmaAttrs: [
        { key: 'interactive', value: 'true' },
        { key: 'estado', value: 'borrador | cumplimentada | descargada | entregada' },
      ],
      codeSnippet: `<afi-status-chip
  [estado]="estado()"
  [interactive]="true"
  (triggered)="estadoMenu.toggle()"
/>
<afi-menu #estadoMenu>
  <button (click)="onEstadoChange('borrador')">Borrador</button>
  <button (click)="onEstadoChange('cumplimentada')">Cumplimentada</button>
  <button (click)="onEstadoChange('descargada')">Descargada</button>
  <button (click)="onEstadoChange('entregada')">Entregada</button>
</afi-menu>`,
    },
    {
      number: 5,
      name: 'Disparador "Notas"',
      description: 'Icon-only en el lado derecho. Notas son global-scope. Panel = dropdown.',
      backingPrimitives: [
        { name: 'afi-button', slug: 'button' },
        { name: 'afi-tooltip', slug: 'tooltip' },
        { name: 'afi-dropdown-panel', slug: 'dropdown-panel' },
      ],
      figmaAttrs: [
        { key: 'variant', value: 'ghost' },
        { key: 'size', value: 'sm' },
        { key: 'icon', value: 'lucide-notebook-pen' },
        { key: 'panel', value: 'afi-dropdown-panel' },
      ],
      codeSnippet: `<afi-tooltip text="Notas" position="bottom">
  <afi-icon-button
    ariaLabel="Notas"
    variant="ghost"
    size="sm"
    (clicked)="notesPanel.toggle()"
  >
    <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
      <path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838.838-2.872a2 2 0 0 1 .506-.854z"/>
    </svg>
  </afi-icon-button>
</afi-tooltip>
<afi-dropdown-panel #notesPanel>
  <!-- Notes content here -->
</afi-dropdown-panel>`,
    },
    {
      number: 6,
      name: 'Disparador "Ajustes de simulación"',
      description: 'Icon-only. Click abre dropdown panel con ajustes globales.',
      backingPrimitives: [
        { name: 'afi-button', slug: 'button' },
        { name: 'afi-tooltip', slug: 'tooltip' },
        { name: 'afi-dropdown-panel', slug: 'dropdown-panel' },
      ],
      figmaAttrs: [
        { key: 'variant', value: 'ghost' },
        { key: 'size', value: 'sm' },
        { key: 'icon', value: 'lucide-sliders-horizontal' },
        { key: 'panel', value: 'afi-dropdown-panel' },
      ],
      codeSnippet: `<afi-tooltip text="Ajustes de simulación" position="bottom">
  <afi-icon-button
    ariaLabel="Ajustes de simulación"
    variant="ghost"
    size="sm"
    (clicked)="settingsPanel.toggle()"
  >
    <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
      <line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/>
      <line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/>
      <line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/>
      <line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/>
      <line x1="18" x2="22" y1="16" y2="16"/>
    </svg>
  </afi-icon-button>
</afi-tooltip>
<afi-dropdown-panel #settingsPanel>
  <!-- Settings content here -->
</afi-dropdown-panel>`,
    },
    {
      number: 7,
      name: 'Toast de confirmación',
      description: 'Aparece tras renombrar y tras cambiar estado. Auto-dismiss 5s.',
      backingPrimitives: [{ name: 'afi-toast', slug: 'toast' }],
      figmaAttrs: [
        { key: 'posición', value: 'bottom-center' },
        { key: 'auto-dismiss', value: '5000ms' },
        { key: 'acciones', value: 'Deshacer · Cerrar (X)' },
      ],
      codeSnippet: `<afi-toast
  [message]="toastMessage()"
  [visible]="toastVisible()"
  (undo)="onUndo()"
  (dismissed)="toastVisible.set(false)"
/>`,
    },
  ];
}
