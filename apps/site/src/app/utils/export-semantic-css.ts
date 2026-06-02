import {
  SEMANTIC_TOKEN_MANIFEST,
  type SemanticTokenManifestEntry,
} from '../data/semantic-token-manifest.generated';

const BRAND_PREFIX = '--brand-';

interface BrandMeta {
  readonly slug: string;
  readonly displayName: string;
}

const BRAND_DISPLAY: Record<string, string> = {
  afi: 'Afi',
  sarevi: 'Sarevi',
  unicaja: 'Unicaja',
  'banco-cooperativo': 'Banco Cooperativo Español',
  'laboral-kutxa': 'Laboral Kutxa',
  mutualidad: 'Mutualidad',
};

/**
 * Per-brand overrides applied ONLY at download time — the source codebase
 * keeps its current mapping (live components still need brand-primary-*
 * pointing to what they actually consume today).
 *
 * AFI: components today read brand-primary-* for CTAs (azul-profundo). The
 * intended convention is brand-primary = identity color (azul), brand-secondary
 * = action/CTA color (azul-profundo). Until components are migrated to read
 * brand-secondary for CTAs, we expose the *target* shape in the download so
 * external programmers can build against the convention from day one.
 *
 * Values are stored as primitive token names so the runtime probe resolves
 * them via getComputedStyle — keeps hex/px out of component code.
 */
const BRAND_PRIMITIVE_OVERRIDES: Record<string, Record<string, string>> = {
  afi: {
    '--brand-primary-background-default': '--color-afi-azul-500',
    '--brand-primary-background-hover': '--color-afi-azul-600',
    '--brand-primary-background-active': '--color-afi-azul-700',
    '--brand-primary-foreground-default': '--color-afi-azul-0',
    '--brand-primary-foreground-hover': '--color-afi-azul-25',
    '--brand-primary-foreground-active': '--color-afi-azul-0',
    '--brand-primary-border-default': '--color-afi-azul-500',
    '--brand-primary-border-hover': '--color-afi-azul-600',
    '--brand-primary-border-active': '--color-afi-azul-700',
  },
};

function brandMeta(slug: string): BrandMeta {
  return { slug, displayName: BRAND_DISPLAY[slug] ?? slug };
}

function rgbToHex(value: string): string {
  const match = value
    .trim()
    .match(
      /^rgba?\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)(?:\s*,\s*(-?[\d.]+))?\s*\)$/,
    );
  if (!match) return value;
  const [, rStr, gStr, bStr, aStr] = match;
  if (rStr == null || gStr == null || bStr == null) return value;
  const channel = (raw: string) =>
    Math.round(parseFloat(raw)).toString(16).padStart(2, '0').toUpperCase();
  let hex = `#${channel(rStr)}${channel(gStr)}${channel(bStr)}`;
  if (aStr !== undefined) {
    const alpha = parseFloat(aStr);
    if (alpha < 1) {
      const a = Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase();
      hex += a;
    }
  }
  return hex;
}

function stripBrandPrefix(name: string): string {
  return name.startsWith(BRAND_PREFIX) ? `--${name.slice(BRAND_PREFIX.length)}` : name;
}

function resolveValue(
  entry: SemanticTokenManifestEntry,
  probe: HTMLElement,
  host: HTMLElement,
  brandSlug: string,
): string | null {
  // Per-brand override: substitute a primitive token at the source so the
  // probe reads the override's resolved value instead of the live token's.
  const overridePrimitive = BRAND_PRIMITIVE_OVERRIDES[brandSlug]?.[entry.name];

  // Peek at the authored value first: literals like `100%`, `44rem`, or
  // `hsla(...)` skip the var() probe (which would resolve % to px against the
  // probe's containing block, mangling the authored intent).
  const authored = getComputedStyle(host).getPropertyValue(entry.name).trim();
  const isLiteral =
    !overridePrimitive && authored.length > 0 && !authored.includes('var(');

  if (entry.kind === 'color') {
    const source = overridePrimitive
      ? `var(${overridePrimitive})`
      : isLiteral
        ? authored
        : `var(${entry.name})`;
    probe.style.color = '';
    probe.style.color = source;
    const computed = getComputedStyle(probe).color;
    const isTransparentLiteral =
      authored === 'transparent' || authored.toLowerCase() === 'currentcolor';
    if (!computed) return null;
    if (computed === 'rgba(0, 0, 0, 0)' && !isTransparentLiteral) return null;
    return rgbToHex(computed);
  }

  if (entry.kind === 'length') {
    if (isLiteral) return authored;
    const source = overridePrimitive
      ? `var(${overridePrimitive})`
      : `var(${entry.name})`;
    probe.style.width = '';
    probe.style.width = source;
    const computed = getComputedStyle(probe).width;
    if (!computed || computed === 'auto') return null;
    return computed;
  }

  return authored.length > 0 ? authored : null;
}

function buildCss(brand: BrandMeta, host: HTMLElement): string {
  const probe = document.createElement('div');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'width:0;height:0;visibility:hidden;contain:strict;';
  host.appendChild(probe);

  const lines: string[] = [];
  try {
    for (const entry of SEMANTIC_TOKEN_MANIFEST) {
      const value = resolveValue(entry, probe, host, brand.slug);
      if (value == null) continue;
      lines.push(`  ${stripBrandPrefix(entry.name)}: ${value};`);
    }
  } finally {
    probe.remove();
  }

  const generatedAt = new Date().toISOString().slice(0, 10);
  return (
    `/*\n` +
    ` * Coherence DS — semantic tokens (${brand.displayName})\n` +
    ` * Generated ${generatedAt} from the live Overview page.\n` +
    ` * Drop in alongside your CSS — every token is a single CSS custom\n` +
    ` * property with the raw value already resolved (no var() chains, no\n` +
    ` * brand prefixes).\n` +
    ` */\n\n` +
    `:root {\n` +
    lines.join('\n') +
    `\n}\n`
  );
}

function triggerDownload(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: 'text/css;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/**
 * Build the semantic CSS string for the given brand (default Afi) WITHOUT
 * triggering a download. Used by the Semántica CSS tab on the demo
 * overview to render the same content inline that the download button
 * produces.
 */
export function buildSemanticCssString(brandSlug?: string): string {
  if (typeof document === 'undefined') return '';

  const slug =
    brandSlug?.toLowerCase() ||
    document.documentElement.getAttribute('data-brand')?.toLowerCase() ||
    'afi';
  const brand = brandMeta(slug);

  const useWrapper = brandSlug != null && brandSlug.length > 0;
  const host = useWrapper ? document.createElement('div') : document.documentElement;
  if (useWrapper) {
    host.setAttribute('data-brand', slug);
    host.style.cssText =
      'position:absolute;left:-9999px;top:-9999px;width:0;height:0;visibility:hidden;contain:strict;';
    document.body.appendChild(host);
  }

  try {
    return buildCss(brand, host as HTMLElement);
  } finally {
    if (useWrapper) host.remove();
  }
}

/**
 * Generate + download a flat semantic CSS file for the given brand (default
 * Afi). When a brand slug is passed, the probe runs inside a hidden
 * [data-brand="..."] wrapper so the file resolves to that brand's values
 * even if the current page itself is rendered in the Afi default.
 */
export function exportSemanticCss(brandSlug?: string): void {
  if (typeof document === 'undefined') return;
  const slug =
    brandSlug?.toLowerCase() ||
    document.documentElement.getAttribute('data-brand')?.toLowerCase() ||
    'afi';
  const css = buildSemanticCssString(brandSlug);
  if (!css) return;
  triggerDownload(`coherence-${slug}-semantic.css`, css);
}
