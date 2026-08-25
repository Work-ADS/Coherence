import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { ScopedBrandService } from '../../services/scoped-brand.service';
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

  private readonly scopedBrand = inject(ScopedBrandService);

  /**
   * Where the `Valor` column reads token values from.
   *
   * Doc pages confine the brand swap to the shell's preview frame, so the
   * scoped node — not `<html>` — is the only place a brand token resolves to
   * what the preview is actually showing. `brand` is part of this signal on
   * purpose: `getComputedStyle` is a one-shot read, so the column needs a
   * reason to re-resolve when the preview re-skins.
   *
   * Falls back to the document root for tables rendered outside a doc shell
   * (the pattern pages), where the global brand is the right answer.
   */
  private readonly resolution = computed(() => ({
    brand: this.scopedBrand.brand(),
    root: this.scopedBrand.scope() ?? this.documentRoot(),
  }));

  readonly tableRows = computed(() => {
    const { root } = this.resolution();
    return this.rows().map((r) => ({
      key: `${r.property}:${r.token}`,
      property: r.property,
      token: r.token,
      value: r.value ?? this.resolveRawValue(r, root),
      note: r.note ?? '',
      highlighted: this.isHighlighted(r),
    }));
  });

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

  private documentRoot(): HTMLElement | null {
    return typeof document === 'undefined' ? null : document.documentElement;
  }

  /**
   * `token` is tried first on purpose. It is the property the component
   * actually consumes, so its computed value is the contract — and it is the
   * only candidate that re-resolves per brand. `primitive` is an authored
   * leaf from one brand's palette (`--color-afi-azul-500`), which resolves
   * under every brand and therefore always answered with AFI's value.
   */
  private resolveRawValue(row: TokenRow, root: HTMLElement | null): string {
    const candidates = [row.token, row.semantic, row.primitive].filter(Boolean) as string[];
    for (const candidate of candidates) {
      const resolved = this.resolveToken(candidate, root);
      if (resolved) return resolved;
      const parenthetical = candidate.match(/\((#[0-9a-fA-F]{3,8}|rgba?[^)]+|\d+(?:\.\d+)?[a-z%]+)\)/);
      if (parenthetical?.[1]) return this.normalizeColor(parenthetical[1]) ?? parenthetical[1];
    }
    return row.primitive ?? row.semantic ?? row.token;
  }

  private resolveToken(value: string, root: HTMLElement | null): string | null {
    const token = value.match(/--[a-zA-Z0-9-_]+/)?.[0];
    if (!token || !root) return null;
    const raw = getComputedStyle(root).getPropertyValue(token).trim();
    if (!raw) return null;
    const nested = this.resolveToken(raw, root);
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
