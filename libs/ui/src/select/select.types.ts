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
