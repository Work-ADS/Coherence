/**
 * Tabs size variants.
 * Sizing is handled in SCSS via `.tabs__list--sm` / `.tabs__list--md` modifiers.
 * This file defines the type + token usage reference.
 */

export type TabsSize = 'sm' | 'md';

export const tokenUsage = [
  { property: 'List background', token: 'var(--surface-subtle)' },
  { property: 'Indicator background', token: 'var(--surface-default)' },
  { property: 'Indicator shadow', token: 'var(--shadow-sm)' },
  { property: 'Trigger text (inactive)', token: 'var(--foreground-tertiary-default)' },
  { property: 'Trigger text (active)', token: 'var(--foreground-primary-default)' },
  { property: 'Trigger text (hover)', token: 'var(--foreground-primary-default)' },
  { property: 'Border radius (list)', token: 'var(--radius-lg)' },
  { property: 'Border radius (indicator)', token: 'var(--radius-md)' },
  { property: 'Focus ring', token: 'var(--border-focus)' },
  { property: 'Transition (indicator)', token: 'var(--duration-normal) cubic-bezier(0.4, 0, 0.2, 1)' },
  { property: 'Transition (color)', token: 'var(--duration-fast) ease-out' },
  { property: 'Badge background', token: 'var(--brand-primary-background-default)' },
  { property: 'Badge text', token: 'var(--brand-primary-foreground-default)' },
];
