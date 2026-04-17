import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

import { ModalComponent } from '../modal';
import { ButtonComponent } from '../button';

/**
 * Keyboard-instructions modal for chart primitives.
 *
 * Wraps `<afi-modal>` with the fixed keyboard map from data-viz-skill.md.
 * Opened by a ghost button auto-added to each chart's action slot, or by pressing `?`.
 */
@Component({
  selector: 'afi-chart-instructions',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-button
      variant="ghost"
      size="sm"
      ariaLabel="Instrucciones de teclado"
      (clicked)="open()"
    >
      <svg slot="iconStart" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2"/>
        <path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/>
        <path d="M8 12h.001"/><path d="M12 12h.001"/><path d="M16 12h.001"/>
        <path d="M7 16h10"/>
      </svg>
    </afi-button>

    <afi-modal
      [open]="isOpen()"
      title="Atajos de teclado"
      size="sm"
      (openChange)="onModalChange($event)"
    >
      <dl class="grid grid-cols-[auto_1fr] gap-x-space-4 gap-y-space-2 text-body-sm">
        <dt class="font-medium text-canvas-fg"><kbd class="px-space-1 py-0.5 bg-surface-quiet rounded-sm text-body-sm">Enter</kbd></dt>
        <dd class="text-neutral-600">Entrar en el gráfico / activar punto</dd>

        <dt class="font-medium text-canvas-fg"><kbd class="px-space-1 py-0.5 bg-surface-quiet rounded-sm text-body-sm">Shift+Enter</kbd></dt>
        <dd class="text-neutral-600">Subir un nivel</dd>

        <dt class="font-medium text-canvas-fg"><kbd class="px-space-1 py-0.5 bg-surface-quiet rounded-sm text-body-sm">← →</kbd></dt>
        <dd class="text-neutral-600">Navegar entre elementos</dd>

        <dt class="font-medium text-canvas-fg"><kbd class="px-space-1 py-0.5 bg-surface-quiet rounded-sm text-body-sm">↑ ↓</kbd></dt>
        <dd class="text-neutral-600">Navegar entre series</dd>

        <dt class="font-medium text-canvas-fg"><kbd class="px-space-1 py-0.5 bg-surface-quiet rounded-sm text-body-sm">Esc</kbd></dt>
        <dd class="text-neutral-600">Cerrar información emergente</dd>

        <dt class="font-medium text-canvas-fg"><kbd class="px-space-1 py-0.5 bg-surface-quiet rounded-sm text-body-sm">Tab</kbd></dt>
        <dd class="text-neutral-600">Salir del gráfico</dd>
      </dl>

      <div slot="footer">
        <afi-button variant="secondary" size="sm" (clicked)="close()">
          Cerrar
        </afi-button>
      </div>
    </afi-modal>
  `,
})
export class ChartInstructionsComponent {
  readonly chartLabel = input('gráfico');

  readonly opened = output<void>();

  protected readonly isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
    this.opened.emit();
  }

  close(): void {
    this.isOpen.set(false);
  }

  onModalChange(open: boolean): void {
    this.isOpen.set(open);
  }
}
