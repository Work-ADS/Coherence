// =============================================================================
// Segmented Control — variants (Coherence DS)
// =============================================================================

export type SegmentedControlSize = 'sm' | 'md' | 'lg';

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
  { property: 'Transition (indicator)', token: 'var(--duration-normal) cubic-bezier(0.4, 0, 0.2, 1)' },
  { property: 'Transition (color)', token: 'var(--duration-fast) ease-out' },
];
