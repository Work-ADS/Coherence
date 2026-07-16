import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  BadgeV2Component,
  ButtonV2Component,
  CardV2Component,
  CheckboxV2Component,
  ChipV2Component,
  IconButtonV2Component,
  InputV2Component,
  MenuItemV2Component,
  MenuV2Component,
  MenuDividerV2Component,
  NavItemV2Component,
  NavSectionV2Component,
  SelectV2Component,
  SidebarV2Component,
  TableV2Component,
  TabsV2Component,
  TabV2Component,
  TagV2Component,
  ToggleV2Component,
} from '@coherence/ui';
import type {
  BadgeV2Tone,
  ButtonV2Size,
  ButtonV2Variant,
  IconButtonV2Size,
  IconButtonV2Variant,
  InputV2Size,
  SelectV2Size,
  SelectV2Option,
  TableV2Column,
  TableV2Density,
  TableV2RowAction,
  TableV2SortState,
} from '@coherence/ui';

import { DemoShellComponent } from '../demo-shell/demo-shell.component';

/**
 * Identity v2 workbench — the foundations-modern proving ground.
 *
 * Shows every variant × size × state grid for the v2 primitives as they land
 * (button first, input next). Throwaway chrome by design: this page grows into
 * the component moodboard for Borja, so styling stays minimal and local.
 *
 * The `data-foundation="modern"` attribute on the root div activates the
 * scoped token mirror; the demo-shell chrome around it stays on the legacy
 * foundation on purpose.
 */
@Component({
  selector: 'site-foundations-modern-workbench-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BadgeV2Component,
    ButtonV2Component,
    CardV2Component,
    CheckboxV2Component,
    ChipV2Component,
    IconButtonV2Component,
    TableV2Component,
    InputV2Component,
    MenuItemV2Component,
    MenuV2Component,
    MenuDividerV2Component,
    NavItemV2Component,
    NavSectionV2Component,
    SelectV2Component,
    SidebarV2Component,
    TabsV2Component,
    TabV2Component,
    TagV2Component,
    ToggleV2Component,
    DemoShellComponent,
  ],
  templateUrl: './foundations-modern-workbench.page.html',
  styleUrls: ['./foundations-modern-workbench.page.scss'],
})
export class FoundationsModernWorkbenchPage {
  // Sidebar workbench — collapsed state per demo frame (self-toggling).
  readonly sidebarCollapsedMain = signal(false);
  readonly sidebarCollapsedRail = signal(true);

  readonly variants: ButtonV2Variant[] = ['primary', 'secondary', 'ghost', 'destructive'];
  readonly sizes: ButtonV2Size[] = ['xs', 'sm', 'md', 'lg'];

  // Icon button — shares the button's variants; sizes are sm/md/lg (no xs).
  readonly iconButtonVariants: IconButtonV2Variant[] = ['primary', 'secondary', 'ghost', 'destructive'];
  readonly iconButtonSizes: IconButtonV2Size[] = ['sm', 'md', 'lg'];

  readonly inputSizes: InputV2Size[] = ['sm', 'md', 'lg'];

  readonly selectSizes: SelectV2Size[] = ['sm', 'md', 'lg'];

  readonly selectOptions: SelectV2Option[] = [
    { value: 'sl', label: 'Sociedad limitada' },
    { value: 'sa', label: 'Sociedad anónima' },
    { value: 'slu', label: 'Sociedad limitada unipersonal' },
    { value: 'coop', label: 'Sociedad cooperativa' },
    { value: 'civil', label: 'Sociedad civil' },
    { value: 'com', label: 'Comunidad de bienes', disabled: true },
  ];

  readonly provinceOptions: SelectV2Option[] = [
    'Álava',
    'Albacete',
    'Alicante',
    'Almería',
    'Asturias',
    'Ávila',
    'Badajoz',
    'Barcelona',
    'Burgos',
    'Cáceres',
    'Cádiz',
    'Cantabria',
  ].map((name) => ({ value: name.toLowerCase(), label: name }));

  readonly labels: Record<ButtonV2Variant, string> = {
    primary: 'Guardar',
    secondary: 'Cancelar',
    ghost: 'Ver detalle',
    destructive: 'Eliminar',
  };

  // Badge — status tones with their canonical example labels (Figma status set).
  readonly badgeTones: { tone: BadgeV2Tone; label: string }[] = [
    { tone: 'neutral', label: 'Borrador' },
    { tone: 'success', label: 'Activo' },
    { tone: 'warning', label: 'Pendiente' },
    { tone: 'critical', label: 'Vencido' },
    { tone: 'info', label: 'En revisión' },
  ];

