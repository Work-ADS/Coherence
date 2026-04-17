export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'left-start';
export type MenuItemVariant = 'default' | 'danger';

/** Tokens consumed by Menu — shown on the Design tab. */
export const tokenUsage = [
  { property: 'Fondo panel', token: 'var(--surface-elevated)' },
  { property: 'Borde panel', token: 'var(--border-hairline)' },
  { property: 'Sombra panel', token: 'var(--shadow-lg)' },
  { property: 'Fondo item hover', token: 'var(--surface-muted)' },
  { property: 'Texto item', token: 'var(--canvas-fg)' },
  { property: 'Texto danger', token: 'var(--system-error-600)' },
  { property: 'Fondo danger hover', token: 'var(--system-error-50)' },
  { property: 'Ícono item', token: 'var(--neutral-500)' },
  { property: 'Shortcut', token: 'var(--neutral-400), font-mono' },
  { property: 'Divider', token: 'var(--border-hairline)' },
  { property: 'Radio panel', token: 'var(--radius-lg)' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Animación entrada', token: 'var(--duration-fast) var(--easing-enter)' },
  { property: 'Hover lean-in ícono', token: 'translateX(2px) 120ms var(--easing-enter)' },
] as const;
