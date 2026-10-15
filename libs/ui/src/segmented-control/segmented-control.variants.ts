// =============================================================================
// Segmented Control — variants (Coherence DS)
// =============================================================================

export type SegmentedControlSize = 'sm' | 'md' | 'lg';

/** `raised` is a lifted white thumb; `solid` is an action-coloured thumb. */
export type SegmentedControlAppearance = 'raised' | 'solid';

export const tokenUsage = [
  { property: 'Track background', token: 'var(--surface-subtle)' },
  { property: 'Indicator background', token: 'var(--surface-default)' },
  { property: 'Indicator shadow', token: 'var(--elevation-1)' },
  { property: 'Option text (inactive)', token: 'var(--foreground-tertiary-default)' },
  { property: 'Option text (active)', token: 'var(--foreground-primary-default)' },
  { property: 'Option text (hover)', token: 'var(--foreground-secondary-default)' },
  { property: 'Border radius (track)', token: 'var(--radius-lg)' },
  { property: 'Border radius (indicator)', token: 'var(--radius-md)' },
  { property: 'Focus ring', token: 'var(--border-focus)' },
  { property: 'Transition (indicator)', token: 'var(--duration-base) var(--easing-standard)' },
  { property: 'Transition (color)', token: 'var(--duration-fast) ease-out' },
];
