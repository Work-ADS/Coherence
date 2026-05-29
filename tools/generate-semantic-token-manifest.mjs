#!/usr/bin/env node
// =============================================================================
// generate-semantic-token-manifest.mjs
//
// Parses libs/tokens/semantic.scss and emits a TS manifest of every semantic
// token declared at :root, classified as color | length | other. The manifest
// feeds apps/site/src/app/utils/export-semantic-css.ts, which probes each
// token at runtime and assembles the downloadable semantic CSS file on the
// Overview page.
//
// Wired to `prebuild` / `prestart` in apps/site/package.json so the manifest
// can never drift from the source SCSS.
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const SOURCE = path.join(REPO_ROOT, 'libs/tokens/semantic.scss');
const OUTPUT = path.join(
  REPO_ROOT,
  'apps/site/src/app/data/semantic-token-manifest.generated.ts',
);

// Internal tokens that aren't meant for external consumers — excluded from the
// downloadable file. (Code-block + figure-paper tokens belong to /talks slides.)
const EXCLUDE_PREFIXES = [
  '--code-block-',
  '--callout-tint',
  '--figure-paper-',
];

const source = fs.readFileSync(SOURCE, 'utf8');

// Strip line + block comments so they don't trip the declaration regex.
const stripped = source
  .replace(/\/\/[^\n]*/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');

// Find every :root { ... } block with balanced brace matching.
function extractRootBlocks(src) {
  const blocks = [];
  const open = /:root\s*\{/g;
  let m;
  while ((m = open.exec(src))) {
    const start = m.index + m[0].length;
    let depth = 1;
    let i = start;
    while (i < src.length && depth > 0) {
      const ch = src[i];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      i++;
    }
    blocks.push(src.slice(start, i - 1));
  }
  return blocks;
}

// Pull declarations from a :root block. Two shapes:
//   1) --name: value;
//   2) @include responsive-token(--name, ( base: VALUE, ... ));
function extractDeclarations(block) {
  const out = [];
  for (const m of block.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    out.push({ name: `--${m[1]}`, rawValue: m[2].trim() });
  }
  for (const m of block.matchAll(
    /@include\s+responsive-token\s*\(\s*--([\w-]+)\s*,\s*\(\s*base\s*:\s*([^,)]+)/g,
  )) {
    out.push({ name: `--${m[1]}`, rawValue: m[2].trim() });
  }
  return out;
}

const rootBlocks = extractRootBlocks(stripped);
const tokens = [];
const seen = new Set();
for (const block of rootBlocks) {
  for (const decl of extractDeclarations(block)) {
    if (seen.has(decl.name)) continue;
    seen.add(decl.name);
    tokens.push(decl);
  }
}

// Recursive classifier. Walks var() chains using the parsed map; falls back to
// prefix heuristics for external primitives (--color-*, --dimension-*, etc.).
const valueMap = new Map(tokens.map((t) => [t.name, t.rawValue]));

function classify(name, depth = 0) {
  if (depth > 12) return 'other';

  const value = valueMap.get(name);
  if (value == null) {
    // External primitive — classify by name prefix.
    if (name.startsWith('--color-')) return 'color';
    if (
      name.startsWith('--dimension-') ||
      name.startsWith('--space-') ||
      name.startsWith('--radius-') ||
      name.startsWith('--size-')
    ) {
      return 'length';
    }
    return 'other';
  }

  // Literal patterns
  if (/^[\d.]+(?:px|rem|em|vh|vw|%)/i.test(value)) return 'length';
  if (/^transparent$/i.test(value)) return 'color';
  if (/^currentColor$/i.test(value)) return 'color';
  if (/^(?:#[0-9a-f]+|hsla?\(|rgba?\()/i.test(value)) return 'color';

  // Var chain — resolve first referenced token.
  const ref = value.match(/var\(\s*(--[\w-]+)/);
  if (ref) return classify(ref[1], depth + 1);

  return 'other';
}

const manifest = tokens
  .filter(({ name }) => !EXCLUDE_PREFIXES.some((p) => name.startsWith(p)))
  .map(({ name }) => ({ name, kind: classify(name) }));

const banner = `/**
 * AUTO-GENERATED — do not edit by hand.
 * Source: libs/tokens/semantic.scss
 * Regenerated automatically by \`npm run prestart\` / \`npm run prebuild\`.
 *
 * Consumed by apps/site/src/app/utils/export-semantic-css.ts to produce the
 * downloadable semantic CSS file from the Overview page.
 */
`;

const body = `export type SemanticTokenKind = 'color' | 'length' | 'other';

export interface SemanticTokenManifestEntry {
  readonly name: string;
  readonly kind: SemanticTokenKind;
}

export const SEMANTIC_TOKEN_MANIFEST: readonly SemanticTokenManifestEntry[] = ${JSON.stringify(
  manifest,
  null,
  2,
)} as const;
`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, banner + '\n' + body);

const counts = manifest.reduce(
  (acc, e) => ((acc[e.kind] = (acc[e.kind] || 0) + 1), acc),
  /** @type {Record<string, number>} */ ({}),
);
console.log(
  `[semantic-token-manifest] wrote ${manifest.length} tokens (${Object.entries(
    counts,
  )
    .map(([k, v]) => `${v} ${k}`)
    .join(', ')}) → ${path.relative(REPO_ROOT, OUTPUT)}`,
);
