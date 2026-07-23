import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';

import {
  BadgeV2Component,
  ButtonV2Component,
  CardV2Component,
  CheckboxV2Component,
  ChipV2Component,
  DialogV2Component,
  DrawerV2Component,
  IconButtonV2Component,
  InputV2Component,
  MenuItemV2Component,
  MenuV2Component,
  MenuDividerV2Component,
  NavbarV2Component,
  NavItemV2Component,
  NavSectionV2Component,
  RadioGroupV2Component,
  RadioV2Component,
  SearchV2Component,
  SegmentedControlV2Component,
  SelectV2Component,
  SidebarV2Component,
  TableApronComponent,
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
  DialogV2CloseReason,
  DialogV2Size,
  DrawerV2CloseReason,
  DrawerV2Size,
  IconButtonV2Size,
  IconButtonV2Variant,
  InputV2Size,
  NavbarV2Action,
  SearchV2Suggestion,
  SegmentedControlV2Option,
  SelectV2Size,
  SelectV2Option,
  TableApronSelectionAction,
  TableApronToken,
  TableV2Column,
  TableV2Density,
  TableV2RowAction,
  TableV2SortState,
} from '@coherence/ui';


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
    DialogV2Component,
    DrawerV2Component,
    IconButtonV2Component,
    TableV2Component,
    InputV2Component,
    MenuItemV2Component,
    MenuV2Component,
    MenuDividerV2Component,
    NavbarV2Component,
    NavItemV2Component,
    NavSectionV2Component,
    SearchV2Component,
    SelectV2Component,
    RadioGroupV2Component,
    RadioV2Component,
    SegmentedControlV2Component,
    SidebarV2Component,
    TableApronComponent,
    TabsV2Component,
    TabV2Component,
    TagV2Component,
    ToggleV2Component,
  ],
  templateUrl: './foundations-modern-workbench.page.html',
  styleUrls: ['./foundations-modern-workbench.page.scss'],
})
export class FoundationsModernWorkbenchPage {
  private readonly destroyRef = inject(DestroyRef);

  // ─── Side index (table of contents) ───
  // Driven off the rendered group titles so the nav stays in sync as groups are
  // added — no hand-maintained list, no querySelector.
  readonly groupTitles = viewChildren<ElementRef<HTMLElement>>('wbGroup');
  readonly sections = signal<string[]>([]);
  readonly activeSection = signal(0);

  constructor() {
    afterNextRender(() => {
      const groups = this.groupTitles();
      this.sections.set(
        groups.map((group) => group.nativeElement.textContent?.trim() ?? ''),
      );

      // Scroll-spy: highlight the group nearest the top of the viewport. The
      // bottom rootMargin biases the "active" pick toward the upper third so the
      // highlight flips as a section's heading reaches the top, not its middle.
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((entry) => entry.isIntersecting);
          if (visible.length === 0) return;
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
          );
          const index = groups.findIndex(
            (group) => group.nativeElement === topmost.target,
          );
          if (index >= 0) this.activeSection.set(index);
        },
        { rootMargin: '0px 0px -70% 0px', threshold: 0 },
      );
      groups.forEach((group) => observer.observe(group.nativeElement));
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  scrollToSection(index: number): void {
    // ElementRef.scrollIntoView is the standard reach here (as in afi-tabs-v2);
    // smoothness is dropped when the user prefers reduced motion.
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.groupTitles()[index]?.nativeElement.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  // Sidebar workbench — collapsed state per demo frame (self-toggling).
  readonly sidebarCollapsedMain = signal(false);
  readonly sidebarCollapsedRail = signal(true);

  // Navbar workbench — echoes the last control the bar emitted, and drives the
  // off-canvas nav drawer opened by the menu toggle (left-anchored drawer-v2
  // hosting afi-sidebar-v2).
  readonly navbarLastAction = signal<NavbarV2Action | null>(null);
  readonly navDrawerOpen = signal(false);

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

  // Segmented control — one selection is always active; count comes from the array.
  readonly segmentedPeriodo: SegmentedControlV2Option[] = [
    { value: 'mensual', label: 'Mensual' },
    { value: 'anual', label: 'Anual' },
  ];
  readonly segmentedVista: SegmentedControlV2Option[] = [
    { value: 'resumen', label: 'Resumen' },
    { value: 'actividad', label: 'Actividad' },
    { value: 'ajustes', label: 'Ajustes' },
  ];
  readonly segmentedEstado: SegmentedControlV2Option[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'activos', label: 'Activos' },
    { value: 'pendientes', label: 'Pendientes' },
    { value: 'archivados', label: 'Archivados' },
  ];
  readonly segmentedFrecuencia: SegmentedControlV2Option[] = [
    { value: 'diario', label: 'Diario' },
    { value: 'semanal', label: 'Semanal', disabled: true },
    { value: 'mensual', label: 'Mensual' },
  ];
  readonly segPeriodo = signal('mensual');
  readonly segVista = signal('resumen');
  readonly segEstado = signal('activos');
  readonly segFrecuencia = signal('diario');

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

