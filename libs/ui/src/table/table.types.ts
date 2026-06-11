import type { BadgeIntent } from '../badge';

export type TableCellKind = 'text' | 'badge';

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
 */
export type TableReservedKey = 'children' | 'actions';
