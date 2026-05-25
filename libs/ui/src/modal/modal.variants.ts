/**
 * afi-modal — type exports only.
 *
 * Per `docs/rules/component-skill.md §6`, variant logic lives in
 * `modal.component.scss` via BEM modifiers (`&--sm`, `&--md`, etc.).
 * This file exports the union types consumed by the component's signal inputs.
 */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

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
