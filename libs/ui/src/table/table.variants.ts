/**
 * afi-table — type exports only.
 *
 * Per `docs/rules/component-skill.md §6`, variant + density logic lives in
 * `table.component.scss` via BEM modifiers (`&--compact`, `&--comfortable`).
 */

export type TableDensity = 'compact' | 'comfortable';

/**
 * Reveal mode for trailing row actions.
 *
 * - `always` — actions are fully visible at rest. Retained as an opt-in
 *              override for denser / kiosk contexts; not the v1 default.
 * - `hover`  — **DEFAULT (locked 2026-05-28)**. Actions are invisible at
 *              rest; appear on row hover / focus-within. Strict Notion /
 *              Granola convention. Cleanest visual register, accepted as
 *              the AFI desktop default after side-by-side comparison
 *              against `soft` on `/componentes/table` + the sociedades
 *              demo. Trade-off: discoverability is hover-dependent — fine
 *              for the AFI desktop-first product surface.
 * - `soft`   — actions are ~40% opacity at rest; full opacity on row
 *              hover / focus-within. Notion middle ground — kept as the
 *              opt-in for any future context where hover-dependence isn't
 *              acceptable (touch, kiosk, training mode).
 */
export type TableActionsReveal = 'always' | 'hover' | 'soft';
