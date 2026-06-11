import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import {
  ButtonComponent,
  KbdComponent,
  PageHeaderComponent,
  TableComponent,
  type TableColumn,
  type TableRowAction,
} from '@coherence/ui';

import { KeyShortcutDirective } from '../../../../directives/key-shortcut.directive';
import { DemoShellComponent } from '../../demo-shell/demo-shell.component';
import { PlannerSidebarComponent } from '../../shared/planner-sidebar.component';
import { PlannerTopBarComponent } from '../../shared/planner-top-bar.component';
import { VersionToggleComponent, type VersionOption } from '../../shared/version-toggle.component';
import { WealthPlannerStore } from '../store';
import type { Frecuencia, IngresoGastoRow } from '../store';
import {
  IngresoGastoFormModalComponent,
  type IngresoGastoMode,
} from './ingreso-gasto-form-modal.component';

/**
 * Shared list-body for both Situación Actual · Ingresos and · Gastos.
 *
 * One component, two consumers (ingresos.page, gastos.page). The route-level
 * page components are thin wrappers that pass `mode` and the matching demo
 * shell config.
 *
 * Reads rows from `WealthPlannerStore.ingresos()` / `gastos()` depending on
 * mode. Uses the shared `<site-ingreso-gasto-form-modal>` for add + edit.
 */
