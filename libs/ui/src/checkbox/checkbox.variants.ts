/**
 * afi-checkbox — type exports only.
 *
 * Per `docs/rules/component-skill.md §6`, size logic lives in
 * `checkbox.component.scss` via BEM modifiers.
 */

export type CheckboxSize = 'sm' | 'md';

/** Token usage map for the Checkbox primitive (consumed by site Design tab). */
export const tokenUsage = [
  { property: 'Fondo (sin marcar)', token: 'var(--input-background-default)' },
  { property: 'Fondo (marcado)', token: 'var(--brand-secondary-background-default)' },
  { property: 'Borde (reposo)', token: 'var(--input-border-default)' },
  { property: 'Borde (hover)', token: 'var(--input-border-hover)' },
  { property: 'Borde (marcado)', token: 'var(--brand-secondary-background-default)' },
  { property: 'Borde (error)', token: 'var(--feedback-error-foreground)' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px' },
  { property: 'Texto label', token: 'var(--foreground-primary-default)' },
  { property: 'Hint', token: 'var(--foreground-tertiary-default)' },
  { property: 'Error', token: 'var(--feedback-error-foreground)' },
  { property: 'Tamaño (md/sm)', token: 'var(--checkbox-size-md) / var(--checkbox-size-sm)' },
  { property: 'Trazo (md/sm)', token: 'var(--checkbox-glyph-md) / var(--checkbox-glyph-sm)' },
  { property: 'Radio', token: 'var(--radius-sm)' },
  { property: 'Transición', token: 'var(--duration-fast) var(--easing-enter)' },
] as const;
