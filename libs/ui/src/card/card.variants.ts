/**
 * Card variant class maps.
 * All colors reference Tailwind tokens (no hex/rgba).
 */

export const variantClasses = {
  default: 'bg-surface-100 border border-border-hairline',
  elevated: 'bg-surface-elevated shadow-sm',
  quiet: 'bg-surface-quiet',
} as const;

export const paddingClasses = {
  none: '',
  sm: 'p-space-3',
  md: 'p-space-4',
  lg: 'p-space-6',
} as const;

export type CardVariant = keyof typeof variantClasses;
export type CardPadding = keyof typeof paddingClasses;

export const tokenUsage = [
  { property: 'Fondo (default)', token: 'var(--surface-100)' },
  { property: 'Fondo (elevated)', token: 'var(--surface-elevated)' },
  { property: 'Fondo (quiet)', token: 'var(--surface-quiet)' },
  { property: 'Borde', token: 'var(--border-hairline)' },
  { property: 'Sombra (elevated)', token: 'shadow-sm' },
  { property: 'Sombra hover (interactive)', token: 'shadow-md' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Radio', token: 'rounded-md (6px)' },
  { property: 'Padding (sm/md/lg)', token: 'space-3 / space-4 / space-6' },
  { property: 'Transición (interactive)', token: 'var(--duration-fast) ease-out' },
];
