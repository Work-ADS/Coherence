/** Tokens consumed by NavSection. */
export const tokenUsage = [
  { property: 'Background hover (parent)', token: '--nav-item-background-hover' },
  { property: 'Text (active child)', token: '--nav-item-foreground-selected' },
  { property: 'Chevron', token: '--foreground-tertiary-default' },
  { property: 'Guide line', token: '--border-subtle' },
  { property: 'Trail hover', token: '--brand-primary-border-default' },
  { property: 'Marker', token: '--brand-primary-border-default', note: '2×16px rounded' },
  { property: 'Children indent', token: '--space-lg (24px)' },
  { property: 'Chevron rotation', token: '--duration-fast + --easing-standard' },
  { property: 'Expand/collapse', token: 'grid-template-rows, --duration-base + --easing-standard' },
] as const;
