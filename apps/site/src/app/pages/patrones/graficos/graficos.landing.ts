import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ChartLineComponent } from '@coherence/ui';
import type { LineSeries } from '@coherence/ui';

import { TeaserTileComponent } from '../../../components/teaser-tile/teaser-tile.component';

/**
 * Static projection series for the anatomy example — three risk profiles.
 *
 * The x domain is the holder's age, not a year: the line primitive formats
 * numeric x ticks through `formatNumber`, which abbreviates 2024 to "2 k".
 * Ages sit below the abbreviation threshold and read cleanly.
 */
const ANATOMY_SERIES: LineSeries[] = [
  {
    key: 'Conservador',
    points: [
      { x: 35, y: 100000 }, { x: 40, y: 108000 }, { x: 45, y: 115000 },
      { x: 50, y: 122000 }, { x: 55, y: 128000 }, { x: 60, y: 134000 },
    ],
  },
  {
    key: 'Moderado',
    points: [
      { x: 35, y: 100000 }, { x: 40, y: 115000 }, { x: 45, y: 132000 },
      { x: 50, y: 150000 }, { x: 55, y: 170000 }, { x: 60, y: 192000 },
    ],
  },
  {
    key: 'Dinámico',
    points: [
      { x: 35, y: 100000 }, { x: 40, y: 125000 }, { x: 45, y: 155000 },
      { x: 50, y: 190000 }, { x: 55, y: 230000 }, { x: 60, y: 280000 },
    ],
  },
];

interface AnatomyCallout {
  n: number;
  /** BEM modifier suffix carrying the badge's position (see the .scss). */
  slug: string;
  name: string;
  detail: string;
}

/** Numbered in DOM/reading order of the rendered chart. */
const ANATOMY_CALLOUTS: AnatomyCallout[] = [
  { n: 1, slug: 'titulo', name: 'Título', detail: 'Encuadra la lectura del gráfico. Opcional cuando el contexto ya lo aporta la página.' },
  { n: 2, slug: 'subtitulo', name: 'Subtítulo', detail: 'Contexto interpretativo: rango de fechas, filtro activo o unidad.' },
  { n: 3, slug: 'instrucciones', name: 'Botón de instrucciones de teclado', detail: 'Abre el mapa de teclas del gráfico. Obligatorio en los cuatro primitivos.' },
  { n: 4, slug: 'eje-y', name: 'Eje cuantitativo', detail: 'Escala de valores. En barras arranca siempre en cero.' },
  { n: 5, slug: 'lienzo', name: 'Lienzo del gráfico', detail: 'Área de dibujo que contiene las marcas de datos.' },
  { n: 6, slug: 'marcadores', name: 'Marcadores de datos', detail: 'Puntos focables con teclado; también hacen de indicador de foco.' },
  { n: 7, slug: 'eje-x', name: 'Eje de categorías o fechas', detail: 'Intervalos consistentes: el espaciado desigual distorsiona la tendencia.' },
  { n: 8, slug: 'leyenda', name: 'Leyenda', detail: 'Solo cuando hay varias series y el etiquetado directo no cabe.' },
  { n: 9, slug: 'tabla', name: 'Botón de tabla de datos', detail: 'Alternativa accesible al gráfico. Obligatorio en bar, line y dumbbell.' },
];

interface AnatomyRow {
  part: string;
  /** Cells in column order: bar, line, heatmap, dumbbell. */
  cells: [string, string, string, string];
}

/** Mirrors the anatomy table in docs/rules/data-viz-skill.md. */
const ANATOMY_ROWS: AnatomyRow[] = [
  { part: 'Título', cells: ['Opcional', 'Opcional', 'Opcional', 'Opcional'] },
  { part: 'Subtítulo', cells: ['Opcional', 'Opcional', 'Opcional', 'Opcional'] },
  { part: 'Botón de tabla de datos', cells: ['Requerido', 'Requerido', 'Opcional', 'Requerido'] },
  { part: 'Botón de instrucciones de teclado', cells: ['Requerido', 'Requerido', 'Requerido', 'Requerido'] },
  { part: 'Lienzo del gráfico', cells: ['Requerido', 'Requerido', 'Requerido', 'Requerido'] },
  { part: 'Marcadores de datos', cells: ['Requerido', 'Requerido', 'Requerido', 'Requerido'] },
  { part: 'Eje cuantitativo', cells: ['Requerido', 'Requerido (vertical)', '—', 'Requerido (vertical)'] },
  { part: 'Eje de categorías o fechas', cells: ['Requerido', 'Requerido (horizontal)', 'Requerido (ambos)', 'Requerido (horizontal)'] },
  { part: 'Leyenda', cells: ['—', 'Opcional', 'Opcional', 'Opcional'] },
  { part: 'Etiquetas de serie', cells: ['—', 'Opcional', '—', '—'] },
];

@Component({
  selector: 'site-graficos-landing',
  standalone: true,
  imports: [TeaserTileComponent, ChartLineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './graficos.landing.html',
  styleUrls: ['./graficos.landing.scss'],
})
export class GraficosLandingPage {
  readonly anatomySeries = ANATOMY_SERIES;
  readonly callouts = ANATOMY_CALLOUTS;
  readonly anatomyRows = ANATOMY_ROWS;

  readonly charts = [
    {
      slug: 'bar',
      name: 'Bar',
      description: 'Barras verticales u horizontales. Y siempre desde cero.',
    },
    {
      slug: 'line',
      name: 'Line',
      description: 'Series temporales con segmentos rectos. Gaps para valores nulos.',
    },
    {
      slug: 'heatmap',
      name: 'Heatmap',
      description: 'Grilla 2D con escala secuencial o divergente.',
    },
    {
      slug: 'dumbbell',
      name: 'Dumbbell',
      description: 'Comparación de dos valores por categoría (actual vs objetivo).',
    },
    {
      slug: 'evolucion-patrimonial',
      name: 'Evolución patrimonial — V3',
      description:
        'Patrón compuesto: cabecera flotante, filtros por zonas, barras monocromáticas. Iteración V3 en curso.',
    },
  ];
}
