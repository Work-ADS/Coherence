/**
 * afi-search — type exports only.
 *
 * Per `docs/rules/component-skill.md §6`, variant logic lives in
 * `search.component.scss` via BEM modifiers.
 */

export type SearchSize = 'sm' | 'md' | 'lg';

/**
 * Item shape for the optional `[suggestions]` autocomplete dropdown.
 *
 * The primitive renders three slots per row:
 *  - `label`       — primary line (bold, always shown)
 *  - `description` — secondary line (muted, below the label)
 *  - `trailing`    — trailing tag aligned right (compact, tabular)
 *
 * Use `id` (defaults to `label`) to disambiguate when two suggestions
 * share a visible label. The id is what the `(suggestionPicked)` event
 * carries, so the consumer can map back to the source record without
 * relying on label text.
 */
export interface SearchSuggestion {
  /** Primary line — required, what the user reads first. */
  label: string;
  /** Optional secondary line under the label (e.g. category · entity). */
  description?: string;
  /** Optional trailing tag aligned right (e.g. formatted value). */
  trailing?: string;
  /** Stable identifier; falls back to `label` when omitted. */
  id?: string;
}
