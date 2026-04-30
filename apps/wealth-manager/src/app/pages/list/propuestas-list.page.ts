import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  ButtonComponent,
  CheckboxComponent,
  InputComponent,
  KbdComponent,
  MenuComponent,
  MenuItemComponent,
  ModalComponent,
  PageHeaderComponent,
  StatusChipComponent,
  BadgeComponent,
} from '@coherence/ui';
import type { Estado } from '@coherence/ui';

import { PropuestaRow, PropuestaState } from '../../data/propuesta.model';
import { PresenterModeService } from '../../data/presenter-mode.service';
import { TelemetryService } from '../../data/telemetry.service';

import { TypePickerComponent } from '../../type-picker/type-picker.component';

import PROPUESTAS_DATA from '../../../assets/data/propuestas.json';

/** Map propuesta states to Estado values for StatusChip */
const STATE_MAP: Record<PropuestaState, Estado> = {
  'borrador': 'borrador',
  'enviado-para-firma': 'pendiente',
  'ejecutado': 'ejecutada',
  'formalizada': 'aprobada',
  'cancelada': 'cancelada',
};

/** Per-state actions from the brief */
const STATE_ACTIONS: Record<PropuestaState, { primary: string; secondary: string[] }> = {
  'borrador': {
    primary: 'Editar',
    secondary: ['Eliminar', 'Enviar para firmar'],
  },
  'enviado-para-firma': {
    primary: 'Ver propuesta',
    secondary: ['Cancelar firma'],
  },
  'ejecutado': {
    primary: 'Ver propuesta',
    secondary: ['Eliminar'],
  },
  'formalizada': {
    primary: 'Volver a borrador',
    secondary: ['Solicitar propuesta inversión'],
  },
  'cancelada': {
    primary: 'Volver a solicitar',
    secondary: [],
  },
};

