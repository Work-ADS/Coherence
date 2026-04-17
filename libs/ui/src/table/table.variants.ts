/**
 * Table variant class maps.
 * All colors reference Tailwind tokens (no hex/rgba).
 */

export const densityClasses = {
  compact: 'h-9',
  comfortable: 'h-12',
} as const;

export type TableDensity = keyof typeof densityClasses;

export const tokenUsage = [
  { property: 'Fondo cabecera', token: 'var(--surface-100)' },
  { property: 'Texto cabecera', token: 'var(--color-neutral-500)' },
  { property: 'Borde fila', token: 'var(--border-hairline)' },
  { property: 'Fondo hover fila', token: 'var(--surface-100)' },
  { property: 'Fondo seleccionado', token: 'var(--action-500) / 5%' },
  { property: 'Borde selección', token: 'var(--action-500)' },
  { property: 'Estado vacío texto', token: 'var(--color-neutral-500)' },
  { property: 'Skeleton', token: 'var(--color-neutral-200)' },
  { property: 'Tipografía', token: 'var(--type-body-sm)' },
  { property: 'Altura (compact)', token: 'h-9 (36px)' },
  { property: 'Altura (comfortable)', token: 'h-12 (48px)' },
];
