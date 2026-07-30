import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

import type { SeriesVisual } from './chart.types';

/**
 * Shared chart legend.
 *
 * Hidden by default — direct labeling is preferred per Visa PDS.
 * When shown, renders a horizontal list of color+texture swatches with labels.
 */
@Component({
  selector: 'afi-chart-legend',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-legend.component.html',
})
export class ChartLegendComponent {
  readonly items = input<Array<{ label: string; visual: SeriesVisual }>>([]);
  readonly hidden = input(true);
}
