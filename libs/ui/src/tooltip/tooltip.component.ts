import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TooltipPosition } from './tooltip.variants';

/**
 * Tooltip — wraps any element and shows a label on hover/focus.
 *
 * Usage:
 *   <afi-tooltip text="Guardar cambios">
 *     <button>💾</button>
 *   </afi-tooltip>
 */
@Component({
  selector: 'afi-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  readonly text = input.required<string>();
  readonly position = input<TooltipPosition>('bottom');
  readonly disabled = input<boolean>(false);

  readonly popClass = computed(() => `tooltip__pop tooltip__pop--${this.position()}`);
}
