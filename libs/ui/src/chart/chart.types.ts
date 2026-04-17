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
}

export interface LineSeries {
  key: string;
  points: Array<{ x: number | Date; y: number | null }>;
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
export type HeatmapScale = 'sequential' | 'divergent';
export type DumbbellOrientation = 'vertical' | 'horizontal';
