/**
 * afi-input — type exports only.
 *
 * Per `docs/rules/component-skill.md §6`, variant logic lives in
 * `input.component.scss` via BEM modifiers.
 */

export type InputSize = 'sm' | 'md' | 'lg';

/** `pill` is the filter-row shape: fully rounded, for search and filter fields on open canvas, never inside a form. */
export type InputShape = 'rect' | 'pill';
export type InputType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'password'
  | 'date';
