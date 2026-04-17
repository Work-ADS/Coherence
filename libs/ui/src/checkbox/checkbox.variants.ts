/**
 * Checkbox variant class maps.
 * All colors reference Tailwind tokens (no hex/rgba).
 */

export const boxSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
} as const;

export type CheckboxSize = keyof typeof boxSizeClasses;

/** Token usage map for the Checkbox primitive (consumed by site Design tab). */
export const tokenUsage = [
  { property: 'Fondo (unchecked)', token: 'var(--surface-base)' },
  { property: 'Fondo (checked)', token: 'var(--action-500)' },
  { property: 'Borde (idle)', token: 'var(--border-hairline)' },
  { property: 'Borde (checked)', token: 'var(--action-500)' },
  { property: 'Borde (error)', token: 'var(--system-error-base)' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Texto label', token: 'var(--canvas-fg)' },
  { property: 'Hint', token: 'var(--neutral-500)' },
  { property: 'Error', token: 'var(--system-error-base)' },
  { property: 'Tamaño (sm/md)', token: '16px / 20px' },
  { property: 'Radio', token: 'rounded-sm (2px)' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
] as const;
