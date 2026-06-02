/**
 * Button variant + size — type exports only.
 *
 * Per `docs/rules/component-skill.md §6` (LOCKED 2026-05-19), variant logic
 * lives in `button.component.scss` via BEM modifiers (`&--primary`, `&--sm`).
 * This file exports the union types consumed by the component's signal inputs.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
