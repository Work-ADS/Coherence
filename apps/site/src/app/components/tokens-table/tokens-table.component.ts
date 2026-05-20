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
  template: `
    <section>
      @if (title()) {
        <h3 class="text-section text-canvas-fg mb-space-6">{{ title() }}</h3>
      }
      <afi-table
        [columns]="computedColumns()"
        [rows]="tableRows()"
        trackByKey="property"
        density="compact"
        [rowHoverable]="true"
      />
    </section>
  `,
})
export class TokensTableComponent {
  readonly title = input<string>('');
  readonly rows = input.required<TokenRow[]>();

  /** Detect if we have extended data (4 columns) or basic (2 columns) */
  readonly hasExtendedData = computed(() =>
    this.rows().some(r => r.semantic || r.primitive)
  );

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
