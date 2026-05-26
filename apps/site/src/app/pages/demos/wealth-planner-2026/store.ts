import { Injectable, computed, signal } from '@angular/core';

/**
 * WealthPlannerStore — shared signal-based state for all Situación Actual
 * pages (Brief A standup; Briefs B–D extend).
 *
 * Lives at /demos/wealth-planner-2026 and is injected by every Situación
 * page (Familia, Sociedades, Patrimonio, Ingresos, Gastos) plus the
 * planner sidebar (which derives chip state from it).
 *
 * v1 = in-memory only. No backend, no persistence across reloads.
 */

export type Sexo = 'femenino' | 'masculino' | 'otro';

export type EstadoCivil = 'soltero' | 'casado' | 'pareja-de-hecho' | 'divorciado' | 'viudo';

export type RegimenEconomico = 'gananciales' | 'separacion-de-bienes' | 'participacion';

export type Parentesco = 'padre' | 'madre' | 'suegro' | 'suegra' | 'abuelo' | 'abuela' | 'otro';

export interface ClienteData {
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: Sexo | null;
  estadoCivil: EstadoCivil | null;
  regimenEconomico: RegimenEconomico | null;
  nacionalidad: string;
  residenciaFiscal: string;
  nif: string;
}

export interface ConyugeData {
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: Sexo | null;
  nacionalidad: string;
}

export interface HijoData {
  id: string;
  nombre: string;
  fechaNacimiento: string;
  aCargo: boolean;
}

export interface AscendienteData {
  id: string;
  nombre: string;
  parentesco: Parentesco | null;
  fechaNacimiento: string;
  aCargo: boolean;
}

// ── Ingresos + Gastos (Brief D) ──────────────────────────────────────────
export type Frecuencia = 'mensual' | 'trimestral' | 'semestral' | 'anual';

export type InicioKind = 'retiro' | 'jubilacion' | 'edad' | 'ano';

export type FinalizacionKind = 'indefinido' | 'retiro-jubilacion' | 'edad-hijo' | 'edad' | 'ano';

export interface IngresoGastoRow {
  id: string;
  concepto: string;
  isFuturo: boolean;
  inicio: {
    kind: InicioKind;
    value: number | null;
  } | null;
  finalizacion: {
    kind: FinalizacionKind;
    hijoId: string | null;
    value: number | null;
  };
  frecuencia: Frecuencia;
  /** IPC retired per Borja 2026-02-27. Manual increment only. 0 = no incremento. */
  incrementoManualPct: number;
  valor: number;
}

// ── Patrimonio (Brief C seed for Objetivos consumers) ──────────────────────
export type PatrimonioTipo =
  | 'liquidez'
  | 'inversion'
  | 'inmobiliario'
  | 'pension'
  | 'participacion'
  | 'otro';

export interface PatrimonioAsset {
  id: string;
  nombre: string;
  tipo: PatrimonioTipo;
  valor: number;
}

// ── Objetivos · Legado y retiro (Brief E) ──────────────────────────────────
export type LegadoObjetivo = 'mantener-todo' | 'mantener-vivienda' | 'manual';

export interface LegadoRetiroData {
  edadSeguridad: number;
  legadoObjetivo: LegadoObjetivo | null;
  activosConservar: string[];
  patrimonioFinancieroAdicional: number;
  edadRetiro: number | null;
  continuarCotizaciones: boolean;
}

// ── Objetivos · Desinversiones futuras (Brief G) ────────────────────────────
export type DesinversionObjetivo = 'liquidez' | 'rentas';

export interface DesinversionFutura {
  id: string;
  nombre: string;
  objetivo: DesinversionObjetivo | null;
  /** Reuses the Brief D Frecuencia type — only used when objetivo === 'rentas'. */
  frecuencia: Frecuencia | null;
  /** Years over which the rentas are paid out (only when objetivo === 'rentas'). */
  plazoAnios: number | null;
  /** Patrimonio asset ids selected for this desinversión. */
  activosAsignados: string[];
  /** Gross amount (computed inline from selected assets in v1; see page). */
  importeBruto: number;
  /** Net amount (gross minus mocked fiscal cost; see page). */
  importeNeto: number;
}

// ── Objetivos · Inversiones futuras (Brief F) ──────────────────────────────
export type InversionFuturaTipo = 'vivienda' | 'otros';

