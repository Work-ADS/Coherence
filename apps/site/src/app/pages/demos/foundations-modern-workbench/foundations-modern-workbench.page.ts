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
  TabPanelV2Directive,
  TagV2Component,
  ToggleV2Component,
  provideAfiUiCopy,
} from '@coherence/ui';

import {
  ChartBarComponent,
  LogoComponent,
  NavbarItemV2Component,
  ToastV2Component,
  TopBarComponent,
} from '@coherence/ui';
import type { BarDatum } from '@coherence/ui';

import { PlannerNavbarV2Component } from '../shared/planner-navbar-v2.component';
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

import { HyperTextDirective } from '../../../directives/hyper-text.directive';
import { LanguageService } from '../../../services/language.service';
import { WORKBENCH_COPY, WORKBENCH_UI_CHROME } from './foundations-modern-workbench.copy';

/** A filter option: a stable id for state, a translated label for display. */
interface FilterOption {
  id: string;
  label: string;
}

/**
 * Identity v2 workbench — the foundations-modern proving ground.
 *
 * Shows every variant × size × state grid for the v2 primitives as they land.
 * Throwaway chrome by design: this page is the component moodboard, so styling
 * stays minimal and local.
 *
 * The `data-foundation="modern"` attribute on the root div activates the
 * scoped token mirror; the site chrome around it stays on the legacy foundation
 * on purpose.
 *
 * **Bilingual.** Every string the page renders comes from
 * `foundations-modern-workbench.copy.ts` via the `t()` computed, so the page
 * follows the site language toggle. Component NAMES are the exception — Button,
 * Select, Table apron stay English in both languages and live as literal text in
 * the template, which also keeps the side index stable across a switch. Data
 * fixtures (client names, provinces, amounts) are equally untranslated: they are
 * realistic Spanish specimens, and an "English" province list would be fake data.
 *
 * Anything the user's interaction produces is stored as a KEY, never as resolved
 * text — see `deleteOutcome`, `filterOutcome`, `lastAction`, and the filter Sets.
 * Storing the rendered string would strand it in whichever language was active
 * when it happened, and the page would show mixed languages after a toggle.
 */
