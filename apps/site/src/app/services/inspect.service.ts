import { Injectable, signal } from '@angular/core';

export interface TokenInfo {
  property: string;
  value: string;
  token: string | null; // null = raw value (violation)
  isViolation: boolean;
}

export interface InspectResult {
  element: HTMLElement;
  selector: string;
  componentName: string | null;
  hierarchy: HierarchyItem[];
  tokens: TokenInfo[];
}

export interface HierarchyItem {
  name: string;
  isComponent: boolean;
}

/**
 * Reads computed styles from a hovered DOM element,
 * resolves which CSS properties use design tokens vs raw values,
 * and reports violations (hardcoded hex/px not from a token).
 */
@Injectable({ providedIn: 'root' })
export class InspectService {
  readonly activeResult = signal<InspectResult | null>(null);
  readonly isActive = signal(false);

  /** CSS properties we care about inspecting */
  private readonly TRACKED_PROPERTIES = [
    'color',
    'background-color',
    'background',
    'border-color',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'outline-color',
    'box-shadow',
    'font',
    'font-size',
    'font-weight',
    'font-family',
    'line-height',
    'letter-spacing',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'gap',
    'row-gap',
    'column-gap',
    'width',
    'height',
    'min-width',
    'min-height',
    'max-width',
    'max-height',
    'border-radius',
    'border-width',
    'opacity',
    'transition',
  ];

  /** Known token prefixes from the design system */
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

  /**
   * Inspect an element: read its inline + computed styles,
   * check which ones resolve from CSS custom properties.
   */
  inspect(element: HTMLElement): void {
    if (!this.isActive()) return;

    const tokens: TokenInfo[] = [];
    const computed = getComputedStyle(element);
    const inlineStyle = element.style;

    // Get all CSS custom properties applied to this element by walking up stylesheets
    const appliedTokens = this.getAppliedTokens(element);

    for (const prop of this.TRACKED_PROPERTIES) {
      const computedValue = computed.getPropertyValue(prop).trim();
      if (!computedValue || computedValue === 'none' || computedValue === 'normal' || computedValue === '0px') {
        continue;
      }

      // Check if this property's value comes from a token
      const token = appliedTokens.get(prop) ?? null;
      const isViolation = this.isRawValue(computedValue, prop) && !token;

      // Skip boring inherited defaults
      if (this.isDefaultValue(prop, computedValue)) continue;

      tokens.push({
        property: prop,
        value: computedValue,
        token,
        isViolation,
      });
    }

    this.activeResult.set({
      element,
      selector: this.buildSelector(element),
      componentName: this.findComponentName(element),
      hierarchy: this.buildHierarchy(element),
      tokens,
    });
  }

  clear(): void {
    this.activeResult.set(null);
  }

  /**
   * Walk the element's matched CSS rules to find which properties
   * are set via var(--token-name).
   */
  private getAppliedTokens(element: HTMLElement): Map<string, string> {
    const map = new Map<string, string>();

    try {
      // Check inline style for var() usage
      for (let i = 0; i < element.style.length; i++) {
        const prop = element.style[i]!;
        const value = element.style.getPropertyValue(prop);
        const token = this.extractToken(value);
        if (token) map.set(prop, token);
      }

      // Walk matched CSS rules
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const rules = sheet.cssRules;
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule instanceof CSSStyleRule && element.matches(rule.selectorText)) {
              for (let j = 0; j < rule.style.length; j++) {
                const prop = rule.style[j]!;
                const value = rule.style.getPropertyValue(prop);
                const token = this.extractToken(value);
                if (token) map.set(prop, token);
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

    return map;
  }

  /** Extract a --token-name from a var(--token-name) value */
  private extractToken(value: string): string | null {
    const match = value.match(/var\((--[^,)]+)/);
    return match ? match[1]! : null;
  }

  /** Check if a computed value looks like a hardcoded/raw value */
  private isRawValue(value: string, property: string): boolean {
    // Colors: rgb/rgba with specific values that aren't black/white/transparent
    if (property.includes('color') || property === 'background' || property === 'background-color') {
      if (value === 'transparent' || value === 'inherit' || value === 'currentcolor') return false;
      if (value.startsWith('rgb') || value.startsWith('#')) return true;
    }

    // Spacing/sizing: px values
    if (property.includes('padding') || property.includes('margin') || property.includes('gap') ||
        property === 'width' || property === 'height' || property.includes('radius')) {
      if (value.includes('px') && !value.startsWith('0')) return true;
    }

    return false;
  }

  /** Filter out boring default values that every element has */
  private isDefaultValue(prop: string, value: string): boolean {
    if (prop === 'color' && value === 'rgb(0, 0, 0)') return true;
    if (prop === 'background-color' && (value === 'rgba(0, 0, 0, 0)' || value === 'transparent')) return true;
    if (value === 'auto' || value === 'initial') return true;
    return false;
  }

  /** Build a readable CSS selector path for the element */
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

  /**
   * Find the nearest Angular component host element.
   * Angular components use custom element names (contain a dash).
   */
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

  /**
   * Build hierarchy showing component nesting from the element up.
   * Stops at the demo area boundary.
   */
  private buildHierarchy(el: HTMLElement): HierarchyItem[] {
    const items: HierarchyItem[] = [];
    let current: HTMLElement | null = el;
    let depth = 0;

    while (current && depth < 6) {
      const tag = current.tagName.toLowerCase();
      // Stop at demo boundary
      if (current.classList.contains('demo-content')) break;

      const isComponent = tag.includes('-') && !tag.startsWith('ng-');
      const name = isComponent
        ? tag
        : (current.classList.length > 0
          ? tag + '.' + Array.from(current.classList)[0]
          : tag);

      items.unshift({ name, isComponent });
      current = current.parentElement;
      depth++;
    }

    return items;
  }
}
