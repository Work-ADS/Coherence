/**
 * afi-drawer-v2 — type exports + token manifest only.
 *
 * Per `docs/rules/component-skill.md §6`, variant logic lives in
 * `drawer-v2.component.scss` via BEM modifiers (`&--sm`, `&--md`, `&--lg`). This
 * file exports the union type consumed by the component's `size` signal input,
 * plus the `tokenUsage` map the future documentation page renders in its
 * "Tokens" block.
 *
 * Mirrors the Figma component set (AFI-FOUNDATIONS-MODERN → Drawer 2769:5408,
 * documented at 2799:519), which defines a width-only Size variant (SM · MD · LG)
 * over an identical Header + Body + Footer shell. Unlike the centred `afi-dialog-v2`,
 * the drawer is a right-anchored, full-height panel with dividers between its
 * three sections and a slide-in-from-right entrance.
 */

/**
 * Width of the drawer shell. Structure is identical across sizes — only the
 * `max-inline-size` changes. The panel is always full viewport height.
 *
 * - `sm` (360px) — filters, quick settings, or simple forms.
 * - `md` (480px) — mid forms, detail panels, or moderate-complexity views.
 * - `lg` (640px) — rich-step workflows, comparison tables, or dense content.
 */
export type DrawerV2Size = 'sm' | 'md' | 'lg';

/**
 * Edge the panel is anchored to.
 *
 * - `right` (default) — the standard detail/filter/form drawer; slides in from
 *   the trailing edge. Structure and every other value is unchanged.
 * - `left` — the off-canvas navigation pattern: host `afi-sidebar-v2` as the
 *   body and slides in from the leading edge, matching the Navbar behaviour
 *   canvas ("menu button → opens navigation drawer"). Only the anchored edge,
 *   the rounded (inner) corners, and the slide direction mirror.
 */
export type DrawerV2Anchor = 'right' | 'left';

/** Reason a drawer closed, emitted on the `closed` output. */
export type DrawerV2CloseReason = 'esc' | 'backdrop' | 'button';

export const tokenUsage = [
  { property: 'Fondo panel', token: 'var(--background-elevated)' },
  {
    property: 'Radio (esquinas izquierdas)',
    token: 'var(--radius-lg)',
    note: 'sólo las esquinas del borde interior; el borde exterior va a ras del viewport',
  },
  { property: 'Sombra', token: 'var(--elevation-drawer)' },
  {
    property: 'Relleno de secciones',
    token: 'var(--pad-drawer)',
    note: '24 — padding de header (inline), body y footer',
  },
  {
    property: 'Altura de la cabecera',
    token: 'var(--navigation-toolbar-height)',
    note: '48 — altura mínima tipo toolbar',
  },
  {
    property: 'Divisores',
    token: 'var(--borders-default)',
    note: 'stroke/default bajo la cabecera y sobre el footer',
  },
  {
    property: 'Ancho (SM · MD · LG)',
    token: 'var(--width-drawer-sm | -md | -lg)',
    note: '360 · 480 · 640',
  },
  {
    property: 'Backdrop (scrim)',
    token: 'var(--overlay-blanket)',
    note: 'TODO(tokens): la foundation modern aún no define overlay/scrim propio; se comparte con Dialog',
  },
  { property: 'Título', token: 'var(--content-primary)', note: 'tipografía H4' },
  {
    property: 'Descripción',
    token: 'var(--content-secondary)',
    note: 'tipografía body/default',
  },
  { property: 'Separación título/descripción', token: 'var(--gap-control-sm)' },
  { property: 'Separación acciones footer', token: 'var(--gap-dialog-actions)' },
  {
    property: 'Entrada (deslizar desde la derecha)',
    token: 'var(--motion-duration-slow) · var(--motion-easing-enter)',
    note: '300ms ease-out',
  },
] as const;
