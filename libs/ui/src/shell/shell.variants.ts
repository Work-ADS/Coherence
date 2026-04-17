/** Shell types — five locked layouts. */
export type ShellType = 'workspace' | 'focus' | 'canvas' | 'auth' | 'docs';

/** Types that ship in v1. */
export const shippingTypes: readonly ShellType[] = ['workspace', 'docs', 'auth'] as const;

/** Types reserved in v1 (stub only). */
export const reservedTypes: readonly ShellType[] = ['focus', 'canvas'] as const;

/** Default shell type when none is specified or an invalid value is given. */
export const defaultShellType: ShellType = 'workspace';

/** Validate and coerce a shell type string. Returns the default on invalid input. */
export function coerceShellType(value: string | null | undefined): ShellType {
  const valid: readonly string[] = ['workspace', 'focus', 'canvas', 'auth', 'docs'];
  if (value && valid.includes(value)) return value as ShellType;
  if (value && typeof ngDevMode !== 'undefined' && ngDevMode) {
    console.warn(
      `[afi-shell] Unknown shell type "${value}". Falling back to "${defaultShellType}".`
    );
  }
  return defaultShellType;
}

export const tokenUsage = [
  { property: 'Fondo (workspace)', token: 'var(--canvas-bg)' },
  { property: 'Fondo (auth)', token: 'var(--surface-quiet)' },
  { property: 'Fondo (docs)', token: 'var(--canvas-bg)' },
  { property: 'Sidebar ancho', token: '260px' },
  { property: 'Contenido max-width', token: '920px (docs)' },
  { property: 'Right rail ancho', token: '240px' },
];
