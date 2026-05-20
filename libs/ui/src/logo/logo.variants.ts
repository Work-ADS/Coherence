export type LogoVariant = 'color' | 'monochrome';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

export const logoTokenUsage = [
  { property: 'Símbolo (color)', token: 'var(--brand-mark-symbol)' },
  { property: 'Símbolo (monochrome)', token: 'currentColor' },
  { property: 'Wordmark', token: 'currentColor' },
  { property: 'Altura sm', token: 'var(--dim-24)' },
  { property: 'Altura md', token: 'var(--dim-32)' },
  { property: 'Altura lg', token: 'var(--dim-48)' },
  { property: 'Altura xl', token: 'var(--dim-64)' },
  { property: 'Anillo de foco', token: 'var(--border-focus)' },
] as const;
