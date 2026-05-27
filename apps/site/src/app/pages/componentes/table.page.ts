import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TableComponent, SegmentedControlComponent } from '@coherence/ui';
import type { TableColumn, TableDensity } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const SAMPLE_COLUMNS: TableColumn[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'estado', label: 'Estado' },
  { key: 'monto', label: 'Monto', align: 'end', sortable: true },
];

const SAMPLE_ROWS: Record<string, unknown>[] = [
  { id: 1, nombre: 'Operación Alpha', estado: 'Activo', monto: '$12,500' },
  { id: 2, nombre: 'Operación Beta', estado: 'Pendiente', monto: '$8,300' },
  { id: 3, nombre: 'Operación Gamma', estado: 'Cerrado', monto: '$45,000' },
  { id: 4, nombre: 'Operación Delta', estado: 'Activo', monto: '$3,200' },
];

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Header background', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
      { property: 'Header border', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-gris-200' },
      { property: 'Header text', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
      { property: 'Row background (hover)', token: '--surface-subtle', semantic: '--surface-subtle', primitive: '--color-afi-control-50' },
      { property: 'Row text', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
      { property: 'Row divider', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-gris-200' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'Compact row padding', token: '--space-sm', semantic: '--space-sm', primitive: '12px' },
      { property: 'Comfortable row padding', token: '--space-md', semantic: '--space-md', primitive: '16px' },
      { property: 'Cell padding inline', token: '--space-md', semantic: '--space-md', primitive: '16px' },
      { property: 'Typography', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '14px / 20px / 400' },
    ],
  },
];

const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
];

@Component({
  selector: 'site-table-page',
  standalone: true,
  imports: [
    RouterLink,
    TableComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.page.html',
  styleUrl: './table.page.scss',
})
export class TablePage {
  readonly density = signal<TableDensity>('compact');

  readonly densityOptions = DENSITY_OPTIONS;
  readonly columns = SAMPLE_COLUMNS;
  readonly rows = SAMPLE_ROWS;
  readonly tokenCategories = TOKEN_CATEGORIES;
}
