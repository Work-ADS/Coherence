/**
 * Card variants — semantic intent only. The visual mapping (token, shadow,
 * padding) lives in card.component.scss as BEM modifier classes. Consumers
 * pass the variant name; the host class emits `afi-card--<variant>` for the
 * SCSS to pick up.
 *
 * Refactored 2026-06-10 (Richard): legacy Tailwind class map removed,
 * default variant now uses `--surface-subtle` (AFI Gris 25), no border.
 */

/**
 * `default`, `elevated` and `quiet` are ours. The zip names are accepted as
 * aliases: `subtle` is our `default` (surface-subtle) and `raised` is our
 * `elevated`. The zip's own `default` (a flat surface-default card) is our
 * `quiet`; the names swap in a later pass, once the last consumer moves.
 */
export type CardVariant = 'default' | 'elevated' | 'quiet' | 'subtle' | 'raised';

/** `on-brand`: a shadow tinted toward the brand hue, for a card on a coloured ground. */
export type CardElevation = 'default' | 'on-brand';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export const tokenUsage = [
  { property: 'Fondo (default)', token: 'var(--surface-subtle)' },
  { property: 'Fondo (elevated)', token: 'var(--surface-raised)' },
  { property: 'Fondo (quiet)', token: 'var(--surface-default)' },
  { property: 'Sombra (elevated)', token: 'var(--elevation-sm)' },
  { property: 'Sombra hover (interactive)', token: 'var(--elevation-card-hover)', note: 'sube 2 px' },
  { property: 'Sombra (on-brand)', token: 'var(--elevation-card-on-brand)' },
  { property: 'Borde (bordered)', token: 'var(--border-subtle)' },
  { property: 'Foco', token: 'var(--border-focus)', note: 'anillo de 2 px' },
  { property: 'Radio', token: 'var(--radius-card)' },
  { property: 'Radio (bordered)', token: 'var(--radius-section)' },
  {
    property: 'Padding (sm/md/lg)',
    token: 'var(--space-sm) / var(--space-md) / var(--space-lg)',
  },
  {
    property: 'Transición',
    token: 'var(--duration-base) var(--easing-standard)',
  },
];
