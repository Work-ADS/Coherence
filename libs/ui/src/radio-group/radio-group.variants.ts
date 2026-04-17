/**
 * RadioGroup variant class maps.
 * All colors reference Tailwind tokens (no hex/rgba).
 */

export const dotSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
} as const;

/** Inner dot size for the selected state */
export const innerDotSizeClasses = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
} as const;

export type RadioSize = keyof typeof dotSizeClasses;

/** Token usage map for the RadioGroup primitive (consumed by site Design tab). */
export const tokenUsage = [
  { property: 'Fondo (unselected)', token: 'var(--surface-base)' },
  { property: 'Fondo (selected)', token: 'var(--action-500)' },
  { property: 'Borde (idle)', token: 'var(--border-hairline)' },
  { property: 'Borde (selected)', token: 'var(--action-500)' },
  { property: 'Borde (error)', token: 'var(--system-error-base)' },
  { property: 'Punto interior', token: 'white' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Texto label', token: 'var(--canvas-fg)' },
  { property: 'Hint', token: 'var(--neutral-500)' },
  { property: 'Tamaño (sm/md)', token: '16px / 20px' },
  { property: 'Radio', token: 'rounded-full' },
  { property: 'Transición', token: '250ms cubic-bezier(0.34, 1.56, 0.64, 1)' },
] as const;
