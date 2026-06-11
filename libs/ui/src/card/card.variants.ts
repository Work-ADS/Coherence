/**
 * Card variants — semantic intent only. The visual mapping (token, shadow,
 * padding) lives in card.component.scss as BEM modifier classes. Consumers
 * pass the variant name; the host class emits `afi-card--<variant>` for the
 * SCSS to pick up.
 *
 * Refactored 2026-06-10 (Richard): legacy Tailwind class map removed,
 * default variant now uses `--surface-subtle` (AFI Gris 25), no border.
 */

export type CardVariant = 'default' | 'elevated' | 'quiet';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export const tokenUsage = [
  { property: 'Fondo (default)', token: 'var(--surface-subtle)' },
  { property: 'Fondo (elevated)', token: 'var(--surface-raised)' },
  { property: 'Fondo (quiet)', token: 'var(--surface-default)' },
  { property: 'Sombra (elevated)', token: 'var(--elevation-sm)' },
  { property: 'Sombra hover (interactive)', token: 'var(--elevation-md)' },
  { property: 'Foco', token: 'var(--border-focus)', note: '--space-2xs offset' },
  { property: 'Radio', token: 'var(--radius-md)' },
  {
    property: 'Padding (sm/md/lg)',
    token: 'var(--space-sm) / var(--space-md) / var(--space-lg)',
  },
  {
    property: 'Transición',
    token: 'var(--duration-fast) var(--easing-enter)',
  },
];
