export type NavItemVariant = 'default' | 'active';

/** Tokens consumed by NavItem. */
export const tokenUsage = [
  { property: 'Text (idle)', token: '--nav-item-foreground-default' },
  { property: 'Text (hover)', token: '--nav-item-foreground-hover' },
  { property: 'Text (active)', token: '--nav-item-foreground-selected' },
  { property: 'Background (hover)', token: '--nav-item-background-hover' },
  { property: 'Background (active)', token: '--nav-item-background-selected' },
  { property: 'Icon (idle)', token: '--nav-item-icon-default' },
  { property: 'Icon (hover)', token: '--nav-item-icon-hover' },
  { property: 'Focus ring', token: '--border-focus' },
  { property: 'Transition', token: '--duration-fast + --easing-standard' },
] as const;
