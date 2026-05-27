import { Injectable, signal } from '@angular/core';

export type TokenCategory =
  | 'color'
  | 'spacing'
  | 'sizing'
  | 'border'
  | 'typography'
  | 'effects'
  | 'motion';

export type TokenTier = 'component' | 'semantic' | 'primitive' | 'unknown';

/**
 * One step in a `var(--x)` resolution chain. The chain reads
 * top-to-bottom from component vars (closest to the call site) down to
 * primitives (the literal value the browser actually paints).
 */
export interface TokenStep {
  token: string;
  tier: TokenTier;
  tierLabel: string;
  resolvedValue: string;
  hex: string | null;
}

export interface TokenInfo {
  property: string;
  authoredValue: string;
  computedValue: string;
  computedHex: string | null;
  chain: TokenStep[];
  isViolation: boolean;
  category: TokenCategory;
}

export interface HierarchyItem {
  name: string;
  isComponent: boolean;
}

export interface TokenGroup {
  category: TokenCategory;
  label: string;
  tokens: TokenInfo[];
  violationCount: number;
}

export interface StateInfo {
  property: string;
  authoredValue: string;
  computedValue: string;
  computedHex: string | null;
  chain: TokenStep[];
  category: TokenCategory;
}

export interface StateGroup {
  state: string;
  label: string;
  tokens: StateInfo[];
}

export interface InspectResult {
  element: HTMLElement;
  selector: string;
  componentName: string | null;
  hierarchy: HierarchyItem[];
  tokens: TokenInfo[];
  groups: TokenGroup[];
  states: StateGroup[];
}

/**
 * Flat, single-line handoff payload — the contract the AFI team agreed on
 * 2026-05-22. One token name (whatever the component actually authored —
 * component-tier if it exists, otherwise semantic) + the final paintable
 * hex. No primitive → semantic → component chain visible to the consumer.
 */
export interface HandoffToken {
  property: string;
  token: string;
  hex: string | null;
}

/**
 * One rendered line for a Figma-style inspect panel section. `name` is the
 * team-style token name (e.g. `button-primary-background`) when a DS
 * component context can be derived from the DOM; otherwise it's the raw
 * CSS property (e.g. `padding`). `value` is the painted value the team
 * actually drops into their flat per-brand file.
 */
export interface HandoffLine {
  name: string;
  value: string;
}

export type HandoffSection = 'layout' | 'style' | 'typography';

export interface HandoffSections {
  layout: HandoffLine[];
  style: HandoffLine[];
  typography: HandoffLine[];
}

const PROPERTY_CATEGORIES: Record<string, TokenCategory> = {
  color: 'color',
  'background-color': 'color',
  // `background` shorthand is intentionally omitted — its color portion is
  // forwarded onto `background-color`, so listing both produces a
  // duplicate row in the Color card.
  'border-color': 'color',
  'border-top-color': 'color',
  'border-right-color': 'color',
  'border-bottom-color': 'color',
  'border-left-color': 'color',
  'outline-color': 'color',
  'box-shadow': 'color',

  padding: 'spacing',
  'padding-top': 'spacing',
  'padding-right': 'spacing',
  'padding-bottom': 'spacing',
  'padding-left': 'spacing',
  margin: 'spacing',
  'margin-top': 'spacing',
  'margin-right': 'spacing',
  'margin-bottom': 'spacing',
  'margin-left': 'spacing',
  gap: 'spacing',
  'row-gap': 'spacing',
  'column-gap': 'spacing',

  width: 'sizing',
  height: 'sizing',
  'min-width': 'sizing',
  'min-height': 'sizing',
  'max-width': 'sizing',
  'max-height': 'sizing',

  'border-width': 'border',
  'border-radius': 'border',

  font: 'typography',
  'font-size': 'typography',
  'font-weight': 'typography',
  'font-family': 'typography',
  'line-height': 'typography',
  'letter-spacing': 'typography',

  opacity: 'effects',

  transition: 'motion',
};

/**
 * 3-section grouping for the Figma-style inspect panel. Maps a curated
 * subset of CSS properties into the broader buckets a designer actually
 * scans. Per-side longhands (padding-top etc.) and font-* longhands are
 * intentionally omitted — shorthands carry the same info more concisely
 * and Figma's dev mode does the same.
 */
const SECTION_BY_PROPERTY: Record<string, HandoffSection> = {
  // LAYOUT — structural rhythm + shape
  display: 'layout',
  width: 'layout', height: 'layout',
  padding: 'layout',
  margin: 'layout',
  gap: 'layout',
  'border-width': 'layout', 'border-radius': 'layout',
  transition: 'layout',

  // STYLE — color + finish
  color: 'style',
  'background-color': 'style',
  'border-color': 'style',
  'outline-color': 'style',
  'box-shadow': 'style',
  opacity: 'style',

  // TYPOGRAPHY — `font` shorthand carries family + weight + size + line-height
  font: 'typography',
  'letter-spacing': 'typography',
};

/**
 * CSS property → short slot suffix for team-style names.
 * Example: `button-primary-` + `background` (slot) → `button-primary-background`.
 * Properties not listed fall back to the raw CSS property name.
 */
const SLOT_BY_PROPERTY: Record<string, string> = {
  'background-color': 'background',
  color: 'foreground',
  'border-color': 'border',
  'border-top-color': 'border',
  'border-right-color': 'border',
  'border-bottom-color': 'border',
  'border-left-color': 'border',
  'outline-color': 'outline',
  'box-shadow': 'shadow',
};

/**
 * BEM modifiers that represent size, not visual variant. Filtered out
 * when deriving the team-style variant from class names so the popover
 * outputs `button-primary-…` not `button-md-…`.
 */
