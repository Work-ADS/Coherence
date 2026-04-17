export type LoadingOverlayVariant = 'quiet-spinner' | 'line-reveal';

export const tokenUsage = [
  { property: 'Fondo overlay', token: 'var(--surface-quiet)', note: 'opacity 0.85' },
  { property: 'Spinner borde', token: 'var(--neutral-200)' },
  { property: 'Spinner acento', token: 'var(--action-500)' },
  { property: 'Barra line-reveal', token: 'var(--action-500)' },
  { property: 'Texto mensaje', token: 'var(--neutral-600)' },
  { property: 'Fade-in', token: 'var(--duration-fast) ease-out' },
  { property: 'Spinner spin', token: '700ms linear infinite' },
  { property: 'Barra grow', token: '400ms ease-out' },
];
