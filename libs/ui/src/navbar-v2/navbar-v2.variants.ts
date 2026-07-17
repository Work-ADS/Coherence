/**
 * afi-navbar-v2 — type exports + token manifest only.
 *
 * Per `docs/rules/component-skill.md §6`, layout logic lives in
 * `navbar-v2.component.scss` via BEM modifiers (`&--desktop`, `&--compact`,
 * `&--mobile`). This file exports the union type consumed by the component's
 * `layout` signal input, plus the `tokenUsage` map the future documentation page
 * renders in its "Tokens" block.
 *
 * Mirrors the Figma component set (AFI-FOUNDATIONS-MODERN → Navbar 2759:5028,
 * documented at 2777:4723, behaviour canvas 2775:4656): one full-width flat
 * application-chrome bar, height-bound and bottom-hairline separated, with three
 * responsive layouts over the same shell.
 */

/**
 * Responsive layout of the bar. Same shell (height, fill, bottom hairline)
 * across all three — only the zone content changes. Bind it to a container
 * query on the host. (A one-way input, not a two-way `model()` like
 * `afi-sidebar-v2`'s `collapsed`: nothing inside the navbar changes its layout.)
 *
 * - `desktop` — menu toggle + page label · full search trigger · Help ·
 *   Notifications · Avatar.
 * - `compact` — page label · search icon trigger · Notifications · Avatar
 *   (no menu toggle, no Help).
 * - `mobile` — menu toggle + page label · search icon trigger · overflow ·
 *   Avatar.
 */
export type NavbarV2Layout = 'desktop' | 'compact' | 'mobile';

/** Which navbar control emitted an interaction, carried on `activated`. */
export type NavbarV2Action =
  | 'menu'
  | 'search'
  | 'help'
  | 'notifications'
  | 'overflow'
  | 'avatar';

export const tokenUsage = [
  {
    property: 'Altura de la barra',
    token: 'var(--navigation-navbar-height)',
    note: '64 — igual en las tres disposiciones',
  },
  {
    property: 'Fondo (desktop)',
    token: 'var(--background-canvas)',
    note: 'la barra ancha se funde con el lienzo',
  },
  {
    property: 'Fondo (compact · mobile)',
    token: 'var(--background-surface)',
  },
  {
    property: 'Hairline inferior',
    token: 'var(--stroke-hairline) solid var(--borders-default)',
  },
  {
    property: 'Relleno lateral (desktop)',
    token: 'var(--pad-control-lg)',
    note: '12',
  },
  {
    property: 'Relleno lateral (compact · mobile)',
    token: 'var(--pad-navbar-inline)',
    note: '16',
  },
  {
    property: 'Separación entre zonas (compact · mobile)',
    token: 'var(--gap-navbar-zones)',
    note: '16',
  },
  {
    property: 'Separación entre acciones (compact · mobile)',
    token: 'var(--gap-navbar-actions)',
    note: '8',
  },
  {
    property: 'Separación entre controles (desktop)',
    token: 'var(--gap-control-md)',
    note: '6',
  },
  {
    property: 'Ancho del buscador (desktop)',
    token: 'var(--width-navbar-search)',
    note: '360',
  },
  {
    property: 'Buscador — alto · borde · radio',
    token: 'var(--height-component-md) · var(--borders-default) · var(--radius-lg)',
  },
  {
    property: 'Etiqueta de página',
    token: 'var(--content-primary)',
    note: 'H4 en desktop, body/small en compact · mobile',
  },
  {
    property: 'Placeholder del buscador',
    token: 'var(--content-placeholder)',
  },
  {
    property: 'Atajo (⌘K)',
    token: 'var(--content-tertiary)',
    note: 'body/small — pista visual, aria-hidden',
  },
  {
    property: 'Avatar',
    token: 'var(--avatar-md)',
    note: '32 — disparador del menú de usuario',
  },
] as const;
