/**
 * Tag v2 (foundations-modern) kind — type export only.
 *
 * Per `docs/rules/component-skill.md §6` (LOCKED 2026-05-19), variant logic
 * lives in `tag-v2.component.scss` via BEM modifiers (`&--category`,
 * `&--system`). This file exports the union consumed by the component's `kind`
 * signal input.
 *
 * Mirrors the Figma component set exactly: Kind = Category | System.
 */

export type TagV2Kind = 'category' | 'system';
