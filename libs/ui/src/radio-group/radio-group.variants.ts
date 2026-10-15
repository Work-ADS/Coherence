/**
 * afi-radio-group — type exports only.
 *
 * Per `docs/rules/component-skill.md §6`, size logic lives in
 * `radio-group-item.component.scss` via BEM modifiers.
 */

export type RadioSize = 'sm' | 'md';

/** One option of a group that renders its own items through `options`. */
export interface RadioOption {
  value: string;
  label: string;
  /** Second line under the label. */
  description?: string;
  disabled?: boolean;
}

/** Token usage map for the RadioGroup primitive (consumed by site Design tab). */
export const tokenUsage = [
  { property: 'Fondo (anillo)', token: 'var(--input-background-default)' },
  { property: 'Borde (reposo)', token: 'var(--input-border-default)' },
  { property: 'Borde (hover)', token: 'var(--input-border-hover)' },
  { property: 'Borde (seleccionado)', token: 'var(--brand-secondary-background-default)' },
  { property: 'Punto interior', token: 'var(--brand-secondary-background-default)' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px' },
  { property: 'Texto label', token: 'var(--foreground-primary-default)' },
  { property: 'Leyenda', token: 'var(--foreground-secondary-default)' },
  { property: 'Hint', token: 'var(--foreground-tertiary-default)' },
  { property: 'Tamaño (md/sm)', token: 'var(--checkbox-size-md) / var(--checkbox-size-sm)' },
  { property: 'Radio', token: 'var(--radius-full)' },
  { property: 'Transición', token: 'var(--duration-fast) var(--easing-enter)' },
] as const;
