/**
 * Select variant class maps.
 * CVA-style pattern — matches Input's file structure.
 * All colors reference Tailwind tokens (no hex/rgba).
 */

export const baseClasses =
  'block w-full appearance-none rounded-md border bg-surface text-canvas-fg ' +
  'transition-colors duration-fast ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export const stateClasses = {
  idle: 'border-border-hairline hover:border-neutral-400',
  error: 'border-system-error hover:border-system-error',
} as const;

/**
 * Size variants for the trigger button.
 *
 * Horizontal padding is symmetric (same left & right). The chevron sits at
 * the end of the flex row, naturally landing right at the padding edge —
 * no extra right-padding is needed. Previously pr-8/10/12 created unwanted
 * empty space between chevron and the container edge.
 */
export const sizeClasses = {
  sm: 'h-8 px-3 text-body-sm',
  md: 'h-10 px-4 text-body-md',
  lg: 'h-12 px-5 text-body-md',
} as const;

/** Tokens consumed by Select — shown on the Design tab. */
export const tokenUsage = [
  { property: 'Fondo', token: 'var(--surface-base)' },
  { property: 'Texto', token: 'var(--canvas-fg)' },
  { property: 'Borde (idle)', token: 'var(--border-hairline)' },
  { property: 'Borde (error)', token: 'var(--system-error-base)' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Altura (sm/md/lg)', token: 'var(--control-h-sm), -md, -lg' },
  { property: 'Radio', token: 'var(--radius-md)' },
  { property: 'Tipografía', token: 'var(--type-body-sm), var(--type-body-md)' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
] as const;
