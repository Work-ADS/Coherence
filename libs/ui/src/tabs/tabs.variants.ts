/**
 * Tabs variant class maps.
 * All colors reference Tailwind tokens (no hex/rgba).
 */

export const tabSizeClasses = {
  sm: 'h-8 px-3 text-body-sm',
  md: 'h-10 px-4 text-body-md',
} as const;

export type TabsSize = keyof typeof tabSizeClasses;

export const tokenUsage = [
  { property: 'Borde inferior', token: 'var(--border-hairline)' },
  { property: 'Tab activo (borde)', token: 'var(--action-500)' },
  { property: 'Tab activo (texto)', token: 'var(--action-500)' },
  { property: 'Tab inactivo (texto)', token: 'var(--neutral-500)' },
  { property: 'Tab hover (fondo)', token: 'var(--surface-100)' },
  { property: 'Tab hover (texto)', token: 'var(--canvas-fg)' },
  { property: 'Badge fondo', token: 'var(--action-500)' },
  { property: 'Badge texto', token: 'white' },
  { property: 'Foco', token: 'var(--border-focus)', note: 'ring inset' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];
