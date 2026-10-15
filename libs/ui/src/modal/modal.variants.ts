/**
 * afi-modal — type exports only.
 *
 * Per `docs/rules/component-skill.md §6`, variant logic lives in
 * `modal.component.scss` via BEM modifiers (`&--sm`, `&--md`, etc.).
 * This file exports the union types consumed by the component's signal inputs.
 */

/**
 * - `sm` (400px) — confirms, prompts.
 * - `md` (540px) — default forms.
 * - `lg` (760px) — longer forms.
 * - `xl` (56rem) — multi-section forms.
 * - `xxl` (65rem) — 2-pane layouts (form + live preview). Added 2026-05-28
 *   for the patrimonial add-asset dialog; reach for it only when a single
 *   pane genuinely doesn't fit the content.
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Layout type of the modal.
 *
 * - `confirm` — simple yes/no or message+action. Body is compact, non-scrollable,
 *   footer actions are centred. Title + description are enough; consumers
 *   project optional body content beneath them.
 * - `form` — full form dialog. Body grows, scrolls independently, footer pins
 *   to the bottom. This is the default for all data-entry dialogs.
 */
export type ModalType = 'confirm' | 'form';

export const tokenUsage = [
  { property: 'Fondo panel', token: 'var(--overlay-modal)' },
  { property: 'Telón', token: 'var(--overlay-blanket) + blur(var(--overlay-blur))' },
  { property: 'Título', token: 'var(--type-subtitle), var(--foreground-primary-default)' },
  { property: 'Descripción', token: 'var(--foreground-tertiary-default)' },
  { property: 'Botón cerrar', token: 'var(--foreground-tertiary-default), hover var(--surface-subtle)' },
  { property: 'Foco', token: 'var(--border-focus)' },
  { property: 'Radio', token: 'var(--radius-modal)' },
  { property: 'Sombra', token: 'var(--elevation-xl)' },
  { property: 'Tamaño', token: 'var(--dimension-modal-{sm|md|lg|xl|xxl})' },
];
