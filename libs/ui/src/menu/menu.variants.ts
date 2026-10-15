export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'left-start';

/**
 * Visual variants for `<afi-menu-item>`.
 *
 * - `default` — standard text color, neutral hover background.
 * - `danger` — **the destructive-action variant. LOCKED 2026-05-28 as a
 *   menu-item RULE.** Any menu item whose action removes, deletes,
 *   destroys, archives-permanently, cancels, or otherwise produces a
 *   non-trivially-reversible result MUST use `variant="danger"`. Reads
 *   `--feedback-error-foreground` for text + `--feedback-error-background`
 *   on hover.
 *
 *   The destructive item is also visually separated by an
 *   `<afi-menu-divider>` from the standard items above it — this is the
 *   convention `<afi-table>`'s overflow menu enforces automatically
 *   (danger items render below the divider). When composing menus
 *   manually, mirror that pattern: standard items, divider, danger items.
 *
 *   Examples that MUST be danger: Borrar, Eliminar, Archivar (cuando es
 *   permanente), Cancelar suscripción, Vaciar papelera.
 *   Examples that are NOT danger (despite sounding destructive): Cerrar
 *   (just dismisses), Salir (navigation), Vaciar formulario (resets, not
 *   destroys), Marcar como leído.
 */
export type MenuItemVariant = 'default' | 'danger';

/** Tokens consumed by Menu — shown on the Design tab. */
export const tokenUsage = [
  { property: 'Fondo panel', token: 'var(--overlay-dropdown)' },
  { property: 'Borde panel', token: 'var(--border-subtle)' },
  { property: 'Sombra panel', token: 'var(--elevation-lg)' },
  { property: 'Radio panel', token: 'var(--radius-panel)' },
  { property: 'Capa', token: 'var(--z-floating)' },
  { property: 'Fila: alto, relleno, hueco', token: 'var(--menu-item-min-height), var(--menu-item-padding-*), var(--menu-item-gap)' },
  { property: 'Fila: tipografía', token: 'var(--menu-item-font)' },
  { property: 'Fila: fondo y texto', token: 'var(--nav-item-background-*), var(--nav-item-foreground-*)' },
  { property: 'Ícono', token: 'var(--nav-item-icon-*)' },
  { property: 'Texto danger', token: 'var(--feedback-error-foreground)' },
  { property: 'Fondo danger hover', token: 'var(--feedback-error-background)' },
  { property: 'Divisor', token: 'var(--border-subtle)' },
  { property: 'Foco', token: 'var(--border-focus)', note: 'anillo interior' },
  { property: 'Animación', token: 'extrusión del panel + subida escalonada de filas (--reveal-*)' },
] as const;
