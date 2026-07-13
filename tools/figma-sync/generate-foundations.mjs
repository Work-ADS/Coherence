// =============================================================================
// generate-foundations.mjs — Figma → SCSS token generator (identity v2)
// =============================================================================
//
// Reads tools/figma-sync/foundations-modern.json (snapshot of the live Figma
// variable collections in AFI-FOUNDATIONS-MODERN) and emits the SCSS token
// files under libs/tokens/foundations-modern/.
//
// Every emitted block is scoped under [data-foundation="modern"] so the
// existing site is untouched until a page/component opts in. At cutover,
// this scope becomes :root and the old token files are archived.
//
// Run:  node tools/figma-sync/generate-foundations.mjs
//
// Do NOT edit the generated files by hand — change Figma, refresh the
// snapshot, re-run. See docs/session-briefs/2026-07-13-identity-v2-token-audit.md.
// =============================================================================

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const OUT_DIR = join(ROOT, 'libs', 'tokens', 'foundations-modern');
const SCOPE = '[data-foundation="modern"]';

const snapshot = JSON.parse(readFileSync(join(HERE, 'foundations-modern.json'), 'utf8'));
const coll = Object.fromEntries(snapshot.collections.map((c) => [c.collection, c]));
const varsOf = (name) => coll[name].vars;

// --- naming ------------------------------------------------------------------

const cssName = (path) => path.replaceAll('/', '-');

// Figma alias `{collection-path}` → CSS var() reference. The prefix map keys
// off the alias's first segment (aliases never state their collection).
const ALIAS_PREFIX = {
  dimension: '--',        // dimension/dimension-3 → var(--dimension-3)
  font: '--',             // font/weight/medium    → var(--font-weight-medium)
  primary: '--color-', neutral: '--color-', control: '--color-',
  warning: '--color-', error: '--color-', info: '--color-', success: '--color-',
  'data-viz': '--color-', disabled: '--',
};

// Figma aliases into an EXTERNAL library (current-brand placeholder ramps that
// only exist in another Figma file). Mapped to in-repo equivalents until the
// graphic-color pass happens. TODO(colors-deferred).
const EXTERNAL_PLACEHOLDERS = {
  'Secondary/25': 'var(--color-neutral-25)',
  'Secondary/900': 'var(--color-neutral-900)',
  'Tertiary/700': 'var(--color-control-700)',
  'Tertiary/500': 'var(--color-control-500)',
  'Tertiary/300': 'var(--color-control-300)',
};

