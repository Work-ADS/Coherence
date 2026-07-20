/**
 * Search v2 (foundations-modern) — public types.
 *
 * A search field on the modern foundation whose optional typeahead preview is an
 * `afi-menu-v2` panel (role="listbox") of `afi-menu-item-v2` rows — the same
 * dropdown + overlay harness `afi-select-v2` uses, so the two read as siblings.
 *
 * Consumes only `foundations-modern` tokens → renders correctly only inside a
 * `[data-foundation="modern"]` scope.
 */

export type SearchV2Size = 'sm' | 'md' | 'lg';

/**
 * One typeahead preview row. Consumers own the filtering (typically a
 * `computed()` over the current `value()`) and hand back the matches.
 */
export interface SearchV2Suggestion {
  /** Primary line — required, what the user reads first. */
  label: string;
  /** Optional secondary line under the label (e.g. category · entity). */
  description?: string;
  /** Optional trailing tag aligned right (e.g. a formatted value). */
  trailing?: string;
  /** Stable id; falls back to `label`. Carried on `suggestionPicked`. */
  id?: string;
}
