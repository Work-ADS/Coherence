/**
 * Input v2 (foundations-modern) size + type — type exports only.
 *
 * Per `docs/rules/component-skill.md §6` (LOCKED 2026-05-19), state/size logic
 * lives in `input-v2.component.scss` via BEM modifiers (`&--md`, `&--error`).
 * This file exports the union types consumed by the component's signal inputs.
 *
 * Figma component set (Input, node 2383:5318) defines MD and LG. SM is
 * extrapolated from the token scale (`--height-component-sm` / `--pad-control-sm`),
 * mirroring how `button-v2` built its full size ladder from the dimension tokens.
 */

export type InputV2Size = 'sm' | 'md' | 'lg';

export type InputV2Type =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search';
