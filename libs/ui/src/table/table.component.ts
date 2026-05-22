import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import { CheckboxComponent } from '../checkbox';
import type { TableColumn, TableSortState } from './table.types';
import type { TableDensity } from './table.variants';

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
  imports: [CheckboxComponent],
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

  readonly selectedChange = output<Record<string, unknown>[]>();
  readonly sortChange = output<TableSortState | null>();
  readonly rowClicked = output<{
    row: Record<string, unknown>;
    event: MouseEvent;
  }>();

  readonly skeletonRows = [0, 1, 2, 3, 4];

  readonly visibleColumns = computed(() =>
    this.columns().filter((c) => !c.hidden),
  );

  readonly totalColumns = computed(
    () => this.visibleColumns().length + (this.selectable() ? 1 : 0),
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
    return [
      'afi-table__th',
      align,
      col.sortable ? 'afi-table__th--sortable' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  cellClasses(col: TableColumn): string {
    const align =
      col.align === 'end'
        ? 'afi-table__td--end'
        : col.align === 'center'
          ? 'afi-table__td--center'
          : 'afi-table__td--start';
    return ['afi-table__td', align].join(' ');
  }

  rowClasses(selected: boolean): string {
    return [
      'afi-table__row',
      `afi-table__row--${this.density()}`,
      this.rowHoverable() ? 'afi-table__row--hoverable' : '',
      selected ? 'afi-table__row--selected' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  ariaSort(columnKey: string): string {
    const sort = this.sortBy();
    if (!sort || sort.column !== columnKey) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
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
      this.selectedChange.emit(
        this.selected().filter((s) => s[key] !== row[key]),
      );
    }
  }

  onRowClick(row: Record<string, unknown>, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      target.closest('afi-checkbox') ||
      target.closest('button') ||
      target.closest('a')
    )
      return;
    this.rowClicked.emit({ row, event });
  }
}
