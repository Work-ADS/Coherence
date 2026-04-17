export type PageHeaderDensity = 'compact' | 'default';

export const densityClasses: Record<PageHeaderDensity, string> = {
  compact: 'min-h-[48px] py-2',
  default: 'min-h-[56px] py-3',
};

export const stickyClasses = 'sticky top-0 z-10';

export const scrollFadeClasses =
  'backdrop-blur-sm border-b border-border-hairline';

export const noScrollFadeClasses = 'border-b border-transparent';

export const tokenUsage = [
  { property: 'Fondo', token: 'var(--surface-elevated)' },
  { property: 'Título', token: 'var(--type-title), var(--canvas-fg)' },
  { property: 'Subtítulo', token: 'var(--type-body), var(--color-neutral-500)' },
  { property: 'Borde scroll', token: 'var(--border-hairline)' },
  { property: 'Backdrop blur', token: 'blur(8px)' },
  { property: 'Padding horizontal', token: 'var(--dim-space-8)' },
  { property: 'Altura mín. (default)', token: '56px' },
  { property: 'Altura mín. (compact)', token: '48px' },
  { property: 'Sticky z-index', token: 'z-10' },
  { property: 'Transición', token: 'var(--duration-fast) var(--easing-enter)' },
];
