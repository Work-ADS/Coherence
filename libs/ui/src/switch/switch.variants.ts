/**
 * Switch variant class maps.
 * All colors reference Tailwind tokens (no hex/rgba).
 */

export const trackSizeClasses = {
  sm: 'w-8 h-[18px]',
  md: 'w-10 h-[22px]',
} as const;

export const thumbSizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-[18px] w-[18px]',
} as const;

export const thumbTranslateClasses = {
  sm: 'translate-x-[14px]',
  md: 'translate-x-[18px]',
} as const;

export type SwitchSize = keyof typeof trackSizeClasses;

export const tokenUsage = [
  { property: 'Track (off)', token: 'var(--neutral-300)' },
  { property: 'Track (on)', token: 'var(--action-500)' },
  { property: 'Thumb', token: 'white' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Texto label', token: 'var(--canvas-fg)' },
  { property: 'Hint', token: 'var(--neutral-500)' },
  { property: 'Tamaño track (sm/md)', token: '32×18px / 40×22px' },
  { property: 'Tamaño thumb (sm/md)', token: '14px / 18px' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];
