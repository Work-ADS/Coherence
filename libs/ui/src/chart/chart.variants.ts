/**
 * Color + texture resolver.
 *
 * Maps series index → { color, texture, patternId } tuple.
 * Color is never the only encoding cue — every series gets a texture fill.
 * Colors reference CSS custom properties from the `data-*` token bucket.
 */

import type { SeriesVisual, TextureId } from './chart.types';

const PALETTE: string[] = [
  'var(--data-neutral-strong)',
  'var(--data-highlight-primary)',
  'var(--data-neutral-medium)',
  'var(--data-highlight-secondary)',
  'var(--data-neutral-muted)',
];

const TEXTURES: TextureId[] = ['dots', 'lines', 'crosshatch'];

/**
 * Resolve visual encoding for a series by index.
 * Cycles through palette and textures independently so combinations stay unique
 * longer than either list alone.
 */
export function resolveSeriesVisual(index: number): SeriesVisual {
  const colorIdx = index % PALETTE.length;
  const textureIdx = index % TEXTURES.length;
  const color: string = PALETTE[colorIdx]!;
  const texture: TextureId = TEXTURES[textureIdx]!;
  const patternId = `afi-pattern-${texture}-${index}`;
  return { color, texture, patternId };
}

/**
 * SVG `<defs>` block for texture patterns.
 * Render once per chart inside the SVG root.
 */
export function buildPatternDefs(count: number): string {
  const defs: string[] = [];
  for (let i = 0; i < count; i++) {
    const v = resolveSeriesVisual(i);
    defs.push(patternSvg(v));
  }
  return `<defs>${defs.join('')}</defs>`;
}

function patternSvg(v: SeriesVisual): string {
  switch (v.texture) {
    case 'dots':
      return `<pattern id="${v.patternId}" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="${v.color}" />
        <circle cx="3" cy="3" r="1.2" fill="white" opacity="0.4" />
      </pattern>`;
    case 'lines':
      return `<pattern id="${v.patternId}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="${v.color}" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="white" stroke-width="1.5" opacity="0.4" />
      </pattern>`;
    case 'crosshatch':
      return `<pattern id="${v.patternId}" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="${v.color}" />
        <path d="M0,0 L6,6 M6,0 L0,6" stroke="white" stroke-width="1" opacity="0.35" />
      </pattern>`;
  }
}

/**
 * Divergent palette resolver for heatmaps.
 * Maps a normalized value (-1..+1 for divergent, 0..1 for sequential)
 * to a CSS var from the diverge bucket.
 */
export const tokenUsage = [
  { property: 'Paleta series', token: 'var(--data-neutral-strong/medium/muted), var(--data-highlight-primary/secondary)' },
  { property: 'Divergente positivo', token: 'var(--data-diverge-pos-300/500/700)' },
  { property: 'Divergente negativo', token: 'var(--data-diverge-neg-300/500/700)' },
  { property: 'Ejes / grid', token: 'var(--border-hairline)' },
  { property: 'Texto ejes', token: 'text-neutral-500 (body-sm)' },
  { property: 'Título', token: 'text-section text-canvas-fg' },
  { property: 'Subtítulo', token: 'text-body-sm text-neutral-500' },
  { property: 'Focus ring', token: 'var(--border-focus)' },
  { property: 'Transición hover', token: '180ms ease-out (opacity)' },
  { property: 'Empty state', token: 'text-neutral-500 text-body-sm' },
];

export function resolveDivergentColor(normalizedValue: number, scale: 'sequential' | 'divergent'): string {
  if (scale === 'sequential') {
    if (normalizedValue <= 0.25) return 'var(--data-neutral-muted)';
    if (normalizedValue <= 0.5) return 'var(--data-neutral-medium)';
    if (normalizedValue <= 0.75) return 'var(--data-highlight-secondary)';
    return 'var(--data-highlight-primary)';
  }
  // Divergent: negative → red stops, positive → green stops
  if (normalizedValue <= -0.5) return 'var(--data-diverge-neg-700)';
  if (normalizedValue <= -0.25) return 'var(--data-diverge-neg-500)';
  if (normalizedValue < 0) return 'var(--data-diverge-neg-300)';
  if (normalizedValue === 0) return 'var(--data-neutral-muted)';
  if (normalizedValue <= 0.25) return 'var(--data-diverge-pos-300)';
  if (normalizedValue <= 0.5) return 'var(--data-diverge-pos-500)';
  return 'var(--data-diverge-pos-700)';
}
