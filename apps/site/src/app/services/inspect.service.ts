import { Injectable, signal } from '@angular/core';

export type TokenCategory =
  | 'color'
  | 'spacing'
  | 'sizing'
  | 'border'
  | 'typography'
  | 'effects'
  | 'motion';

export interface TokenInfo {
  property: string;
  value: string;
  token: string | null;
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
  value: string;
  token: string | null;
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

const PROPERTY_CATEGORIES: Record<string, TokenCategory> = {
  color: 'color',
  'background-color': 'color',
  background: 'color',
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
 * Reads computed styles from an inspected DOM element, resolves which CSS
 * properties use design tokens vs raw values, and groups them by category
 * with violations sorted first.
 */
@Injectable({ providedIn: 'root' })
export class InspectService {
  readonly activeResult = signal<InspectResult | null>(null);
  readonly isActive = signal(false);

  private readonly TRACKED_PROPERTIES = Object.keys(PROPERTY_CATEGORIES);

  private readonly TOKEN_PREFIXES = [
    '--color-',
    '--brand-',
    '--surface-',
    '--canvas-',
    '--feedback-',
    '--disabled-',
    '--type-',
    '--space-',
    '--dimension-',
    '--radius-',
    '--border-width-',
    '--duration-',
    '--easing-',
    '--tracking-',
    '--shadow-',
    '--top-bar-',
    '--sidebar-',
  ];

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

      const token = applied.tokens.get(prop) ?? null;
      const authoredValue = applied.values.get(prop) ?? null;
      const isViolation = this.isRawValue(computedValue, prop) && !token;

      if (this.isDefaultValue(prop, computedValue)) continue;

      tokens.push({
        property: prop,
        value: authoredValue ?? computedValue,
        token,
        isViolation,
        category: PROPERTY_CATEGORIES[prop] ?? 'effects',
      });
    }

    const groups = this.buildGroups(tokens);
    const states = this.buildStates(element);

    this.activeResult.set({
      element,
      selector: this.buildSelector(element),
      componentName: this.findComponentName(element),
      hierarchy: this.buildHierarchy(element),
      tokens,
      groups,
      states,
    });
  }

  private buildStates(element: HTMLElement): StateGroup[] {
    const out: StateGroup[] = [];

    for (const { state, label } of STATE_PSEUDOS) {
      const tokens: StateInfo[] = [];
      const seen = new Set<string>();

      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) {
            if (!(rule instanceof CSSStyleRule)) continue;
            if (!rule.selectorText.includes(state)) continue;

            if (!this.selectorMatchesWithState(rule.selectorText, state, element)) continue;

            for (const prop of Array.from(rule.style)) {
              if (seen.has(prop)) continue;
              const value = rule.style.getPropertyValue(prop).trim();
              if (!value) continue;
              const token = this.extractToken(value);
              tokens.push({
                property: prop,
                value,
                token,
                category: PROPERTY_CATEGORIES[prop] ?? 'effects',
              });
              seen.add(prop);
            }
          }
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
          const tokenPart = t.token ? `\`${t.token}\`` : `\`${t.value}\``;
          lines.push(`- ${t.property} → ${tokenPart}`);
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
          if (t.token) {
            lines.push(`- ${t.property} → \`${t.token}\` · ${t.value}`);
          } else {
            const flag = t.isViolation ? ' ⚠' : '';
            lines.push(`- ${t.property} → \`${t.value}\`${flag}`);
          }
        }
        lines.push('');
      }
    }

    return lines.join('\n').trimEnd() + '\n';
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

    try {
      for (const prop of Array.from(element.style)) {
        record(prop, element.style.getPropertyValue(prop));
      }

      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) {
            if (rule instanceof CSSStyleRule && element.matches(rule.selectorText)) {
              for (const prop of Array.from(rule.style)) {
                record(prop, rule.style.getPropertyValue(prop));
              }
            }
          }
        } catch {
          // Cross-origin stylesheet, skip
        }
      }
    } catch {
      // Safety net
    }

    return { tokens, values };
  }

  private extractToken(value: string): string | null {
    const match = value.match(/var\((--[^,)]+)/);
    return match ? match[1]! : null;
  }

  private isRawValue(value: string, property: string): boolean {
    if (
      property.includes('color') ||
      property === 'background' ||
      property === 'background-color'
    ) {
      // getComputedStyle normalizes `transparent` to `rgba(0, 0, 0, 0)`, so the
      // literal-keyword check alone never matches computed values. The `background`
      // shorthand serializes as `rgba(0, 0, 0, 0) none repeat scroll …` — accept
      // anything that starts with the transparent rgba sentinel.
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
