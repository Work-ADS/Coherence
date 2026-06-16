import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { BadgeComponent } from '../badge';
import { CheckboxComponent } from '../checkbox';
import { MenuComponent } from '../menu/menu.component';
import { MenuDividerComponent } from '../menu/menu-divider.component';
import { MenuItemComponent } from '../menu/menu-item.component';
import type {
  TableCellTemplateMap,
  TableCellTone,
  TableCellTplCtx,
  TableColumn,
  TableRowAction,
  TableSortState,
} from './table.types';
import type { TableActionsReveal, TableDensity } from './table.variants';

/**
 * Data table primitive.
 *
 * Semantic HTML table with sortable columns, row selection, empty/loading
 * states. Consumers pass pre-sorted `rows` — Table does not sort internally.
 *
 * BEM + DS tokens (no Tailwind for visual styling).
 */
@Component({
  selector: 'afi-table',
  standalone: true,
  imports: [
    BadgeComponent,
    CheckboxComponent,
    MenuComponent,
    MenuDividerComponent,
    MenuItemComponent,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  readonly columns = input<TableColumn[]>([]);
  readonly rows = input<Record<string, unknown>[]>([]);
  readonly trackByKey = input<string>('id');
  readonly selected = input<Record<string, unknown>[]>([]);
  readonly selectable = input<boolean>(false);
  readonly sortBy = input<TableSortState | null>(null);
  readonly loading = input<boolean>(false);
  readonly emptyText = input<string>('Sin datos');
  readonly rowHoverable = input<boolean>(true);
  readonly density = input<TableDensity>('compact');
  readonly rowActions = input<TableRowAction[]>([]);
  /**
   * When + how trailing row actions reveal. See `TableActionsReveal` JSDoc
   * for the three modes. Default `hover` was locked 2026-05-28 (team
   * decision — Opción 1 won: 0% opacity at rest, full on row hover. Cleanest
   * visual register, Notion / Granola convention). `soft` + `always` remain
   * available as opt-in overrides for denser / kiosk contexts.
   */
  readonly actionsReveal = input<TableActionsReveal>('hover');
  /**
   * Row whose `trackByKey` matches this value gets a transient highlight
   * (BEM modifier `afi-table__row--highlighted`). Consumers wire this to
   * an external "current selection" signal — e.g. inspect-click on a doc
   * page's preview area surfaces the matching token row.
   */
  readonly highlightedRowKey = input<unknown>(null);

  /**
   * Currently-expanded row keys (consumer-managed, mirrors `selected`).
   * A row is expandable when it carries `children: [...]` OR when
   * `expandDetailTpl` is set on the table. Click on the chevron toggles
   * the row's key in this array; the table emits the new array via
   * `expandedKeysChange`.
   */
  readonly expandedKeys = input<unknown[]>([]);

  /**
   * Free-form detail template for the `expand` variant — rendered below
   * the row when no `children` are present. Context: `$implicit` is the
   * row data, so the template can read row fields via `let-row`.
   *
   * Mutually exclusive with `children` mode per row: if a row has
   * `children`, children win and the template is ignored for that row.
   */
  readonly expandDetailTpl = input<TemplateRef<{ $implicit: Record<string, unknown> }> | null>(
    null,
  );

  /**
   * Per-column custom cell templates, keyed by `TableColumn.key`. When a
   * column's key has an entry here, the row cell renders the projected
   * template instead of the default text / badge cell. Context: `$implicit`
   * + named `row` + named `col` (so `let-row` / `let-col="col"` both work).
   *
   * Use case (Richard 2026-06-16, Optimización del asset allocation
   * Step 2): inline `afi-switch` + conditional `afi-input` per row, so
   * "Usar todo el activo" stays inside the table rhythm instead of forking
   * to a bespoke list. Replaces the prior workaround of pre-formatting
   * cell strings.
   */
  readonly cellTemplates = input<TableCellTemplateMap | null>(null);

  readonly selectedChange = output<Record<string, unknown>[]>();
  readonly sortChange = output<TableSortState | null>();
  readonly rowClicked = output<{
    row: Record<string, unknown>;
    event: MouseEvent;
  }>();
  readonly rowActionClicked = output<{
    action: TableRowAction;
    row: Record<string, unknown>;
    event: MouseEvent;
  }>();
  readonly expandedKeysChange = output<unknown[]>();

  readonly skeletonRows = [0, 1, 2, 3, 4];

  readonly visibleColumns = computed(() => this.columns().filter((c) => !c.hidden));

  /**
   * True if the trailing-actions column must be rendered at all. Considers
   * both the table-level default and any per-row `actions` overrides — if
   * a single row has `actions: [...]` even when the default is empty, the
   * column has to exist so cells line up. Children are not scanned here
   * (column presence is decided up front); they reuse the same column.
   */
  readonly hasRowActions = computed(() => {
    if (this.rowActions().length > 0) return true;
    return this.rows().some((row) => {
      const a = row['actions'];
      return Array.isArray(a) && a.length > 0;
    });
  });

  /**
   * Row actions split by `overflow` flag. Inline actions render as buttons
   * in the trailing cell; overflow actions live inside the `⋯` menu.
   * Computed so a re-shuffle of the input array doesn't desync the two.
   *
   * Design rule (Richard 2026-06-10): a 1- or 2-action set is ALWAYS
   * rendered inline — collapsing two icons into a `⋯` menu is friction
   * with no payoff. Consumers can still pass `overflow: true` on
   * individual actions; the flag is honored only once the total action
   * count crosses 3. `resolveActions()` normalizes this before any
   * inline/overflow split.
   */
  private resolveActions(actions: TableRowAction[]): TableRowAction[] {
    if (actions.length <= 2) {
      return actions.map((a) => (a.overflow ? { ...a, overflow: false } : a));
    }
    return actions;
  }

  readonly inlineActions = computed(() =>
    this.resolveActions(this.rowActions()).filter((a) => !a.overflow),
  );
  readonly overflowActions = computed(() =>
    this.resolveActions(this.rowActions()).filter((a) => !!a.overflow),
  );
  readonly hasOverflowActions = computed(() => this.overflowActions().length > 0);

  /**
   * Overflow actions split into the two groups the menu renders: standard
   * (default variant) above the divider, danger below. The split is done
   * here rather than inline in the template because `@if` inside `@for`
   * with content projection (`<afi-menu-item>` inside `<afi-menu>`'s
   * `<ng-content>`) was inconsistently picking up dynamically-emitted
   * children — two flat `@for` loops with the divider between is robust.
   */
  readonly overflowStandardActions = computed(() =>
    this.overflowActions().filter((a) => a.variant !== 'danger'),
  );
  readonly overflowDangerActions = computed(() =>
    this.overflowActions().filter((a) => a.variant === 'danger'),
  );
  readonly hasOverflowDivider = computed(
    () => this.overflowStandardActions().length > 0 && this.overflowDangerActions().length > 0,
  );

  /**
   * Single-source-of-truth for which row's overflow menu is open. Holds
   * the row's `trackByKey` value (or null when closed). Only one menu open
   * at a time — clicking the trigger on a different row closes the previous
   * one. Matches the convention in the patrimonial reference + Notion.
   */
  private readonly openMenuRowKey = signal<unknown>(null);

  /**
   * The actual DOM element the menu anchors to. Captured from
   * `event.currentTarget` in `toggleMenu` so positioning is exact — using
   * a template reference variable through `*ngTemplateOutlet` (the prior
   * approach) was returning the wrong button across @for iterations.
   * Cleared on close so the menu doesn't hold a stale element ref.
   */
  protected readonly menuAnchor = signal<HTMLElement | null>(null);

  /**
   * Class string on the `<table>` element. Picks up the actions-reveal
   * modifier (`afi-table--actions-hover` / `--actions-soft`) and the
   * grouped-header modifier (`afi-table--with-groups`) so the SCSS can
   * scope tint + divider rules without touching individual cells.
   */
  readonly tableClasses = computed(() => {
    const reveal = this.actionsReveal();
    const parts = ['afi-table'];
    if (reveal !== 'always') parts.push(`afi-table--actions-${reveal}`);
    if (this.hasHeaderGroups()) parts.push('afi-table--with-groups');
    return parts.join(' ');
  });

  /**
   * Runs of consecutive columns that share the same `group` key. Used to
   * render the optional second `<thead>` row of group labels. Columns
   * without a `group` produce a placeholder run with `label === null`
   * (no visible label, but the colspan keeps cell alignment).
   *
   * The first column in each run owns the `groupLabel`; subsequent
   * columns in the same group can omit it.
   */
  readonly headerGroups = computed(() => {
    const cols = this.visibleColumns();
    if (!cols.some((c) => c.group)) return [] as { label: string | null; span: number }[];
    const runs: { label: string | null; span: number }[] = [];
    let currentKey: string | null | undefined = undefined;
    let currentLabel: string | null = null;
    let currentSpan = 0;
    for (const c of cols) {
      const key = c.group ?? null;
      if (currentKey === undefined) {
        currentKey = key;
        currentLabel = c.groupLabel ?? null;
        currentSpan = 1;
        continue;
      }
      if (key === currentKey) {
        currentSpan++;
      } else {
        runs.push({ label: currentLabel, span: currentSpan });
        currentKey = key;
        currentLabel = c.groupLabel ?? null;
        currentSpan = 1;
      }
    }
    if (currentKey !== undefined) runs.push({ label: currentLabel, span: currentSpan });
    return runs;
  });

  readonly hasHeaderGroups = computed(() => this.headerGroups().length > 0);

  readonly totalColumns = computed(
    () =>
      this.visibleColumns().length + (this.selectable() ? 1 : 0) + (this.hasRowActions() ? 1 : 0),
  );

  readonly allSelected = computed(() => {
    const r = this.rows();
    const s = this.selected();
    return r.length > 0 && s.length === r.length;
  });

  readonly someSelected = computed(() => {
    const s = this.selected();
    return s.length > 0 && !this.allSelected();
  });

  trackKey(row: Record<string, unknown>): unknown {
    return row[this.trackByKey()];
  }

  // ── Expand variant helpers (rowActivation='expand') ──────────────────
  //
  // Per-row computation rather than table-level computed signals because
  // the `actions` / `children` magic keys live on individual rows. These
  // methods are called from the template inside the `@for` loop. Small
  // tables: fine. Large tables (>1000 rows): consider memoization later.

  hasChildren(row: Record<string, unknown>): boolean {
    const c = row['children'];
    return Array.isArray(c) && c.length > 0;
  }

  childrenOf(row: Record<string, unknown>): Record<string, unknown>[] {
    const c = row['children'];
    return Array.isArray(c) ? (c as Record<string, unknown>[]) : [];
  }

  hasExpansion(row: Record<string, unknown>): boolean {
    return this.hasChildren(row) || !!this.expandDetailTpl();
  }

  isExpanded(row: Record<string, unknown>): boolean {
    const key = row[this.trackByKey()];
    return this.expandedKeys().includes(key);
  }

  toggleExpand(row: Record<string, unknown>, event: MouseEvent): void {
    event.stopPropagation();
    const key = row[this.trackByKey()];
    const current = this.expandedKeys();
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    this.expandedKeysChange.emit(next);
  }

  /**
   * Resolve a row's effective action set: per-row `actions` override if
   * present (including empty array to hide), else fall back to the
   * table-level `[rowActions]` input.
   */
  actionsFor(row: Record<string, unknown>): TableRowAction[] {
    const own = row['actions'];
    const raw = Array.isArray(own) ? (own as TableRowAction[]) : this.rowActions();
    // Apply the ≤2-actions-always-inline rule per-row too, so a row-level
    // override behaves identically to the table-level input.
    return this.resolveActions(raw);
  }

  inlineActionsFor(row: Record<string, unknown>): TableRowAction[] {
    return this.actionsFor(row).filter((a) => !a.overflow);
  }

  overflowActionsFor(row: Record<string, unknown>): TableRowAction[] {
    return this.actionsFor(row).filter((a) => !!a.overflow);
  }

  overflowStandardActionsFor(row: Record<string, unknown>): TableRowAction[] {
    return this.overflowActionsFor(row).filter((a) => a.variant !== 'danger');
  }

  overflowDangerActionsFor(row: Record<string, unknown>): TableRowAction[] {
    return this.overflowActionsFor(row).filter((a) => a.variant === 'danger');
  }

  hasOverflowDividerFor(row: Record<string, unknown>): boolean {
    return (
      this.overflowStandardActionsFor(row).length > 0 &&
      this.overflowDangerActionsFor(row).length > 0
    );
  }

  hasInlineActionsFor(row: Record<string, unknown>): boolean {
    return this.inlineActionsFor(row).length > 0;
  }

  hasOverflowActionsFor(row: Record<string, unknown>): boolean {
    return this.overflowActionsFor(row).length > 0;
  }

  isSelected(row: Record<string, unknown>): boolean {
    const key = this.trackByKey();
    return this.selected().some((s) => s[key] === row[key]);
  }

  headerCellClasses(col: TableColumn): string {
    const align =
      col.align === 'end'
        ? 'afi-table__th--end'
        : col.align === 'center'
          ? 'afi-table__th--center'
          : 'afi-table__th--start';
    return ['afi-table__th', align, col.sortable ? 'afi-table__th--sortable' : '']
      .filter(Boolean)
      .join(' ');
  }

  cellClasses(col: TableColumn, row: Record<string, unknown> | null = null): string {
    const align =
      col.align === 'end'
        ? 'afi-table__td--end'
        : col.align === 'center'
          ? 'afi-table__td--center'
          : 'afi-table__td--start';
    const tone = this.toneFor(col, row);
    return [
      'afi-table__td',
      align,
      col.emphasis ? 'afi-table__td--emphasis' : '',
      tone ? `afi-table__td--tone-${tone}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private toneFor(col: TableColumn, row: Record<string, unknown> | null): TableCellTone | null {
    if (!col.toneKey || !row) return null;
    const v = row[col.toneKey];
    if (
      v === 'success' ||
      v === 'warning' ||
      v === 'danger' ||
      v === 'neutral' ||
      v === 'info'
    ) {
      return v;
    }
    return null;
  }

  actionClasses(action: TableRowAction): string {
    return [
      'afi-table__action',
      action.icon ? 'afi-table__action--icon' : '',
      action.variant === 'danger' ? 'afi-table__action--danger' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  rowClasses(
    selected: boolean,
    highlighted: boolean,
    isChild = false,
    muted = false,
  ): string {
    return [
      'afi-table__row',
      `afi-table__row--${this.density()}`,
      this.rowHoverable() ? 'afi-table__row--hoverable' : '',
      selected ? 'afi-table__row--selected' : '',
      highlighted ? 'afi-table__row--highlighted' : '',
      isChild ? 'afi-table__row--child' : '',
      muted ? 'afi-table__row--muted' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  isMuted(row: Record<string, unknown>): boolean {
    return row['muted'] === true;
  }

  isHighlighted(row: Record<string, unknown>): boolean {
    const key = this.highlightedRowKey();
    if (key === null || key === undefined) return false;
    return row[this.trackByKey()] === key;
  }

  ariaSort(columnKey: string): string {
    const sort = this.sortBy();
    if (!sort || sort.column !== columnKey) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  cellText(row: Record<string, unknown>, col: TableColumn): string {
    const value = row[col.key];
    return value === null || value === undefined ? '' : String(value);
  }

  cellTemplateFor(col: TableColumn): TemplateRef<TableCellTplCtx> | null {
    const map = this.cellTemplates();
    return map ? (map[col.key] ?? null) : null;
  }

  onSort(columnKey: string): void {
    const current = this.sortBy();
    if (!current || current.column !== columnKey) {
      this.sortChange.emit({ column: columnKey, direction: 'asc' });
    } else if (current.direction === 'asc') {
      this.sortChange.emit({ column: columnKey, direction: 'desc' });
    } else {
      this.sortChange.emit(null);
    }
  }

  toggleAll(checked: boolean): void {
    this.selectedChange.emit(checked ? [...this.rows()] : []);
  }

  toggleRow(row: Record<string, unknown>, checked: boolean): void {
    const key = this.trackByKey();
    if (checked) {
      this.selectedChange.emit([...this.selected(), row]);
    } else {
      this.selectedChange.emit(this.selected().filter((s) => s[key] !== row[key]));
    }
  }

  onRowClick(row: Record<string, unknown>, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('afi-checkbox') || target.closest('button') || target.closest('a')) return;
    this.rowClicked.emit({ row, event });
  }

  onRowAction(action: TableRowAction, row: Record<string, unknown>, event: MouseEvent): void {
    event.stopPropagation();
    this.rowActionClicked.emit({ action, row, event });
  }

  // ── Overflow menu state helpers ─────────────────────────────────────────
  isMenuOpen(row: Record<string, unknown>): boolean {
    return this.openMenuRowKey() === row[this.trackByKey()];
  }

  toggleMenu(row: Record<string, unknown>, event: MouseEvent): void {
    event.stopPropagation();
    const key = row[this.trackByKey()];
    const willOpen = this.openMenuRowKey() !== key;
    this.openMenuRowKey.set(willOpen ? key : null);
    // Capture the trigger button itself for accurate anchored positioning.
    // event.currentTarget is the `<button>` the listener was attached to —
    // always the exact button across @for iterations / template outlets.
    this.menuAnchor.set(willOpen ? (event.currentTarget as HTMLElement) : null);
  }

  closeMenu(): void {
    this.openMenuRowKey.set(null);
    this.menuAnchor.set(null);
  }

  /**
   * Compose: emit the row action, then close the menu. Wraps the two so
   * the template stays declarative.
   */
  onOverflowAction(
    action: TableRowAction,
    row: Record<string, unknown>,
    event: Event,
  ): void {
    this.rowActionClicked.emit({
      action,
      row,
      event: event as MouseEvent,
    });
    this.closeMenu();
  }
}
