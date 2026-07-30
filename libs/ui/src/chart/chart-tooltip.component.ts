import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

/**
 * Shared chart tooltip.
 *
 * Positioned absolutely relative to the chart container.
 * Shows on hover and keyboard focus; dismiss via Esc.
 * 120ms fade per motion spec; reduced-motion collapses to 0–80ms.
 */
@Component({
  selector: 'afi-chart-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./chart-tooltip.component.scss'],
  templateUrl: './chart-tooltip.component.html',
})
export class ChartTooltipComponent {
  readonly visible = signal(false);
  readonly x = signal(0);
  readonly y = signal(0);
  readonly title = input('');
  readonly value = input<string | null>(null);
  readonly secondary = input<string | null>(null);
  readonly tooltipId = input('afi-chart-tooltip');

  show(x: number, y: number): void {
    this.x.set(x);
    this.y.set(y);
    this.visible.set(true);
  }

  hide(): void {
    this.visible.set(false);
  }
}
