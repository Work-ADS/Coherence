export interface SelectOption {
  value: string | number;
  label: string;
  icon?: string;
  description?: string;
  disabled?: boolean;
  group?: string;
}

/** @deprecated No longer used — Select is always custom listbox. Kept for API compat. */
export type SelectMode = 'native' | 'custom';
export type SelectSize = 'sm' | 'md' | 'lg';

/** `pill` is the filter-row shape: fully rounded and sized to its content. */
export type SelectShape = 'rect' | 'pill';
/** Which edge of the trigger the open panel lines up with. */
export type SelectAlign = 'start' | 'end';
