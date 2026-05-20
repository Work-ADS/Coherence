export type SidebarMode = 'static' | 'collapsible' | 'hover-expand';
export type SidebarVariant = 'neutral' | 'brand';

export const sidebarWidths = {
  collapsed: '64px',
  expanded: '240px',
} as const;

/** Tokens consumed by Sidebar. */
export const tokenUsage = [
  { property: 'Background', token: '--nav-sidebar' },
  { property: 'Border', token: '--border-subtle' },
  { property: 'Pin active', token: '--brand-primary-foreground-default' },
  { property: 'Pin idle', token: '--foreground-tertiary-default' },
  { property: 'Width collapsed', token: '64px' },
  { property: 'Width expanded', token: '240px' },
  { property: 'Transition', token: '--duration-base + --easing-standard' },
] as const;
