/**
 * Table apron (foundations-modern) — public types + token manifest.
 *
 * The apron is the floating status strip that sits under a data table (like a
 * furniture apron under a tabletop): it reads out the live result count and
 * the active filters as removable tokens. It is presentation-only — the
 * consumer owns the filter/search state and passes the resolved `shown` /
 * `total` / `tokens`, mirroring the "table does not sort or filter itself"
 * contract of `afi-table-v2`.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Table apron (to be created;
 * see docs/build-prompts for the component spec).
 *
 * Consumes only `foundations-modern` tokens, so it renders correctly only
 * inside a `[data-foundation="modern"]` scope.
 */

/** Density — matches the table density it pairs with. */
export type TableApronSize = 'sm' | 'md';

/** Optional leading glyph on a token, signalling the filter's origin. */
export type TableApronTokenIcon = 'search' | 'filter';

/**
 * One active-filter token in the apron. A token is a readout of a filter the
 * consumer has applied (a selected tab, a search term, a facet), NOT a control:
 * clicking its body does nothing; clicking its × emits `tokenDismissed` so the
 * consumer can clear that filter. `removable` defaults to `true`.
 */
export interface TableApronToken {
  /** Stable identifier carried back on `tokenDismissed`. */
  id: string;
  /** Visible text (e.g. the search term or the active tab label). */
  label: string;
  /** Optional leading glyph; omit for a plain label token. */
  icon?: TableApronTokenIcon;
  /** Whether the × dismiss button renders. Defaults to `true`. */
  removable?: boolean;
}

export const tokenUsage = [
  { property: 'Fondo de la cápsula', token: 'var(--background-hover)' },
  { property: 'Borde de la cápsula', token: 'var(--borders-default)', note: 'grosor --stroke-default' },
  { property: 'Sombra flotante', token: 'var(--elevation-menu)' },
  { property: 'Radio de la cápsula', token: 'var(--radius-full)' },
  { property: 'Número (shown)', token: 'var(--content-primary)', note: 'peso --font-weight-semibold' },
  { property: 'Total + nombre + separador', token: 'var(--content-secondary)' },
  { property: 'Fondo del token', token: 'var(--background-surface)' },
  { property: 'Borde del token', token: 'var(--borders-default)' },
  { property: 'Sombra del token', token: 'var(--elevation-1)' },
  { property: 'Texto del token', token: 'var(--content-primary)', note: 'estilo label' },
  { property: 'Icono del token / ×', token: 'var(--content-secondary)', note: 'tamaño --icon-sm' },
  { property: 'Entrada de la cápsula', token: 'slide-fade-enter · var(--motion-duration-base) var(--motion-easing-enter)' },
];
