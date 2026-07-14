/**
 * Card v2 (foundations-modern) — token usage manifest.
 *
 * The card has no variant/size union: it is a single-shape surface whose only
 * axes are the Header / Footer booleans (handled by inputs, not modifier
 * classes). This file therefore carries only the `tokenUsage` map that the
 * future documentation page renders in its "Tokens" block, mirroring the v1
 * `card` and the other v2 primitives.
 *
 * Every value is bound to an existing foundations-modern token; `--pad-card`
 * (16 / `--dimension-4`) was the one component-specific spacing token added
 * during this build.
 */

export const tokenUsage = [
  { property: 'Fondo', token: 'var(--background-surface)' },
  { property: 'Borde', token: 'var(--borders-default)', note: 'grosor --stroke-default' },
  { property: 'Radio', token: 'var(--radius-xl)' },
  { property: 'Sombra', token: 'var(--elevation-card)', note: 'alias de --elevation-1' },
  { property: 'Padding + gap de sección', token: 'var(--pad-card)' },
  { property: 'Título (H4)', token: 'var(--content-primary)' },
  { property: 'Texto de apoyo', token: 'var(--content-secondary)' },
  { property: 'Divisor', token: 'var(--borders-default)', note: 'alto --stroke-default' },
  { property: 'Gap acciones del pie', token: 'var(--gap-control-sm)' },
];
