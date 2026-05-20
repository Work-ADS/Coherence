// =============================================================================
// Icon Button — variants (Coherence DS)
//
// Matches Figma component spec: 5 types × 3 sizes × 4 states.
// Figma token names: --button/{type}/background/{state}
// =============================================================================

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destruction';

/** @deprecated Use 'secondary' instead */
export type IconButtonVariantLegacy = 'subtle';

export type IconButtonSize = 'sm' | 'md' | 'lg';
