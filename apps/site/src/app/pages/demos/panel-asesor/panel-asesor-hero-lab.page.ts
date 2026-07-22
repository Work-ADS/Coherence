// external
import { ChangeDetectionStrategy, Component } from '@angular/core';

// internal (libs)
import {
  BadgeV2Component,
  CardV2Component,
  ChartCompositionComponent,
} from '@coherence/ui';
import type { BarDatum } from '@coherence/ui';

// relative
import { DemoShellComponent } from '../demo-shell/demo-shell.component';

const EUR = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Panel del asesor — hero lab (experimento 1 del dashboard de marca).
 *
 * Three treatments of the same hero — patrimonio total + composition strip —
 * to lock the visual register of the advisor dashboard before building the
 * remaining tiles. One dataset (the post-meeting Andalucía-transition client),
 * one primitive (`afi-chart-composition`), three variants:
 *
 *   T1 «Producto»  — card-v2, contained figure, `segments` strip.
 *   T2 «Editorial» — no card, oversized light figure, `blocks` strip.
 *   T3 «Trazos»    — editorial spine, `ticks` strip (solid emphasis band).
 *
 * The typescale here is deliberately exploratory (page-local custom props
 * derived from type tokens) — whichever treatment wins gets its sizes
 * promoted to semantic tokens.
 */
@Component({
  selector: 'site-panel-asesor-hero-lab',
  standalone: true,
  imports: [
    DemoShellComponent,
    BadgeV2Component,
    CardV2Component,
    ChartCompositionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './panel-asesor-hero-lab.page.html',
  styleUrl: './panel-asesor-hero-lab.page.scss',
})
export class PanelAsesorHeroLabPage {
  /** Post-meeting client: six properties, plan agreed, nothing executed yet. */
  readonly composicion: BarDatum[] = [
    { key: 'Inmobiliario', value: 2_610_000 },
    { key: 'Financiero', value: 558_000 },
    { key: 'Pensiones', value: 430_000 },
    { key: 'Liquidez', value: 124_518.45 },
  ];

  private readonly total = this.composicion.reduce((sum, d) => sum + d.value, 0);

  /** "3.722.518" — the strong part of the figure. */
  readonly totalEntero: string;
  /** ",45 €" — decimals + symbol, typographically dimmed. */
  readonly totalResto: string;

  constructor() {
    const formatted = EUR.format(this.total);
    const comma = formatted.lastIndexOf(',');
    this.totalEntero = formatted.slice(0, comma);
    this.totalResto = formatted.slice(comma);
  }
}
