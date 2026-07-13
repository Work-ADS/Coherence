/**
 * Menu v2 (foundations-modern) — type exports only.
 *
 * Per `docs/rules/component-skill.md §6` (LOCKED 2026-05-19), state/variant
 * logic lives in the component SCSS via BEM modifiers. This file exports the
 * union types consumed by the menu-v2 family's signal inputs.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Menu Item set (node
 * 2401:1966) + the Menu / Select documentation canvas (node 2410:2101).
 */

export type MenuItemV2Variant = 'default' | 'destructive';

/**
 * ARIA role the item element carries. `menuitem` inside a context menu
 * (`role="menu"`), `option` inside a Select listbox (`role="listbox"`).
 */
export type MenuItemV2Role = 'menuitem' | 'option';
