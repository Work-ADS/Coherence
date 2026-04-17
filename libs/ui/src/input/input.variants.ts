/**
 * Input variant class maps.
 * CVA-style pattern — matches Button's file structure.
 * All colors reference Tailwind tokens (no hex/rgba).
 */

export const baseClasses =
  'block w-full rounded-md border bg-surface text-canvas-fg ' +
  'transition-colors duration-fast ease-out ' +
  'placeholder:text-neutral-400 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'read-only:bg-neutral-50 read-only:cursor-default';

export const stateClasses = {
  idle: 'border-border-hairline hover:border-neutral-400',
  error: 'border-system-error hover:border-system-error',
} as const;

export const sizeClasses = {
  sm: 'h-8 px-3 text-body-sm',
  md: 'h-10 px-4 text-body-md',
  lg: 'h-12 px-5 text-body-md',
} as const;

export type InputSize = keyof typeof sizeClasses;
export type InputType = 'text' | 'textarea' | 'number' | 'email' | 'password';

/** Token usage map for the Input primitive (consumed by site Design tab). */
export const tokenUsage = [
  { property: 'Fondo', token: 'var(--surface-base)' },
  { property: 'Borde (idle)', token: 'var(--border-hairline)' },
  { property: 'Borde (error)', token: 'var(--system-error-base)' },
  { property: 'Borde (hover)', token: 'var(--neutral-400)' },
  { property: 'Foco', token: 'var(--border-focus)' },
  { property: 'Texto', token: 'var(--canvas-fg)' },
  { property: 'Placeholder', token: 'var(--neutral-400)' },
  { property: 'Label', token: 'var(--canvas-fg)' },
  { property: 'Hint', token: 'var(--neutral-500)' },
  { property: 'Error', token: 'var(--system-error-base)' },
  { property: 'Altura (sm/md/lg)', token: 'var(--control-h-sm), -md, -lg' },
  { property: 'Radio', token: 'var(--radius-md)' },
  { property: 'Tipografía', token: 'var(--type-body-sm), var(--type-body-md)' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
] as const;