function resolveRef(value) {
  const m = /^\{(.+)\}$/.exec(String(value));
  if (!m) return null;
  const path = m[1];
  if (EXTERNAL_PLACEHOLDERS[path]) return { css: EXTERNAL_PLACEHOLDERS[path], external: path };
  const head = path.split('/')[0];
  const prefix = ALIAS_PREFIX[head];
  if (!prefix) throw new Error(`No alias prefix for {${path}}`);
  // primitive-numbers strips the redundant "dimension/" group: dimension/dimension-3 → --dimension-3
  const target = head === 'dimension' ? path.replace(/^dimension\//, '') : path;
  return { css: `var(${prefix}${cssName(target)})`, external: null };
}

const px = (n) => (n === 0 ? '0' : `${n}px`);

function header(title, extra = '') {
  return `// =============================================================================
// ${title} — GENERATED, do not edit
// =============================================================================
// Source: Figma AFI-FOUNDATIONS-MODERN → tools/figma-sync/foundations-modern.json
// Regenerate: node tools/figma-sync/generate-foundations.mjs
${extra ? '//\n' + extra + '\n' : ''}// =============================================================================

`;
}

const files = {};

// --- primitive-numbers.scss ----------------------------------------------------

{
  let body = `${SCOPE} {\n`;
  for (const v of varsOf('Primitive Numbers')) {
    const name = cssName(v.name.replace('dimension/', ''));
    body += `  --${name}: ${px(v.values['Primitive numbers'])};\n`;
  }
  body += '}\n';
  files['primitive-numbers.scss'] = header('primitive-numbers.scss — dimension scale (base-4)', '// Pattern: --dimension-N = N × 4px, fractional indices for sub-4px steps.') + body;
}

// --- primitive-colors.scss -----------------------------------------------------

{
  let body = `${SCOPE} {\n`;
  let lastGroup = '';
  for (const v of varsOf('Primitive Colors')) {
    const group = v.name.split('/')[0];
    if (group !== lastGroup) {
      body += `\n  // ${group}\n`;
      lastGroup = group;
    }
    const raw = v.values['V4 Primitive colors'];
    const ref = resolveRef(raw);
    if (ref?.external) {
      body += `  --color-${cssName(v.name)}: ${ref.css}; // TODO(colors-deferred): Figma aliases external {${ref.external}} — current-brand placeholder\n`;
    } else {
      body += `  --color-${cssName(v.name)}: ${ref ? ref.css : raw};\n`;
    }
  }
  body += '}\n';
  files['primitive-colors.scss'] = header('primitive-colors.scss — V4 color ramps', '// primary ramp is the neutral-zinc placeholder until brand accents are chosen.\n// data-viz values are current-brand placeholders (colors deferred).') + body;
}

// --- primitive-type.scss -------------------------------------------------------

{
  let body = `${SCOPE} {\n`;
  for (const v of varsOf('Primitive Type')) {
    const name = cssName(v.name);
    let val = v.values['Modern'];
    if (v.name === 'font/family/primary') {
      val = `'IBM Plex Sans', sans-serif`; // Figma stores "IBM plex sans"; casing normalized
    } else if (v.name === 'font/family/mono') {
      val = `'IBM Plex Mono', monospace`;
    } else if (v.name.startsWith('font/letter-spacing/')) {
      val = val === 0 ? '0' : `${val}em`;
    }
    body += `  --${name}: ${val};\n`;
  }
  body += '}\n';
  files['primitive-type.scss'] = header('primitive-type.scss — font primitives (mode: Modern)', "// IBM Plex Sans is loaded in apps/site/src/index.html alongside Roboto Serif.") + body;
}

// --- primitive-motion.scss -----------------------------------------------------

{
  let body = `${SCOPE} {\n`;
  for (const v of varsOf('Primitive Motion')) {
    const val = v.name.startsWith('duration/') ? `${v.values['Modern']}ms` : v.values['Modern'];
    body += `  --motion-${cssName(v.name)}: ${val};\n`;
  }
  body += '}\n';
  files['primitive-motion.scss'] = header('primitive-motion.scss — durations + easings (mode: Modern)', '// Design contract from Figma; implementation may refine curves in code for smoother animation.') + body;
}

// --- primitive-elevation.scss --------------------------------------------------

{
  const ev = Object.fromEntries(varsOf('Primitive Elevation').map((v) => [v.name, v.values['Primitive elevation']]));
  const part = (path) => {
    const raw = ev[path];
    const ref = resolveRef(raw);
    return ref ? ref.css : raw;
  };
  const layer = (base, inset = false) =>
    `${inset ? 'inset ' : ''}${part(`${base}/x`)} ${part(`${base}/y`)} ${part(`${base}/blur`)} ${part(`${base}/spread`)} ${part(`${base}/color`)}`;

  let body = `${SCOPE} {\n  --elevation-0: none;\n`;
  for (let lvl = 1; lvl <= 6; lvl++) {
    body += `  --elevation-${lvl}: ${layer(`${lvl}/contact shadow`)}, ${layer(`${lvl}/ambient shadow`)};\n`;
  }
  body += `\n  // pressed states (neomorphic) — inner for filled surfaces, inverted for dark ones\n`;
  body += `  // NOTE: buttons use the Figma EFFECT STYLES for pressed treatments (primary blur 8,\n`;
  body += `  // secondary blur 2 — intentionally different); these vars mirror the variable set only.\n`;
  body += `  --elevation-pressed-inner: ${layer('pressed/inner-shadow', true)};\n`;
  body += `  --elevation-pressed-inner-inverted: inset ${part('pressed/inner-shadow/x')} ${part('pressed/inner-shadow/y')} ${part('pressed/inner-shadow/blur')} ${part('pressed/inner-shadow/spread')} ${ev['pressed/inner-shadow/inverted']};\n`;
  body += `  --elevation-pressed-box: ${layer('pressed/box-shadow')};\n`;

  body += `\n  // semantic roles — mirror the Figma Elevation/roles/* effect styles\n`;
  for (const [role, lvl] of Object.entries(snapshot.elevationRoles ?? {})) {
    body += `  --elevation-${role}: var(--elevation-${lvl});\n`;
  }
  body += '}\n';
  files['primitive-elevation.scss'] = header('primitive-elevation.scss — 7 elevation levels + pressed', '// Each level = contact shadow + ambient shadow, composed into one box-shadow value.') + body;
}

// --- semantic-colors.scss ------------------------------------------------------

{
  const vars = varsOf('Semantic Colors');
  let body = `${SCOPE} {\n`;
  let lastGroup = '';
  for (const v of vars) {
    const group = v.name.split('/')[0];
    if (group !== lastGroup) {
      body += `\n  // ${group}\n`;
      lastGroup = group;
    }
    body += `  --${cssName(v.name)}: ${resolveRef(v.values['semantics V3']).css};\n`;
  }
  body += '}\n\n';

  const dark = vars.filter((v) => v.values['semantics V3'] !== v.values['Mode']);
  body += `// Dark theme — only ${dark.length}/69 roles are authored in Figma so far.\n`;
  body += `// When dark mode gets designed, re-sync and this block grows automatically.\n`;
  body += `${SCOPE}[data-theme='dark'],\n${SCOPE} [data-theme='dark'] {\n`;
  for (const v of dark) {
    body += `  --${cssName(v.name)}: ${resolveRef(v.values['Mode']).css};\n`;
  }
  body += '}\n';
  files['semantic-colors.scss'] = header('semantic-colors.scss — 69 color roles × 2 modes', '// Mode "semantics V3" = light (default). Mode "Mode" = dark (mostly unauthored).') + body;
}

// --- semantic-dimensions.scss --------------------------------------------------

{
  let body = `${SCOPE} {\n`;
  let lastGroup = '';
  for (const v of varsOf('Semantic Dimensions')) {
    const group = v.name.split('/')[0];
    if (group !== lastGroup) {
      body += `\n  // ${group}\n`;
      lastGroup = group;
    }
    body += `  --${cssName(v.name)}: ${resolveRef(v.values['Mode 1']).css};\n`;
  }
  body += '}\n';
  files['semantic-dimensions.scss'] = header('semantic-dimensions.scss — static component dimensions', '// Radius, heights, widths, strokes, icons, nav, table rows, avatars, control pad/gap.') + body;
}

// --- semantic-spacing.scss -----------------------------------------------------

{
  const vars = varsOf('Semantic Spacing');
  const modes = coll['Semantic Spacing'].modes; // XS base + 5 min-width overrides
  const BP_MIN = { 'SM ≥576px': '576px', 'MD ≥768px': '768px', 'LG ≥992px': '992px', 'XL ≥1200px': '1200px', 'XXL ≥1400px': '1400px' };

  let body = `${SCOPE} {\n`;
  for (const v of vars) body += `  --${cssName(v.name)}: ${resolveRef(v.values[modes[0]]).css};\n`;
  body += '}\n';

  for (let i = 1; i < modes.length; i++) {
    const changed = vars.filter((v) => v.values[modes[i]] !== v.values[modes[i - 1]]);
    if (!changed.length) continue;
    body += `\n@media (min-width: ${BP_MIN[modes[i]]}) {\n  ${SCOPE} {\n`;
    for (const v of changed) body += `    --${cssName(v.name)}: ${resolveRef(v.values[modes[i]]).css};\n`;
    body += '  }\n}\n';
  }
  files['semantic-spacing.scss'] = header('semantic-spacing.scss — responsive spacing (6 breakpoints)', '// Mobile-first: XS values at base, overrides only where a breakpoint changes the value.') + body;
}

// --- semantic-typography.scss --------------------------------------------------

{
  let body = `${SCOPE} {\n`;
  let lastGroup = '';
  for (const v of varsOf('Semantic Typography')) {
    const group = v.name.split('/')[0];
    if (group !== lastGroup) {
      body += `\n  // ${group}\n`;
      lastGroup = group;
    }
    body += `  --type-${cssName(v.name)}: ${resolveRef(v.values['Mode 1']).css};\n`;
  }
  body += '}\n';
  files['semantic-typography.scss'] = header('semantic-typography.scss — type roles (display → help)', '// Naming: --type-<style>-<prop>. Family/letter-spacing come from primitive-type.scss.') + body;
}

// --- index.scss ----------------------------------------------------------------

files['index.scss'] = header('index.scss — foundations-modern entrypoint', `// The identity-v2 foundation, mirrored 1:1 from Figma (526 tokens).\n// Scoped under ${SCOPE}: set data-foundation="modern" on <html> or any\n// wrapper element to activate. The legacy foundation at :root is unaffected.`) +
  ["@import './primitive-numbers.scss';",
   "@import './primitive-colors.scss';",
   "@import './primitive-type.scss';",
   "@import './primitive-motion.scss';",
   "@import './primitive-elevation.scss';",
   "@import './semantic-colors.scss';",
   "@import './semantic-dimensions.scss';",
   "@import './semantic-spacing.scss';",
   "@import './semantic-typography.scss';",
  ].join('\n') + '\n';

// --- write ----------------------------------------------------------------------

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT_DIR, name), content);
  console.log('wrote', join('libs/tokens/foundations-modern', name));
}
console.log('done —', Object.keys(files).length, 'files');