export interface InversionFuturaRow {
  id: string;
  nombre: string;
  tipo: InversionFuturaTipo | null;
  anio: number | null;
  importe: number;
  /** Family-member id ('cliente' | 'conyuge' | hijo.id | ascendiente.id) or null. */
  titular: string | null;
}

// ── Sociedades (Brief B) ─────────────────────────────────────────────────
export type Tributacion = 'patrimonial' | 'holding' | 'socimi';

export interface ParticipanteSociedad {
  /** id of a family member ('cliente' | 'conyuge' | 'hijo-{N}' | 'asc-{N}') or another sociedad ('sociedad-{N}') */
  id: string;
  label: string;
  porcentaje: number;
}

export interface Sociedad {
  id: string;
  nombre: string;
  tributacion: Tributacion | null;
  participantes: ParticipanteSociedad[];
}

export type SectionState = 'empty' | 'in-progress' | 'complete';

const EMPTY_CLIENTE: ClienteData = {
  nombre: '',
  apellidos: '',
  fechaNacimiento: '',
  sexo: null,
  estadoCivil: null,
  regimenEconomico: null,
  nacionalidad: '',
  residenciaFiscal: '',
  nif: '',
};

const DEFAULT_LEGADO_RETIRO: LegadoRetiroData = {
  edadSeguridad: 100,
  legadoObjetivo: null,
  activosConservar: [],
  patrimonioFinancieroAdicional: 0,
  edadRetiro: null,
  continuarCotizaciones: true,
};

let nextHijoId = 1;
let nextAscendienteId = 1;
let nextSociedadId = 1;
let nextIngresoId = 1;
let nextGastoId = 1;
let nextInversionFuturaId = 1;
let nextDesinversionId = 1;

@Injectable({ providedIn: 'root' })
export class WealthPlannerStore {
  // ──────────────────────────────────────────────────────────────────────
  // Familia (Brief A)
  // ──────────────────────────────────────────────────────────────────────

  readonly cliente = signal<ClienteData>({ ...EMPTY_CLIENTE });
  readonly tienePareja = signal<boolean>(false);
  readonly conyuge = signal<ConyugeData | null>(null);
  readonly hijos = signal<HijoData[]>([]);
  readonly ascendientes = signal<AscendienteData[]>([]);

  /** Sidebar chip state derived from cliente completeness. */
  readonly familiaState = computed<SectionState>(() => {
    const c = this.cliente();
    if (!c.nombre.trim()) return 'empty';
    const required =
      c.nombre.trim() && c.apellidos.trim() && c.fechaNacimiento && c.estadoCivil !== null;
    return required ? 'complete' : 'in-progress';
  });

  // Mutations
  setCliente(partial: Partial<ClienteData>): void {
    this.cliente.update((c) => ({ ...c, ...partial }));
  }

  setTienePareja(value: boolean): void {
    this.tienePareja.set(value);
    if (!value) {
      this.conyuge.set(null);
    } else if (this.conyuge() === null) {
      this.conyuge.set({
        nombre: '',
        apellidos: '',
        fechaNacimiento: '',
        sexo: null,
        nacionalidad: '',
      });
    }
  }

  setConyuge(partial: Partial<ConyugeData>): void {
    this.conyuge.update((c) => (c === null ? null : { ...c, ...partial }));
  }

  addHijo(): void {
    const id = `hijo-${nextHijoId++}`;
    this.hijos.update((rows) => [...rows, { id, nombre: '', fechaNacimiento: '', aCargo: false }]);
  }

  removeHijo(id: string): void {
    this.hijos.update((rows) => rows.filter((h) => h.id !== id));
  }

  updateHijo(id: string, partial: Partial<HijoData>): void {
    this.hijos.update((rows) => rows.map((h) => (h.id === id ? { ...h, ...partial } : h)));
  }

  addAscendiente(): void {
    const id = `asc-${nextAscendienteId++}`;
    this.ascendientes.update((rows) => [
      ...rows,
      {
        id,
        nombre: '',
        parentesco: null,
        fechaNacimiento: '',
        aCargo: false,
      },
    ]);
  }

  removeAscendiente(id: string): void {
    this.ascendientes.update((rows) => rows.filter((a) => a.id !== id));
  }

