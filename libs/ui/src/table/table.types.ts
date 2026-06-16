import type { TemplateRef } from '@angular/core';

import type { BadgeIntent } from '../badge';

export type TableCellKind = 'text' | 'badge';

/**
 * Context handed to a cell-template projection via the `cellTemplates`
 * input. Consumers reference fields via `let-row` (the implicit) or via
 * `let-col="col"` for column-specific behavior.
 */
export interface TableCellTplCtx {
  $implicit: Record<string, unknown>;
  row: Record<string, unknown>;
  col: TableColumn;
}

export type TableCellTemplateMap = Record<string, TemplateRef<TableCellTplCtx>>;

/**
 * Per-cell tone for scorecard tables (e.g. Consecución de objetivos —
 * verde / naranja / rojo). Resolves to a `--feedback-*-foreground` token
 * via the `afi-table__td--tone-{value}` modifier; `neutral` falls back to
 * the secondary foreground for "dim" cells.
 */
export type TableCellTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

export type TableRowActionVariant = 'default' | 'danger';

/**
 * Known row-action icons. Inline SVG paths rendered by `<afi-table>` so
 * consumers don't have to pass raw markup. Extend cautiously — every new
 * icon adds a switch case in the template + a small file-size cost.
 *
 * Current set covers the WP/Sarevi migration: edit (pencil), delete
 * (trash), more (vertical ⋯). Add `'open'`, `'duplicate'`, `'archive'`
 * if a real consumer needs them.
 */
export type TableRowActionIcon = 'edit' | 'delete' | 'more';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
  width?: string;
  hidden?: boolean;
  emphasis?: boolean;
  kind?: TableCellKind;
  badgeIntent?: BadgeIntent;
  /**
   * When set, the cell reads `row[toneKey]` as a `TableCellTone` and
   * applies `afi-table__td--tone-{value}` so the cell renders with a
   * status foreground. Skipped when the row key is missing or not a
   * valid tone. Used for scorecard tables where individual cells carry
   * verde / naranja / rojo independent of the column.
   */
  toneKey?: string;
  /**
   * Group key for two-row scorecard headers. Consecutive columns with
   * the SAME `group` are colspan-joined under one group header in a
   * second `<thead>` row. The first column in each run also carries the
   * group's display label via `groupLabel`. When no column declares a
   * group, the table renders a flat single-row header (no behavior
   * change). Used by Consecución de objetivos to render "Antes / Después
   * del plan de acción" over three metric columns each.
   */
  group?: string;
  /** Display label for the group header. Read from the first column in the run. */
  groupLabel?: string;
}

export interface TableRowAction {
  key: string;
  label: string;
  /**
   * When present, the action renders as an icon-only square button (label
   * collapses to `aria-label`). Visual parity with `<afi-icon-button>` —
   * but kept inline so the `.afi-table__action` reveal modifiers can
   * apply uniformly.
   */
  icon?: TableRowActionIcon;
  ariaLabel?: string;
  variant?: TableRowActionVariant;
  /**
   * When true, the action does NOT render as an inline button. Instead it
   * appears inside the overflow `⋯` menu (rendered via `<afi-menu>`) at
   * the trailing edge of the row.
   *
   * Threshold rule (Richard 2026-06-10): when the action set has 1 or 2
   * entries, the `overflow` flag is IGNORED and both render inline — a
   * 3-dot menu for ≤ 2 items is friction with no payoff. The flag only
   * starts taking effect at 3+ actions.
   *
   * Canonical patterns:
   *   - 2 actions  → Edit (default icon) + Delete (danger icon), both inline
   *   - 3+ actions → primary inline; the rest with `overflow: true`
   * Danger actions placed in the overflow menu automatically get a divider
   * above them (matching the patrimonial reference).
   */
  overflow?: boolean;
}

export interface TableSortState {
  column: string;
  direction: 'asc' | 'desc';
}

/**
 * Reserved row-data magic keys consumed by `<afi-table>` (2026-05-28).
 * Documented here so consumers know which property names are off-limits as
 * column keys.
 *
 * - `children` — child rows for the `expand` variant. Same column schema
 *   as the parent. Rows with `children` get a chevron prepended to their
 *   first cell; expanding reveals the children indented underneath.
 *   Mutually exclusive with `expandDetailTpl` mode (children win when both
 *   are present).
 * - `actions` — per-row override of the table-level `[rowActions]` input.
 *   Pass `actions: []` to hide all actions on that row; pass a custom
 *   array to swap the action set entirely.
 * - `muted` — when truthy, the row renders italic + tertiary foreground
 *   (BEM modifier `afi-table__row--muted`). Use for reference / baseline
 *   rows that should not draw the eye (e.g. the "Objetivo" target row
 *   in Consecución de objetivos).
 */
export type TableReservedKey = 'children' | 'actions' | 'muted';
