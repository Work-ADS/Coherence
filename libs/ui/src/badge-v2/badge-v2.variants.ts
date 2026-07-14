/**
 * Badge v2 (foundations-modern) tone — type export only.
 *
 * Per `docs/rules/component-skill.md §6` (LOCKED 2026-05-19), variant logic
 * lives in `badge-v2.component.scss` via BEM modifiers (`&--neutral`,
 * `&--success`, …). This file exports the union consumed by the component's
 * `tone` signal input.
 *
 * Mirrors the Figma component set exactly: Tone = Neutral | Success | Warning |
 * Critical | Info. Note `critical` resolves to the `error/*` semantic tokens —
 * the palette names its severe-red role `error`, while the badge surfaces it as
 * the product-facing tone "Critical".
 */

export type BadgeV2Tone = 'neutral' | 'success' | 'warning' | 'critical' | 'info';
