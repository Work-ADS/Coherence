import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { TableComponent, type TableColumn } from '@coherence/ui';
import type { TokenRow } from './tokens-table.types';

/**
 * Two-column table showing Property → Token mapping for a primitive.
 * Wraps <afi-table> with fixed column schema.
 */
@Component({
  selector: 'afi-tokens-table',
  standalone: true,
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <h3 class="text-section text-canvas-fg mb-space-6">{{ title() }}</h3>
      <afi-table
        [columns]="columns"
        [rows]="tableRows()"
        trackByKey="property"
        density="compact"
        [rowHoverable]="true"
      />
    </section>
  `,
})
export class TokensTableComponent {
  readonly title = input<string>('Tokens consumidos');
  readonly rows = input.required<TokenRow[]>();

  readonly columns: TableColumn[] = [
    { key: 'property', label: 'Propiedad' },
    { key: 'token', label: 'Token' },
  ];

  readonly tableRows = computed(() =>
    this.rows().map(r => ({
      property: r.property,
      token: r.note ? `${r.token} — ${r.note}` : r.token,
    })),
  );
}
