/**
 * afi-badge — type exports only. Variant logic lives in
 * `badge.component.scss` via BEM modifiers (docs/rules/component-skill.md §6).
 */

/** Meaning of the colour. `brand` is the action colour (brand-secondary on AFI). */
export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info';

/** @deprecated Use `BadgeTone`. */
export type BadgeIntent = 'neutral' | 'info' | 'success' | 'warning' | 'error';

/** `soft` is a tinted pill, `solid` a filled one (brand and error only), `outline` an inset hairline. */
export type BadgeVariant = 'soft' | 'solid' | 'outline';

export type BadgeSize = 'sm' | 'md';