  updateAscendiente(id: string, partial: Partial<AscendienteData>): void {
    this.ascendientes.update((rows) => rows.map((a) => (a.id === id ? { ...a, ...partial } : a)));
  }

  // ──────────────────────────────────────────────────────────────────────
  // Sociedades (Brief B)
  // ──────────────────────────────────────────────────────────────────────

  readonly sociedades = signal<Sociedad[]>([
    // Seed example so the populated-table state is visible on first visit.
    {
      id: 'sociedad-seed',
      nombre: 'Inversiones Siglo XXI, SL',
      tributacion: 'patrimonial',
      participantes: [
        { id: 'cliente', label: 'Cliente', porcentaje: 50 },
        { id: 'conyuge', label: 'Cónyuge', porcentaje: 30 },
      ],
    },
  ]);

  /** Sidebar chip state: empty when no sociedades, complete when at least one exists. */
  readonly sociedadesState = computed<SectionState>(() => {
    const list = this.sociedades();
    if (list.length === 0) return 'empty';
    const allValid = list.every((s) => s.nombre.trim() !== '' && s.tributacion !== null);
    return allValid ? 'complete' : 'in-progress';
  });

  /** Family-member options derived from current cliente / conyuge / hijos / ascendientes. */
  readonly familiaParticipantes = computed<ParticipanteSociedad[]>(() => {
    const out: ParticipanteSociedad[] = [];
    const c = this.cliente();
    if (c.nombre.trim()) {
      out.push({
        id: 'cliente',
        label: `${c.nombre} ${c.apellidos}`.trim() || 'Cliente',
        porcentaje: 0,
      });
    } else {
      out.push({ id: 'cliente', label: 'Cliente', porcentaje: 0 });
    }
    if (this.tienePareja()) {
      const co = this.conyuge();
      out.push({
        id: 'conyuge',
        label: co?.nombre.trim() ? `${co.nombre} ${co.apellidos}`.trim() : 'Cónyuge',
        porcentaje: 0,
      });
    }
    this.hijos().forEach((h, i) => {
      out.push({
        id: h.id,
        label: h.nombre.trim() || `Hijo ${i + 1}`,
        porcentaje: 0,
      });
    });
    this.ascendientes().forEach((a, i) => {
      out.push({
        id: a.id,
        label: a.nombre.trim() || `Ascendiente ${i + 1}`,
        porcentaje: 0,
      });
    });
    return out;
  });

  addSociedad(): Sociedad {
    const id = `sociedad-${nextSociedadId++}`;
    const next: Sociedad = {
      id,
      nombre: '',
      tributacion: null,
      participantes: this.familiaParticipantes(),
    };
    this.sociedades.update((rows) => [...rows, next]);
    return next;
  }

  updateSociedad(id: string, partial: Partial<Sociedad>): void {
    this.sociedades.update((rows) => rows.map((s) => (s.id === id ? { ...s, ...partial } : s)));
  }

  removeSociedad(id: string): void {
    this.sociedades.update((rows) => rows.filter((s) => s.id !== id));
  }

  updateParticipante(sociedadId: string, participanteId: string, porcentaje: number): void {
    this.sociedades.update((rows) =>
      rows.map((s) =>
        s.id === sociedadId
          ? {
              ...s,
              participantes: s.participantes.map((p) =>
                p.id === participanteId ? { ...p, porcentaje } : p,
              ),
            }
          : s,
      ),
    );
  }

  // ──────────────────────────────────────────────────────────────────────
  // Ingresos + Gastos (Brief D)
  // ──────────────────────────────────────────────────────────────────────

  readonly ingresos = signal<IngresoGastoRow[]>([
    {
      id: 'ingreso-seed-1',
      concepto: 'Herencia Manuel',
      isFuturo: true,
      inicio: { kind: 'ano', value: 2032 },
      finalizacion: { kind: 'indefinido', hijoId: null, value: null },
      frecuencia: 'anual',
      incrementoManualPct: 0,
      valor: 150000,
    },
  ]);

  readonly gastos = signal<IngresoGastoRow[]>([
    {
      id: 'gasto-seed-1',
      concepto: 'Dependencia y cuidados',
      isFuturo: true,
      inicio: { kind: 'ano', value: 2050 },
      finalizacion: { kind: 'indefinido', hijoId: null, value: null },
      frecuencia: 'anual',
      incrementoManualPct: 3,
      valor: 50000,
    },
    {
      id: 'gasto-seed-2',
      concepto: 'Incremento ocio',
      isFuturo: true,
      inicio: { kind: 'retiro', value: null },
      finalizacion: { kind: 'ano', hijoId: null, value: 2050 },
      frecuencia: 'anual',
      incrementoManualPct: 3,
      valor: 60000,
    },
  ]);

