export type LoadingOverlayVariant = 'quiet-spinner' | 'line-reveal';

export const tokenUsage = [
  { property: 'Fondo overlay', token: 'var(--surface-subtle)', note: 'opacity 0.85' },
  { property: 'Spinner borde', token: 'var(--control-track-background)' },
  { property: 'Spinner acento', token: 'var(--brand-secondary-background-default)' },
  { property: 'Barra line-reveal', token: 'var(--brand-secondary-background-default)' },
  { property: 'Texto mensaje', token: 'var(--foreground-tertiary-default)' },
  { property: 'Fade-in', token: 'var(--duration-fast) var(--easing-enter)' },
  { property: 'Barra grow', token: 'var(--duration-reveal-light) var(--easing-enter)' },
];
