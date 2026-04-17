import type { Estado } from './status-chip.labels';

export type StatusChipSize = 'sm' | 'md';
export type StatusChipVariant = 'subtle' | 'solid';

export const baseClasses =
  'inline-flex items-center rounded-full font-medium ' +
  'transition-colors duration-fast ease-out';

export const sizeClasses: Record<StatusChipSize, string> = {
  sm: 'h-5 px-2 text-body-sm',
  md: 'h-6 px-2.5 text-body-sm',
};

export function variantClasses(variant: StatusChipVariant, estado: Estado): string {
  if (variant === 'solid') {
    return `bg-[var(--status-${estadoToCssKey(estado)}-dot)] text-white`;
  }
  const key = estadoToCssKey(estado);
  return `bg-[var(--status-${key}-bg)] text-[var(--status-${key}-fg)]`;
}

function estadoToCssKey(estado: Estado): string {
  const map: Record<Estado, string> = {
    'borrador': 'draft',
    'pendiente': 'pending',
    'aprobada': 'approved',
    'rechazada': 'rejected',
    'ejecutada': 'executed',
    'cancelada': 'cancelled',
    'en-revision': 'in-review',
    'archivada': 'archived',
  };
  return map[estado];
}

export const tokenUsage = [
  { property: 'Fondo (subtle)', token: 'var(--status-{key}-bg)' },
  { property: 'Texto (subtle)', token: 'var(--status-{key}-fg)' },
  { property: 'Fondo (solid)', token: 'var(--status-{key}-dot)' },
  { property: 'Texto (solid)', token: 'white' },
  { property: 'Dot', token: 'var(--status-{key}-dot)' },
  { property: 'Radio', token: 'rounded-full' },
  { property: 'Altura (sm)', token: 'h-5 (20px)' },
  { property: 'Altura (md)', token: 'h-6 (24px)' },
  { property: 'Tipografía', token: 'var(--type-body-sm), font-medium' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];
