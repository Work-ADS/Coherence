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
  template: `
    @if (!hidden()) {
      <div class="flex flex-wrap gap-space-4 mt-space-3 text-body-sm text-neutral-600" role="list"
           [attr.aria-label]="'Leyenda del gráfico'">
        @for (item of items(); track item.label) {
          <div class="inline-flex items-center gap-space-1" role="listitem">
            <svg width="14" height="14" aria-hidden="true">
              <rect width="14" height="14" rx="2" [attr.fill]="item.visual.patternId ? 'url(#' + item.visual.patternId + ')' : item.visual.color" />
            </svg>
            <span>{{ item.label }}</span>
          </div>
        }
      </div>
    }
  `,
})
export class ChartLegendComponent {
  readonly items = input<Array<{ label: string; visual: SeriesVisual }>>([]);
  readonly hidden = input(true);
}
