import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

import type { TokenRow } from './tokens-table.types';

/**
 * Token handoff table — shows the contract programmers need:
 * Attribute → Token → Raw value, with per-row copy.
 */
@Component({
  selector: 'afi-tokens-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tokens-table.component.html',
  styleUrl: './tokens-table.component.scss',
})
export class TokensTableComponent {
  readonly title = input<string>('');
  readonly rows = input.required<TokenRow[]>();
  /**
   * CSS custom property key (e.g. `--brand-secondary-background-default`)
   * whose row should be highlighted. Used by the inspect-click flow on
   * doc pages — clicking an element in the preview surfaces the matching
   * row. Null means "no highlight".
   */
  readonly highlightToken = input<string | null>(null);
  readonly copiedKey = signal<string | null>(null);

  readonly tableRows = computed(() =>
    this.rows().map((r) => ({
      key: `${r.property}:${r.token}`,
      property: r.property,
      token: r.token,
      value: r.value ?? this.resolveRawValue(r),
      note: r.note ?? '',
      highlighted: this.isHighlighted(r),
    })),
  );

  copyRow(row: { property: string; token: string; value: string; key: string }): void {
    if (!navigator?.clipboard) return;
    const text = `${row.property}: ${row.token} (${row.value})`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.copiedKey.set(row.key);
        setTimeout(() => {
          if (this.copiedKey() === row.key) this.copiedKey.set(null);
        }, 1200);
      })
      .catch(() => {});
  }

  private isHighlighted(row: TokenRow): boolean {
    const key = this.highlightToken();
    if (!key) return false;
    return row.token === key || row.semantic === key || row.primitive === key;
  }

  private resolveRawValue(row: TokenRow): string {
    const candidates = [row.primitive, row.semantic, row.token].filter(Boolean) as string[];
    for (const candidate of candidates) {
      const resolved = this.resolveToken(candidate);
      if (resolved) return resolved;
      const parenthetical = candidate.match(/\((#[0-9a-fA-F]{3,8}|rgba?[^)]+|\d+(?:\.\d+)?[a-z%]+)\)/);
      if (parenthetical?.[1]) return this.normalizeColor(parenthetical[1]) ?? parenthetical[1];
    }
    return row.primitive ?? row.semantic ?? row.token;
  }

  private resolveToken(value: string): string | null {
    const token = value.match(/--[a-zA-Z0-9-_]+/)?.[0];
    if (!token || typeof document === 'undefined') return null;
    const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    if (!raw) return null;
    const nested = this.resolveToken(raw);
    return nested ?? this.normalizeColor(raw) ?? raw;
  }

  private normalizeColor(value: string): string | null {
    const trimmed = value.trim();
    const hex = trimmed.match(/^#([0-9a-fA-F]{3,8})$/);
    if (hex) return `#${hex[1]!.toUpperCase()}`;
    const rgb = trimmed.match(
      /^rgba?\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*(?:[,\s/]\s*(\d*(?:\.\d+)?%?))?\s*\)$/,
    );
    if (!rgb) return null;
    const toHex = (n: string) => Math.max(0, Math.min(255, Math.round(Number(n))))
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
    return `#${toHex(rgb[1]!)}${toHex(rgb[2]!)}${toHex(rgb[3]!)}`;
  }
}
