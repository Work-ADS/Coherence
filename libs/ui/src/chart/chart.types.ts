/**
 * Shared chart types — data shapes, shared API interfaces, and chart config.
 *
 * Each chart primitive consumes a specific datum shape. Shared inputs/outputs
 * are defined here so all four chart components stay in sync.
 */

// ---------------------------------------------------------------------------
// Per-chart datum shapes
// ---------------------------------------------------------------------------

export interface BarDatum {
  key: string;
  value: number;
  label?: string;
  /** Display-only change annotation (e.g. "+0,9 %"). Rendered by the
   *  composition strip's `detail` legend under each category's value;
   *  ignored by every other chart. */
  deltaLabel?: string;
}

export interface LineSeries {
  key: string;
  points: Array<{ x: number | Date; y: number | null }>;
  /** Optional stroke color override. CSS color string (token or hex).
   *  When omitted the chart falls back to the default series palette. */
  color?: string;
}

export interface HeatmapCell {
  x: string | number;
  y: string | number;
  value: number;
}

export interface DumbbellDatum {
  key: string;
  valueA: number;
  valueB: number;
  labelA?: string;
  labelB?: string;
}

// ---------------------------------------------------------------------------
// Color + texture resolver output
// ---------------------------------------------------------------------------

export type TextureId = 'dots' | 'lines' | 'crosshatch';

export interface SeriesVisual {
  color: string;
  texture: TextureId;
  patternId: string;
}

// ---------------------------------------------------------------------------
// Shared chart config types
// ---------------------------------------------------------------------------

export interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface TickStop {
  value: number;
  label: string;
}

export type BarOrientation = 'vertical' | 'horizontal';
export type BarSort = 'asc' | 'desc' | null;
export type CompositionVariant = 'segments' | 'blocks' | 'ticks';
export type HeatmapScale = 'sequential' | 'divergent';
export type DumbbellOrientation = 'vertical' | 'horizontal';
