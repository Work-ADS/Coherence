/**
 * afi-modal — type exports only.
 *
 * Per `docs/rules/component-skill.md §6`, variant logic lives in
 * `modal.component.scss` via BEM modifiers (`&--sm`, `&--md`, etc.).
 * This file exports the union types consumed by the component's signal inputs.
 */

/**
 * - `sm` (28rem) — confirms, prompts.
 * - `md` (32rem) — default forms.
 * - `lg` (42rem) — longer forms.
 * - `xl` (56rem) — multi-section forms.
 * - `xxl` (65rem) — 2-pane layouts (form + live preview). Added 2026-05-28
 *   for the patrimonial add-asset dialog; reach for it only when a single
 *   pane genuinely doesn't fit the content.
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const tokenUsage = [
  { property: 'Fondo panel', token: 'var(--surface-raised)' },
  { property: 'Backdrop', token: 'var(--surface-overlay)' },
  { property: 'Borde footer', token: 'var(--border-subtle)' },
  { property: 'Título', token: 'var(--foreground-primary-default)' },
  { property: 'Descripción', token: 'var(--foreground-secondary-default)' },
  { property: 'Botón cerrar (idle)', token: 'var(--foreground-tertiary-default)' },
  { property: 'Botón cerrar (hover)', token: 'var(--foreground-primary-default)' },
  { property: 'Foco', token: 'var(--border-focus)' },
  { property: 'Radio', token: 'var(--radius-md)' },
  { property: 'Sombra', token: 'var(--elevation-lg)' },
  { property: 'Tamaño', token: 'var(--dimension-modal-{sm|md|lg|xl})' },
];
