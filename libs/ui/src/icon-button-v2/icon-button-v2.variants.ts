/**
 * Icon Button v2 (foundations-modern) — variant + size types and token manifest.
 *
 * Per `docs/rules/component-skill.md §6` (LOCKED 2026-05-19), variant logic
 * lives in the component SCSS via BEM modifiers (`&--primary`, `&--sm`); this
 * file exports only the union types consumed by the signal inputs, plus the
 * `tokenUsage` map the future documentation page renders in its "Tokens" block.
 *
 * Mirrors the Figma component set exactly (Icon Button 2818:5969): Variant =
 * Primary | Secondary | Ghost | Destructive; Size = SM | MD | LG.
 */

export type IconButtonV2Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type IconButtonV2Size = 'sm' | 'md' | 'lg';

export const tokenUsage = [
  { property: 'Lado (SM · MD · LG)', token: 'var(--height-component-sm | -md | -lg)', note: '28 · 32 · 40 — cuadrado' },
  { property: 'Tamaño de icono', token: 'var(--icon-sm) / var(--icon-md)', note: 'SM → 16; MD y LG → 20' },
  { property: 'Radio', token: 'var(--radius-md)' },
  { property: 'Fondo primary', token: 'var(--brand-background-default)', note: 'hover --brand-background-hover, pressed --brand-background-pressed' },
  { property: 'Fondo secondary', token: 'var(--control-background-default)', note: 'hover/active --control-background-hover/-active' },
  { property: 'Fondo destructive', token: 'var(--button-destructive-background)', note: 'hover --button-destructive-background-hover' },
  { property: 'Icono primary/destructive', token: 'var(--content-inverse)' },
  { property: 'Icono secondary/ghost', token: 'var(--content-primary)' },
  { property: 'Sheen (primary/destructive)', token: 'var(--button-sheen)' },
  { property: 'Realce (raised)', token: 'var(--button-raised-primary | -neutral | -danger)' },
  { property: 'Pulsado (pressed)', token: 'var(--button-pressed-primary | -secondary)' },
  { property: 'Anillo de foco', token: 'var(--borders-focus)', note: 'grosor --stroke-focus' },
  { property: 'Deshabilitado', token: 'var(--disabled-background) / var(--disabled-content)' },
];