  readonly ingresosState = computed<SectionState>(() =>
    this.ingresos().length === 0 ? 'empty' : 'in-progress',
  );

  readonly gastosState = computed<SectionState>(() =>
    this.gastos().length === 0 ? 'empty' : 'in-progress',
  );

  addIngreso(row: Omit<IngresoGastoRow, 'id'>): IngresoGastoRow {
    const id = `ingreso-${nextIngresoId++}`;
    const next: IngresoGastoRow = { ...row, id };
    this.ingresos.update((rows) => [...rows, next]);
    return next;
  }

  updateIngreso(id: string, partial: Partial<IngresoGastoRow>): void {
    this.ingresos.update((rows) => rows.map((r) => (r.id === id ? { ...r, ...partial } : r)));
  }

  removeIngreso(id: string): void {
    this.ingresos.update((rows) => rows.filter((r) => r.id !== id));
  }

  addGasto(row: Omit<IngresoGastoRow, 'id'>): IngresoGastoRow {
    const id = `gasto-${nextGastoId++}`;
    const next: IngresoGastoRow = { ...row, id };
    this.gastos.update((rows) => [...rows, next]);
    return next;
  }

  updateGasto(id: string, partial: Partial<IngresoGastoRow>): void {
    this.gastos.update((rows) => rows.map((r) => (r.id === id ? { ...r, ...partial } : r)));
  }

  removeGasto(id: string): void {
    this.gastos.update((rows) => rows.filter((r) => r.id !== id));
  }

  // ──────────────────────────────────────────────────────────────────────
  // Patrimonio (Brief C) — minimal shared slice for Objetivos selectors
  // ──────────────────────────────────────────────────────────────────────

  readonly patrimonio = signal<PatrimonioAsset[]>([
    {
      id: 'patrimonio-vivienda-principal',
      nombre: 'Vivienda principal',
      tipo: 'inmobiliario',
      valor: 450000,
    },
    {
      id: 'patrimonio-apartamento-cadiz',
      nombre: 'Apartamento en Cádiz',
      tipo: 'inmobiliario',
      valor: 280000,
    },
    {
      id: 'patrimonio-cartera-renta-4',
      nombre: 'Cartera Renta 4',
      tipo: 'inversion',
      valor: 62300,
    },
    {
      id: 'patrimonio-plan-pensiones',
      nombre: 'Plan de pensiones',
      tipo: 'pension',
      valor: 120000,
    },
    {
      id: 'patrimonio-liquidez-santander',
      nombre: 'Cuenta Santander',
      tipo: 'liquidez',
      valor: 45200,
    },
  ]);

  readonly patrimonioState = computed<SectionState>(() =>
    this.patrimonio().length === 0 ? 'empty' : 'complete',
  );

  // ──────────────────────────────────────────────────────────────────────
  // Objetivos · Legado y retiro (Brief E)
  // ──────────────────────────────────────────────────────────────────────

  readonly legadoRetiroEstablished = signal<boolean>(false);
  readonly legadoRetiro = signal<LegadoRetiroData>({
    ...DEFAULT_LEGADO_RETIRO,
  });

  readonly legadoRetiroState = computed<SectionState>(() => {
    if (!this.legadoRetiroEstablished()) return 'empty';

    const lr = this.legadoRetiro();
    if (lr.legadoObjetivo === null || lr.edadRetiro === null) {
      return 'in-progress';
    }

    if (lr.legadoObjetivo === 'manual' && lr.activosConservar.length === 0) {
      return 'in-progress';
    }

    return 'complete';
  });

  setLegadoRetiroEstablished(value: boolean): void {
    this.legadoRetiroEstablished.set(value);
  }

  setLegadoRetiro(partial: Partial<LegadoRetiroData>): void {
    this.legadoRetiro.update((current) => {
      const next = { ...current, ...partial };

      if (partial.legadoObjetivo !== undefined && partial.legadoObjetivo !== 'manual') {
        next.activosConservar = [];
      }

      return next;
    });
  }

