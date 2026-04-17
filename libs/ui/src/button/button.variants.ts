/**
 * Button variant + size class maps.
 * CVA-style pattern — one file, variants via class binding.
 * All colors reference Tailwind tokens (no hex/rgba).
 */

export const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-md font-serif font-medium ' +
  'transition-colors duration-fast ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export const variantClasses = {
  primary:
    'bg-action text-white hover:bg-action-600 active:bg-action-700',
  secondary:
    'bg-surface text-canvas-fg border border-border-hairline ' +
    'hover:bg-neutral-100 active:bg-neutral-200',
  ghost:
    'bg-transparent text-canvas-fg hover:bg-neutral-100 active:bg-neutral-200',
  danger:
    'bg-system-error text-white hover:opacity-90 active:opacity-80',
} as const;

export const sizeClasses = {
  sm: 'h-8 px-3 text-body-sm',
  md: 'h-10 px-4 text-button',
  lg: 'h-12 px-5 text-button',
} as const;

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;
