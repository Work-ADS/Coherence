// =============================================================================
// Stepper — variants + item type (Coherence DS)
// =============================================================================

export type StepperOrientation = 'horizontal' | 'vertical';

/**
 * Per-item visual organization, orthogonal to overall orientation:
 * - `inline` (default) — badge and label sit side-by-side (icon + text).
 * - `stacked` — badge sits above the label, label centered below. Used
 *   when the designer wants a stronger marker per step (e.g. the BC
 *   datos page, where each step circle has its label centered beneath it).
 */
export type StepperLayout = 'inline' | 'stacked';

/** One step in the indicator. Add fields cautiously — every consumer reads them. */
export interface StepperItem {
  key: string;
  label: string;
}

/** Per-item state computed from `current` vs the item's index (1-based). */
export type StepperState = 'done' | 'current' | 'todo';
