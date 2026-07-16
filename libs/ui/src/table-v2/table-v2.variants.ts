/**
 * Table v2 (foundations-modern) — public types + token manifest.
 *
 * The v2 table keeps the v1 `afi-table` API shape (`[columns]` + `[rows]` +
 * `[rowActions]`) so it reads as a familiar, migratable swap, but it is rebuilt
 * on the foundations-modern tokens and v2 primitives (checkbox-v2, badge-v2,
 * icon-button-v2, menu-v2) and adds the Figma density / selection / Data-Empty-
 * Loading model.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Table (Shell 2738:5016, Row
 * 2730:3800, Cell 2729:3488, Header Cell 2730:3888, Header Row 2730:3889,
 * behaviour 2740:4153, documentation 2744:4180).
 *
 * Deliberately out of scope for this first cut (documented parity gaps vs. the
 * v1 table, to add when a consumer needs them): expandable / child rows, grouped
 * two-row headers, per-cell tone, and custom cell templates.
 */

import type { BadgeV2Tone } from '../badge-v2';
import type { IconButtonV2Variant } from '../icon-button-v2';

/** Row density — drives row/cell height and cell inline padding only. */
export type TableV2Density = 'compact' | 'default' | 'comfortable';

/**
 * Cell kind — determines rendering AND default alignment (Figma "Alignment
 * rules"): text/status → start, numeric/monetary → end (with tabular figures).
 * An explicit `align` on the column overrides the kind default.
 */
export type TableV2CellKind = 'text' | 'numeric' | 'monetary' | 'status';

/**
 * When (and whether) the selection checkboxes and trailing row actions reveal.
 * `hover` (default) keeps them at 0 opacity until the row is hovered / focused /
 * selected — the Notion / Granola register the team locked for v1. `always`
 * keeps them persistently visible for denser or kiosk contexts. The header
 * "select all" checkbox is ALWAYS visible regardless of this setting.
 */
export type TableV2ActionsReveal = 'hover' | 'always';

export interface TableV2Column {
  /** Row-data property this column reads. */
  key: string;
  /** Visible column header label. */
  label: string;
  /** Cell kind — default `'text'`. Drives rendering + default alignment. */
  kind?: TableV2CellKind;
  /** Sortable header (cycles none → asc → desc → none via `sortChange`). */
  sortable?: boolean;
  /** Override the kind's default alignment. */
  align?: 'start' | 'center' | 'end';
  /** Explicit column width (CSS length). Omit for flexible (`flex: 1`). */
  width?: string;
  /** Badge tone for `kind: 'status'` cells (whole column). Default `'neutral'`. */
  badgeTone?: BadgeV2Tone;
  /**
   * For `kind: 'status'`: read the badge tone per-row from `row[toneKey]`
   * (a `BadgeV2Tone`). Falls back to `badgeTone` then `'neutral'` when the row
   * value is missing or invalid. Use when the status colour varies by row.
   */
  toneKey?: string;
  /** Hide the column without removing it from the data model. */
  hidden?: boolean;
}

/** Known trailing-row-action icons (inline SVGs rendered by the table). */
export type TableV2RowActionIcon = 'edit' | 'delete' | 'duplicate' | 'more' | 'archive';

export interface TableV2RowAction {
  key: string;
  label: string;
  /** Inline icon glyph. Omit to render an inline label icon-button is skipped. */
  icon?: TableV2RowActionIcon;
  ariaLabel?: string;
  /** `danger` tints the overflow menu row / inline icon-button destructive. */
  variant?: 'default' | 'danger';
  /**
   * Explicit icon-button variant for an INLINE action (e.g. the Edit action
   * as `primary`). Falls back to `secondary` (or `destructive` when
   * `variant: 'danger'`). Ignored for overflow-menu actions.
   */
  iconVariant?: IconButtonV2Variant;
  /**
   * Route this action into the trailing `⋯` overflow menu instead of an inline
   * icon-button. Mirrors the v1 threshold rule: a set of ≤ 2 actions is always
   * rendered inline; the flag only takes effect at 3+ actions.
   */
  overflow?: boolean;
}

export interface TableV2SortState {
  column: string;
  direction: 'asc' | 'desc';
}

export const tokenUsage = [
  { property: 'Fondo del shell', token: 'var(--background-surface)' },
  { property: 'Borde del shell', token: 'var(--borders-default)', note: 'grosor --stroke-default' },
  { property: 'Alto de fila', token: 'var(--table-row-compact | -default | -comfortable)', note: '32 · 40 · 48' },
  { property: 'Alto de cabecera', token: 'var(--table-header-height)', note: '40, fijo' },
  { property: 'Padding lateral de celda', token: 'var(--pad-table-cell-inline-compact | -default)', note: '8 (compact) · 12 (default/comfortable)' },
  { property: 'Gap de contenido de celda', token: 'var(--gap-table-cell-content)' },
  { property: 'Ancho columna de selección', token: 'var(--width-table-selection-column)', note: '40' },
  { property: 'Divisor de fila', token: 'var(--borders-default)', note: 'alto --stroke-hairline, solo inferior' },
  { property: 'Texto de celda', token: 'var(--content-primary)', note: 'estilo table 13/18/400' },
  { property: 'Texto de cabecera', token: 'var(--content-secondary)', note: 'estilo table header 13/18/500' },
  { property: 'Icono de orden', token: 'var(--content-secondary)', note: 'tamaño --icon-xs' },
  { property: 'Fila hover', token: 'var(--background-hover)' },
  { property: 'Fila seleccionada', token: 'var(--background-selected)' },
];
