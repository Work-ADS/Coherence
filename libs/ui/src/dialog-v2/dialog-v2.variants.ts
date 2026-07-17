/**
 * afi-dialog-v2 — type exports + token manifest only.
 *
 * Per `docs/rules/component-skill.md §6`, variant logic lives in
 * `dialog-v2.component.scss` via BEM modifiers (`&--sm`, `&--md`, …). This file
 * exports the union type consumed by the component's `size` signal input, plus
 * the `tokenUsage` map the future documentation page renders in its "Tokens"
 * block.
 *
 * Mirrors the Figma component set (AFI-FOUNDATIONS-MODERN → Dialog 2736:3707),
 * which defines a width-only Size variant (SM · MD · LG) over an identical
 * Header + Body + Footer shell. `xl` / `xxl` extend that scale in code for
 * complex and 2-pane dialogs (the same need the v1 `afi-modal` covered); their
 * width tokens were added to the modern foundation ahead of Figma and should be
 * reconciled into the Figma variables on the next sync.
 */

/**
 * Width of the dialog shell. Structure is identical across sizes — only the
 * `max-width` changes.
 *
 * - `sm` (400px) — confirms, prompts, single-decision dialogs.
 * - `md` (560px) — default forms.
 * - `lg` (720px) — longer forms.
 * - `xl` (800px) — multi-section forms. Code extension beyond the Figma spec.
 * - `xxl` (960px) — 2-pane layouts (form + live preview). Reach for it only
 *   when a single pane genuinely doesn't fit. Code extension beyond Figma.
 */
export type DialogV2Size = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/** Reason a dialog closed, emitted on the `closed` output. */
export type DialogV2CloseReason = 'esc' | 'backdrop' | 'button';

export const tokenUsage = [
  { property: 'Fondo panel', token: 'var(--background-elevated)' },
  { property: 'Radio', token: 'var(--radius-xl)' },
  { property: 'Sombra', token: 'var(--elevation-dialog)' },
  {
    property: 'Relleno + separación de secciones',
    token: 'var(--pad-dialog)',
    note: '24 — padding del shell y gap entre header/body/footer',
  },
  {
    property: 'Ancho (SM · MD · LG · XL · XXL)',
    token: 'var(--width-dialog-sm | -md | -lg | -xl | -xxl)',
    note: '400 · 560 · 720 · 800 · 960',
  },
  {
    property: 'Backdrop (scrim)',
    token: 'var(--overlay-blanket)',
    note: 'TODO(tokens): la foundation modern aún no define overlay/scrim propio; se usa el token v1 (no el alias --surface-overlay)',
  },
  { property: 'Título', token: 'var(--content-primary)', note: 'tipografía H4' },
  {
    property: 'Descripción',
    token: 'var(--content-secondary)',
    note: 'tipografía body/default',
  },
  { property: 'Separación título/descripción', token: 'var(--gap-control-sm)' },
  { property: 'Separación acciones footer', token: 'var(--gap-dialog-actions)' },
] as const;