const BEM_SIZE_MODIFIERS = new Set(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'compact', 'full', 'wide']);

const CATEGORY_ORDER: TokenCategory[] = [
  'color',
  'spacing',
  'sizing',
  'border',
  'typography',
  'effects',
  'motion',
];

const CATEGORY_LABELS: Record<TokenCategory, string> = {
  color: 'Color',
  spacing: 'Spacing',
  sizing: 'Sizing',
  border: 'Border',
  typography: 'Typography',
  effects: 'Effects',
  motion: 'Motion',
};

const STATE_PSEUDOS: { state: string; label: string }[] = [
  { state: ':hover', label: 'Hover' },
  { state: ':focus-visible', label: 'Focus' },
  { state: ':focus', label: 'Focus (legacy)' },
  { state: ':active', label: 'Active (pressed)' },
  { state: ':disabled', label: 'Disabled' },
  { state: ':checked', label: 'Checked' },
];

/**
 * Classes the inspector itself injects on the element it's pinning /
 * highlighting. We must skip any rule that targets one of these so the
 * pin's outline ring doesn't show up as if it were authored UI styling.
 * Mirrors the classes applied by demo-shell.component.ts.
 */
const INSPECTOR_INJECTED_RE = /\.demo-shell-(?:pinned|highlight)-(?:inspect|comment)\b/;

/**
 * Map of color-bearing CSS shorthands → the longhand color property each
 * one implies. When an author writes `background: var(--surface-default)`
 * the CSSStyleRule only exposes `background`; the `background-color`
 * longhand returns empty. We mine the shorthand value for a color-tier
 * var() reference and republish it as the longhand's authored value so
 * the chain renders against the property the inspector groups under
 * "Color".
 */
const COLOR_SHORTHAND_TO_LONGHANDS: Record<string, string[]> = {
  background: ['background-color'],
  border: [
    'border-color',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
  ],
  'border-top': ['border-top-color'],
  'border-right': ['border-right-color'],
  'border-bottom': ['border-bottom-color'],
  'border-left': ['border-left-color'],
  outline: ['outline-color'],
};

/**
 * Single-value logical / physical shorthands → the longhands they
 * populate. Same problem as colors: when the author writes
 * `padding-inline: var(--space-md)`, the CSSStyleRule only exposes the
 * logical property; `padding-left` / `padding-right` come back empty and
 * the inspector falls through to whatever the cascade started with
 * (typically Tailwind's `0`). We forward the single-value form here. Multi-
 * value forms like `padding: 8px 16px` aren't covered — they're rare in
 * the DS and the per-side longhand still works if the author wrote them.
 */
/**
 * CSS properties that inherit by default. If the clicked element doesn't
 * author one of these, we walk up the DOM tree to find an ancestor that
 * does and build the chain from that authored value — same way the
 * browser resolves inheritance.
 */
const INHERITABLE_PROPERTIES = new Set([
  'color',
  'font',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'text-align',
  'text-transform',
]);

const SIZING_SHORTHAND_TO_LONGHANDS: Record<string, string[]> = {
  'padding-inline': ['padding-left', 'padding-right'],
  'padding-block': ['padding-top', 'padding-bottom'],
  padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  'margin-inline': ['margin-left', 'margin-right'],
  'margin-block': ['margin-top', 'margin-bottom'],
  margin: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
};

/**
 * Component-tier tokens are namespaced after their component
 * (libs/tokens/components.scss). Everything else is decided by whether
 * the resolved value still references another var() — if it does, this
 * level is a semantic alias; if it doesn't, this level is the primitive
 * leaf the browser paints with.
 */
const COMPONENT_PREFIXES = [
  '--icon-button-',
  '--top-bar-',
  '--sidebar-',
  '--nav-item-',
  '--tab-',
  '--control-h-',
];

const TIER_LABELS: Record<TokenTier, string> = {
  component: 'COMPONENT',
  semantic: 'SEMANTIC',
  primitive: 'PRIMITIVE',
  unknown: 'TOKEN',
};

function classifyTier(token: string, resolvedValue: string): TokenTier {
  for (const p of COMPONENT_PREFIXES) {
    if (token.startsWith(p)) return 'component';
  }
  if (!token.startsWith('--')) return 'unknown';
  // No further var() reference → this is the primitive leaf in the chain.
  if (!resolvedValue.includes('var(')) return 'primitive';
  return 'semantic';
}

/**
 * Reads computed styles from an inspected DOM element, resolves which CSS
 * properties use design tokens vs raw values, walks the `var()` chain down
 * to the primitive layer, and groups them by category with violations first.
 */
@Injectable({ providedIn: 'root' })
export class InspectService {
  readonly activeResult = signal<InspectResult | null>(null);
  readonly isActive = signal(false);

  private readonly TRACKED_PROPERTIES = Object.keys(PROPERTY_CATEGORIES);

  /**
   * Cached authored definitions of every `--token` declared at the document
   * root level. Built lazily the first time we need to walk a chain, then
   * reused for the rest of the session.
   */
  private rootVarsCache: Map<string, string> | null = null;

  activate(): void {
    this.isActive.set(true);
  }

  deactivate(): void {
    this.isActive.set(false);
    this.activeResult.set(null);
  }

