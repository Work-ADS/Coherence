import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { BadgeV2Component } from '../badge-v2';
import type { BadgeV2Tone } from '../badge-v2';
import { ButtonV2Component } from '../button-v2';
import { CheckboxV2Component } from '../checkbox-v2';
import { IconButtonV2Component } from '../icon-button-v2';
import type { IconButtonV2Variant } from '../icon-button-v2';
import { MenuV2Component } from '../menu-v2/menu-v2.component';
import { MenuItemV2Component } from '../menu-v2/menu-item-v2.component';
import { MenuDividerV2Component } from '../menu-v2/menu-divider-v2.component';

import type {
  TableV2ActionsReveal,
  TableV2Column,
  TableV2Density,
  TableV2Reveal,
  TableV2RowAction,
  TableV2SortState,
} from './table-v2.variants';

/**
 * Gap (px) between the trailing ⋯ button and its anchored overflow menu. JS
 * positioning math can't read a CSS var, so this is a deliberate escape hatch:
 * it mirrors the `--dimension-1` spacing step and select-v2's `PANEL_OFFSET`.
 * Keep in sync if that step changes.
 */
const MENU_OFFSET = 4;

interface MenuCoords {
  readonly top: number;
  readonly left: number;
}

/**
 * Data table — identity v2 (foundations-modern).
 *
 * A data-driven table that keeps the v1 `afi-table` API shape (`[columns]` +
 * `[rows]` + `[rowActions]`, `selectedChange` / `sortChange` / `rowActionClicked`
 * outputs) so it reads as a familiar swap, rebuilt on foundations-modern tokens
 * and v2 primitives. Consumes only `foundations-modern` tokens, so it renders
 * correctly only inside a `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Table (Shell 2738:5016 +
 * component set nodes; behaviour 2740:4153; documentation 2744:4180).
 *
 * What it renders:
 *  - Densities compact / default / comfortable (row + cell padding only; header
 *    height is a constant per Figma).
 *  - Cell kinds text / numeric / monetary / status, alignment driven by kind
 *    (numeric + monetary right-aligned with tabular figures).
 *  - Selection column (fixed width, centred checkbox). The header "select all"
 *    checkbox is always visible and shows indeterminate on partial selection;
 *    row checkboxes + trailing actions reveal on hover / focus / selection
 *    (`actionsReveal`, default `hover`).
 *  - Sort: clicking a sortable header cycles none → asc → desc → none; only the
 *    active column shows a chevron; the icon slot is always reserved so toggling
 *    never shifts the header width. The table does not sort — consumers pass
 *    pre-sorted rows and react to `sortChange`.
 *  - Data / Empty (message + optional "add" action) / Loading (rows dimmed with
 *    geometry preserved + centred spinner) states.
 *  - Trailing actions: inline icon-buttons (icon-button-v2) plus an overflow
 *    `⋯` menu (menu-v2, anchored with `position: fixed` so it escapes the
 *    horizontal-scroll region). Threshold rule mirrors v1: ≤ 2 actions always
 *    render inline; `overflow` only takes effect at 3+.
 *
 * A11y: semantic `<table>` / `<thead>` / `<tbody>`, `<th scope="col">` header
 * cells, `aria-sort` on sortable headers, specific accessible names on the
 * select-all / per-row checkboxes and the overflow trigger, and the v2 focus
 * ring on every interactive child.
 */
@Component({
  selector: 'afi-table-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    BadgeV2Component,
    ButtonV2Component,
    CheckboxV2Component,
    IconButtonV2Component,
    MenuV2Component,
    MenuItemV2Component,
    MenuDividerV2Component,
  ],
  templateUrl: './table-v2.component.html',
  styleUrls: ['./table-v2.component.scss'],
  host: { class: 'afi-table-v2' },
})
export class TableV2Component {
  readonly columns = input<TableV2Column[]>([]);
  readonly rows = input<Record<string, unknown>[]>([]);
  readonly trackByKey = input<string>('id');
  readonly selected = input<Record<string, unknown>[]>([]);
  readonly selectable = input<boolean>(false);
  readonly sortBy = input<TableV2SortState | null>(null);
  readonly loading = input<boolean>(false);
  readonly density = input<TableV2Density>('default');
  readonly rowHoverable = input<boolean>(true);
  readonly rowActions = input<TableV2RowAction[]>([]);
  readonly actionsReveal = input<TableV2ActionsReveal>('hover');

  /**
   * Opt-in row-entrance motion. See `TableV2Reveal` — `none` (default) keeps
   * the compliant behaviour; `stagger` replays a blur-and-fade cascade whenever
   * `revealKey` changes. Deliberate warm-transition exception; documented on the
   * type.
   */
  readonly reveal = input<TableV2Reveal>('none');

