import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { TableComponent, type TableColumn } from '@coherence/ui';
import type { TokenRow } from './tokens-table.types';

/**
 * Token resolution table — shows the mapping chain:
 * Property → Component Token → Semantic Token → Primitive
 *
 * Falls back to 2-column (Property/Token) when semantic/primitive are not provided.
 */
@Component({
  selector: 'afi-tokens-table',
  standalone: true,
  imports: [TableComponent],
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

  /** Detect if we have extended data (4 columns) or basic (2 columns) */
  readonly hasExtendedData = computed(() =>
    this.rows().some(r => r.semantic || r.primitive)
  );

  /**
   * The property name (trackByKey value) of the first row whose `token`
   * matches the active highlight key. Afi-table matches by property, so
   * we map from leaf-token to property here.
   */
  readonly highlightedRowKey = computed<string | null>(() => {
    const key = this.highlightToken();
    if (!key) return null;
    return this.rows().find(r => r.token === key)?.property ?? null;
  });

  readonly computedColumns = computed<TableColumn[]>(() => {
    if (this.hasExtendedData()) {
      return [
        { key: 'property', label: 'Property' },
        { key: 'token', label: 'Component Token' },
        { key: 'semantic', label: 'Semantic' },
        { key: 'primitive', label: 'Primitive' },
      ];
    }
    return [
      { key: 'property', label: 'Property' },
      { key: 'token', label: 'Token' },
    ];
  });

  readonly tableRows = computed(() =>
    this.rows().map(r => ({
      property: r.property,
      token: r.note ? `${r.token} — ${r.note}` : r.token,
      semantic: r.semantic ?? '',
      primitive: r.primitive ?? '',
    })),
  );
}
