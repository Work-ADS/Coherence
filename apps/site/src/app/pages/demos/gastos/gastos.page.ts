import { ChangeDetectionStrategy, Component, computed, HostListener, inject, signal } from '@angular/core';

import {
  ButtonComponent,
  IconButtonComponent,
  KbdComponent,
  ModalComponent,
  PageHeaderComponent,
  TableComponent,
  type TableColumn,
  type TableRowAction,
} from '@coherence/ui';

import { KeyShortcutDirective } from '../../../directives/key-shortcut.directive';

import {
  EvolucionBarChartComponent,
  type EvolucionDataPoint,
  type LifeEvent,
} from '../../patrones/graficos/evolucion-patrimonial/evolucion-bar-chart.component';
import { ActionToastComponent } from '../shared/action-toast.component';
import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import { WealthPlannerStore, type IngresoGastoRow } from '../wealth-planner-2026/store';
import {
  IngresoGastoFormModalComponent,
} from '../wealth-planner-2026/shared/ingreso-gasto-form-modal.component';

/**
 * Situacion Actual · Gastos.
 *
 * Mirrors the Patrimonio previsto layout idiom: ObjetivosPageShell chrome,
 * a top-level afi-page-header with the page title + primary action, and
 * section-level afi-page-headers boxing the chart and table below.
 *
 * IPC rate is fixed at 1.5% for projections when incrementaIPC === true.
 */
