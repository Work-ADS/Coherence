/**
 * Button v2 (foundations-modern) variant + size — type exports only.
 *
 * Per `docs/rules/component-skill.md §6` (LOCKED 2026-05-19), variant logic
 * lives in `button-v2.component.scss` via BEM modifiers (`&--primary`, `&--xs`).
 * This file exports the union types consumed by the component's signal inputs.
 *
 * Mirrors the Figma component set exactly: Variant = Primary | Secondary |
 * Ghost | Destructive; Size = XS | SM | MD | LG.
 */

export type ButtonV2Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonV2Size = 'xs' | 'sm' | 'md' | 'lg';
