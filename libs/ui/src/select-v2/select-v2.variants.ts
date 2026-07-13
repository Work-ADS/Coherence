/**
 * Select v2 (foundations-modern) — type exports only.
 *
 * Per `docs/rules/component-skill.md §6` (LOCKED 2026-05-19), state/variant
 * logic lives in the component SCSS via BEM modifiers. This file exports the
 * union types consumed by the select-v2 signal inputs.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Select set (node 2406:2129).
 * Figma authors MD + LG only; SM is extrapolated from the token scale, matching
 * the input-v2 precedent.
 */

export type SelectV2Size = 'sm' | 'md' | 'lg';

/**
 * One choice in a Select's listbox. `value` is the stable key emitted on
 * selection; `label` is what the user reads. `disabled` options render dimmed
 * and are skipped by keyboard navigation and clicks.
 */
export interface SelectV2Option {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}
