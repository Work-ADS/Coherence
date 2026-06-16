/**
 * afi-filter-chip — type exports only.
 *
 * Per `docs/rules/component-skill.md §6`, variant logic lives in
 * `filter-chip.component.scss` via BEM modifiers.
 */

export type FilterChipSize = 'sm' | 'md';

/**
 * Behavior mode for the filter chip.
 *
 * - `toggle`   — single pill that toggles on/off (legacy default). Use a
 *                row of these when the filter set is small (≤ 5 values)
 *                and selection state should be visible at a glance.
 * - `dropdown` — one pill with a label (e.g. "Tipo") that opens a panel
 *                of multi-select checkbox rows. Use when the filter set
 *                is larger or when several filter axes share one row.
 */
export type FilterChipMode = 'toggle' | 'dropdown';

/**
 * Option shown inside the dropdown panel when `mode="dropdown"`.
 *
 * - `value` is the stable id emitted via `(selectedValuesChange)`.
 * - `label` is what the user reads.
 * - `count` (optional) renders as a trailing pill on the row.
 */
export interface FilterChipOption {
  value: string;
  label: string;
  count?: number;
}
