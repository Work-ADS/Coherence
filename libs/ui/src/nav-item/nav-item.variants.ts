export type NavItemVariant = 'default' | 'active';

export const navItemClasses: Record<NavItemVariant, string> = {
  default: 'hover:bg-surface-100 text-neutral-700',
  active: 'bg-action/5 border-l-2 border-l-action text-action-900',
};

/** Tokens consumed by NavItem — shown on the Design tab. */
export const tokenUsage = [
  { property: 'Texto (idle)', token: 'var(--neutral-700)' },
  { property: 'Texto (activo)', token: 'var(--action-900)' },
  { property: 'Fondo hover', token: 'var(--surface-100)' },
  { property: 'Fondo activo', token: 'var(--action) / 5%' },
  { property: 'Borde activo', token: 'var(--action)' },
  { property: 'Badge fondo', token: 'var(--system-error-500)' },
  { property: 'Tooltip fondo', token: 'var(--neutral-900)' },
  { property: 'Foco', token: 'var(--action)', note: '2px offset' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
] as const;
