/** Tokens consumed by NavSection — shown on the Design tab. */
export const tokenUsage = [
  { property: 'Fondo hover (fila padre)', token: 'var(--surface-muted)' },
  { property: 'Texto padre (activo)', token: 'var(--canvas-fg), font-medium' },
  { property: 'Chevron', token: 'var(--neutral-400)' },
  { property: 'Línea guía', token: 'var(--border-hairline)' },
  { property: 'Trail hover', token: 'var(--action-300)' },
  { property: 'Marker', token: 'var(--action-500)', note: '2×16px rounded' },
  { property: 'Sangría hijos', token: 'var(--space-8)' },
  { property: 'Rotación chevron', token: 'var(--duration-fast) var(--easing-enter)' },
  { property: 'Expand/collapse', token: 'grid-template-rows 0fr→1fr, var(--duration-200)' },
] as const;