@Component({
  selector: 'site-ingresos-gastos-list',
  standalone: true,
  imports: [
    ButtonComponent,
    KbdComponent,
    PageHeaderComponent,
    TableComponent,
    DemoShellComponent,
    PlannerSidebarComponent,
    PlannerTopBarComponent,
    VersionToggleComponent,
    IngresoGastoFormModalComponent,
    KeyShortcutDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ingresos-gastos-list.component.html',
  styleUrls: ['./ingresos-gastos-list.component.scss'],
})
export class IngresosGastosListComponent {
  readonly store = inject(WealthPlannerStore);

  /** Cmd/Ctrl + A — bound via `siteKeyShortcut="a"` on the primary CTA. */
  readonly addShortcut: string[] = ['⌘', 'A'];

  /** Which section we're rendering — drives copy + which store slice we read. */
  readonly mode = input.required<IngresoGastoMode>();

  // ── Per-mode copy ─────────────────────────────────────────────────────
  readonly title = computed<string>(() => (this.mode() === 'ingreso' ? 'Ingresos' : 'Gastos'));

  readonly subtitle = computed<string>(() =>
    this.mode() === 'ingreso'
      ? 'Introduce aquí todos los ingresos del cliente. Tanto los actuales como los previstos (por ejemplo, en la jubilación).'
      : 'Introduce aquí todos los gastos del cliente. Tanto los actuales como los previstos.',
  );

  readonly activeKey = computed<string>(() => (this.mode() === 'ingreso' ? 'ingresos' : 'gastos'));

  readonly demoSlug = computed<string>(() => (this.mode() === 'ingreso' ? 'ingresos' : 'gastos'));

  readonly demoRoute = computed<string>(() => `/demos/wealth-planner-2026/${this.demoSlug()}`);

  readonly viewLabel = computed<string>(() => (this.mode() === 'ingreso' ? 'Ingresos' : 'Gastos'));

  readonly views = computed<string[]>(() => [this.viewLabel()]);

  readonly addLabel = computed<string>(() =>
    this.mode() === 'ingreso' ? '+ Añadir ingreso' : '+ Añadir gasto',
  );

  readonly emptyLabel = computed<string>(() =>
    this.mode() === 'ingreso'
      ? 'Aún no hay ingresos registrados.'
      : 'Aún no hay gastos registrados.',
  );

  // ── Rows ──────────────────────────────────────────────────────────────
  readonly rows = computed<IngresoGastoRow[]>(() =>
    this.mode() === 'ingreso' ? this.store.ingresos() : this.store.gastos(),
  );

  readonly tableColumns: TableColumn[] = [
    { key: 'concepto', label: 'Concepto', emphasis: true },
    {
      key: 'etiqueta',
      label: 'Etiqueta',
      kind: 'badge',
      badgeIntent: 'info',
      width: 'var(--dimension-24)',
    },
    { key: 'frecuencia', label: 'Frecuencia' },
    { key: 'valor', label: 'Valor', align: 'end', emphasis: true },
  ];

  /**
   * Locked action pattern (2026-05-28): 1 primary inline + the rest in
   * the `⋯` overflow menu. Matches sociedades, inversiones-futuras,
   * desinversiones-futuras. Editar inline (most-used) → Duplicar +
   * Borrar in overflow.
   */
  readonly tableActions: TableRowAction[] = [
    {
      key: 'edit',
      label: 'Editar',
      icon: 'edit',
      ariaLabel: 'Editar fila',
    },
    { key: 'duplicate', label: 'Duplicar', overflow: true },
    {
      key: 'delete',
      label: 'Borrar',
      overflow: true,
      variant: 'danger',
    },
  ];

  readonly tableRows = computed<Record<string, unknown>[]>(() =>
    this.rows().map((row) => ({
      id: row.id,
      concepto: row.concepto || 'Sin concepto',
      etiqueta: row.isFuturo ? 'Futuro' : '',
      frecuencia: this.frecuenciaLabel(row.frecuencia),
      valor: this.formatEuro(row.valor),
    })),
  );

  // ── Dialog state ──────────────────────────────────────────────────────
  /** id of the row being edited; '' for new (add); null = closed. */
  readonly editingId = signal<string | null>(null);
  readonly dialogOpen = computed(() => this.editingId() !== null);

  readonly editingRow = computed<IngresoGastoRow | null>(() => {
    const id = this.editingId();
    if (id === null || id === '') return null;
    return this.rows().find((r) => r.id === id) ?? null;
  });

  // ── Version-toggle ────────────────────────────────────────────────────
  readonly version = signal<string>('v1');
  readonly versions: VersionOption[] = [
    { key: 'v1', label: 'Versión 1' },
    { key: 'v2', label: 'Versión 2' },
    { key: 'v3', label: 'Versión 3' },
  ];
  setVersion(v: string): void {
    this.version.set(v);
  }

  // ── Frecuencia label helper ───────────────────────────────────────────
  private readonly frecuenciaLabels: Record<Frecuencia, string> = {
    mensual: 'Mensual',
    trimestral: 'Trimestral',
    semestral: 'Semestral',
    anual: 'Anual',
  };

  frecuenciaLabel(f: Frecuencia): string {
    return this.frecuenciaLabels[f];
  }

  /** EUR formatter for the Valor column (es-ES locale). */
  private readonly euroFormatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  formatEuro(n: number): string {
    return this.euroFormatter.format(n);
  }

  // ── Actions ───────────────────────────────────────────────────────────
  openAdd(): void {
    this.editingId.set('');
  }

  openEdit(id: string): void {
    this.editingId.set(id);
  }

  closeDialog(): void {
    this.editingId.set(null);
  }

  removeRow(id: string, event?: Event): void {
    event?.stopPropagation();
    if (this.mode() === 'ingreso') {
      this.store.removeIngreso(id);
    } else {
      this.store.removeGasto(id);
    }
  }

  /**
   * Duplicar: clone fields onto a fresh row via the matching store add
   * method. Doesn't open the modal (store add takes the partial directly);
   * the new row appears at the bottom of the list. Slightly different from
   * sociedades / if / df where the modal opens — but that's because this
   * store's add API takes the full row payload instead of returning a
   * blank one.
   */
  duplicateRow(id: string): void {
    const source = this.rows().find((r) => r.id === id);
    if (!source) return;
    const { id: _omitId, ...fields } = source;
    void _omitId;
    const cloned = {
      ...fields,
      concepto: source.concepto ? `${source.concepto} (copia)` : '',
    };
    if (this.mode() === 'ingreso') {
      this.store.addIngreso(cloned);
    } else {
      this.store.addGasto(cloned);
    }
  }

  onTableRowClicked(payload: { row: Record<string, unknown>; event: MouseEvent }): void {
    const id = this.tableRowId(payload.row);
    if (id) this.openEdit(id);
  }

  onTableActionClicked(payload: {
    action: TableRowAction;
    row: Record<string, unknown>;
    event: MouseEvent;
  }): void {
    const id = this.tableRowId(payload.row);
    if (!id) return;

    switch (payload.action.key) {
      case 'edit':
        this.openEdit(id);
        break;
      case 'duplicate':
        this.duplicateRow(id);
        break;
      case 'delete':
        this.removeRow(id, payload.event);
        break;
    }
  }

  onSubmitted(row: Omit<IngresoGastoRow, 'id'>): void {
    const id = this.editingId();
    if (id === null) return;
    if (id === '') {
      // Add
      if (this.mode() === 'ingreso') {
        this.store.addIngreso(row);
      } else {
        this.store.addGasto(row);
      }
    } else {
      // Edit
      if (this.mode() === 'ingreso') {
        this.store.updateIngreso(id, row);
      } else {
        this.store.updateGasto(id, row);
      }
    }
    this.closeDialog();
  }

  private tableRowId(row: Record<string, unknown>): string | null {
    const id = row['id'];
    return typeof id === 'string' && id ? id : null;
  }
}
