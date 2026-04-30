/**
 * Modal variant class maps.
 * All colors reference Tailwind tokens (no hex/rgba).
 */

export const sizeClasses = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
  xl: 'max-w-[960px]',
} as const;

export type ModalSize = keyof typeof sizeClasses;

export const tokenUsage = [
  { property: 'Fondo panel', token: 'var(--surface-elevated)' },
  { property: 'Backdrop', token: 'black/40' },
  { property: 'Borde footer', token: 'var(--border-hairline)' },
  { property: 'Título', token: 'var(--canvas-fg)' },
  { property: 'Descripción', token: 'var(--neutral-600)' },
  { property: 'Botón cerrar (idle)', token: 'var(--neutral-400)' },
  { property: 'Botón cerrar (hover)', token: 'var(--canvas-fg)' },
  { property: 'Foco', token: 'var(--border-focus)' },
  { property: 'Radio', token: 'rounded-md (6px)' },
  { property: 'Sombra', token: 'shadow-lg' },
  { property: 'Tamaño (sm/md/lg)', token: '400px / 560px / 720px' },
];
