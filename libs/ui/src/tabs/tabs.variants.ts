import type { IconName } from '../icon';

/**
 * Tabs size variants.
 * Sizing is handled in SCSS via `.tabs__list--sm` / `.tabs__list--md` modifiers.
 * This file defines the type + token usage reference.
 */

export type TabsSize = 'sm' | 'md';

/** A tab given as data (`items` on `afi-tabs`): the bar only, with the panels owned by the consumer. */
export interface TabsItem {
  value: string;
  label: string;
  icon?: IconName;
  /** Trailing count chip. */
  count?: number | string;
  disabled?: boolean;
}

export const tokenUsage = [
  { property: 'Gap between tabs', token: '--tab-gap' },
  { property: 'Tab height', token: '--tab-item-height (sm: --tab-item-height-sm)' },
  { property: 'Tab font (rest / active)', token: '--tab-item-font / --tab-item-font-active' },
  { property: 'Trigger text (inactive / hover)', token: '--foreground-tertiary-default / --foreground-secondary-default' },
  { property: 'Trigger text (active)', token: '--foreground-brand-default' },
  { property: 'Trigger text (disabled)', token: '--foreground-tertiary-disabled' },
  { property: 'Indicator', token: '--brand-secondary-background-default' },
  { property: 'Count chip', token: '--tab-count-size, --surface-subtle (active: --brand-secondary-neutral-background-default)' },
  { property: 'Panel enter', token: '--reveal-cascade-duration + --easing-enter' },
] as const;