@Component({
  selector: 'site-foundations-modern-workbench-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PlannerNavbarV2Component,
    ToastV2Component,
    TopBarComponent,
    LogoComponent,
    NavbarItemV2Component,
    ChartBarComponent,
    SegmentedControlV2Component,
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
    SidebarV2Component,
    TableApronComponent,
    TabsV2Component,
    TabV2Component,
    TabPanelV2Directive,
    TagV2Component,
    ToggleV2Component,
    HyperTextDirective,
  ],
  templateUrl: './foundations-modern-workbench.page.html',
  styleUrls: ['./foundations-modern-workbench.page.scss'],
  // The primitives' own chrome (× buttons, "Cargando…", select-all) follows the
  // page language through one provider instead of ~50 per-instance bindings.
  providers: [
    provideAfiUiCopy(() => {
      const language = inject(LanguageService);
      return computed(() => WORKBENCH_UI_CHROME[language.lang()]);
    }),
  ],
})
export class FoundationsModernWorkbenchPage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly language = inject(LanguageService);

  /** Every rendered string resolves through here. */
  readonly t = computed(() => WORKBENCH_COPY[this.language.lang()]);

  /**
   * The active language, bound to `[siteHyperTextReplayOn]` on the page title so
   * it replays the decode when the user flips ES/EN.
   *
   * The page title only. The component titles (Button, Select, …) are the same
   * word in both languages, so decoding them would scramble text that never
   * changes — motion announcing an update that did not happen.
   */
  readonly lang = this.language.lang;

  // ─── Side index (table of contents) ───
  // Driven off the rendered group titles so the nav stays in sync as groups are
  // added — no hand-maintained list, no querySelector. Those titles are component
  // names, so they never change with the language and this snapshot stays valid.
  readonly groupTitles = viewChildren<ElementRef<HTMLElement>>('wbGroup');

  /** Frame widths for the navbar breakpoint specimens. */
  readonly navbarBreakpoints = computed(() => [
    { label: this.t().bpWide, width: '100%' },
    { label: this.t().bpMedium, width: '52rem' },
    { label: this.t().bpNarrow, width: '30rem' },
  ]);

  /** Language options for the site-bar specimen (display-only). */
  readonly langOptions = [
    { value: 'es', label: 'ES' },
    { value: 'en', label: 'EN' },
  ];

  /**
   * Net worth per year — the mixed-sign specimen. Values in thousands so the
   * direct labels stay short; three years close below zero, which is what puts
   * the zero rule and the below-zero red to work.
   */
  readonly patrimonioData: BarDatum[] = [
    { key: '2019', value: 412 },
    { key: '2020', value: -186 },
    { key: '2021', value: 298 },
    { key: '2022', value: -94 },
    { key: '2023', value: 341 },
    { key: '2024', value: -27 },
    { key: '2025', value: 587 },
  ];

  /**
   * Mean of the series, so the reference line always describes the data actually
   * plotted rather than a number pasted in beside it.
   */
  readonly patrimonioAverage =
    this.patrimonioData.reduce((sum, d) => sum + d.value, 0) / this.patrimonioData.length;

  /**
   * Wealth by asset class — the horizontal specimen. Long category names and no
   * time dimension, which is exactly when Visa calls for horizontal bars.
   */
  readonly breakdownData = computed<BarDatum[]>(() => [
    { key: this.t().equities, value: 1284 },
    { key: this.t().realEstate, value: 862 },
    { key: this.t().fixedIncome, value: 549 },
    { key: this.t().alternatives, value: 218 },
    { key: this.t().cash, value: 143 },
  ]);

  /** Mirrors the live site's destinations (display-only here). */
  readonly siteNavItems = computed(() => [
    { label: this.t().navDesignAtAfi, selected: true },
    { label: this.t().navLab, selected: false },
    { label: this.t().navDemos, selected: false },
  ]);

  // ── Toast demo state (the consumer owns visibility + timer) ───────────────
  readonly toastVisible = signal(false);
  private readonly toastKind = signal<'undo' | 'shortcut' | 'plain'>('undo');
  readonly toastShowUndo = signal(true);
  readonly toastShortcut = signal<string[]>([]);
  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly toastMessage = computed(() =>
    this.toastKind() === 'plain' ? this.t().toastReportReady : this.t().toastStatusChanged,
  );

  showToastDemo(kind: 'undo' | 'shortcut' | 'plain'): void {
    this.toastKind.set(kind);
    this.toastShowUndo.set(kind !== 'plain');
    this.toastShortcut.set(kind === 'shortcut' ? ['⌘', 'Z'] : []);
    this.toastVisible.set(true);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible.set(false), 5000);
  }

  hideToastDemo(): void {
    clearTimeout(this.toastTimer);
    this.toastVisible.set(false);
  }

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

  readonly selectOptions = computed<SelectV2Option[]>(() => [
    { value: 'sl', label: this.t().companySl },
    { value: 'sa', label: this.t().companySa },
    { value: 'slu', label: this.t().companySlu },
    { value: 'coop', label: this.t().companyCoop },
    { value: 'civil', label: this.t().companyCivil },
    { value: 'com', label: this.t().companyCb, disabled: true },
  ]);

  // Spanish provinces — a data fixture, not copy. Untranslated on purpose: a
  // real province list IS the specimen (see the copy file's header).
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
  readonly segmentedPeriodo = computed<SegmentedControlV2Option[]>(() => [
    { value: 'mensual', label: this.t().monthly },
    { value: 'anual', label: this.t().annual },
  ]);
  readonly segmentedVista = computed<SegmentedControlV2Option[]>(() => [
    { value: 'resumen', label: this.t().summary },
    { value: 'actividad', label: this.t().activity },
    { value: 'ajustes', label: this.t().settings },
  ]);
  readonly segmentedEstado = computed<SegmentedControlV2Option[]>(() => [
    { value: 'todos', label: this.t().all },
    { value: 'activos', label: this.t().active },
    { value: 'pendientes', label: this.t().pending },
    { value: 'archivados', label: this.t().archived },
  ]);
  readonly segmentedFrecuencia = computed<SegmentedControlV2Option[]>(() => [
    { value: 'diario', label: this.t().daily },
    { value: 'semanal', label: this.t().weekly, disabled: true },
    { value: 'mensual', label: this.t().monthly },
  ]);
  readonly segPeriodo = signal('mensual');
  readonly segVista = signal('resumen');
  readonly segEstado = signal('activos');
  readonly segFrecuencia = signal('diario');

  readonly labels = computed<Record<ButtonV2Variant, string>>(() => ({
    primary: this.t().btnPrimary,
    secondary: this.t().btnSecondary,
    ghost: this.t().btnGhost,
    destructive: this.t().btnDestructive,
  }));

  // Badge — status tones with their canonical example labels (Figma status set).
  readonly badgeTones = computed<{ tone: BadgeV2Tone; label: string }[]>(() => [
    { tone: 'neutral', label: this.t().draft },
    { tone: 'success', label: this.t().active },
    { tone: 'warning', label: this.t().pending },
    { tone: 'critical', label: this.t().overdue },
    { tone: 'info', label: this.t().inReview },
  ]);

  // Dialog — one instance driven by the size buttons; last close reason echoed.
  // The reason is an API value ('button' / 'backdrop' / 'escape'), so it is shown
  // verbatim in both languages rather than translated.
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

  // Destructive confirm — a delete flow. Stores the OUTCOME KEY, not its text,
  // so the echo follows a later language switch.
  readonly deleteDialogOpen = signal(false);
  private readonly deleteOutcomeKey = signal<'deleted' | 'cancelled' | null>(null);
  readonly deleteOutcome = computed(() => this.outcomeText(this.deleteOutcomeKey()));

  onConfirmDelete(): void {
    this.deleteDialogOpen.set(false);
    this.deleteOutcomeKey.set('deleted');
  }

  onCancelDelete(): void {
    this.deleteDialogOpen.set(false);
    this.deleteOutcomeKey.set('cancelled');
  }

  /** Resolve an outcome key to text in the active language. */
  private outcomeText(key: 'deleted' | 'cancelled' | 'applied' | null): string {
    if (key === 'deleted') return this.t().deleted;
    if (key === 'cancelled') return this.t().cancelled;
    if (key === 'applied') return this.t().filtersApplied;
    return this.t().none;
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
  private readonly filterOutcomeKey = signal<'applied' | 'cancelled' | null>(null);
  readonly filterOutcome = computed(() => this.outcomeText(this.filterOutcomeKey()));

  // Chip filters are controlled here so clicks toggle and stick — chip-v2's
  // `selected` is a two-way model, so binding it to a constant wouldn't reflect
  // interaction. The Set holds stable IDS, never labels: keying on the visible
  // text would drop every selection the moment the language changed.
  readonly statusFilters = computed<FilterOption[]>(() => [
    { id: 'active', label: this.t().active },
    { id: 'pending', label: this.t().pending },
    { id: 'archived', label: this.t().archived },
  ]);
  readonly categoryFilters = computed<FilterOption[]>(() => [
    { id: 'income', label: this.t().filterIncome },
    { id: 'expense', label: this.t().filterExpense },
    { id: 'transfer', label: this.t().filterTransfer },
    { id: 'adjustment', label: this.t().filterAdjustment },
  ]);
  readonly dateFilters = computed<FilterOption[]>(() => [
    { id: '7d', label: this.t().filter7Days },
    { id: '30d', label: this.t().filter30Days },
    { id: 'quarter', label: this.t().filterLastQuarter },
    { id: 'custom', label: this.t().filterCustom },
  ]);
  readonly selectedFilters = signal<Set<string>>(
    new Set(['active', 'income', 'expense', '30d']),
  );

  toggleFilter(id: string): void {
    this.selectedFilters.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  onApplyFilters(): void {
    this.filterDrawerOpen.set(false);
    this.filterOutcomeKey.set('applied');
  }

  onCancelFilters(): void {
    this.filterDrawerOpen.set(false);
    this.filterOutcomeKey.set('cancelled');
  }

  readonly simulating = signal(false);

  // Chip — live selection + removable demo state.
  readonly chipSelected = signal(true);
  readonly chipRemovableVisible = signal(true);
  // Chip value segment — selected chip carrying an applied filter value; Clear
  // resets both the selection and the value back to the empty state.
  readonly chipValueSelected = signal(true);
  private readonly chipValueCleared = signal(false);
  readonly chipValue = computed(() =>
    this.chipValueCleared() ? null : this.t().equities,
  );

  clearChipValue(): void {
    this.chipValueCleared.set(true);
  }

  // Tabs — live active index + the panel copy each view reveals.
  readonly tabsActive = signal(0);
  readonly tabPanels = computed(() => [
    this.t().tabPanelSummary,
    this.t().tabPanelPortfolio,
    this.t().tabPanelCashFlow,
    this.t().tabPanelDocuments,
  ]);

  /** Safe accessor for the active panel's copy (dodges noUncheckedIndexedAccess). */
  readonly activeTabPanel = computed(() => this.tabPanels()[this.tabsActive()] ?? '');

  // Table — data-driven demo. Columns exercise every cell kind; alignment is
  // driven by kind (numeric/monetary right-aligned + tabular figures).
  readonly tableDensities: TableV2Density[] = ['compact', 'default', 'comfortable'];

  readonly tableColumns = computed<TableV2Column[]>(() => [
    { key: 'cliente', label: this.t().colClient, kind: 'text', sortable: true },
    { key: 'tipo', label: this.t().colType, kind: 'text' },
    { key: 'posiciones', label: this.t().colPositions, kind: 'numeric', sortable: true },
    { key: 'valor', label: this.t().colValue, kind: 'monetary', sortable: true },
    { key: 'estado', label: this.t().colStatus, kind: 'status', toneKey: 'estadoTone' },
  ]);

  /**
   * Portfolio rows. Client names and amounts are fixtures (untranslated); the
   * status cell renders from `estadoKey` through the copy layer so the badge
   * follows the language like everything else.
   */
  private readonly portfolioFixtures = [
    { id: 1, cliente: 'María García', tipoKey: 'managed', posiciones: 12, valor: '1.240.500 €', estadoKey: 'active', estadoTone: 'success' },
    { id: 2, cliente: 'Grupo Inversor Delta', tipoKey: 'advisory', posiciones: 34, valor: '8.905.120 €', estadoKey: 'inReview', estadoTone: 'info' },
    { id: 3, cliente: 'Fundación Norte', tipoKey: 'managed', posiciones: 8, valor: '512.000 €', estadoKey: 'pending', estadoTone: 'warning' },
    { id: 4, cliente: 'Javier Ruiz', tipoKey: 'pension', posiciones: 5, valor: '98.750 €', estadoKey: 'overdue', estadoTone: 'critical' },
    { id: 5, cliente: 'Sociedad Patrimonial SL', tipoKey: 'advisory', posiciones: 21, valor: '3.410.900 €', estadoKey: 'draft', estadoTone: 'neutral' },
  ];

  private portfolioType(key: string): string {
    const lang = this.language.lang();
    if (key === 'managed') return lang === 'en' ? 'Managed portfolio' : 'Cartera gestionada';
    if (key === 'advisory') return lang === 'en' ? 'Advisory mandate' : 'Mandato asesorado';
    return lang === 'en' ? 'Pension plan' : 'Plan de pensiones';
  }

  private portfolioStatus(key: string): string {
    const copy = this.t();
    if (key === 'active') return copy.active;
    if (key === 'inReview') return copy.inReview;
    if (key === 'pending') return copy.pending;
    if (key === 'overdue') return copy.overdue;
    return copy.draft;
  }

  readonly tableData = computed<Record<string, unknown>[]>(() =>
    this.portfolioFixtures.map((row) => ({
      ...row,
      tipo: this.portfolioType(row.tipoKey),
      estado: this.portfolioStatus(row.estadoKey),
    })),
  );

  // Row actions — the locked pattern: Edit inline (primary icon-button) + a ⋯
  // menu with Duplicate / Delete (danger). ≤2 inline, 3+ collapses to overflow.
  readonly tableActions = computed<TableV2RowAction[]>(() => [
    { key: 'edit', label: this.t().edit, icon: 'edit' },
    { key: 'duplicate', label: this.t().duplicate, icon: 'duplicate', overflow: true },
    { key: 'delete', label: this.t().remove, icon: 'delete', variant: 'danger', overflow: true },
  ]);

  readonly tableSort = signal<TableV2SortState | null>(null);
  readonly tableSelected = signal<Record<string, unknown>[]>([]);

  /**
   * Last row/bulk action, held as a key plus its detail string so the echo
   * re-renders in the active language instead of freezing the label that was
   * current when it happened.
   */
  private readonly lastAction = signal<{ key: string; detail: string } | null>(null);

  readonly tableLastAction = computed(() => {
    const entry = this.lastAction();
    if (!entry) return this.t().none;
    const copy = this.t();
    const label =
      entry.key === 'edit'
        ? copy.edit
        : entry.key === 'duplicate'
          ? copy.duplicate
          : copy.remove;
    return `${label} · ${entry.detail}`;
  });

  /** The table doesn't sort itself; the demo sorts here in reaction to sortChange. */
  readonly tableRows = computed(() => {
    const sort = this.tableSort();
    const rows = [...this.tableData()];
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
    this.lastAction.set({ key: e.action.key, detail: String(e.row['cliente']) });
  }

  // ── Apron bulk actions + per-density selection ────────────────────────────────
  // The apron shows on every populated table (not loading / empty). When rows are
  // selected it surfaces a selection chip + these bulk actions as icon buttons.
  readonly bulkActions = computed<TableApronSelectionAction[]>(() => [
    { key: 'delete', label: this.t().remove, icon: 'delete', variant: 'danger' },
  ]);

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
    this.lastAction.set({
      key: action.key,
      detail: `${this.tableSelected().length} ${this.t().apronPortfolioPlural}`,
    });
    this.onTableSelected([]);
  }

  onDensityBulk(density: string, action: TableApronSelectionAction): void {
    const n = this.densitySel(density).length;
    this.lastAction.set({
      key: action.key,
      detail: `${n} ${this.t().apronPortfolioPlural} (${density})`,
    });
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
  readonly orderColumns = computed<TableV2Column[]>(() => [
    { key: 'pedido', label: this.t().colOrder, kind: 'text' },
    { key: 'cliente', label: this.t().colClient, kind: 'text' },
    { key: 'total', label: this.t().colTotal, kind: 'monetary' },
    { key: 'estado', label: this.t().colStatus, kind: 'status', toneKey: 'estadoTone' },
  ]);

  readonly orderStatusFilters = computed<{ key: string; label: string }[]>(() => [
    { key: 'todos', label: this.t().all },
    { key: 'nuevo', label: this.t().filterNew },
    { key: 'atrasado', label: this.t().filterLate },
    { key: 'cerrado', label: this.t().filterClosed },
  ]);

  /** Order rows. Names and amounts are fixtures; the status cell resolves via copy. */
  private readonly orderFixtures = [
    { id: '52000', pedido: '#52000', cliente: 'Ava Bennett', total: '2.400,00 €', estadoTone: 'info', estadoKey: 'nuevo' },
    { id: '52003', pedido: '#52003', cliente: 'Tessa Foster', total: '3.600,00 €', estadoTone: 'info', estadoKey: 'nuevo' },
    { id: '52006', pedido: '#52006', cliente: 'Reed Ellison', total: '750,00 €', estadoTone: 'warning', estadoKey: 'atrasado' },
    { id: '52009', pedido: '#52009', cliente: 'Noah Holloway', total: '7.200,00 €', estadoTone: 'info', estadoKey: 'nuevo' },
    { id: '52012', pedido: '#52012', cliente: 'Isla Quimby', total: '2.400,00 €', estadoTone: 'success', estadoKey: 'cerrado' },
    { id: '52015', pedido: '#52015', cliente: 'Wren Iverson', total: '3.600,00 €', estadoTone: 'warning', estadoKey: 'atrasado' },
    { id: '52018', pedido: '#52018', cliente: 'Milo Hartley', total: '750,00 €', estadoTone: 'success', estadoKey: 'cerrado' },
    { id: '52021', pedido: '#52021', cliente: 'June Alvarez', total: '7.200,00 €', estadoTone: 'info', estadoKey: 'nuevo' },
    { id: '52024', pedido: '#52024', cliente: 'Ava Bennett', total: '2.400,00 €', estadoTone: 'warning', estadoKey: 'atrasado' },
    { id: '52027', pedido: '#52027', cliente: 'Tessa Foster', total: '3.600,00 €', estadoTone: 'success', estadoKey: 'cerrado' },
    { id: '52030', pedido: '#52030', cliente: 'Reed Ellison', total: '750,00 €', estadoTone: 'info', estadoKey: 'nuevo' },
    { id: '52033', pedido: '#52033', cliente: 'Noah Holloway', total: '7.200,00 €', estadoTone: 'success', estadoKey: 'cerrado' },
  ];

  private orderStatusLabel(key: string): string {
    const copy = this.t();
    if (key === 'nuevo') return copy.filterNew;
    if (key === 'atrasado') return copy.filterLate;
    return copy.filterClosed;
  }

  readonly orderData = computed<Record<string, unknown>[]>(() =>
    this.orderFixtures.map((row) => ({
      ...row,
      estado: this.orderStatusLabel(row.estadoKey),
    })),
  );

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
    return this.orderData().filter((row) => {
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
      const label = this.orderStatusFilters().find((f) => f.key === status)?.label ?? status;
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
   *  suggestion rows (label = client, description = order · status, trailing = total). */
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