  toggle(): void {
    if (this.isActive()) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  inspect(element: HTMLElement): void {
    if (!this.isActive()) return;

    const tokens: TokenInfo[] = [];

    // Strip the inspector's own pin/highlight classes for the duration of the
    // read so neither `getComputedStyle` nor `element.matches` is fooled by
    // our overlay (which paints an outline ring + brand colour on pinned
    // elements). Restored in `finally`.
    const restoreInjected = this.suspendInjectedClasses(element);
    try {
      const computed = getComputedStyle(element);
      const applied = this.getAppliedDeclarations(element);

      for (const prop of this.TRACKED_PROPERTIES) {
        const computedValue = computed.getPropertyValue(prop).trim();
        if (
          !computedValue ||
          computedValue === 'none' ||
          computedValue === 'normal' ||
          computedValue === '0px'
        ) {
          continue;
        }

        // For inheritable properties (color, font-*, line-height, …) the
        // value often comes from an ancestor rather than the element
        // itself. If our own cascade has nothing, walk up until we find
        // who actually authored it.
        let authoredValue = applied.values.get(prop);
        if (authoredValue == null && INHERITABLE_PROPERTIES.has(prop)) {
          authoredValue = this.findInheritedAuthoredValue(element, prop);
        }
        const sourceValue = authoredValue ?? computedValue;
        const chain = this.buildChain(sourceValue, prop);
        const hasToken = chain.length > 0;
        // Sizing properties that nobody actually authored (e.g. `width` on
        // a flex child grown to fill its parent) aren't raw-value
        // violations — the px came from layout, not a hardcoded
        // declaration. Only flag width/height when the cascade really
        // wrote them.
        const sizingProp =
          prop === 'width' ||
          prop === 'height' ||
          prop === 'min-width' ||
          prop === 'min-height' ||
          prop === 'max-width' ||
          prop === 'max-height';
        const isViolation =
          this.isRawValue(computedValue, prop) &&
          !hasToken &&
          !(sizingProp && !applied.values.has(prop));

        if (this.isDefaultValue(prop, computedValue)) continue;
        // Drop properties whose effect is suppressed by a sibling (e.g.
        // `border-top-color` when `border-top-width: 0`). They don't paint
        // anything and surface as noisy false-positive violations from UA
        // / preflight resets.
        if (this.isInert(prop, computed)) continue;

        tokens.push({
          property: prop,
          authoredValue: sourceValue,
          computedValue,
          computedHex: this.toHex(computedValue),
          chain,
          isViolation,
          category: PROPERTY_CATEGORIES[prop] ?? 'effects',
        });
      }

      // When the `font` shorthand resolved to a token chain, the
      // individual longhand rows (`font-size`, `font-weight`, `font-family`,
      // `line-height`) are derivative noise — they all came from the same
      // type token. Collapse them so the Typography card stays focused.
      const fontRow = tokens.find((t) => t.property === 'font' && t.chain.length > 0);
      const filtered = fontRow
        ? tokens.filter(
            (t) =>
              t.property === 'font' ||
              !['font-size', 'font-weight', 'font-family', 'line-height', 'letter-spacing'].includes(
                t.property,
              ),
          )
        : tokens;

      const groups = this.buildGroups(filtered);
      const states = this.buildStates(element);

      this.activeResult.set({
        element,
        selector: this.buildSelector(element),
        componentName: this.findComponentName(element),
        hierarchy: this.buildHierarchy(element),
        tokens: filtered,
        groups,
        states,
      });
    } finally {
      restoreInjected();
    }
  }

  /**
   * Handoff-mode inspection — sibling of `inspect()`. Returns the single
   * primary handoff token for an element: the highest-tier authored token
   * (what the component literally writes) + the final paintable hex.
   *
   * Property priority: background-color → color → border-color → box-shadow.
   * Returns null when no color property has an authored token chain (raw
   * values, fully-transparent backgrounds, etc.).
   *
   * Does NOT mutate `activeResult` or `isActive` — pure read. Brand swap
   * lives in the cascade, so this method automatically returns the
   * brand-correct hex without any extra wiring.
   */
  getHandoffToken(element: HTMLElement): HandoffToken | null {
    const restoreInjected = this.suspendInjectedClasses(element);
    try {
      const computed = getComputedStyle(element);
      const applied = this.getAppliedDeclarations(element);

      const PRIORITY = ['background-color', 'color', 'border-color', 'box-shadow'];

      for (const prop of PRIORITY) {
        const computedValue = computed.getPropertyValue(prop).trim();
        if (
          !computedValue ||
          computedValue === 'rgba(0, 0, 0, 0)' ||
          computedValue === 'transparent'
        ) {
          continue;
        }

        let authoredValue = applied.values.get(prop);
        if (authoredValue == null && INHERITABLE_PROPERTIES.has(prop)) {
          authoredValue = this.findInheritedAuthoredValue(element, prop);
        }
        if (!authoredValue) continue;

        const chain = this.buildChain(authoredValue, prop);
        if (chain.length === 0) continue;

        return {
          property: prop,
          token: chain[0]!.token,
          hex: this.toHex(computedValue),
        };
      }

      return null;
    } finally {
      restoreInjected();
    }
  }

  /**
   * Build the three-section Figma-style handoff payload for an element.
   * Sections: Layout (spacing + sizing + radius + motion), Style (color +
   * border-color + effects), Typography. Each line carries the team-style
   * name (`button-primary-background`) when a DS component context can be
   * derived from the DOM, or the raw CSS property name as fallback.
   *
   * Used by the demo-shell inspect panel. Brand-correct hex values fall
   * out automatically because `getComputedStyle` reads the cascade.
   */
  getHandoffSections(element: HTMLElement): HandoffSections {
    const restoreInjected = this.suspendInjectedClasses(element);
    try {
      const computed = getComputedStyle(element);
      const context = this.deriveComponentContext(element);

      const sections: HandoffSections = { layout: [], style: [], typography: [] };

      // Iterate the section map directly so we cover layout properties
      // (display, padding, etc.) that aren't in TRACKED_PROPERTIES.
      for (const prop of Object.keys(SECTION_BY_PROPERTY)) {
        const computedValue = computed.getPropertyValue(prop).trim();
        if (this.isUninteresting(prop, computedValue, computed)) continue;

        const section = SECTION_BY_PROPERTY[prop];
        if (!section) continue;

        const value = this.isColorProperty(prop)
          ? this.toHex(computedValue) ?? computedValue
          : computedValue;

        const name = this.composeName(prop, context);

        // Dedupe identical name+value lines so border-*-color longhands don't
        // emit four copies of the same row.
        const list = sections[section];
        if (list.some((l) => l.name === name && l.value === value)) continue;

        list.push({ name, value });
      }

      return sections;
    } finally {
      restoreInjected();
    }
  }

  /**
   * Walk up the DOM looking for the nearest `<afi-*>` ancestor to identify
   * which DS component the element belongs to, plus the active variant
   * (read from BEM modifier classes on the first descendant, filtered to
   * skip size modifiers).
   */
  private deriveComponentContext(element: HTMLElement): { name: string; variant?: string } | null {
    let current: HTMLElement | null = element;
    while (current) {
      const tag = current.tagName.toLowerCase();
      if (tag.startsWith('afi-')) {
        const name = tag.slice(4);
        const variant = this.extractBemVariant(current);
        return variant ? { name, variant } : { name };
      }
      current = current.parentElement;
    }
    return null;
  }

  /**
   * Read BEM modifier classes from `host` (or its first element child) and
   * return the first one that isn't a size modifier. Examples:
   *   `btn btn--md btn--primary`  → 'primary'
   *   `chip chip--success`        → 'success'
   *   `card card--lg`             → undefined (size-only, no variant)
   */
  private extractBemVariant(host: HTMLElement): string | undefined {
    const candidates: HTMLElement[] = [host];
    const firstChild = host.firstElementChild as HTMLElement | null;
    if (firstChild) candidates.push(firstChild);

    for (const el of candidates) {
      for (const cls of Array.from(el.classList)) {
        const match = cls.match(/^[a-z0-9]+(?:-[a-z0-9]+)*--([a-z0-9-]+)$/);
        if (!match) continue;
        const modifier = match[1]!;
        if (BEM_SIZE_MODIFIERS.has(modifier)) continue;
        return modifier;
      }
    }
    return undefined;
  }

  /**
   * Compose a team-style flat-output name from page or DOM-derived context
   * + the clicked CSS property. Falls back to the raw property when no
   * component context is derivable (raw page HTML, etc.) — Figma does the
   * same.
   */
  private composeName(
    property: string,
    context: { name: string; variant?: string } | null,
  ): string {
    const slot = SLOT_BY_PROPERTY[property] ?? property;
    if (!context) return slot;
    return context.variant
      ? `${context.name}-${context.variant}-${slot}`
      : `${context.name}-${slot}`;
  }

  /**
   * Skip properties whose value is uninteresting for handoff: zero/none/
   * auto defaults, the inert UA values, or sizing properties that nobody
   * actually authored. Mirrors the noise-cutting in `inspect()` so the
   * inspect panel doesn't surface every UA default.
   */
  private isUninteresting(
    prop: string,
    value: string,
    computed: CSSStyleDeclaration,
  ): boolean {
    if (!value) return true;
    if (value === 'none' || value === 'normal' || value === '0px' || value === 'auto') return true;
    if (this.isDefaultValue(prop, value)) return true;
    if (this.isInert(prop, computed)) return true;
    return false;
  }

  /**
   * Temporarily remove `.demo-shell-pinned-*` / `.demo-shell-highlight-*`
   * classes so we can read the element's authored styling without the
   * inspector's overlay leaking in. Returns a restore function the caller
   * must invoke (always — even on error).
   */
  private suspendInjectedClasses(element: HTMLElement): () => void {
    const removed: string[] = [];
    for (const cls of Array.from(element.classList)) {
      if (/^demo-shell-(?:pinned|highlight)-(?:inspect|comment)$/.test(cls)) {
        removed.push(cls);
      }
    }
    for (const cls of removed) element.classList.remove(cls);
    return () => {
      for (const cls of removed) element.classList.add(cls);
    };
  }

  // ─── Chain resolution ──────────────────────────────────────────────────────

  /**
   * Walk a `var()` chain from an authored value down through every
   * intermediate token defined at the document root. Each step records the
   * token name, its tier (component / semantic / primitive), the value it
   * resolved to (which can be another var() reference or a literal), and a
   * hex form when the value is a color.
   */
  private buildChain(authoredValue: string, property: string): TokenStep[] {
    const steps: TokenStep[] = [];
    const seen = new Set<string>();
    const isColorProp = this.isColorProperty(property);

    let current = authoredValue;
    let safety = 8;

    while (safety-- > 0) {
      const token = this.extractToken(current);
      if (!token) break;
      if (seen.has(token)) break;
      seen.add(token);

      const rootVars = this.getRootVars();
      const next = rootVars.get(token) ?? null;
      const resolvedValue = next ?? this.resolveLive(token);
      const tier = classifyTier(token, resolvedValue);
      const hex = isColorProp ? this.toHex(this.resolveLive(token) || resolvedValue) : null;

      steps.push({
        token,
        tier,
        tierLabel: TIER_LABELS[tier],
        resolvedValue: resolvedValue ?? '',
        hex,
      });

      if (next == null) break;
      current = next;
    }

    return steps;
  }

  /**
   * Read the live resolved value of a custom property from the document
   * root. Returns null if undefined. Use this as a fallback when the
   * authored value can't be found in the stylesheet cache (e.g. token was
   * declared on a non-root selector like .scope-foo).
   */
  private resolveLive(token: string): string {
    try {
      return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    } catch {
      return '';
    }
  }

  private getRootVars(): Map<string, string> {
    if (this.rootVarsCache) return this.rootVarsCache;
    const map = new Map<string, string>();

    const visit = (rule: CSSRule) => {
      if (rule instanceof CSSStyleRule) {
        const sel = rule.selectorText.trim();
        if (sel === ':root' || sel === 'html' || sel === ':root, html' || sel === 'html, :root') {
          for (const prop of Array.from(rule.style)) {
            if (!prop.startsWith('--')) continue;
            const value = rule.style.getPropertyValue(prop).trim();
            if (value && !map.has(prop)) map.set(prop, value);
          }
        }
      } else if (this.isGroupingRule(rule)) {
        for (const child of Array.from(rule.cssRules)) visit(child);
      }
    };

    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) visit(rule);
      } catch {
        // cross-origin sheet, skip
      }
    }

    this.rootVarsCache = map;
    return map;
  }

  // ─── Color helpers ─────────────────────────────────────────────────────────

  private isColorProperty(property: string): boolean {
    if (property === 'color' || property === 'background' || property === 'background-color') {
      return true;
    }
    return property.includes('-color') || property === 'box-shadow';
  }

  /**
   * Convert any rgb()/rgba() or 3/6/8-digit hex into uppercase hex form.
   * Returns null when the value isn't a single solid color (gradients,
   * `transparent`, currentcolor, shadows etc.).
   */
  private toHex(value: string): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed === 'transparent') return null;
    if (trimmed === 'currentcolor' || trimmed === 'currentColor') return null;

    // Already hex
    const hexMatch = trimmed.match(/^#([0-9a-fA-F]{3,8})$/);
    if (hexMatch) return ('#' + hexMatch[1]!).toUpperCase();

    // rgb / rgba
    const rgbMatch = trimmed.match(
      /^rgba?\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*(?:[,\s/]\s*(\d*(?:\.\d+)?%?))?\s*\)$/,
    );
    if (rgbMatch) {
      const r = clamp255(Number(rgbMatch[1]));
      const g = clamp255(Number(rgbMatch[2]));
      const b = clamp255(Number(rgbMatch[3]));
      const a = rgbMatch[4];
      let alpha = 1;
      if (a != null && a !== '') {
        alpha = a.endsWith('%') ? Number(a.slice(0, -1)) / 100 : Number(a);
        if (Number.isNaN(alpha)) alpha = 1;
      }
      // Alpha 0 with any RGB → just "transparent"; readable beats lossless.
      if (alpha === 0) return null;
      let hex = `#${pad2(r)}${pad2(g)}${pad2(b)}`;
      if (alpha < 1) hex += pad2(Math.round(alpha * 255));
      return hex.toUpperCase();
    }

    return null;
  }

  // ─── States ────────────────────────────────────────────────────────────────

  private buildStates(element: HTMLElement): StateGroup[] {
    const out: StateGroup[] = [];

    for (const { state, label } of STATE_PSEUDOS) {
      const tokens: StateInfo[] = [];
      const seen = new Set<string>();

      const visit = (rule: CSSRule) => {
        if (rule instanceof CSSStyleRule) {
          if (INSPECTOR_INJECTED_RE.test(rule.selectorText)) return;
          if (!rule.selectorText.includes(state)) return;
          if (!this.selectorMatchesWithState(rule.selectorText, state, element)) return;
          for (const prop of Array.from(rule.style)) {
            if (seen.has(prop)) return;
            const value = rule.style.getPropertyValue(prop).trim();
            if (!value) continue;
            const chain = this.buildChain(value, prop);
            tokens.push({
              property: prop,
              authoredValue: value,
              computedValue: value,
              computedHex: this.isColorProperty(prop) ? this.toHex(value) : null,
              chain,
              category: PROPERTY_CATEGORIES[prop] ?? 'effects',
            });
            seen.add(prop);
          }
        } else if (this.isGroupingRule(rule)) {
          for (const child of Array.from(rule.cssRules)) visit(child);
        }
      };

      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) visit(rule);
        } catch {
          // cross-origin sheet, skip
        }
      }

      if (tokens.length > 0) {
        out.push({ state, label, tokens });
      }
    }

    return out;
  }

  private selectorMatchesWithState(
    selectorText: string,
    state: string,
    element: HTMLElement,
  ): boolean {
    const list = selectorText.split(',').map((s) => s.trim()).filter(Boolean);
    for (const sel of list) {
      const lastCombinatorIdx = Math.max(
        sel.lastIndexOf(' '),
        sel.lastIndexOf('>'),
        sel.lastIndexOf('+'),
        sel.lastIndexOf('~'),
      );
      const lastCompound = lastCombinatorIdx >= 0 ? sel.slice(lastCombinatorIdx + 1) : sel;
      if (!lastCompound.includes(state)) continue;
      const strippedCompound = lastCompound.split(state).join('');
      if (!strippedCompound) continue;
      const fullStripped =
        lastCombinatorIdx >= 0
          ? sel.slice(0, lastCombinatorIdx + 1) + strippedCompound
          : strippedCompound;
      try {
        if (element.matches(fullStripped)) return true;
      } catch {
        // invalid selector after strip, skip
      }
    }
    return false;
  }

  clear(): void {
    this.activeResult.set(null);
  }

  exportCurrentMarkdown(): string {
    const result = this.activeResult();
    if (!result) return '';

    const lines: string[] = [];
    const componentLabel = result.componentName ?? 'element';

    lines.push(`# Inspect — ${componentLabel}`);
    lines.push('');
    lines.push(`\`${result.selector}\``);
    lines.push('');

    if (result.hierarchy.length > 0) {
      lines.push('## Hierarchy');
      lines.push(result.hierarchy.map((h) => h.name).join(' › '));
      lines.push('');
    }

    if (result.states.length > 0) {
      lines.push('## States');
      lines.push('');
      for (const s of result.states) {
        lines.push(`### ${s.label} (\`${s.state}\`)`);
        for (const t of s.tokens) {
          lines.push(this.formatRowMarkdown(t.property, t.chain, t.authoredValue, t.computedHex));
        }
        lines.push('');
      }
    }

    if (result.groups.length > 0) {
      lines.push('## Tokens');
      lines.push('');
      for (const g of result.groups) {
        lines.push(`### ${g.label}${g.violationCount > 0 ? ` (${g.violationCount} ⚠)` : ''}`);
        for (const t of g.tokens) {
          const flag = t.isViolation ? ' ⚠' : '';
          lines.push(
            this.formatRowMarkdown(t.property, t.chain, t.authoredValue, t.computedHex) + flag,
          );
        }
        lines.push('');
      }
    }

    return lines.join('\n').trimEnd() + '\n';
  }

  private formatRowMarkdown(
    property: string,
    chain: TokenStep[],
    authoredValue: string,
    computedHex: string | null,
  ): string {
    if (chain.length === 0) {
      const display = computedHex ?? authoredValue;
      return `- ${property} → \`${display}\``;
    }
    const segments = chain
      .map((s) => `\`${s.token}\` (${s.tierLabel.toLowerCase()})`)
      .join(' → ');
    const tail = computedHex ?? chain[chain.length - 1]?.resolvedValue ?? '';
    return `- ${property} → ${segments}${tail ? ` → \`${tail}\`` : ''}`;
  }

  private buildGroups(tokens: TokenInfo[]): TokenGroup[] {
    return CATEGORY_ORDER.map((category) => {
      const inCategory = tokens.filter((t) => t.category === category);
      const sorted = [
        ...inCategory.filter((t) => t.isViolation),
        ...inCategory.filter((t) => !t.isViolation),
      ];
      return {
        category,
        label: CATEGORY_LABELS[category],
        tokens: sorted,
        violationCount: inCategory.filter((t) => t.isViolation).length,
      };
    }).filter((g) => g.tokens.length > 0);
  }

  /**
   * Read every authored declaration that applies to the element across all
   * stylesheets in the document, then apply them in cascade order so the
   * winning rule (highest specificity, latest source order) is the last to
   * write each property. Mirrors what the browser itself does — and what a
   * developer would see in DevTools' Styles panel.
   *
   * Key behaviours:
   * - Shorthand properties (e.g. `border-radius: var(--radius-control)`) are
   *   queried directly via `rule.style.getPropertyValue(prop)`. Iterating
   *   `Array.from(rule.style)` only yields longhand keys and would silently
   *   decompose the shorthand into four corner-longhands, losing the token.
   * - Rules selecting the inspector's own pin/highlight injection classes
   *   are excluded — those represent dev tooling, not real authored UI.
   */
  private getAppliedDeclarations(
    element: HTMLElement,
  ): { tokens: Map<string, string>; values: Map<string, string> } {
    const tokens = new Map<string, string>();
    const values = new Map<string, string>();

    const record = (prop: string, value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      values.set(prop, trimmed);
      const token = this.extractToken(trimmed);
      if (token) tokens.set(prop, token);
    };

    const matches: { rule: CSSStyleRule; specificity: number; order: number }[] = [];
    let order = 0;

    const visit = (rule: CSSRule) => {
      if (rule instanceof CSSStyleRule) {
        if (INSPECTOR_INJECTED_RE.test(rule.selectorText)) return;
        let m = false;
        try {
          m = element.matches(rule.selectorText);
        } catch {
          m = false;
        }
        if (m) {
          const specificity = this.computeSpecificityForElement(
            rule.selectorText,
            element,
          );
          matches.push({ rule, specificity, order: order++ });
        }
      } else if (this.isGroupingRule(rule)) {
        for (const child of Array.from(rule.cssRules)) visit(child);
      }
    };

    try {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) visit(rule);
        } catch {
          // cross-origin sheet, skip
        }
      }
    } catch {
      // safety net
    }

    matches.sort((a, b) => {
      if (a.specificity !== b.specificity) return a.specificity - b.specificity;
      return a.order - b.order;
    });

    for (const { rule } of matches) {
      for (const prop of this.TRACKED_PROPERTIES) {
        const v = rule.style.getPropertyValue(prop);
        if (v && v.trim()) record(prop, v);
      }
      for (const prop of Array.from(rule.style)) {
        record(prop, rule.style.getPropertyValue(prop));
      }
      // Forward color-bearing shorthands onto their implied longhands so
      // `background: var(--surface-default)` registers as the authored
      // value for `background-color`, etc.
      for (const [shorthand, longhands] of Object.entries(COLOR_SHORTHAND_TO_LONGHANDS)) {
        const sv = rule.style.getPropertyValue(shorthand);
        if (!sv || !sv.trim()) continue;
        const colorPart = this.extractColorPart(sv);
        if (!colorPart) continue;
        for (const lh of longhands) record(lh, colorPart);
      }
      // Single-value sizing shorthands (`padding-inline: var(--space-md)`
      // etc.) — forward the value verbatim to every physical longhand
      // they populate, but only when the shorthand carries a single
      // value. Multi-value cases (`padding: 8px 16px`) are left for the
      // per-side longhand path; this keeps the parser trivial.
      for (const [shorthand, longhands] of Object.entries(SIZING_SHORTHAND_TO_LONGHANDS)) {
        const sv = rule.style.getPropertyValue(shorthand);
        if (!sv) continue;
        const trimmed = sv.trim();
        if (!trimmed) continue;
        if (this.countShorthandValues(trimmed) !== 1) continue;
        for (const lh of longhands) record(lh, trimmed);
      }
    }

    // Inline `style="…"` wins over every author stylesheet rule.
    try {
      for (const prop of Array.from(element.style)) {
        record(prop, element.style.getPropertyValue(prop));
      }
    } catch {
      // safety net
    }

    return { tokens, values };
  }

  /**
   * Walk up the element's parent chain looking for the nearest ancestor
   * that authored `prop` in any matching rule. Used for inheritable
   * properties (`color`, `font-*`, `line-height`, …) so we can build the
   * token chain from whoever actually wrote the value, rather than
   * surfacing the inherited literal as if it were authored locally.
   */
  private findInheritedAuthoredValue(
    element: HTMLElement,
    prop: string,
  ): string | undefined {
    let current = element.parentElement;
    while (current) {
      const tag = current.tagName.toUpperCase();
      const applied = this.getAppliedDeclarations(current);
      const v = applied.values.get(prop);
      if (v != null) return v;
      if (tag === 'HTML') break;
      current = current.parentElement;
    }
    return undefined;
  }

  /**
   * Return the highest specificity among the comma-separated sub-selectors
   * that actually match the element. Comma-separated selector lists
   * cascade independently — a rule like `a, .foo` only contributes
   * the specificity of whichever clause matched the element.
   */
  private computeSpecificityForElement(
    selectorText: string,
    element: HTMLElement,
  ): number {
    let max = 0;
    for (const raw of selectorText.split(',')) {
      const sel = raw.trim();
      if (!sel) continue;
      try {
        if (element.matches(sel)) {
          max = Math.max(max, this.selectorSpecificity(sel));
        }
      } catch {
        // invalid sub-selector, skip
      }
    }
    return max;
  }

  /**
   * Specificity per the CSS spec: (idCount, classCount + attrCount +
   * pseudoClassCount, typeCount + pseudoElementCount), packed into a
   * single number for easy comparison. Approximation — doesn't model the
   * full quirks of `:is()/:where()/:has()`, but accurate enough for our DS.
   */
  private selectorSpecificity(sel: string): number {
    let s = sel;
    const attrCount = (s.match(/\[[^\]]+\]/g) || []).length;
    s = s.replace(/\[[^\]]+\]/g, '');
    const pseudoElCount = (s.match(/::[a-zA-Z][\w-]*/g) || []).length;
    s = s.replace(/::[a-zA-Z][\w-]*/g, '');
    const idCount = (s.match(/#[\w-]+/g) || []).length;
    s = s.replace(/#[\w-]+/g, '');
    const classCount = (s.match(/\.[\w-]+/g) || []).length;
    s = s.replace(/\.[\w-]+/g, '');
    const pseudoClassCount = (s.match(/:[a-zA-Z][\w-]*(?:\([^)]*\))?/g) || []).length;
    s = s.replace(/:[a-zA-Z][\w-]*(?:\([^)]*\))?/g, '');
    const tagCount = (s.match(/(?:^|[\s>+~])[a-zA-Z][\w-]*/g) || []).length;

    const a = idCount;
    const b = classCount + attrCount + pseudoClassCount;
    const c = tagCount + pseudoElCount;
    return a * 1_000_000 + b * 1_000 + c;
  }

  private isGroupingRule(rule: CSSRule): rule is CSSGroupingRule {
    // CSSGroupingRule exists in modern browsers; fall back to duck-typing
    // when the constructor isn't exposed (older Safari versions).
    if (typeof CSSGroupingRule !== 'undefined' && rule instanceof CSSGroupingRule) return true;
    return 'cssRules' in rule && rule instanceof CSSRule && !(rule instanceof CSSStyleRule);
  }

  private extractToken(value: string): string | null {
    const match = value.match(/var\((--[^,)]+)/);
    return match ? match[1]!.trim() : null;
  }

  /**
   * Pull the color-tier part out of a shorthand value like
   * `var(--border-width-hairline) solid var(--border-hairline)`. Strategy:
   * collect every `var(--…)` and literal color in the value, walk each
   * `var()` down through the root-vars map until we hit a literal, and
   * return the first one whose resolved literal parses as a color. Returns
   * the original `var(--…)` slice (so downstream chain logic keeps its
   * starting point), or the literal color when the author wrote one inline.
   */
  private extractColorPart(shorthandValue: string): string | null {
    const rootVars = this.getRootVars();

    // Pass 1 — var() references. Prefer these since DS shorthands almost
    // always write tokens.
    const varRe = /var\((--[^,)]+)(?:\s*,[^)]*)?\)/g;
    let m: RegExpExecArray | null;
    while ((m = varRe.exec(shorthandValue)) !== null) {
      const token = m[1]!.trim();
      let value: string | undefined = rootVars.get(token);
      const seen = new Set<string>([token]);
      let depth = 8;
      while (value && depth-- > 0) {
        if (this.looksLikeColor(value)) {
          return m[0];
        }
        const inner = this.extractToken(value);
        if (!inner || seen.has(inner)) break;
        seen.add(inner);
        value = rootVars.get(inner);
      }
      // Live fallback for tokens defined outside :root (e.g. scoped vars).
      const live = this.resolveLive(token);
      if (live && this.looksLikeColor(live)) return m[0];
    }

    // Pass 2 — literal colors written directly into the shorthand.
    const literalRe =
      /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)|\btransparent\b|\bcurrentcolor\b/i;
    const lit = shorthandValue.match(literalRe);
    return lit ? lit[0] : null;
  }

  private looksLikeColor(value: string): boolean {
    if (!value) return false;
    const v = value.trim().toLowerCase();
    if (v === 'transparent' || v === 'currentcolor' || v === 'inherit') return true;
    if (/^#[0-9a-f]{3,8}$/.test(v)) return true;
    if (/^rgba?\(/.test(v) || /^hsla?\(/.test(v)) return true;
    return false;
  }

  /**
   * How many top-level whitespace-separated values does this shorthand
   * carry? Used to gate single-value forwarding for `padding`/`margin`,
   * where a 2/3/4-value form (`padding: 8px 16px`) needs per-side
   * handling that isn't implemented yet. We respect parens depth so
   * `var(--space-md, fallback)` counts as one value.
   */
  private countShorthandValues(value: string): number {
    let count = 0;
    let depth = 0;
    let inToken = false;
    for (let i = 0; i < value.length; i++) {
      const ch = value[i]!;
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      const isSpace = depth === 0 && /\s/.test(ch);
      if (isSpace) {
        if (inToken) count++;
        inToken = false;
      } else {
        inToken = true;
      }
    }
    if (inToken) count++;
    return count;
  }

  private isRawValue(value: string, property: string): boolean {
    if (
      property.includes('color') ||
      property === 'background' ||
      property === 'background-color'
    ) {
      if (
        value === 'transparent' ||
        value === 'inherit' ||
        value === 'currentcolor' ||
        value.startsWith('rgba(0, 0, 0, 0)')
      ) return false;
      if (value.startsWith('rgb') || value.startsWith('#')) return true;
    }

    if (
      property.includes('padding') ||
      property.includes('margin') ||
      property.includes('gap') ||
      property === 'width' ||
      property === 'height' ||
      property.includes('radius')
    ) {
      if (value.includes('px') && !value.startsWith('0')) return true;
    }

    return false;
  }

  private isDefaultValue(prop: string, value: string): boolean {
    if (prop === 'color' && value === 'rgb(0, 0, 0)') return true;
    if (prop === 'background-color' && (value === 'rgba(0, 0, 0, 0)' || value === 'transparent'))
      return true;
    if (value === 'auto' || value === 'initial') return true;
    return false;
  }

  /**
   * Return true when a property's value doesn't actually paint anything,
   * usually because a sibling property zeroes it out. Examples:
   *  - `border-top-color` is inert when `border-top-width: 0`
   *  - `outline-color` is inert when `outline-style: none` or width 0
   *  - `border-color` shorthand is inert when *all* four widths are 0
   * Tailwind's preflight assigns `border-color: rgb(229, 231, 235)` and
   * `outline-color: #000` to every element via the `*` selector — those
   * are real declarations but they're invisible everywhere `border-width`
   * stays at `0`. Surfacing them as violations would drown out the real
   * dogfood issues.
   */
  private isInert(prop: string, computed: CSSStyleDeclaration): boolean {
    const widthZero = (w: string) => {
      const v = computed.getPropertyValue(w).trim();
      return !v || v === '0px' || v === '0';
    };

    if (prop === 'outline-color') {
      const style = computed.getPropertyValue('outline-style').trim();
      if (!style || style === 'none') return true;
      return widthZero('outline-width');
    }

    if (prop === 'border-top-color') return widthZero('border-top-width');
    if (prop === 'border-right-color') return widthZero('border-right-width');
    if (prop === 'border-bottom-color') return widthZero('border-bottom-width');
    if (prop === 'border-left-color') return widthZero('border-left-width');

    if (prop === 'border-color') {
      // The per-side longhands already tell the full story. The shorthand
      // only adds signal when all four sides paint — otherwise it
      // serializes whatever Tailwind/UA set across sides that aren't even
      // visible, drowning out the side(s) the author actually styled.
      return (
        widthZero('border-top-width') ||
        widthZero('border-right-width') ||
        widthZero('border-bottom-width') ||
        widthZero('border-left-width')
      );
    }

    return false;
  }

  private buildSelector(el: HTMLElement): string {
    const parts: string[] = [];
    let current: HTMLElement | null = el;
    let depth = 0;

    while (current && depth < 3) {
      let part = current.tagName.toLowerCase();
      if (current.classList.length > 0) {
        part += '.' + Array.from(current.classList).slice(0, 2).join('.');
      }
      parts.unshift(part);
      current = current.parentElement;
      depth++;
    }

    return parts.join(' > ');
  }

  private findComponentName(el: HTMLElement): string | null {
    let current: HTMLElement | null = el;
    while (current) {
      const tag = current.tagName.toLowerCase();
      if (tag.includes('-') && !tag.startsWith('ng-')) {
        return tag;
      }
      current = current.parentElement;
    }
    return null;
  }

  private buildHierarchy(el: HTMLElement): HierarchyItem[] {
    const items: HierarchyItem[] = [];
    let current: HTMLElement | null = el;
    let depth = 0;

    while (current && depth < 6) {
      const tag = current.tagName.toLowerCase();
      if (current.classList.contains('demo-content')) break;

      const isComponent = tag.includes('-') && !tag.startsWith('ng-');
      const name = isComponent
        ? tag
        : current.classList.length > 0
          ? tag + '.' + Array.from(current.classList)[0]
          : tag;

      items.unshift({ name, isComponent });
      current = current.parentElement;
      depth++;
    }

    return items;
  }
}

function clamp255(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(255, Math.round(n)));
}

function pad2(n: number): string {
  return n.toString(16).padStart(2, '0');
}
