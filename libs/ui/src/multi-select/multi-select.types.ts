export interface MultiSelectOption {
  value: string;
  label: string;
  /** Right-aligned secondary text, usually a count. */
  hint?: string;
  disabled?: boolean;
  /**
   * Opt-in grouping. Options sharing a group render together under a header
   * row, groups in order of first appearance. The header is checked when every
   * enabled member is selected, mixed when some are, unchecked when none; it
   * selects or clears the group's enabled members.
   */
  group?: string;
}

export type MultiSelectSize = 'sm' | 'md';

/** `pill` is the filter-row shape: sized to its label, the label is its resting text. */
export type MultiSelectShape = 'default' | 'pill';

/**
 * What the closed control says: `count` (label plus a count badge), `labels`
 * (the picked labels, truncated; only where the field is wide) or `fraction`
 * («N de M», the placeholder when none, `allLabel` when everything is on).
 */
export type MultiSelectSummary = 'count' | 'labels' | 'fraction';

/** State handed to a custom `#trigger` template so it can summarise itself. */
export interface MultiSelectTriggerContext {
  /** Same object as the context itself, so `let-s` works. */
  $implicit: MultiSelectTriggerState;
}

export interface MultiSelectTriggerState {
  open: boolean;
  /** Open or close the panel (bind it to the trigger's click). */
  toggle: () => void;
  selected: readonly string[];
  count: number;
  total: number;
  /** Every enabled option is selected. */
  allSelected: boolean;
  labels: readonly string[];
  /** Empties the enabled selection without opening the panel. */
  clear: () => void;
  /** Id of the listbox, for `aria-controls` on the custom trigger. */
  listboxId: string;
}