  /**
   * Replay trigger for `reveal: 'stagger'`. Bind it to the current
   * filter/search signature (any value whose change means "the set changed");
   * mutating it re-keys the rows so the cascade replays. Ignored when
   * `reveal` is `none`.
   */
  readonly revealKey = input<unknown>(null);

  /** Empty-state message (Figma: "No data to display"). */
  readonly emptyText = input<string>('No hay datos que mostrar');
  /** Optional empty-state action button label (Figma: "Add item"). */
  readonly emptyActionLabel = input<string | null>(null);

  /** Transient highlight for the row whose `trackByKey` matches this value. */
  readonly highlightedRowKey = input<unknown>(null);

  /** Accessible name for the `<table>` element (announced to assistive tech). */
  readonly ariaLabel = input<string | null>(null);

  readonly selectedChange = output<Record<string, unknown>[]>();
  readonly sortChange = output<TableV2SortState | null>();
  readonly rowClicked = output<{ row: Record<string, unknown>; event: MouseEvent }>();
  readonly rowActionClicked = output<{
    action: TableV2RowAction;
    row: Record<string, unknown>;
    event: MouseEvent;
  }>();
  readonly emptyAction = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly selectionState = signal<Record<string, unknown>[]>([]);

  constructor() {
    // `selected` remains the controlled API. Mirroring it locally also makes
    // selection work in simple table previews where no parent consumes the
    // `selectedChange` output.
    effect(() => this.selectionState.set(this.selected()));
  }

  readonly visibleColumns = computed(() => this.columns().filter((c) => !c.hidden));

  /** Overall table state — mirrors Figma Shell's Data / Empty / Loading axis. */
  readonly state = computed<'data' | 'empty' | 'loading'>(() => {
    if (this.loading()) return 'loading';
    return this.rows().length === 0 ? 'empty' : 'data';
  });

  readonly tableClasses = computed(() => {
    const parts = ['afi-table-v2__table', `afi-table-v2__table--${this.density()}`];
    if (this.actionsReveal() === 'always') parts.push('afi-table-v2__table--reveal-always');
    return parts.join(' ');
  });

  // ── Selection ──────────────────────────────────────────────────────────────
  readonly allSelected = computed(() => {
    const r = this.rows();
    const key = this.trackByKey();
    const selectedKeys = new Set(this.selectionState().map((row) => row[key]));
    return r.length > 0 && r.every((row) => selectedKeys.has(row[key]));
  });

  readonly someSelected = computed(() => {
    const key = this.trackByKey();
    const selectedKeys = new Set(this.selectionState().map((row) => row[key]));
    return this.rows().some((row) => selectedKeys.has(row[key])) && !this.allSelected();
  });

  isSelected(row: Record<string, unknown>): boolean {
    const key = this.trackByKey();
    return this.selectionState().some((selected) => selected[key] === row[key]);
  }

  toggleAll(): void {
    this.setSelection(this.allSelected() ? [] : [...this.rows()]);
  }

  toggleRow(row: Record<string, unknown>, checked: boolean): void {
    const key = this.trackByKey();
    const selected = this.selectionState();
    if (checked) {
      this.setSelection(
        selected.some((item) => item[key] === row[key]) ? selected : [...selected, row],
      );
    } else {
      this.setSelection(selected.filter((item) => item[key] !== row[key]));
    }
  }

  private setSelection(rows: Record<string, unknown>[]): void {
    this.selectionState.set(rows);
    this.selectedChange.emit(rows);
  }