  // Dialog — one instance driven by the size buttons; last close reason echoed.
  readonly dialogSizes: DialogV2Size[] = ['sm', 'md', 'lg', 'xl', 'xxl'];
  readonly dialogSize = signal<DialogV2Size>('sm');
  readonly dialogOpen = signal(false);
  readonly dialogClosedReason = signal<string>('—');

  openDialog(size: DialogV2Size): void {
    this.dialogSize.set(size);
    this.dialogOpen.set(true);
  }

  onDialogClose(reason: DialogV2CloseReason): void {
    this.dialogOpen.set(false);
    this.dialogClosedReason.set(reason);
  }

  // Destructive confirm — a delete flow. Tracks whether the item was deleted.
  readonly deleteDialogOpen = signal(false);
  readonly deleteOutcome = signal<string>('—');

  onConfirmDelete(): void {
    this.deleteDialogOpen.set(false);
    this.deleteOutcome.set('Eliminado');
  }

  onCancelDelete(): void {
    this.deleteDialogOpen.set(false);
    this.deleteOutcome.set('Cancelado');
  }

  // Drawer — one instance driven by the size buttons; last close reason echoed.
  readonly drawerSizes: DrawerV2Size[] = ['sm', 'md', 'lg'];
  readonly drawerSize = signal<DrawerV2Size>('sm');
  readonly drawerOpen = signal(false);
  readonly drawerClosedReason = signal<string>('—');

  openDrawer(size: DrawerV2Size): void {
    this.drawerSize.set(size);
    this.drawerOpen.set(true);
  }

  onDrawerClose(reason: DrawerV2CloseReason): void {
    this.drawerOpen.set(false);
    this.drawerClosedReason.set(reason);
  }

  onNavbarAction(action: NavbarV2Action): void {
    this.navbarLastAction.set(action);
    if (action === 'menu') {
      this.navDrawerOpen.set(true);
    }
  }

  // Filter panel — a projected-content example: chip filters + apply/clear footer.
  readonly filterDrawerOpen = signal(false);
  readonly filterOutcome = signal<string>('—');

  // Chip filters are controlled here (single selection set keyed by the unique
  // labels) so clicks toggle and stick — chip-v2's `selected` is a two-way
  // model, so binding it to a constant literal wouldn't reflect interaction.
  readonly statusFilters = ['Activo', 'Pendiente', 'Archivado'];
  readonly categoryFilters = ['Ingreso', 'Gasto', 'Transferencia', 'Ajuste'];
  readonly dateFilters = ['7 días', '30 días', 'Último trimestre', 'Personalizado'];
  readonly selectedFilters = signal<Set<string>>(
    new Set(['Activo', 'Ingreso', 'Gasto', '30 días']),
  );

