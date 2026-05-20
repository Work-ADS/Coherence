import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KbdComponent } from '../kbd';
import { TooltipPosition } from './tooltip.variants';

let nextId = 0;

/**
 * Tooltip — wraps any element and shows a label on hover/focus.
 *
 * Usage:
 *   <afi-tooltip text="Guardar cambios">
 *     <button>💾</button>
 *   </afi-tooltip>
 *
 *   <!-- With keyboard shortcut hint -->
 *   <afi-tooltip text="Renombrar" [shortcut]="['Enter']">
 *     <button>✏️</button>
 *   </afi-tooltip>
 */
@Component({
  selector: 'afi-tooltip',
  standalone: true,
  imports: [KbdComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  readonly text = input.required<string>();
  readonly position = input<TooltipPosition>('bottom');
  readonly disabled = input<boolean>(false);

  /** Keyboard shortcut keys to display via afi-kbd inside the tooltip. */
  readonly shortcut = input<string[] | null>(null);

  /** Delay in ms before showing the tooltip (CSS transition-delay). */
  readonly delayMs = input<number>(250);

  readonly tooltipId = `afi-tooltip-${nextId++}`;

  readonly popClass = computed(() => `tooltip__pop tooltip__pop--${this.position()}`);

  readonly delayStyle = computed(() => `${this.delayMs()}ms`);
}
