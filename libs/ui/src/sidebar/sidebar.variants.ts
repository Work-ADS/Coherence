export type SidebarMode = 'static' | 'collapsible' | 'hover-expand';

export const sidebarWidths = {
  collapsed: '64px',
  expanded: '240px',
} as const;

/** Tokens consumed by Sidebar — shown on the Design tab. */
export const tokenUsage = [
  { property: 'Fondo', token: 'var(--surface-quiet)' },
  { property: 'Borde derecho', token: 'var(--border-hairline)' },
  { property: 'Pin activo', token: 'var(--action-500)' },
  { property: 'Pin inactivo', token: 'var(--neutral-400)' },
  { property: 'Ancho colapsado', token: '64px' },
  { property: 'Ancho expandido', token: '240px' },
  { property: 'Transición', token: 'var(--duration-200) ease-out' },
] as const;