  /**
   * The whole selection cell is the hit target — the compact checkbox in its
   * fixed-width column is too easy to miss. A click landing on the checkbox itself is left
   * to the checkbox (its own change fires); a click on the surrounding cell
   * toggles here. Guarding on the checkbox element avoids a double-toggle.
   */
  onHeaderSelectClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('afi-checkbox-v2')) return;
    this.toggleAll();
  }

  /**
   * Header checkbox changes resolve through the table selection state rather
   * than the checkbox's local value. That keeps a click on either the checkbox
   * or the surrounding header cell on the same select-all / clear-all path.
   */
  onHeaderSelectChange(): void {
    this.toggleAll();
  }

  onRowSelectClick(row: Record<string, unknown>, event: MouseEvent): void {
    event.stopPropagation(); // never bubble to the row's rowClicked
    if ((event.target as HTMLElement).closest('afi-checkbox-v2')) return;
    this.toggleRow(row, !this.isSelected(row));
  }

  // ── Actions (inline / overflow split, mirrors v1) ────────────────────────────
  readonly hasRowActions = computed(() => {
    if (this.rowActions().length > 0) return true;
    return this.rows().some((row) => {
      const a = row['actions'];
      return Array.isArray(a) && a.length > 0;
    });
  });

  private resolveActions(actions: TableV2RowAction[]): TableV2RowAction[] {
    if (actions.length <= 2) {
      return actions.map((a) => (a.overflow ? { ...a, overflow: false } : a));
    }
    return actions;
  }

  private actionsFor(row: Record<string, unknown>): TableV2RowAction[] {
    const own = row['actions'];
    const raw = Array.isArray(own) ? (own as TableV2RowAction[]) : this.rowActions();
    return this.resolveActions(raw);
  }

  inlineActionsFor(row: Record<string, unknown>): TableV2RowAction[] {
    return this.actionsFor(row).filter((a) => !a.overflow);
  }

  overflowActionsFor(row: Record<string, unknown>): TableV2RowAction[] {
    return this.actionsFor(row).filter((a) => !!a.overflow);
  }

  overflowStandardActionsFor(row: Record<string, unknown>): TableV2RowAction[] {
    return this.overflowActionsFor(row).filter((a) => a.variant !== 'danger');
  }

  overflowDangerActionsFor(row: Record<string, unknown>): TableV2RowAction[] {
    return this.overflowActionsFor(row).filter((a) => a.variant === 'danger');
  }

  hasOverflowActionsFor(row: Record<string, unknown>): boolean {
    return this.overflowActionsFor(row).length > 0;
  }

  hasOverflowDividerFor(row: Record<string, unknown>): boolean {
    return (
      this.overflowStandardActionsFor(row).length > 0 &&
      this.overflowDangerActionsFor(row).length > 0
    );
  }

  /** icon-button variant for an inline action: explicit override → danger → ghost. */
  iconVariantFor(action: TableV2RowAction): IconButtonV2Variant {
    if (action.iconVariant) return action.iconVariant;
    return action.variant === 'danger' ? 'destructive' : 'ghost';
  }

  // ── Alignment / classes ──────────────────────────────────────────────────────
  private alignFor(col: TableV2Column): 'start' | 'center' | 'end' {
    if (col.align) return col.align;
    return col.kind === 'numeric' || col.kind === 'monetary' ? 'end' : 'start';
  }

  headerCellClasses(col: TableV2Column): string {
    return [
      'afi-table-v2__th',
      `afi-table-v2__th--${this.alignFor(col)}`,
      `afi-table-v2__th--${col.kind ?? 'text'}`,
      col.sortable ? 'afi-table-v2__th--sortable' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  cellClasses(col: TableV2Column): string {
    return [
      'afi-table-v2__td',
      `afi-table-v2__td--${this.alignFor(col)}`,
      `afi-table-v2__td--${col.kind ?? 'text'}`,
    ].join(' ');
  }

  /** Sortable numeric/monetary columns lead with the chevron (right-aligned text). */
  chevronLeads(col: TableV2Column): boolean {
    return col.kind === 'numeric' || col.kind === 'monetary';
  }

  rowClasses(row: Record<string, unknown>): string {
    return [
      'afi-table-v2__row',
      this.rowHoverable() ? 'afi-table-v2__row--hoverable' : '',
      this.isSelected(row) ? 'afi-table-v2__row--selected' : '',
      this.isHighlighted(row) ? 'afi-table-v2__row--highlighted' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  isHighlighted(row: Record<string, unknown>): boolean {
    const key = this.highlightedRowKey();
    if (key === null || key === undefined) return false;
    return row[this.trackByKey()] === key;
  }

  readonly totalColumns = computed(
    () =>
      this.visibleColumns().length + (this.selectable() ? 1 : 0) + (this.hasRowActions() ? 1 : 0),
  );

  // ── Cell content ─────────────────────────────────────────────────────────────
  trackKey(row: Record<string, unknown>): unknown {
    return row[this.trackByKey()];
  }

  /**
   * `@for` track for body rows. Normally the stable row key. When
   * `reveal: 'stagger'` is active it folds `revealKey` into the key so a change
   * re-keys every row — Angular recreates the row nodes and the CSS entrance
   * animation replays across the whole set (the only reliable pure-CSS way to
   * replay a keyframe on rows that survive a filter). Selection is unaffected:
   * `isSelected` compares by `trackByKey` value, not by this render key.
   */
  rowTrack(row: Record<string, unknown>): unknown {
    const base = row[this.trackByKey()];
    return this.reveal() === 'stagger' ? `${String(this.revealKey())}::${String(base)}` : base;
  }

  cellText(row: Record<string, unknown>, col: TableV2Column): string {
    const value = row[col.key];
    return value === null || value === undefined ? '' : String(value);
  }

  /** Badge tone for a status cell: per-row `toneKey` → column `badgeTone` → neutral. */
  badgeToneFor(row: Record<string, unknown>, col: TableV2Column): BadgeV2Tone {
    if (col.toneKey) {
      const v = row[col.toneKey];
      if (
        v === 'neutral' ||
        v === 'success' ||
        v === 'warning' ||
        v === 'critical' ||
        v === 'info'
      ) {
        return v;
      }
    }
    return col.badgeTone ?? 'neutral';
  }

  ariaSort(columnKey: string): 'none' | 'ascending' | 'descending' {
    const sort = this.sortBy();
    if (!sort || sort.column !== columnKey) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  isSortedAsc(columnKey: string): boolean {
    const sort = this.sortBy();
    return !!sort && sort.column === columnKey && sort.direction === 'asc';
  }

  isSortedDesc(columnKey: string): boolean {
    const sort = this.sortBy();
    return !!sort && sort.column === columnKey && sort.direction === 'desc';
  }

  onSort(col: TableV2Column): void {
    if (!col.sortable) return;
    const current = this.sortBy();
    if (!current || current.column !== col.key) {
      this.sortChange.emit({ column: col.key, direction: 'asc' });
    } else if (current.direction === 'asc') {
      this.sortChange.emit({ column: col.key, direction: 'desc' });
    } else {
      this.sortChange.emit(null);
    }
  }

  // ── Row / action clicks ──────────────────────────────────────────────────────
  onRowClick(row: Record<string, unknown>, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('afi-checkbox-v2') || target.closest('button') || target.closest('a')) {
      return;
    }
    this.rowClicked.emit({ row, event });
  }

  onRowAction(action: TableV2RowAction, row: Record<string, unknown>, event: MouseEvent): void {
    event.stopPropagation();
    this.rowActionClicked.emit({ action, row, event });
  }

  // ── Overflow menu (single open at a time, position: fixed anchored) ───────────
  private readonly openMenuKey = signal<unknown>(null);
  protected readonly menuCoords = signal<MenuCoords | null>(null);
  /** The ⋯ trigger of the open menu, so focus can return to it on close. */
  private menuTrigger: HTMLElement | null = null;

  isMenuOpen(row: Record<string, unknown>): boolean {
    return this.openMenuKey() === row[this.trackByKey()];
  }

  toggleMenu(row: Record<string, unknown>, event: MouseEvent): void {
    event.stopPropagation();
    const key = row[this.trackByKey()];
    const willOpen = this.openMenuKey() !== key;
    if (willOpen) {
      const btn = event.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      // Right-align the panel to the trigger; the template translates it -100% X.
      this.menuCoords.set({ top: rect.bottom + MENU_OFFSET, left: rect.right });
      this.menuTrigger = btn;
      this.openMenuKey.set(key);
      // Move focus into the freshly-rendered menu (APG menu-button pattern).
      // Deferred a tick so the @if-rendered panel exists in the DOM.
      setTimeout(() => this.focusMenuItem(0));
    } else {
      this.closeMenu({ refocus: true });
    }
  }

  closeMenu(opts: { refocus?: boolean } = {}): void {
    if (this.openMenuKey() === null) return;
    this.openMenuKey.set(null);
    this.menuCoords.set(null);
    const trigger = this.menuTrigger;
    this.menuTrigger = null;
    if (opts.refocus) trigger?.focus();
  }

  onOverflowAction(action: TableV2RowAction, row: Record<string, unknown>, event: MouseEvent): void {
    this.rowActionClicked.emit({ action, row, event });
    this.closeMenu({ refocus: true });
  }

  /** Enabled `menuitem` buttons in the open overflow menu, in DOM order. */
  private menuItems(): HTMLElement[] {
    return Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>(
        '.afi-table-v2__menu [role="menuitem"]:not([disabled])',
      ),
    );
  }

  private focusMenuItem(index: number): void {
    const items = this.menuItems();
    if (items.length === 0) return;
    const i = ((index % items.length) + items.length) % items.length;
    items[i]?.focus();
  }

  /** Roving focus inside the open overflow menu (APG menu keyboard model). */
  onMenuKeydown(event: KeyboardEvent): void {
    const items = this.menuItems();
    if (items.length === 0) return;
    const current = items.indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusMenuItem(current + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusMenuItem(current - 1);
        break;
      case 'Home':
        event.preventDefault();
        this.focusMenuItem(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusMenuItem(items.length - 1);
        break;
      case 'Tab':
        // Tab closes the menu and returns focus to the trigger (APG).
        event.preventDefault();
        this.closeMenu({ refocus: true });
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.openMenuKey() === null) return;
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.openMenuKey() !== null) this.closeMenu({ refocus: true });
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportShift(): void {
    if (this.openMenuKey() !== null) this.closeMenu();
  }
}
