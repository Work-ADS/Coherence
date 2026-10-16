import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TableComponent, SegmentedControlComponent } from '@coherence/ui';
import type {
  TableActionsReveal,
  TableColumn,
  TableDensity,
  TableHover,
  TableRowAction,
  TableSelectionMode,
} from '@coherence/ui';

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

// Canonical 2-action pattern (Richard 2026-06-10): Editar + Borrar, both
// inline as icon buttons. With ≤ 2 actions the primitive auto-promotes
// everything to inline regardless of the `overflow` flag — a 3-dot menu
// for 1-2 items is friction. From 3 actions up, the flag is honored.
// Duplicar dropped as out-of-scope for the default sample.
const SAMPLE_ROW_ACTIONS: TableRowAction[] = [
  { key: 'edit', label: 'Editar', icon: 'edit', ariaLabel: 'Editar operación' },
  {
    key: 'delete',
    label: 'Borrar',
    icon: 'delete',
    ariaLabel: 'Borrar operación',
    variant: 'danger',
  },
];

// Team-evaluation control: two action-reveal modes side-by-side until we
// pick one as the default in <afi-table>. Opción 1 = strict hover-only
// (Notion / Granola); Opción 2 = soft-at-rest (~40% opacity, brightens
// on hover). Decision lands in `table.variants.ts` as the new default.
const ACTION_REVEAL_OPTIONS = [
  { value: 'hover', label: 'Opción 1' },
  { value: 'soft', label: 'Opción 2' },
];

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Header font', token: '--table-header-font' },
      { property: 'Header text', token: '--table-header-foreground' },
      { property: 'Header divider', token: '--table-header-divider' },
      { property: 'Cell font', token: '--table-cell-font' },
      { property: 'Cell text', token: '--table-cell-foreground' },
      { property: 'Child row text', token: '--table-child-foreground' },
      { property: 'Row background (hover)', token: '--table-row-background-hover' },
      { property: 'Row background (selected)', token: '--surface-selected' },
      { property: 'Totals font', token: '--table-footer-font' },
      { property: 'Totals text', token: '--table-footer-foreground' },
      { property: 'Row divider', token: '--border-hairline' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'Compact row padding', token: '--space-xs' },
      { property: 'Default row padding', token: '--space-sm' },
      { property: 'Comfortable row padding', token: '--space-md' },
      { property: 'Cell padding inline', token: '--space-md' },
      { property: 'Hover radius', token: '--radius-table' },
    ],
  },
];

const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'comfortable', label: 'Comfortable' },
];

const HOVER_OPTIONS = [
  { value: 'on', label: 'On' },
  { value: 'auto', label: 'Auto' },
  { value: 'off', label: 'Off' },
];

const EXTRAS_OPTIONS = [
  { value: 'off', label: 'Plain' },
  { value: 'on', label: 'Reference + totals' },
];

const GROUP_COLUMNS: TableColumn[] = [
  { key: 'nombre', label: 'Activo', sortable: false },
  { key: 'valor', label: 'Valor', align: 'end' },
];

// Two levels: a group (children) and leaves. `disabled` shows a leaf selection skips.
const GROUP_ROWS: Record<string, unknown>[] = [
  {
    id: 'inm',
    nombre: 'Inmobiliario',
    valor: '$320,000',
    children: [
      { id: 'inm-1', nombre: 'Vivienda habitual', valor: '$210,000' },
      { id: 'inm-2', nombre: 'Local alquilado', valor: '$110,000' },
    ],
  },
  {
    id: 'fin',
    nombre: 'Financiero',
    valor: '$140,000',
    children: [
      { id: 'fin-1', nombre: 'Fondo indexado', valor: '$90,000' },
      { id: 'fin-2', nombre: 'Depósito (bloqueado)', valor: '$50,000', disabled: true },
    ],
  },
  { id: 'otros', nombre: 'Colección de arte', valor: '$25,000' },
];

const MODE_OPTIONS = [
  { value: 'rows', label: 'Rows' },
  { value: 'leaves', label: 'Leaves' },
];

const ON_OFF_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
];

const REFERENCE_ROW: Record<string, unknown> = {
  id: '—',
  nombre: 'Objetivo',
  estado: 'Meta',
  monto: '$60,000',
  variant: 'reference',
};

const FOOTER_ROW: Record<string, unknown> = { id: '', nombre: 'Total', estado: '', monto: '$69,000' };

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
  readonly hover = signal<TableHover>('on');
  readonly extras = signal<'on' | 'off'>('off');
  // Docs-page default mirrors the primitive default (`'hover'`, locked
  // 2026-05-28). The Opción 1 / 2 toggle stays as an educational affordance
  // so the team can demonstrate the contrast with `'soft'` from the docs.
  readonly actionReveal = signal<TableActionsReveal>('hover');

  readonly groupColumns = GROUP_COLUMNS;
  readonly groupRows = GROUP_ROWS;
  readonly modeOptions = MODE_OPTIONS;
  readonly onOffOptions = ON_OFF_OPTIONS;
  readonly selectionMode = signal<TableSelectionMode>('leaves');
  readonly rowClickSelect = signal<'on' | 'off'>('on');
  readonly boxesVisible = signal<'on' | 'off'>('off');
  readonly selectedKeys = signal<unknown[]>([]);
  readonly expandedKeys = signal<unknown[]>(['inm']);
  readonly densityOptions = DENSITY_OPTIONS;
  readonly hoverOptions = HOVER_OPTIONS;
  readonly extrasOptions = EXTRAS_OPTIONS;
  readonly actionRevealOptions = ACTION_REVEAL_OPTIONS;
  readonly columns = SAMPLE_COLUMNS;
  // The reference row is listed LAST on purpose: the table pins it above the data.
  readonly displayRows = computed(() => (this.extras() === 'on' ? [...SAMPLE_ROWS, REFERENCE_ROW] : SAMPLE_ROWS));
  readonly footerRow = computed(() => (this.extras() === 'on' ? FOOTER_ROW : null));
  readonly rows = SAMPLE_ROWS;
  readonly rowActions = SAMPLE_ROW_ACTIONS;
  readonly tokenCategories = TOKEN_CATEGORIES;
}