  toggleAssetToConservar(id: string): void {
    this.legadoRetiro.update((current) => {
      const selected = current.activosConservar.includes(id);
      return {
        ...current,
        activosConservar: selected
          ? current.activosConservar.filter((assetId) => assetId !== id)
          : [...current.activosConservar, id],
      };
    });
  }

  setAssetToConservar(id: string, selected: boolean): void {
    const currentSelected = this.legadoRetiro().activosConservar.includes(id);
    if (currentSelected === selected) return;
    this.toggleAssetToConservar(id);
  }

  // ──────────────────────────────────────────────────────────────────────
  // Objetivos · Inversiones futuras (Brief F)
  // ──────────────────────────────────────────────────────────────────────

  readonly inversionesFuturas = signal<InversionFuturaRow[]>([]);

  /**
   * Optional section — there are no required fields, so the chip never reaches
   * `complete`. Empty list = `empty`; any row exists = `in-progress`.
   */
  readonly inversionesFuturasState = computed<SectionState>(() =>
    this.inversionesFuturas().length === 0 ? 'empty' : 'in-progress',
  );

  addInversionFutura(): InversionFuturaRow {
    const next: InversionFuturaRow = {
      id: `inv-fut-${nextInversionFuturaId++}`,
      nombre: '',
      tipo: null,
      anio: null,
      importe: 0,
      titular: null,
    };
    this.inversionesFuturas.update((rows) => [...rows, next]);
    return next;
  }

  updateInversionFutura(id: string, partial: Partial<InversionFuturaRow>): void {
    this.inversionesFuturas.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...partial } : row)),
    );
  }

  removeInversionFutura(id: string): void {
    this.inversionesFuturas.update((rows) => rows.filter((row) => row.id !== id));
  }

  // ──────────────────────────────────────────────────────────────────────
  // Objetivos · Desinversiones futuras (Brief G)
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Seeded with the two PDF p.5 examples so the list page is not empty on
   * first load (a stakeholder demo expectation). The asset ids reference the
   * patrimonio seed; if a senior cleans up patrimonio later, keep these in
   * sync or refactor the seed to derive from `patrimonio()`.
   */
  readonly desinversiones = signal<DesinversionFutura[]>([
    {
      id: 'desinv-seed-1',
      nombre: 'Venta vivienda Cádiz',
      objetivo: 'liquidez',
      frecuencia: null,
      plazoAnios: null,
      activosAsignados: ['patrimonio-apartamento-cadiz'],
      importeBruto: 280000,
      importeNeto: 247800,
    },
    {
      id: 'desinv-seed-2',
      nombre: 'Venta cartera Renta 4',
      objetivo: 'rentas',
      frecuencia: 'mensual',
      plazoAnios: 5,
      activosAsignados: ['patrimonio-cartera-renta-4'],
      importeBruto: 62300,
      importeNeto: 51800,
    },
  ]);

  /**
   * Optional section — same shape as Inversiones futuras: empty when no rows,
   * in-progress when at least one row exists. Never reaches complete because
   * there are no required fields the gestor must fill.
   */
  readonly desinversionesState = computed<SectionState>(() =>
    this.desinversiones().length === 0 ? 'empty' : 'in-progress',
  );

  addDesinversion(): DesinversionFutura {
    const next: DesinversionFutura = {
      id: `desinv-${nextDesinversionId++}`,
      nombre: '',
      objetivo: null,
      frecuencia: null,
      plazoAnios: null,
      activosAsignados: [],
      importeBruto: 0,
      importeNeto: 0,
    };
    this.desinversiones.update((rows) => [...rows, next]);
    return next;
  }

  updateDesinversion(id: string, partial: Partial<DesinversionFutura>): void {
    this.desinversiones.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...partial } : row)),
    );
  }

  removeDesinversion(id: string): void {
    this.desinversiones.update((rows) => rows.filter((row) => row.id !== id));
  }

  toggleActivoAsignado(desinversionId: string, activoId: string): void {
    this.desinversiones.update((rows) =>
      rows.map((row) => {
        if (row.id !== desinversionId) return row;
        const selected = row.activosAsignados.includes(activoId);
        return {
          ...row,
          activosAsignados: selected
            ? row.activosAsignados.filter((id) => id !== activoId)
            : [...row.activosAsignados, activoId],
        };
      }),
    );
  }
}
