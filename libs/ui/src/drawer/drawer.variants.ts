export type DrawerSize = 'sm' | 'md' | 'lg';

export const sizeClasses: Record<DrawerSize, string> = {
  sm: 'w-[400px]',
  md: 'w-[480px]',
  lg: 'w-[640px]',
};

export const tokenUsage = [
  { property: 'Fondo', token: 'var(--surface-base)' },
  { property: 'Borde izquierdo', token: 'var(--border-hairline)' },
  { property: 'Borde header/footer', token: 'var(--border-hairline)' },
  { property: 'Sombra', token: 'shadow-elevation-high' },
  { property: 'Título', token: 'var(--canvas-fg)' },
  { property: 'Navegación (texto)', token: 'var(--neutral-500)' },
  { property: 'Hover (botones)', token: 'var(--surface-100)' },
  { property: 'Tamaño (sm/md/lg)', token: '400px / 480px / 640px' },
  { property: 'Animación slide-in', token: 'translateX (CSS animation)' },
];