type SortColumn = 'name' | 'updatedAt';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'awm-propuestas-list',
  standalone: true,
  imports: [
    ButtonComponent,
    CheckboxComponent,
    InputComponent,
    KbdComponent,
    MenuComponent,
    MenuItemComponent,
    ModalComponent,
    PageHeaderComponent,
    StatusChipComponent,
    BadgeComponent,
    TypePickerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Shell: minimal workspace layout for the concept -->
    <div class="min-h-screen bg-canvas-base">

      <!-- Page header area -->
      <afi-page-header title="Propuestas" [sticky]="true">
        <div slot="filters" class="flex items-center gap-space-4">
          <div class="w-[320px]">
            <afi-input
              placeholder="Buscar por nombre o cliente..."
              size="sm"
              [value]="filterText()"
              (valueChange)="onFilter($any($event))"
            />
          </div>
        </div>

        <div slot="primaryAction">
          <afi-button variant="primary" size="sm" (clicked)="openTypePicker()">
            Nueva propuesta
            <span class="ml-space-2 inline-flex items-center gap-0.5 opacity-60">
              <afi-kbd [keys]="['⌘']" size="sm" />
              <afi-kbd [keys]="['K']" size="sm" />
            </span>
          </afi-button>
        </div>
      </afi-page-header>

      <!-- Bulk action bar -->
      @if (selectedRows().length > 0) {
        <div class="bg-action-50 border-b border-action-200 px-space-8 py-space-3 flex items-center gap-space-4">
          <span class="text-body-sm text-canvas-fg font-medium">
            {{ selectedRows().length }} seleccionada{{ selectedRows().length > 1 ? 's' : '' }}
          </span>
          <afi-button variant="danger" size="sm" (clicked)="confirmDeleteOpen.set(true)">
            Eliminar seleccionadas
          </afi-button>
          <button
            type="button"
            class="text-body-sm text-neutral-500 hover:text-canvas-fg transition-colors duration-fast"
            (click)="selectedRows.set([])"
          >Cancelar selección</button>
        </div>
      }

      <!-- Table -->
      <div class="max-w-[1440px] mx-auto px-space-8 py-space-6">
        <div class="overflow-x-auto rounded-lg border border-border-hairline">
          <table class="w-full text-body-sm">
            <thead>
              <tr class="bg-surface-100 border-b border-border-hairline">
                <th scope="col" class="w-[42px] px-space-2 py-space-3">
                  <afi-checkbox
                    size="sm"
                    ariaLabel="Seleccionar todas"
                    [checked]="allSelected()"
                    [indeterminate]="someSelected()"
                    (checkedChange)="toggleAll($event)"
                  />
                </th>
                <th scope="col" class="text-left px-space-3 py-space-3 font-medium text-neutral-500 cursor-pointer select-none"
                    style="width: 155px"
                    [attr.aria-sort]="sortAriaFor('name')"
                    (click)="toggleSort('name')">
                  <span class="inline-flex items-center gap-1">
                    Nombre
                    <svg class="h-3.5 w-3.5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </th>
                <th scope="col" class="text-left px-space-3 py-space-3 font-medium text-neutral-500" style="width: 175px">
                  Cliente / Cartera
                </th>
                <th scope="col" class="text-left px-space-3 py-space-3 font-medium text-neutral-500" style="width: 175px">
                  Estado
                </th>
                <th scope="col" class="text-left px-space-3 py-space-3 font-medium text-neutral-500" style="width: 265px">
                  Etiquetas
                </th>
                <th scope="col" class="text-left px-space-3 py-space-3 font-medium text-neutral-500 cursor-pointer select-none"
                    style="width: 175px"
                    [attr.aria-sort]="sortAriaFor('updatedAt')"
                    (click)="toggleSort('updatedAt')">
                  <span class="inline-flex items-center gap-1">
                    Actualizado
                    <svg class="h-3.5 w-3.5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </th>
                <th scope="col" class="w-[52px] px-space-2 py-space-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              @for (row of filteredRows(); track row.id) {
                <tr class="border-b border-border-hairline last:border-b-0
                           transition-colors duration-fast hover:bg-surface-100 cursor-pointer"
                    [class.bg-action-50]="isSelected(row)"
                    [class.border-l-2]="isSelected(row)"
                    [class.border-l-action]="isSelected(row)"
                    (click)="onRowClick(row)"
                    role="link"
                    [attr.aria-label]="row.name + ' — ' + row.client">
                  <!-- Checkbox -->
                  <td class="px-space-2 py-space-2" (click)="$event.stopPropagation()">
                    <afi-checkbox
                      size="sm"
                      [ariaLabel]="'Seleccionar ' + row.name"
                      [checked]="isSelected(row)"
                      (checkedChange)="toggleRow(row, $event)"
                    />
                  </td>
                  <!-- Name -->
                  <td class="px-space-3 py-space-2 font-medium text-canvas-fg truncate max-w-[155px]">
                    {{ row.name }}
                  </td>
                  <!-- Client / Cartera -->
                  <td class="px-space-3 py-space-2">
                    <div class="text-canvas-fg">{{ row.client }}</div>
                    <div class="text-body-xs text-neutral-400">{{ row.cartera }}</div>
                  </td>
                  <!-- State -->
                  <td class="px-space-3 py-space-2">
                    <afi-status-chip [estado]="stateToEstado(row.state)" size="sm" />
                  </td>
                  <!-- Tags -->
                  <td class="px-space-3 py-space-2">
                    <div class="flex flex-wrap gap-space-1">
                      @for (tag of row.tags ?? []; track tag) {
                        <afi-badge size="sm" intent="neutral">{{ tag }}</afi-badge>
                      }
                    </div>
                  </td>
                  <!-- Updated -->
                  <td class="px-space-3 py-space-2 text-neutral-500">
                    {{ formatDate(row.updatedAt) }}
                  </td>
                  <!-- Actions -->
                  <td class="px-space-2 py-space-2" (click)="$event.stopPropagation()">
                    <div class="flex items-center gap-space-1">
                      @if (secondaryActions(row.state).length > 0) {
                        <div class="relative">
                          <button
                            type="button"
                            class="p-space-1 rounded-md hover:bg-surface-muted transition-colors duration-fast"
                            [attr.aria-expanded]="openMenuId() === row.id"
                            (click)="openMenuId.set(openMenuId() === row.id ? null : row.id); $event.stopPropagation()"
                            [attr.aria-label]="'Mas acciones para ' + row.name"
                          >
                            <svg class="w-4 h-4 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          <afi-menu
                            [open]="openMenuId() === row.id"
                            (openChange)="openMenuId.set($event ? row.id : null)"
                            placement="bottom-end"
                            [ariaLabel]="'Acciones para ' + row.name"
                          >
                            @for (action of secondaryActions(row.state); track action) {
                              <afi-menu-item
                                [label]="action"
                                [variant]="action === 'Eliminar' ? 'danger' : 'default'"
                                (click)="onAction(row, action); openMenuId.set(null)"
                              />
                            }
                          </afi-menu>
                        </div>
                      }
                    </div>
                  </td>
                </tr>
              }

              @if (filteredRows().length === 0) {
                <tr>
                  <td colspan="7" class="text-center py-space-8 text-neutral-500">
                    Sin resultados para &laquo;{{ filterText() }}&raquo;
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination stub -->
        <div class="flex items-center justify-between mt-space-4 text-body-sm text-neutral-500">
          <span>{{ filteredRows().length }} de {{ allRows().length }} propuestas</span>
        </div>
      </div>

      <!-- Delete confirmation modal -->
      <afi-modal
        [open]="confirmDeleteOpen()"
        (openChange)="confirmDeleteOpen.set($event)"
        title="Eliminar propuestas"
        size="sm"
      >
        <p class="text-body-md text-neutral-600 mb-space-6">
          Se eliminarán {{ selectedRows().length }} propuesta{{ selectedRows().length > 1 ? 's' : '' }}.
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-space-3">
          <afi-button variant="ghost" size="sm" (clicked)="confirmDeleteOpen.set(false)">
            Cancelar
          </afi-button>
          <afi-button variant="danger" size="sm" (clicked)="confirmDelete()">
            Eliminar
          </afi-button>
        </div>
      </afi-modal>

      <!-- Type picker modal -->
      <awm-type-picker
        [open]="typePickerOpen()"
        (openChange)="typePickerOpen.set($event)"
      />
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class PropuestasListPage implements OnInit {
  private readonly router = inject(Router);
  readonly presenter = inject(PresenterModeService);
  private readonly telemetry = inject(TelemetryService);

  readonly allRows = signal<PropuestaRow[]>(PROPUESTAS_DATA as PropuestaRow[]);
  readonly selectedRows = signal<PropuestaRow[]>([]);
  readonly filterText = signal('');
  readonly sortColumn = signal<SortColumn | null>('updatedAt');
  readonly sortDir = signal<SortDir>('desc');
  readonly openMenuId = signal<string | null>(null);
  readonly confirmDeleteOpen = signal(false);
  readonly typePickerOpen = signal(false);

  private filterTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly debouncedFilter = signal('');

  readonly filteredRows = computed(() => {
    const filter = this.debouncedFilter().toLowerCase();
    let rows = this.allRows();

    if (filter) {
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(filter) ||
          r.client.toLowerCase().includes(filter),
      );
    }

    const col = this.sortColumn();
    const dir = this.sortDir();
    if (col) {
      rows = [...rows].sort((a, b) => {
        const av = a[col] ?? '';
        const bv = b[col] ?? '';
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return dir === 'asc' ? cmp : -cmp;
      });
    }

    return rows;
  });

  readonly allSelected = computed(() => {
    const f = this.filteredRows();
    const s = this.selectedRows();
    return f.length > 0 && s.length === f.length;
  });

  readonly someSelected = computed(() => {
    const s = this.selectedRows();
    return s.length > 0 && !this.allSelected();
  });

  ngOnInit(): void {
    this.telemetry.emit('propuestas.list-page.step-start', {
      stepOrdinal: 1,
      rowCount: this.allRows().length,
      presenterMode: this.presenter.active(),
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.telemetry.emit('propuestas.shortcut.new-propuesta.invoked');
      this.openTypePicker();
    }
  }

  onFilter(value: string): void {
    this.filterText.set(value);
    if (this.filterTimeout) clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      this.debouncedFilter.set(value);
      this.telemetry.emit('propuestas.filter.applied', { query: value });
    }, 150);
  }

  openTypePicker(): void {
    this.telemetry.emit('propuestas.type-picker.opened');
    this.typePickerOpen.set(true);
  }

  stateToEstado(state: PropuestaState): Estado {
    return STATE_MAP[state];
  }

  primaryAction(state: PropuestaState): string {
    return STATE_ACTIONS[state].primary;
  }

  secondaryActions(state: PropuestaState): string[] {
    return STATE_ACTIONS[state].secondary;
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  isSelected(row: PropuestaRow): boolean {
    return this.selectedRows().some((r) => r.id === row.id);
  }

  toggleAll(checked: boolean): void {
    this.selectedRows.set(checked ? [...this.filteredRows()] : []);
  }

  toggleRow(row: PropuestaRow, checked: boolean): void {
    if (checked) {
      this.selectedRows.update((s) => [...s, row]);
    } else {
      this.selectedRows.update((s) => s.filter((r) => r.id !== row.id));
    }
  }

  toggleSort(col: SortColumn): void {
    if (this.sortColumn() === col) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(col);
      this.sortDir.set('asc');
    }
  }

  sortAriaFor(col: SortColumn): string {
    if (this.sortColumn() !== col) return 'none';
    return this.sortDir() === 'asc' ? 'ascending' : 'descending';
  }

  onRowClick(row: PropuestaRow): void {
    const action = STATE_ACTIONS[row.state].primary;
    this.onAction(row, action);
  }

  onAction(row: PropuestaRow, action: string): void {
    this.telemetry.emit('propuestas.row-action.clicked', {
      action,
      propuestaId: row.id,
      state: row.state,
    });

    if (action === 'Editar') {
      void this.router.navigate(['/propuesta', row.id, 'ajustes']);
    } else {
      console.info(`[action] ${action} on ${row.id}`);
    }
  }

  confirmDelete(): void {
    const ids = new Set(this.selectedRows().map((r) => r.id));
    this.allRows.update((rows) => rows.filter((r) => !ids.has(r.id)));
    this.telemetry.emit('propuestas.bulk-delete.invoked', { count: ids.size });
    this.selectedRows.set([]);
    this.confirmDeleteOpen.set(false);
  }
}
