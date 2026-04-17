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

export const sizeClasses = {
  sm: 'h-8 px-3 pr-8 text-body-sm',
  md: 'h-10 px-4 pr-10 text-body-md',
  lg: 'h-12 px-5 pr-12 text-body-md',
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
