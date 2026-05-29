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

function currentBrand(): BrandMeta {
  const slug =
    document.documentElement.getAttribute('data-brand')?.toLowerCase() || 'afi';
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
): string | null {
  // Peek at the authored value first: literals like `100%`, `44rem`, or
  // `hsla(...)` skip the var() probe (which would resolve % to px against the
  // probe's containing block, mangling the authored intent).
  const authored = getComputedStyle(document.documentElement)
    .getPropertyValue(entry.name)
    .trim();
  const isLiteral = authored && !authored.includes('var(');

  if (entry.kind === 'color') {
    probe.style.color = '';
    probe.style.color = isLiteral ? authored : `var(${entry.name})`;
    const computed = getComputedStyle(probe).color;
    if (!computed || computed === 'rgba(0, 0, 0, 0)' && authored !== 'transparent') {
      return null;
    }
    return rgbToHex(computed);
  }

  if (entry.kind === 'length') {
    if (isLiteral) return authored;
    probe.style.width = '';
    probe.style.width = `var(${entry.name})`;
    const computed = getComputedStyle(probe).width;
    if (!computed || computed === 'auto') return null;
    return computed;
  }

  return authored || null;
}

function buildCss(brand: BrandMeta): string {
  const probe = document.createElement('div');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText =
    'position:absolute;left:-9999px;top:-9999px;width:0;height:0;visibility:hidden;contain:strict;';
  document.body.appendChild(probe);

  const lines: string[] = [];
  try {
    for (const entry of SEMANTIC_TOKEN_MANIFEST) {
      const value = resolveValue(entry, probe);
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

export function exportSemanticCss(): void {
  if (typeof document === 'undefined') return;
  const brand = currentBrand();
  const css = buildCss(brand);
  triggerDownload(`coherence-${brand.slug}-semantic.css`, css);
}
