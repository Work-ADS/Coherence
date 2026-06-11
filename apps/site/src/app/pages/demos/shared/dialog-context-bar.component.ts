import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export interface ContextBarSegment {
  /** Stable key used as track id. */
  key: string;
  /** Human label shown in the legend ("Liquidez", "Inversión"…). */
  label: string;
  /** Euro amount this segment represents. Used to compute % share. */
  value: number;
  /** When true, the segment is rendered solid; others render muted. */
  highlight?: boolean;
}

/**
 * Mini stacked-bar context tag for dialog headers (Tesler-law affordance:
 * "Patrimonio total · 1.245.000 € · Liquidez 18%"). Sized to fit inside a
 * normal-width modal (`size="md"`) without dominating the form.
 *
 * Renders as a vertical stack:
 *   1. Headline row — title + total formatted to euros
 *   2. Thin horizontal bar — flex-grow segments proportional to `value`
 *   3. Legend row — highlighted segment label + percentage
 *
 * Host owns the data. The component is purely presentational so it can
 * also render for Liquidez (ingreso/gasto dialogs) just by passing a
 * different segments + headline.
 */
@Component({
  selector: 'site-dialog-context-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-context-bar.component.html',
  styleUrls: ['./dialog-context-bar.component.scss'],
})
export class DialogContextBarComponent {
  /** "Patrimonio total", "Liquidez total", etc. */
  readonly title = input.required<string>();
  /** Euro amount shown next to the title. */
  readonly total = input.required<number>();
  /** Distribution slices. At least one segment with `highlight: true`
   *  to anchor the legend label. */
  readonly segments = input.required<ContextBarSegment[]>();

  readonly totalLabel = computed(() => this.formatEuro(this.total()));

  readonly sumOfSegments = computed(() =>
    this.segments().reduce((sum, s) => sum + Math.max(0, s.value), 0),
  );

  readonly normalizedSegments = computed(() => {
    const sum = this.sumOfSegments();
    if (sum <= 0) return [];
    return this.segments().map((s) => ({
      ...s,
      pct: (Math.max(0, s.value) / sum) * 100,
    }));
  });

  /** First highlighted segment — drives the legend row. */
  readonly highlightedSegment = computed(() =>
    this.normalizedSegments().find((s) => s.highlight) ?? null,
  );

  private formatEuro(value: number): string {
    if (!Number.isFinite(value)) return '0 €';
    return `${new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(value)} €`;
  }

  formatPct(value: number): string {
    return `${value.toFixed(value < 10 ? 1 : 0)}%`;
  }
}
