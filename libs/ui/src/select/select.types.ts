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

/** State handed to a custom `#trigger` template so it can summarise itself. */
export interface SelectTriggerContext {
  /** Same object as the context itself, so `let-s` works. */
  $implicit: SelectTriggerState;
}

export interface SelectTriggerState {
  open: boolean;
  /** Open or close the panel (bind it to the trigger's click). */
  toggle: () => void;
  value: string | number | null;
  /** The selected option, or null. */
  option: SelectOption | null;
  /** Clears the value (emits `valueChange` with null). */
  clear: () => void;
  /** Id of the listbox, for `aria-controls` on the custom trigger. */
  listboxId: string;
}

/** `pill` is the filter-row shape: fully rounded and sized to its content. */
export type SelectShape = 'rect' | 'pill';
/** Which edge of the trigger the open panel lines up with. */
export type SelectAlign = 'start' | 'end';
