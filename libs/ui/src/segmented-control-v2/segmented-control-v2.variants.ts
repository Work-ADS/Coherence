// =============================================================================
// Segmented Control v2 — public types (foundations-modern)
// =============================================================================

/**
 * One selectable segment. Labels are concise text (2–4 segments per control);
 * icon-only segments are not supported by design. `disabled` makes the segment
 * inert and skips it during arrow-key rotation.
 */
export interface SegmentedControlV2Option {
  value: string;
  label: string;
  disabled?: boolean;
}
