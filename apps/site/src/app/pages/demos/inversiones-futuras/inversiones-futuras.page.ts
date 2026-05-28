import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  ButtonComponent,
  InputComponent,
  ModalComponent,
  PageHeaderComponent,
  SelectComponent,
  TableComponent,
} from '@coherence/ui';
import type { SelectOption, TableColumn, TableRowAction } from '@coherence/ui';

import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type {
  InversionFuturaRow,
  InversionFuturaTipo,
} from '../wealth-planner-2026/store';

/**
 * Objetivos · Inversiones futuras (Brief F).
 *
 * Optional section — captures planned future asset acquisitions (Vivienda
 * o Otros). Table + add/edit modal, same shape as Sociedades and
 * Ingresos/Gastos. The `<site-objetivos-banner>` strip is gated on
 * `store.legadoRetiroEstablished()` via the shared `<site-objetivos-page-shell>`.
 *
 * Figma reference: node `28:174808` ("↳ Inversiones futuras") in file
 * `888lN7vbJSc4gLYt7nP3DW`. PDF: p.5 ("Inversiones futuras (opcional)").
 */
@Component({
  selector: 'site-inversiones-futuras-page',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    ModalComponent,
    PageHeaderComponent,
    SelectComponent,
    TableComponent,
    ObjetivosPageShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inversiones-futuras.page.html',
  styleUrls: ['./inversiones-futuras.page.scss'],
})
export class InversionesFuturasPage {
  readonly store = inject(WealthPlannerStore);

  // ── Tipo options (locked per PDF p.5) ─────────────────────────────────
  readonly tipoOptions: SelectOption[] = [
    { value: 'vivienda', label: 'Vivienda' },
    { value: 'otros', label: 'Otros' },
  ];

  /**
   * Titular options derived from the Familia store — same shape as Sociedades'
   * participación accionarial picker but flattened to SelectOption[].
   */
  readonly titularOptions = computed<SelectOption[]>(() =>
    this.store.familiaParticipantes().map((p) => ({
      value: p.id,
      label: p.label,
    })),
  );

  // ── Dialog state ──────────────────────────────────────────────────────
  /** id of the inversión being edited; null when dialog is closed. */
  readonly editingId = signal<string | null>(null);
  readonly dialogOpen = computed(() => this.editingId() !== null);

  readonly editing = computed<InversionFuturaRow | null>(() => {
    const id = this.editingId();
    if (id === null) return null;
    return this.store.inversionesFuturas().find((row) => row.id === id) ?? null;
  });

  // ── <afi-table> column + action defs (Propuesta preset — modal flavor) ─
  readonly tableColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre', emphasis: true },
    { key: 'tipo', label: 'Tipo' },
    { key: 'anio', label: 'Año' },
    { key: 'titular', label: 'Titular' },
    { key: 'importe', label: 'Importe', align: 'end' },
  ];

  readonly tableActions: TableRowAction[] = [
    { key: 'edit', label: 'Editar', ariaLabel: 'Editar inversión futura', icon: 'edit' },
    { key: 'duplicate', label: 'Duplicar', overflow: true },
    {
      key: 'delete',
      label: 'Borrar',
      overflow: true,
      variant: 'danger',
    },
  ];

  /**
   * Display rows. Maps raw enum values + numeric fields to human-formatted
   * strings (tipo label, año, titular label, importe €) so the table can
   * render them via its default `cellText` formatter.
   */
  readonly tableRows = computed(() =>
    this.store.inversionesFuturas().map((row) => ({
      id: row.id,
      nombre: row.nombre || 'Sin nombre',
      tipo: this.tipoLabel(row.tipo),
      anio: this.formatAnio(row.anio),
      titular: this.titularLabel(row.titular),
      importe: this.formatEuro(row.importe),
    })),
  );

  // ── Label helpers (used by the table) ─────────────────────────────────
  tipoLabel(tipo: InversionFuturaTipo | null): string {
    return this.tipoOptions.find((o) => o.value === tipo)?.label ?? '—';
  }

  titularLabel(id: string | null): string {
    if (id === null) return '—';
    return this.titularOptions().find((o) => o.value === id)?.label ?? '—';
  }

  formatEuro(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatAnio(anio: number | null): string {
    return anio === null ? '—' : String(anio);
  }

  // ── Actions ───────────────────────────────────────────────────────────
  openAdd(): void {
    const next = this.store.addInversionFutura();
    this.editingId.set(next.id);
  }

  openEdit(id: string): void {
    this.editingId.set(id);
  }

  closeDialog(): void {
    this.editingId.set(null);
  }

  removeInversionFutura(id: string, event?: Event): void {
    event?.stopPropagation();
    this.store.removeInversionFutura(id);
  }

  /** Duplicar: clone source fields onto a fresh row, then open the modal. */
  duplicateInversionFutura(id: string): void {
    const source = this.store.inversionesFuturas().find((r) => r.id === id);
    if (!source) return;
    const next = this.store.addInversionFutura();
    this.store.updateInversionFutura(next.id, {
      nombre: source.nombre ? `${source.nombre} (copia)` : '',
      tipo: source.tipo,
      anio: source.anio,
      titular: source.titular,
      importe: source.importe,
    });
    this.editingId.set(next.id);
  }

  /** Row-click handler — opens edit modal. */
  onTableRowClick(event: { row: Record<string, unknown>; event: MouseEvent }): void {
    this.openEdit(event.row['id'] as string);
  }

  /** Row-action dispatcher (inline + overflow). */
  onTableAction(event: { action: TableRowAction; row: Record<string, unknown> }): void {
    const id = event.row['id'] as string;
    switch (event.action.key) {
      case 'edit':
        this.openEdit(id);
        break;
      case 'duplicate':
        this.duplicateInversionFutura(id);
        break;
      case 'delete':
        this.removeInversionFutura(id);
        break;
    }
  }

  // ── Field handlers ────────────────────────────────────────────────────
  private toStr(value: string | number | null): string {
    return value === null ? '' : String(value);
  }

  private toNumberOrNull(value: string | number | null): number | null {
    if (value === null || value === '') return null;
    const next = Number(value);
    return Number.isFinite(next) ? next : null;
  }

  setNombre(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, { nombre: this.toStr(value) });
  }

  setTipo(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      tipo: (value as InversionFuturaTipo | null) ?? null,
    });
  }

  setAnio(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, { anio: this.toNumberOrNull(value) });
  }

  setImporte(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    const num = this.toNumberOrNull(value);
    this.store.updateInversionFutura(id, {
      importe: num === null ? 0 : Math.max(0, num),
    });
  }

  setTitular(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      titular: value === null || value === '' ? null : String(value),
    });
  }
}