  toggleFilter(label: string): void {
    this.selectedFilters.update((current) => {
      const next = new Set(current);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  onApplyFilters(): void {
    this.filterDrawerOpen.set(false);
    this.filterOutcome.set('Filtros aplicados');
  }

  onCancelFilters(): void {
    this.filterDrawerOpen.set(false);
    this.filterOutcome.set('Cancelado');
  }

  readonly simulating = signal(false);

  // Chip — live selection + removable demo state.
  readonly chipSelected = signal(true);
  readonly chipRemovableVisible = signal(true);
  // Chip value segment — selected chip carrying an applied filter value; Clear
  // resets both the selection and the value back to the empty "Filter" state.
  readonly chipValueSelected = signal(true);
  readonly chipValue = signal<string | null>('Renta variable');

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

  // ── Apron bulk actions + per-density selection ────────────────────────────────
  // The apron shows on every populated table (not loading / empty). When rows are
  // selected it surfaces a selection chip + these bulk actions as icon buttons.
  readonly bulkActions: TableApronSelectionAction[] = [
    { key: 'delete', label: 'Borrar', icon: 'delete', variant: 'danger' },
  ];

  /** Selection per density table (they share the same rows but track separately). */
  readonly densitySelected = signal<Record<string, Record<string, unknown>[]>>({
    compact: [],
    default: [],
    comfortable: [],
  });

  /** Safe accessor for a density's selection (dodges noUncheckedIndexedAccess). */
  densitySel(density: string): Record<string, unknown>[] {
    return this.densitySelected()[density] ?? [];
  }

  setDensitySelected(density: string, rows: Record<string, unknown>[]): void {
    this.densitySelected.update((map) => ({ ...map, [density]: rows }));
  }

  clearDensitySelection(density: string): void {
    this.densitySelected.update((map) => ({ ...map, [density]: [] }));
  }

  onCarterasBulk(action: TableApronSelectionAction): void {
    this.tableLastAction.set(`${action.label} · ${this.tableSelected().length} carteras`);
    this.onTableSelected([]);
  }

  onDensityBulk(density: string, action: TableApronSelectionAction): void {
    const n = this.densitySel(density).length;
    this.tableLastAction.set(`${action.label} · ${n} carteras (${density})`);
    this.clearDensitySelection(density);
  }

  onSimulate(): void {
    if (this.simulating()) {
      return;
    }

    this.simulating.set(true);
    setTimeout(() => this.simulating.set(false), 2000);
  }

  // ── Table apron — search + single-select status filter + live-count pill ──────
  // The page owns the filter/search state; the table renders the resolved rows
  // and replays the blur-and-fade cascade on every filter change (revealKey);
  // the apron reads out "shown / total" + the active filters as removable tokens.
  readonly orderColumns: TableV2Column[] = [
    { key: 'pedido', label: 'Pedido', kind: 'text' },
    { key: 'cliente', label: 'Cliente', kind: 'text' },
    { key: 'total', label: 'Total', kind: 'monetary' },
    { key: 'estado', label: 'Estado', kind: 'status', toneKey: 'estadoTone' },
  ];

  readonly orderStatusFilters: { key: string; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'nuevo', label: 'Nuevos' },
    { key: 'atrasado', label: 'Atrasados' },
    { key: 'cerrado', label: 'Cerrados' },
  ];

  readonly orderData: Record<string, unknown>[] = [
    { id: '52000', pedido: '#52000', cliente: 'Ava Bennett', total: '2.400,00 €', estado: 'Nuevo', estadoTone: 'info', estadoKey: 'nuevo' },
    { id: '52003', pedido: '#52003', cliente: 'Tessa Foster', total: '3.600,00 €', estado: 'Nuevo', estadoTone: 'info', estadoKey: 'nuevo' },
    { id: '52006', pedido: '#52006', cliente: 'Reed Ellison', total: '750,00 €', estado: 'Atrasado', estadoTone: 'warning', estadoKey: 'atrasado' },
    { id: '52009', pedido: '#52009', cliente: 'Noah Holloway', total: '7.200,00 €', estado: 'Nuevo', estadoTone: 'info', estadoKey: 'nuevo' },
    { id: '52012', pedido: '#52012', cliente: 'Isla Quimby', total: '2.400,00 €', estado: 'Cerrado', estadoTone: 'success', estadoKey: 'cerrado' },
    { id: '52015', pedido: '#52015', cliente: 'Wren Iverson', total: '3.600,00 €', estado: 'Atrasado', estadoTone: 'warning', estadoKey: 'atrasado' },
    { id: '52018', pedido: '#52018', cliente: 'Milo Hartley', total: '750,00 €', estado: 'Cerrado', estadoTone: 'success', estadoKey: 'cerrado' },
    { id: '52021', pedido: '#52021', cliente: 'June Alvarez', total: '7.200,00 €', estado: 'Nuevo', estadoTone: 'info', estadoKey: 'nuevo' },
    { id: '52024', pedido: '#52024', cliente: 'Ava Bennett', total: '2.400,00 €', estado: 'Atrasado', estadoTone: 'warning', estadoKey: 'atrasado' },
    { id: '52027', pedido: '#52027', cliente: 'Tessa Foster', total: '3.600,00 €', estado: 'Cerrado', estadoTone: 'success', estadoKey: 'cerrado' },
    { id: '52030', pedido: '#52030', cliente: 'Reed Ellison', total: '750,00 €', estado: 'Nuevo', estadoTone: 'info', estadoKey: 'nuevo' },
    { id: '52033', pedido: '#52033', cliente: 'Noah Holloway', total: '7.200,00 €', estado: 'Cerrado', estadoTone: 'success', estadoKey: 'cerrado' },
  ];

  readonly orderStatus = signal<string>('todos');
  readonly orderSearch = signal<string>('');

  setOrderStatus(key: string): void {
    this.orderStatus.set(key);
  }

  setOrderSearch(value: string): void {
    this.orderSearch.set(value);
  }

  /** Rows after the status filter + free-text search (the page filters, not the table). */
  readonly visibleOrders = computed(() => {
    const status = this.orderStatus();
    const query = this.orderSearch().trim().toLowerCase();
    return this.orderData.filter((row) => {
      if (status !== 'todos' && row['estadoKey'] !== status) return false;
      if (!query) return true;
      const haystack = `${String(row['cliente'])} ${String(row['pedido'])}`.toLowerCase();
      return haystack.includes(query);
    });
  });

  /** Change signature — any filter change re-keys the rows and replays the reveal. */
  readonly orderRevealKey = computed(() => `${this.orderStatus()}|${this.orderSearch().trim()}`);

  /** Active filters as apron tokens (a selected non-"todos" status + a search term). */
  readonly apronTokens = computed<TableApronToken[]>(() => {
    const tokens: TableApronToken[] = [];
    const status = this.orderStatus();
    if (status !== 'todos') {
      const label = this.orderStatusFilters.find((f) => f.key === status)?.label ?? status;
      tokens.push({ id: 'estado', label, icon: 'filter' });
    }
    const query = this.orderSearch().trim();
    if (query) {
      tokens.push({ id: 'buscar', label: query, icon: 'search' });
    }
    return tokens;
  });

  onApronDismiss(token: TableApronToken): void {
    if (token.id === 'estado') this.orderStatus.set('todos');
    if (token.id === 'buscar') this.orderSearch.set('');
  }

  /** Typeahead preview for afi-search-v2: the current matches, capped, mapped to
   *  suggestion rows (label = cliente, description = pedido · estado, trailing = total). */
  readonly orderSuggestions = computed<SearchV2Suggestion[]>(() => {
    if (!this.orderSearch().trim()) return [];
    return this.visibleOrders()
      .slice(0, 6)
      .map((row) => ({
        id: String(row['id']),
        label: String(row['cliente']),
        description: `${String(row['pedido'])} · ${String(row['estado'])}`,
        trailing: String(row['total']),
      }));
  });
}
