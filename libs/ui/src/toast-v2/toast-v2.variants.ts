/**
 * Toast v2 (foundations-modern) — type exports only.
 *
 * Per `docs/rules/component-skill.md §6` (LOCKED 2026-05-19), variant logic
 * lives in `toast-v2.component.scss` via BEM modifiers. This file exports the
 * unions consumed by the component's signal inputs.
 *
 * `placement` mirrors the two positions the v1 toast supported implicitly (it
 * was always bottom-centre); the union makes the choice explicit rather than
 * leaving consumers to override `position: fixed` from the outside.
 */

export type ToastV2Placement = 'bottom-center' | 'bottom-end';

/**
 * Token usage manifest — the semantic roles this component reads. Keep in sync
 * with the stylesheet; the token guardian reviews additions against it.
 */
export const TOAST_V2_TOKEN_USAGE = {
  surface: ['--background-inverse', '--elevation-2'],
  content: ['--content-inverse'],
  dimension: [
    '--height-component-lg',
    '--height-component-sm',
    '--icon-sm',
    '--radius-full',
    '--stroke-default',
  ],
  spacing: ['--gap-control-xs', '--gap-control-sm', '--layout-gap-default'],
  typography: [
    '--font-family-primary',
    '--type-body-small-size',
    '--type-body-small-weight',
    '--type-body-small-line-height',
    '--font-weight-medium',
  ],
  motion: ['--motion-duration-base', '--motion-duration-fast', '--motion-easing-enter'],
} as const;
