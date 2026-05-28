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
  { property: 'Fondo panel', token: 'var(--surface-elevated)' },
  { property: 'Borde panel', token: 'var(--border-hairline)' },
  { property: 'Sombra panel', token: 'var(--shadow-lg)' },
  { property: 'Fondo item hover', token: 'var(--surface-muted)' },
  { property: 'Texto item', token: 'var(--canvas-fg)' },
  { property: 'Texto danger', token: 'var(--system-error-600)' },
  { property: 'Fondo danger hover', token: 'var(--system-error-50)' },
  { property: 'Ícono item', token: 'var(--neutral-500)' },
  { property: 'Shortcut', token: 'var(--neutral-400), font-mono' },
  { property: 'Divider', token: 'var(--border-hairline)' },
  { property: 'Radio panel', token: 'var(--radius-lg)' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Animación entrada', token: 'var(--duration-fast) var(--easing-enter)' },
  { property: 'Hover lean-in ícono', token: 'translateX(2px) 120ms var(--easing-enter)' },
] as const;