@Component({
  selector: 'site-gastos-page',
  standalone: true,
  imports: [
    ActionToastComponent,
    ButtonComponent,
    EvolucionBarChartComponent,
    IconButtonComponent,
    KbdComponent,
    ModalComponent,
    PageHeaderComponent,
    TableComponent,
    KeyShortcutDirective,
    ObjetivosPageShellComponent,
    IngresoGastoFormModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class GastosPage {
  readonly store = inject(WealthPlannerStore);

  readonly ipcRate = 0.015;
  readonly HORIZON = 35;

  readonly addShortcut: string[] = ['⌘', 'A'];

  readonly editingId = signal<string | null>(null);
  readonly dialogOpen = computed(() => this.editingId() !== null);

  /** Snapshot of form data carried across an undo. When set and the modal
   *  is in add mode (editingId === ''), the form re-seeds from this row
   *  instead of resetting to defaults. Cleared on submit/cancel. */
  readonly pendingRestore = signal<IngresoGastoRow | null>(null);

  readonly editingRow = computed<IngresoGastoRow | null>(() => {
    const id = this.editingId();
    if (id === null) return null;
    if (id === '') return this.pendingRestore();
    return this.store.gastos().find((r) => r.id === id) ?? null;
  });

  // ── Save toast + undo ───────────────────────────────────────────────────
  /** Latest successfully-saved gasto. Cleared when the toast dismisses or
   *  when the user opens a new add/edit. */
  readonly lastSaved = signal<IngresoGastoRow | null>(null);
  readonly saveToastVisible = signal<boolean>(false);
  readonly saveToastMessage = signal<string>('');
  readonly undoShortcut: string[] = ['⌘', 'Z'];
  private saveToastTimer: ReturnType<typeof setTimeout> | null = null;

  readonly currentAge = computed<number>(() => {
    const anoNacimiento = this.store.cliente().anoNacimiento;
    if (anoNacimiento === null) return 55;
    return new Date().getFullYear() - anoNacimiento;
  });

  /** Highlighted ages on the chart. Pairs the position (column) with a
   *  shape (icon bubble) per data-viz-skill — color is never the only cue. */
  readonly chartEvents = computed<LifeEvent[]>(() => {
    const events: LifeEvent[] = [
      { age: this.currentAge(), label: 'Edad actual', iconKey: 'now' },
    ];
    const retiro = this.store.legadoRetiro().edadRetiro;
    if (retiro !== null && retiro !== this.currentAge()) {
      events.push({ age: retiro, label: 'Retiro esperado', iconKey: 'briefcase' });
    }
    return events;
  });

  readonly selectedRows = signal<Record<string, unknown>[]>([]);
  readonly selectedCount = computed(() => this.selectedRows().length);

  readonly chartData = computed<EvolucionDataPoint[]>(() => {
    const age = this.currentAge();
    const gastos = this.store.gastos();
    const out: EvolucionDataPoint[] = [];

    for (let offset = 0; offset <= this.HORIZON; offset++) {
      const yearAge = age + offset;
      let total = 0;
      for (const g of gastos) {
        const annual = this.projectGastoValue(g, yearAge);
        if (annual !== null) total += annual;
      }
      out.push({ age: yearAge, value: total });
    }

    return out;
  });

  readonly tableColumns: TableColumn[] = [
    { key: 'concepto', label: 'Concepto', emphasis: true },
    { key: 'inicio', label: 'Inicio' },
    { key: 'fin', label: 'Fin' },
    { key: 'incremento', label: 'Incremento' },
    { key: 'frecuencia', label: 'Frecuencia' },
    { key: 'valor', label: 'Valor', align: 'end', emphasis: true },
  ];

  /** Two-icon row toolbar — edit + delete, both inline (per the table
   *  primitive's 1-2 action rule). No duplicate; no overflow. */
  readonly tableActions: TableRowAction[] = [
    { key: 'edit', label: 'Editar', icon: 'edit', ariaLabel: 'Editar gasto' },
    {
      key: 'delete',
      label: 'Borrar',
      icon: 'delete',
      ariaLabel: 'Borrar gasto',
      variant: 'danger',
    },
  ];

  /** Confirmation modal state — bulk delete + single-row delete mirror
   *  the patrimonio pattern (afi-modal size="sm" with Cancelar / Borrar). */
  readonly confirmBulkDeleteOpen = signal<boolean>(false);
  readonly confirmRowDelete = signal<{ id: string; concepto: string } | null>(null);

  readonly tableRows = computed<Record<string, unknown>[]>(() =>
    this.store.gastos().map((row) => ({
      id: row.id,
      concepto: this.conceptoCell(row),
      inicio: this.inicioLabel(row),
      fin: this.finLabel(row),
      incremento: this.incrementoLabel(row),
      frecuencia: this.frecuenciaLabel(row.frecuencia),
      valor: this.formatEuro(row.valor),
    })),
  );

  /** Export the projected gastos series + event markers as a self-contained
   *  HTML file. Inspector-friendly: the file is just a heading + a semantic
   *  <table>, no scripts. */
  downloadChartData(): void {
    const rows = this.chartData()
      .map((d) => {
        const event = this.chartEvents().find((e) => e.age === d.age);
        const tagCell = event ? `<td>${escapeHtml(event.label)}</td>` : '<td></td>';
        return `<tr><td>${d.age}</td><td>${escapeHtml(this.formatEuro(d.value))}</td>${tagCell}</tr>`;
      })
      .join('\n');

    const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Evolución de gastos · proyección anual</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 2rem; color: #1a1a1a; }
  h1 { font-size: 1.25rem; margin-block-end: 0.25rem; }
  p.meta { color: #555; margin-block-start: 0; }
  table { border-collapse: collapse; margin-block-start: 1.5rem; }
  th, td { padding: 0.5rem 1rem; border-bottom: 1px solid #e5e5e5; text-align: left; }
  th { font-weight: 600; }
  td:nth-child(2) { text-align: right; font-variant-numeric: tabular-nums; }
</style>
</head>
<body>
<h1>Evolución de gastos</h1>
<p class="meta">Proyección anual del gasto total por edad del cliente. IPC ${(this.ipcRate * 100).toFixed(1)} %.</p>
<table>
  <thead><tr><th>Edad</th><th>Gasto anual proyectado</th><th>Hito</th></tr></thead>
  <tbody>
${rows}
  </tbody>
</table>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evolucion-gastos-${new Date().getFullYear()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  openBulkDeleteConfirm(): void {
    if (this.selectedCount() === 0) return;
    this.confirmBulkDeleteOpen.set(true);
  }

  confirmBulkDelete(): void {
    const ids = this.selectedRows()
      .map((r) => r['id'])
      .filter((id): id is string => typeof id === 'string' && id.length > 0);
    for (const id of ids) {
      this.store.removeGasto(id);
    }
    this.selectedRows.set([]);
    this.confirmBulkDeleteOpen.set(false);
  }

  clearSelection(): void {
    this.selectedRows.set([]);
  }

  onSelectionChange(rows: Record<string, unknown>[]): void {
    this.selectedRows.set(rows);
  }

  openRowDeleteConfirm(id: string): void {
    const row = this.store.gastos().find((r) => r.id === id);
    if (!row) return;
    this.confirmRowDelete.set({ id, concepto: row.concepto || 'Sin concepto' });
  }

  confirmRowDeleteApply(): void {
    const target = this.confirmRowDelete();
    if (!target) return;
    this.store.removeGasto(target.id);
    this.selectedRows.set(this.selectedRows().filter((r) => r['id'] !== target.id));
    this.confirmRowDelete.set(null);
  }

  openAdd(): void {
    this.pendingRestore.set(null);
    this.editingId.set('');
  }

  openEdit(id: string): void {
    this.pendingRestore.set(null);
    this.editingId.set(id);
  }

  closeDialog(): void {
    this.editingId.set(null);
    this.pendingRestore.set(null);
  }

  onSubmitted(row: Omit<IngresoGastoRow, 'id'>): void {
    const id = this.editingId();
    if (id === null) return;
    if (id === '') {
      this.store.addGasto(row);
      const created = this.store.gastos().at(-1);
      if (created) {
        this.showSaveToast(
          created,
          `Gasto "${row.concepto || 'Sin concepto'}" añadido`,
        );
      }
    } else {
      this.store.updateGasto(id, row);
    }
    this.closeDialog();
  }

  /** Show the post-save toast. Caller passes the just-saved row so the
   *  undo path can restore its form data when the user hits Deshacer. */
  private showSaveToast(saved: IngresoGastoRow, message: string): void {
    this.lastSaved.set(saved);
    this.saveToastMessage.set(message);
    this.saveToastVisible.set(true);
    if (this.saveToastTimer) clearTimeout(this.saveToastTimer);
    this.saveToastTimer = setTimeout(() => {
      this.saveToastVisible.set(false);
      this.lastSaved.set(null);
    }, 8000);
  }

  /** Toast Deshacer + ⌘Z entry point. Removes the freshly-saved row from
   *  the store and reopens the form modal seeded with the same data so
   *  the user can correct + re-save. No-op once the toast has dismissed. */
  undoLastSave(): void {
    const saved = this.lastSaved();
    if (!saved) return;
    this.store.removeGasto(saved.id);
    this.pendingRestore.set(saved);
    this.lastSaved.set(null);
    this.saveToastVisible.set(false);
    if (this.saveToastTimer) {
      clearTimeout(this.saveToastTimer);
      this.saveToastTimer = null;
    }
    this.editingId.set('');
  }

  dismissSaveToast(): void {
    this.saveToastVisible.set(false);
    this.lastSaved.set(null);
    if (this.saveToastTimer) {
      clearTimeout(this.saveToastTimer);
      this.saveToastTimer = null;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onUndoKeydown(event: KeyboardEvent): void {
    if (!this.saveToastVisible() || !this.lastSaved()) return;
    const isUndo =
      (event.key === 'z' || event.key === 'Z') &&
      (event.metaKey || event.ctrlKey) &&
      !event.shiftKey;
    if (!isUndo) return;
    const tag = (event.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    event.preventDefault();
    this.undoLastSave();
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
      case 'delete':
        payload.event?.stopPropagation();
        this.openRowDeleteConfirm(id);
        break;
    }
  }

  private projectGastoValue(g: IngresoGastoRow, age: number): number | null {
    const currentAge = this.currentAge();
    const isActive = this.isGastoActiveAtAge(g, age, currentAge);
    if (!isActive) return null;

    const yearsSinceStart = age - this.inicioAge(g, currentAge);
    if (yearsSinceStart < 0) return null;

    const multiplier = this.frecuenciaMultiplier(g.frecuencia);
    const baseAnnual = g.valor * multiplier;
    const growthRate = g.incrementaIPC ? this.ipcRate : g.incrementoManualPct / 100;
    const projected = baseAnnual * Math.pow(1 + growthRate, yearsSinceStart);

    return Math.round(projected);
  }

  private isGastoActiveAtAge(
    g: IngresoGastoRow,
    age: number,
    currentAge: number,
  ): boolean {
    const startAge = this.inicioAge(g, currentAge);
    const endAge = this.finAge(g, currentAge);

    if (age < startAge) return false;
    if (endAge !== null && age > endAge) return false;

    return true;
  }

  private inicioAge(g: IngresoGastoRow, currentAge: number): number {
    if (!g.isFuturo || !g.inicio) return currentAge;

    switch (g.inicio.kind) {
      case 'retiro':
        return this.store.legadoRetiro().edadRetiro ?? 67;
      case 'jubilacion':
        return 67;
      case 'edad':
        return g.inicio.value ?? currentAge;
      case 'ano':
        return this.yearToAge(g.inicio.value ?? new Date().getFullYear());
      default:
        return currentAge;
    }
  }

  private finAge(g: IngresoGastoRow, currentAge: number): number | null {
    switch (g.finalizacion.kind) {
      case 'indefinido':
        return null;
      case 'retiro-jubilacion':
        return 67;
      case 'edad-hijo': {
        const hijo = this.store.hijos().find((h) => h.id === g.finalizacion.hijoId);
        if (!hijo || hijo.anoNacimiento === null) return null;
        const hijoAge = g.finalizacion.value;
        if (hijoAge === null) return null;
        const currentYear = new Date().getFullYear();
        const hijoCurrentAge = currentYear - hijo.anoNacimiento;
        const yearsUntil = hijoAge - hijoCurrentAge;
        return currentAge + yearsUntil;
      }
      case 'edad':
        return g.finalizacion.value ?? null;
      case 'ano':
        return this.yearToAge(g.finalizacion.value ?? currentAge);
      default:
        return null;
    }
  }

  private yearToAge(year: number): number {
    const currentYear = new Date().getFullYear();
    return this.currentAge() + (year - currentYear);
  }

  private frecuenciaMultiplier(f: IngresoGastoRow['frecuencia']): number {
    switch (f) {
      case 'mensual':
        return 12;
      case 'trimestral':
        return 4;
      case 'semestral':
        return 2;
      case 'anual':
        return 1;
    }
  }

  private conceptoCell(row: IngresoGastoRow): string {
    return row.concepto || 'Sin concepto';
  }

  private inicioLabel(row: IngresoGastoRow): string {
    if (!row.isFuturo || !row.inicio) return 'Ahora';
    switch (row.inicio.kind) {
      case 'retiro':
        return 'Retiro';
      case 'jubilacion':
        return 'Jubilación';
      case 'edad':
        return row.inicio.value !== null ? `${row.inicio.value} años` : 'Manual';
      case 'ano':
        return row.inicio.value !== null ? String(row.inicio.value) : 'Manual';
      default:
        return 'Ahora';
    }
  }

  private finLabel(row: IngresoGastoRow): string {
    switch (row.finalizacion.kind) {
      case 'indefinido':
        return 'Indefinido';
      case 'retiro-jubilacion':
        return 'Jubilación';
      case 'edad-hijo': {
        const hijo = this.store.hijos().find((h) => h.id === row.finalizacion.hijoId);
        const label = hijo?.alias?.trim() || 'Hijo';
        return row.finalizacion.value !== null
          ? `${label}: ${row.finalizacion.value} años`
          : label;
      }
      case 'edad':
        return row.finalizacion.value !== null ? `${row.finalizacion.value} años` : 'Manual';
      case 'ano':
        return row.finalizacion.value !== null ? String(row.finalizacion.value) : 'Manual';
      default:
        return 'Indefinido';
    }
  }

  private incrementoLabel(row: IngresoGastoRow): string {
    if (row.incrementaIPC) return 'IPC';
    if (row.incrementoManualPct === 0) return '—';
    return `${row.incrementoManualPct}%`;
  }

  private readonly frecuenciaLabels: Record<IngresoGastoRow['frecuencia'], string> = {
    mensual: 'Mensual',
    trimestral: 'Trimestral',
    semestral: 'Semestral',
    anual: 'Anual',
  };

  private frecuenciaLabel(f: IngresoGastoRow['frecuencia']): string {
    return this.frecuenciaLabels[f];
  }

  private readonly euroFormatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  private formatEuro(n: number): string {
    return this.euroFormatter.format(n);
  }

  private tableRowId(row: Record<string, unknown>): string | null {
    const id = row['id'];
    return typeof id === 'string' && id ? id : null;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
