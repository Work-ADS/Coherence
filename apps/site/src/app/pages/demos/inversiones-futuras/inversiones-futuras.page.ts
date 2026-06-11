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
  KbdComponent,
  ModalComponent,
  PageHeaderComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
  SectionComponent,
  SelectComponent,
  TableComponent,
} from '@coherence/ui';
import type { SelectOption, TableColumn, TableRowAction } from '@coherence/ui';

import { KeyShortcutDirective } from '../../../directives/key-shortcut.directive';
import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type {
  InversionFuturaRiesgo,
  InversionFuturaRow,
  InversionFuturaTipo,
  InversionFuturaUsoVivienda,
} from '../wealth-planner-2026/store';

/**
 * Objetivos · Inversiones futuras (Brief F · V2).
 *
 * V2 split (Figma file `T3hIzIj78bTHVJhpSimJyK`, node `68489:167246`):
 * the add/edit dialog is type-conditional with 8 tipos — Liquidez, Fondos,
 * Acciones cotizadas, Participaciones empresariales, Private equity,
 * Inmobiliario, Otros activos, Deudas. Each tipo carries its own set of
 * type-specific fields layered on top of the common Nombre / Año / Valor
 * actual / Titular base. See the discriminated union in
 * `apps/site/src/app/pages/demos/wealth-planner-2026/store.ts`.
 */
@Component({
  selector: 'site-inversiones-futuras-page',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    KbdComponent,
    ModalComponent,
    PageHeaderComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
    SectionComponent,
    SelectComponent,
    TableComponent,
    ObjetivosPageShellComponent,
    KeyShortcutDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inversiones-futuras.page.html',
  styleUrls: ['./inversiones-futuras.page.scss'],
})
export class InversionesFuturasPage {
  readonly store = inject(WealthPlannerStore);

  /** Cmd/Ctrl + A — bound via `siteKeyShortcut="a"` on the primary CTA. */
  readonly addShortcut: string[] = ['⌘', 'A'];

  // ── Tipo options (Figma V2: 8 tipos) ──────────────────────────────────
  readonly tipoOptions: SelectOption[] = [
    { value: 'liquidez', label: 'Liquidez' },
    { value: 'fondos', label: 'Fondos de inversión' },
    { value: 'acciones-cotizadas', label: 'Acciones cotizadas' },
    {
      value: 'participaciones-empresariales',
      label: 'Participaciones empresariales',
    },
    { value: 'private-equity', label: 'Private equity' },
    { value: 'inmobiliario', label: 'Inmobiliario' },
    { value: 'otros-activos', label: 'Otros activos' },
    { value: 'deudas', label: 'Deudas' },
  ];

  // ── Shared option sets for type-specific fields ───────────────────────
  readonly riesgoOptions: SelectOption[] = [
    { value: 'nulo', label: 'Nulo' },
    { value: 'bajo', label: 'Bajo' },
    { value: 'moderado', label: 'Moderado' },
    { value: 'alto', label: 'Alto' },
    { value: 'muy-alto', label: 'Muy alto' },
  ];

