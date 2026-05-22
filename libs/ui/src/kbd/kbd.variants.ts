/**
 * afi-kbd — type exports + display constants.
 *
 * Per `docs/rules/component-skill.md §6`, variant logic lives in
 * `kbd.component.scss` via BEM modifiers. This file exports the union
 * types consumed by the component plus the separator-character map.
 */

export const separatorChars = {
  none: '',
  plus: '+',
  arrow: '→',
} as const;

export type KbdSize = 'sm' | 'md';
export type KbdSeparator = keyof typeof separatorChars;