  readonly simulating = signal(false);

  // Chip — live selection + removable demo state.
  readonly chipSelected = signal(true);
  readonly chipRemovableVisible = signal(true);

  // Tabs — live active index + the panel copy each view reveals.
  readonly tabsActive = signal(0);
  readonly tabPanels: string[] = [
    'Patrimonio total, rentabilidad YTD y asignación por clase de activo.',
    'Detalle de posiciones: renta fija, renta variable y alternativos.',
    'Entradas y salidas previstas para los próximos doce meses.',
    'Contratos, informes y documentación fiscal del cliente.',
  ];

  // Table — data-driven demo. Columns exercise every cell kind; alignment is
  // driven by kind (numeric/monetary right-aligned + tabular figures).
  readonly tableDensities: TableV2Density[] = ['compact', 'default', 'comfortable'];

  readonly tableColumns: TableV2Column[] = [
    { key: 'cliente', label: 'Cliente', kind: 'text', sortable: true },
    { key: 'tipo', label: 'Tipo', kind: 'text' },
    { key: 'posiciones', label: 'Posiciones', kind: 'numeric', sortable: true },
    { key: 'valor', label: 'Valor', kind: 'monetary', sortable: true },
    { key: 'estado', label: 'Estado', kind: 'status', toneKey: 'estadoTone' },
  ];

  readonly tableData: Record<string, unknown>[] = [
    { id: 1, cliente: 'María García', tipo: 'Cartera gestionada', posiciones: 12, valor: '1.240.500 €', estado: 'Activo', estadoTone: 'success' },
    { id: 2, cliente: 'Grupo Inversor Delta', tipo: 'Mandato asesorado', posiciones: 34, valor: '8.905.120 €', estado: 'En revisión', estadoTone: 'info' },
    { id: 3, cliente: 'Fundación Norte', tipo: 'Cartera gestionada', posiciones: 8, valor: '512.000 €', estado: 'Pendiente', estadoTone: 'warning' },
    { id: 4, cliente: 'Javier Ruiz', tipo: 'Plan de pensiones', posiciones: 5, valor: '98.750 €', estado: 'Vencido', estadoTone: 'critical' },
    { id: 5, cliente: 'Sociedad Patrimonial SL', tipo: 'Mandato asesorado', posiciones: 21, valor: '3.410.900 €', estado: 'Borrador', estadoTone: 'neutral' },
  ];

  // Row actions — the locked pattern: Edit inline (primary icon-button) + a ⋯
  // menu with Duplicar / Eliminar (danger). ≤2 inline, 3+ collapses to overflow.
  readonly tableActions: TableV2RowAction[] = [
    { key: 'edit', label: 'Editar', icon: 'edit' },
    { key: 'duplicate', label: 'Duplicar', icon: 'duplicate', overflow: true },
    { key: 'delete', label: 'Eliminar', icon: 'delete', variant: 'danger', overflow: true },
  ];

  readonly tableSort = signal<TableV2SortState | null>(null);
  readonly tableSelected = signal<Record<string, unknown>[]>([]);
  readonly tableLastAction = signal<string>('—');

  /** The table doesn't sort itself; the demo sorts here in reaction to sortChange. */
  readonly tableRows = computed(() => {
    const sort = this.tableSort();
    const rows = [...this.tableData];
    if (!sort) return rows;
    const num = (v: unknown) =>
      typeof v === 'string' ? Number(v.replace(/[^\d,-]/g, '').replace(',', '.')) : Number(v);
    rows.sort((a, b) => {
      const av = a[sort.column];
      const bv = b[sort.column];
      const cmp =
        sort.column === 'cliente'
          ? String(av).localeCompare(String(bv), 'es')
          : num(av) - num(bv);
      return sort.direction === 'asc' ? cmp : -cmp;
    });
    return rows;
  });

  onTableSort(sort: TableV2SortState | null): void {
    this.tableSort.set(sort);
  }

  onTableSelected(rows: Record<string, unknown>[]): void {
    this.tableSelected.set(rows);
  }

  onTableAction(e: { action: TableV2RowAction; row: Record<string, unknown> }): void {
    this.tableLastAction.set(`${e.action.label} · ${String(e.row['cliente'])}`);
  }

  onSimulate(): void {
    if (this.simulating()) {
      return;
    }

    this.simulating.set(true);
    setTimeout(() => this.simulating.set(false), 2000);
  }
}
