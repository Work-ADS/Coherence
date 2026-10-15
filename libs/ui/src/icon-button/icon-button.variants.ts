// =============================================================================
// Icon Button — variants (Coherence DS)
//
// Chrome scale 24/28/32/36/40; `quiet` variants carry no surface (row actions, field help).
// Figma token names: --button/{type}/background/{state}
// =============================================================================

export type IconButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'destruction'
  | 'quiet'
  | 'quiet-destruction';

/** @deprecated Use 'secondary' instead */
export type IconButtonVariantLegacy = 'subtle';

export type IconButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
