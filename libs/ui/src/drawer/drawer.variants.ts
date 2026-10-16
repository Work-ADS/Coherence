/**
 * - `sm` (450px) — the default: one record, one task.
 * - `md` (760px) — dense forms in several columns.
 * - `wide` — everything right of the sidebar column; the whole viewport on narrow screens.
 * - `lg` — deprecated alias of `md`.
 */
export type DrawerSize = 'sm' | 'md' | 'lg' | 'wide';

export const tokenUsage = [
  { property: 'Fondo panel', token: 'var(--overlay-modal)' },
  { property: 'Borde', token: 'var(--border-subtle)' },
  { property: 'Sombra', token: 'var(--elevation-xl)' },
  { property: 'Radio', token: 'var(--radius-modal)' },
  { property: 'Marco', token: 'var(--layout-shell-inset)' },
  { property: 'Telón', token: 'var(--overlay-blanket-drawer) + blur(var(--overlay-blur))' },
  { property: 'Capa (telón / panel)', token: 'var(--z-drawer) / var(--drawer-panel-z)' },
  { property: 'Título', token: 'var(--type-body-lg-600)' },
  { property: 'Botones', token: 'var(--drawer-button-size), hover var(--surface-subtle)' },
  { property: 'Ancho sm / md / wide', token: 'var(--drawer-width-sm) / var(--drawer-width-md) / var(--drawer-wide-offset)' },
  { property: 'Animación', token: 'var(--duration-slow) var(--easing-enter)' },
];
