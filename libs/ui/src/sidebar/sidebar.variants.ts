export type SidebarMode = 'static' | 'collapsible' | 'hover-expand';

/**
 * `neutral` and `secondary-azul` are the original chrome. `flush-light` (sits
 * on the canvas, dark ink) and `inset-dark` (an inset azul panel, light ink)
 * are the Wealth Planner chrome: 36px rows, 72px rail, tokens from `--sidebar-*`.
 */
export type SidebarVariant = 'neutral' | 'secondary-azul' | 'flush-light' | 'inset-dark';

/** Who is signed in, shown above the footer. */
export interface SidebarUser {
  name: string;
  role?: string;
  src?: string | null;
}

/** Variants that carry the Wealth Planner geometry. */
export const planningVariants: readonly SidebarVariant[] = ['flush-light', 'inset-dark'] as const;

export const sidebarWidths = {
  collapsed: '64px',
  expanded: '240px',
} as const;

/** Tokens consumed by Sidebar. */
export const tokenUsage = [
  { property: 'Background', token: '--sidebar-background (new variants) / --nav-sidebar' },
  { property: 'Border', token: '--sidebar-border / --border-subtle' },
  { property: 'Ink', token: '--sidebar-foreground' },
  { property: 'Panel width', token: '--sidebar-nav-width' },
  { property: 'Rail width', token: '--sidebar-rail-width' },
  { property: 'Brand band', token: '--sidebar-brand-height' },
  { property: 'Group gap', token: '--sidebar-group-gap' },
  { property: 'Transition', token: '--duration-base + --easing-standard' },
] as const;
