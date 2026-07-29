import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  type BarDatum,
  ButtonV2Component,
  CardV2Component,
  ChartCompositionComponent,
  TagV2Component,
  formatCurrency,
} from '@coherence/ui';

/** One patrimonio category: the bar segment plus its legend annotations. */
interface Categoria {
  key: string;
  valor: number;
  /** Signed change over the comparison window, as a percentage. */
  variacion: number;
}

/**
 * The nine patrimonio categories — the locked TipoPatrimonioTop taxonomy
 * (store's TIPO_PATRIMONIO_TOP_LABEL), all present so the breakdown shows the
 * complete model. Ordered high → low so the bar's ink ramp and the legend read
 * in rank order. Demo values.
 */
const CATEGORIAS: readonly Categoria[] = [
  { key: 'Inmobiliario', valor: 730_000, variacion: 0.9 },
  { key: 'Participaciones empresariales', valor: 185_000, variacion: 1.4 },
  { key: 'Planes de pensiones', valor: 120_000, variacion: 0.72 },
  { key: 'Deuda', valor: 96_000, variacion: -1.8 },
  { key: 'Private equity', valor: 95_000, variacion: 3.2 },
  { key: 'Inversiones', valor: 62_300, variacion: 2.1 },
  { key: 'Liquidez', valor: 45_200, variacion: 0.05 },
  { key: 'Seguro de vida', valor: 35_000, variacion: 0 },
  { key: 'Otros activos', valor: 18_500, variacion: -0.3 },
];

/** A not-yet-designed block in the bento. Square, labelled, nothing else. */
interface Placeholder {
  id: string;
  label: string;
}

/** Signed percentage, RAE spacing (space before %). */
function pct(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString('es-ES', { maximumFractionDigits: 2 })} %`;
}

/**
 * Demo 1 — dashboard bento, first pass.
 *
 * Layout follows the "Layout 1" reference: a hero row of two cards (wide + narrow)
 * over two rows of supporting blocks. Only the patrimonio card is built; every
 * other block is a labelled square standing in for a section not yet designed.
 *
 * The breakdown is afi-chart-composition end to end: segmented bar, `detail`
 * legend (value + delta per category, hover-linked to the segments), and the
 * data table in `peek` register — first rows under a progressive blur with the
 * expand pill on top.
 *
 * Neutral by request — monochrome ramp, deltas without semantic green/red.
 * Standalone: no navigation, no sidebar, no demo-shell.
 */
@Component({
  selector: 'site-demo-1-page',
  standalone: true,
  imports: [ButtonV2Component, CardV2Component, ChartCompositionComponent, TagV2Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-1.page.html',
  styleUrls: ['./demo-1.page.scss'],
})
export class Demo1Page {
  protected readonly total = CATEGORIAS.reduce((sum, c) => sum + c.valor, 0);

  /** Segments + legend annotations for afi-chart-composition. */
  protected readonly composicion: BarDatum[] = CATEGORIAS.map((c) => ({
    key: c.key,
    value: c.valor,
    deltaLabel: pct(c.variacion),
  }));

  protected readonly totalFormateado = formatCurrency(this.total, 'es-ES', 'symbol');

  protected readonly heroPlaceholder: Placeholder = { id: 'objetivos', label: 'Objetivos' };

  protected readonly filaMedia: readonly Placeholder[] = [
    { id: 'ingresos', label: 'Ingresos' },
    { id: 'gastos', label: 'Gastos' },
    { id: 'liquidez', label: 'Liquidez' },
  ];

  protected readonly filaInferior: readonly Placeholder[] = [
    { id: 'proyeccion', label: 'Proyección' },
    { id: 'sociedades', label: 'Sociedades' },
  ];
}
