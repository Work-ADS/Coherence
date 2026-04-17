import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import { CheckboxComponent } from '../checkbox';
import type { TableColumn, TableSortState } from './table.types';
import { densityClasses, TableDensity } from './table.variants';

/**
 * Data table primitive.
 *
 * Semantic HTML table with sortable columns, row selection, empty/loading states.
 * Consumers pass pre-sorted `rows`; Table does NOT sort internally.
 */
@Component({
  selector: 'afi-table',
  standalone: true,
  imports: [CheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-x-auto">
      <table class="w-full text-body-sm">
        <thead>
          <tr class="bg-surface-100 border-b border-border-hairline">
            @if (selectable()) {
              <th scope="col" class="w-12 px-space-2">
                <afi-checkbox
                  size="sm"
                  ariaLabel="Seleccionar todas las filas"
                  [checked]="allSelected()"
                  [indeterminate]="someSelected()"
                  (checkedChange)="toggleAll($event)" />
              </th>
            }
            @for (col of visibleColumns(); track col.key) {
              <th
                scope="col"
                [class]="headerCellClasses(col)"
                [attr.aria-sort]="col.sortable ? ariaSort(col.key) : null"
                [style.width]="col.width ?? 'auto'"
                (click)="col.sortable ? onSort(col.key) : null"
              >
                <span class="inline-flex items-center gap-1">
                  {{ col.label }}
                  @if (col.sortable) {
                    <svg class="h-3.5 w-3.5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
                    </svg>
                  }
                </span>
              </th>
            }
          </tr>
        </thead>
        <tbody [attr.aria-busy]="loading() ? 'true' : null">
          @if (loading()) {
            @for (i of skeletonRows; track i) {
              <tr [class]="rowClasses(false)">
                @if (selectable()) { <td class="px-space-2"><div class="h-4 w-4 bg-neutral-200 rounded animate-pulse"></div></td> }
                @for (col of visibleColumns(); track col.key) {
                  <td [class]="cellClasses(col)"><div class="h-4 bg-neutral-200 rounded animate-pulse"></div></td>
                }
              </tr>
            }
          } @else if (rows().length === 0) {
            <tr>
              <td [attr.colspan]="totalColumns()" class="text-center py-space-8 text-neutral-500" aria-live="polite">
                {{ emptyText() }}
              </td>
            </tr>
          } @else {
            @for (row of rows(); track trackKey(row)) {
              <tr
                [class]="rowClasses(isSelected(row))"
                (click)="onRowClick(row, $event)"
              >
                @if (selectable()) {
                  <td class="px-space-2" (click)="$event.stopPropagation()">
                    <afi-checkbox
                      size="sm"
                      [ariaLabel]="'Seleccionar fila'"
                      [checked]="isSelected(row)"
                      (checkedChange)="toggleRow(row, $event)" />
                  </td>
                }
                @for (col of visibleColumns(); track col.key) {
                  <td [class]="cellClasses(col)">{{ row[col.key] }}</td>
                }
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
})
export class TableComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  readonly rowClicked = output<{ row: Record<string, unknown>; event: MouseEvent }>();

  readonly skeletonRows = [0, 1, 2, 3, 4];

  readonly visibleColumns = computed(() => this.columns().filter(c => !c.hidden));

  readonly totalColumns = computed(() =>
    this.visibleColumns().length + (this.selectable() ? 1 : 0),
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
    return this.selected().some(s => s[key] === row[key]);
  }

  headerCellClasses(col: TableColumn): string {
    const align = col.align === 'end' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
    return `px-space-3 py-space-2 font-medium text-neutral-500 ${align} ${col.sortable ? 'cursor-pointer select-none' : ''}`;
  }

  cellClasses(col: TableColumn): string {
    const align = col.align === 'end' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
    return `px-space-3 py-space-2 ${align}`;
  }

  rowClasses(selected: boolean): string {
    return [
      densityClasses[this.density()],
      'border-b border-border-hairline transition-colors duration-fast',
      this.rowHoverable() ? 'hover:bg-surface-100' : '',
      selected ? 'bg-action/5 border-l-2 border-l-action' : '',
    ].join(' ');
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
      this.selectedChange.emit(this.selected().filter(s => s[key] !== row[key]));
    }
  }

  onRowClick(row: Record<string, unknown>, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('afi-checkbox') || target.closest('button') || target.closest('a')) return;
    this.rowClicked.emit({ row, event });
  }
}
