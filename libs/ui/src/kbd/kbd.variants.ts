export const rootBaseClasses =
  'inline-flex items-center gap-1 font-mono';

export const keyBaseClasses =
  'inline-flex items-center justify-center ' +
  'bg-surface-muted border border-border-hairline rounded-sm ' +
  'text-canvas-fg';

export const sizeClasses = {
  sm: { key: 'h-5 min-w-5 px-1.5 text-body-sm', root: 'text-body-sm' },
  md: { key: 'h-6 min-w-6 px-2 text-body-md',  root: 'text-body-md' },
} as const;

export const separatorChars = {
  none:  '',
  plus:  '+',
  arrow: '→',
} as const;

export type KbdSize = keyof typeof sizeClasses;
export type KbdSeparator = keyof typeof separatorChars;

export const tokenUsage = [
  { property: 'Fondo tecla', token: 'var(--surface-muted)' },
  { property: 'Borde tecla', token: 'var(--border-hairline)' },
  { property: 'Texto', token: 'var(--canvas-fg)' },
  { property: 'Radio', token: 'rounded-sm (2px)' },
  { property: 'Tipografía', token: 'font-mono' },
  { property: 'Altura (sm)', token: 'h-5 (20px)' },
  { property: 'Altura (md)', token: 'h-6 (24px)' },
];
