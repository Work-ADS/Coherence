// =============================================================================
// Stepper — variants + item type (Coherence DS)
// =============================================================================

export type StepperOrientation = 'horizontal' | 'vertical';

/** One step in the indicator. Add fields cautiously — every consumer reads them. */
export interface StepperItem {
  key: string;
  label: string;
}

/** Per-item state computed from `current` vs the item's index (1-based). */
export type StepperState = 'done' | 'current' | 'todo';
