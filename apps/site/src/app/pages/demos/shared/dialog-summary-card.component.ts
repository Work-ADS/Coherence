import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type SummaryTrend = 'up' | 'down' | 'neutral';

/**
 * Compact data summary card for dialog headers.
 *
 * Replaces the old stacked-bar context bar with a tight horizontal row:
 * label (muted) + total (bold) + delta badge (arrow + %). No bar graph,
 * no legend. Just the numbers that matter.
 *
 * The title is dynamic — e.g. "Liquidez total", "Inversión total",
 * "Ingresos anuales" — depending on the dialog context.
 */
@Component({
  selector: 'site-dialog-summary-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-summary-card.component.html',
  styleUrl: './dialog-summary-card.component.scss',
})
export class DialogSummaryCardComponent {
  /** E.g. "Liquidez total", "Patrimonio total" */
  readonly title = input.required<string>();
  /** Euro amount. */
  readonly total = input.required<number>();
  /** Optional suffix override (default ' €'). Pass '%' or an empty string. */
  readonly suffix = input<string>(' €');
  /** Absolute delta value (e.g. 3.2). Sign shown by `trend`. */
  readonly delta = input<number | null>(null);
  /** Direction of the delta. */
  readonly trend = input<SummaryTrend>('neutral');

  readonly totalLabel = computed(() => this.#formatEuro(this.total()));

  readonly deltaLabel = computed(() => {
    const d = this.delta();
    if (d === null || d === undefined) return null;
    const abs = Math.abs(d);
    const sign = this.trend() === 'down' ? '−' : '+';
    return `${sign}${abs.toFixed(abs < 10 ? 1 : 0)}%`;
  });

  readonly trendIcon = computed(() => {
    switch (this.trend()) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '';
    }
  });

  readonly trendClass = computed(() => {
    switch (this.trend()) {
      case 'up': return 'summary-card__delta--up';
      case 'down': return 'summary-card__delta--down';
      default: return 'summary-card__delta--neutral';
    }
  });

  #formatEuro(value: number): string {
    if (!Number.isFinite(value)) return `0${this.suffix()}`;
    return `${new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(value)}${this.suffix()}`;
  }
}