  readonly usoViviendaOptions: SelectOption[] = [
    { value: 'principal', label: 'Vivienda principal' },
    { value: 'secundaria', label: 'Vivienda secundaria' },
    { value: 'inversion', label: 'Inversión' },
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

  /**
   * Activo financiado options (Deudas tipo): every OTHER inversión futura the
   * user has already added — a Deuda links to the asset it finances.
   */
  readonly activoFinanciadoOptions = computed<SelectOption[]>(() =>
    this.store
      .inversionesFuturas()
      .filter((row) => row.id !== this.editingId() && row.tipo !== 'deudas')
      .map((row) => ({
        value: row.id,
        label: row.nombre || 'Sin nombre',
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

  // ── <afi-table> column + action defs ──────────────────────────────────
  readonly tableColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre', emphasis: true },
    { key: 'tipo', label: 'Tipo' },
    { key: 'anio', label: 'Año' },
    { key: 'titular', label: 'Titular' },
    { key: 'importe', label: 'Valor actual', align: 'end' },
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
   * strings (tipo label, año, titular label, valor actual €) so the table
   * can render them via its default `cellText` formatter.
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

  /** True when the dialog should render the "¿Hay financiación asociada?" radio. */
  readonly showsFinanciacion = computed(() => {
    const tipo = this.editing()?.tipo;
    // Per Figma, Deudas does NOT carry this radio — a debt is itself the
    // financiación. All other tipos (including Draft) render it.
    return tipo !== 'deudas';
  });

  // ── Label helpers (used by the table + edit form) ─────────────────────
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
    // Spread keeps every type-specific field intact; the cast widens the
    // Draft return type so the union shape matches.
    this.store.updateInversionFutura(next.id, {
      ...source,
      id: next.id,
      nombre: source.nombre ? `${source.nombre} (copia)` : '',
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

  /**
   * Switching tipo seeds the type-specific defaults so the next render has
   * a fully-typed row to narrow against. Without this, going from
   * `liquidez` → `inmobiliario` would leave Inmobiliario's required
   * `revalorizacionEsperadaPct` undefined and TS would still accept it
   * (the union spreads via Partial), which is exactly the discipline the
   * union was meant to enforce.
   */
  setTipo(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    const tipo = (value as InversionFuturaTipo | null) ?? null;
    this.store.updateInversionFutura(id, this.defaultsForTipo(tipo));
  }

  private defaultsForTipo(
    tipo: InversionFuturaTipo | null,
  ): Partial<InversionFuturaRow> {
    switch (tipo) {
      case null:
      case 'liquidez':
        return { tipo };
      case 'fondos':
        return { tipo, rentabilidadRiesgo: null };
      case 'acciones-cotizadas':
        return { tipo, dividendoAnualPct: null };
      case 'participaciones-empresariales':
        return { tipo, rentabilidadRiesgo: null, dividendoAnualPct: null };
      case 'private-equity':
        return {
          tipo,
          compromisoPago: 0,
          desembolsoRealizado: 0,
          anioFinDesembolsos: null,
          anioInicioDistribuciones: null,
          anioFinDistribuciones: null,
          rentabilidadRiesgo: null,
        };
      case 'inmobiliario':
        return {
          tipo,
          revalorizacionEsperadaPct: null,
          nivelRiesgo: null,
          uso: null,
        };
      case 'otros-activos':
        return {
          tipo,
          rentabilidadRiesgo: null,
          ingresosNetosAnualesPct: null,
        };
      case 'deudas':
        return {
          tipo,
          tipoInteresPct: null,
          plazoAnios: null,
          activoFinanciadoId: null,
          // Deudas drops the financiación radio per Figma.
          financiacionAsociada: null,
        };
    }
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

  setFinanciacionAsociada(value: string): void {
    const id = this.editingId();
    if (id === null) return;
    // afi-radio-group emits the selected option's `value` as string.
    this.store.updateInversionFutura(id, {
      financiacionAsociada: value === 'si',
    });
  }

  // ── Type-specific setters ─────────────────────────────────────────────
  setRentabilidadRiesgo(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      rentabilidadRiesgo: (value as InversionFuturaRiesgo | null) ?? null,
    });
  }

  setDividendoAnualPct(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      dividendoAnualPct: this.toNumberOrNull(value),
    });
  }

  setIngresosNetosAnualesPct(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      ingresosNetosAnualesPct: this.toNumberOrNull(value),
    });
  }

  setCompromisoPago(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    const num = this.toNumberOrNull(value);
    this.store.updateInversionFutura(id, {
      compromisoPago: num === null ? 0 : Math.max(0, num),
    });
  }

  setDesembolsoRealizado(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    const num = this.toNumberOrNull(value);
    this.store.updateInversionFutura(id, {
      desembolsoRealizado: num === null ? 0 : Math.max(0, num),
    });
  }

  setAnioFinDesembolsos(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      anioFinDesembolsos: this.toNumberOrNull(value),
    });
  }

  setAnioInicioDistribuciones(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      anioInicioDistribuciones: this.toNumberOrNull(value),
    });
  }

  setAnioFinDistribuciones(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      anioFinDistribuciones: this.toNumberOrNull(value),
    });
  }

  setRevalorizacionEsperadaPct(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      revalorizacionEsperadaPct: this.toNumberOrNull(value),
    });
  }

  setNivelRiesgo(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      nivelRiesgo: (value as InversionFuturaRiesgo | null) ?? null,
    });
  }

  setUsoVivienda(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      uso: (value as InversionFuturaUsoVivienda | null) ?? null,
    });
  }

  setTipoInteresPct(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      tipoInteresPct: this.toNumberOrNull(value),
    });
  }

  setPlazoAnios(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      plazoAnios: this.toNumberOrNull(value),
    });
  }

  setActivoFinanciadoId(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      activoFinanciadoId:
        value === null || value === '' ? null : String(value),
    });
  }
}
