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

/**
 * Familia field shape — aligned with Figma Wealth planner V2 (file
 * `888lN7vbJSc4gLYt7nP3DW`, page "↳ Familia ✅"). The cliente and cónyuge
 * share a single `PersonaBase` shape; hijos / ascendientes carry a smaller
 * subset because the planner doesn't need their tax/employment details.
 *
 * TODO(awp-familia): split `inactivo` into `inactivo-sin-cotizaciones` and
 * `inactivo-con-cotizaciones` again if/when the backend differentiates the
 * pension calculation. Today the single `inactivo` collapses both since the
 * fields they capture are identical (años cotizados, año de baja, tipo de
 * cotización). Confirm with Borja before any backend migration.
 */
export type TipoActividad = 'activo' | 'jubilado' | 'inactivo';

export type TipoCotizacion =
  | 'regimen-general'
  | 'autonomo'
  | 'agrario'
  | 'mar'
  | 'empleadas-hogar'
  | 'otro';

export type Parentesco = 'padre' | 'madre' | 'suegro' | 'suegra' | 'abuelo' | 'abuela' | 'otro';

/**
 * Tri-state answer to "¿Tiene cónyuge?".
 * - `unanswered` — initial state, sidebar chip stays in-progress at most.
 * - `no`         — explicit "no spouse"; conyuge data is null.
 * - `yes`        — has spouse; `conyuge` carries the form data.
 */
export type ConyugeStatus = 'unanswered' | 'no' | 'yes';

/**
 * Disability options. Spanish IMSERSO scale.
 * TODO(awp-familia): confirm the canonical option list against the Figma
 * select. Today's enum is a reasonable working set — may need to add
 * "necesita tercera persona" / "movilidad reducida" classifications.
 */
export type GradoDiscapacidad = 'sin' | '33-64' | '65-74' | '75+';

export interface PersonaBase {
  alias: string;
  residenciaFiscal: string;
  anoNacimiento: number | null;
  gradoDiscapacidad: GradoDiscapacidad | null;
  tipoActividad: TipoActividad | null;
  /** Conditional · Jubilado → year of retirement. */
  anoJubilacion: number | null;
  /** Conditional · Inactivo → years contributed before leaving the workforce. */
  anosCotizados: number | null;
  /** Conditional · Inactivo → year contributions stopped. */
  anoDejoCotizar: number | null;
  /** Conditional · Inactivo → contribution scheme. */
  tipoCotizacion: TipoCotizacion | null;
}

export type ClienteData = PersonaBase;
export type ConyugeData = PersonaBase;

export interface HijoData {
  id: string;
  alias: string;
  anoNacimiento: number | null;
  gradoDiscapacidad: GradoDiscapacidad | null;
  /** True when this hijo is financially dependent on the cliente. */
  delCliente: boolean;
}

export interface AscendienteData {
  id: string;
  alias: string;
  parentesco: Parentesco | null;
  anoNacimiento: number | null;
  gradoDiscapacidad: GradoDiscapacidad | null;
  /** True when this ascendiente is financially dependent on the cliente. */
  delCliente: boolean;
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
//
// v1 tipos kept for cross-Brief compatibility (legado-retiro, desinversiones-
// futuras read these). v2 adds Borja's locked taxonomy (PDF p.2, Granola
// 2026-03-05) — `fondos`, `acciones-cotizadas`, `participaciones-empresariales`,
// `otros`, `deudas`. v1 modal still writes the legacy slugs; v2 Simple-mode
// modal writes the new ones. Single source of truth → one signal.
export type PatrimonioTipo =
  // v1 tipos
  | 'liquidez'
  | 'inversion'
  | 'inmobiliario'
  | 'pension'
  | 'participacion'
  | 'otro'
  // v2 tipos (Brief C — Borja's 7-tipo set)
  | 'fondos'
  | 'acciones-cotizadas'
  | 'participaciones-empresariales'
  | 'otros'
  | 'deudas';

// v2 enums (Brief C — Borja's per-tipo subfields, PDF p.2-3)
export type RentabilidadRiesgo = 'bajo' | 'medio' | 'alto';
export type NivelRiesgo = 'nulo' | 'bajo' | 'medio' | 'alto';
export type InmobiliarioUso = 'vivienda-principal' | 'uso-propio' | 'inversion';
export type TipoGeneracion = 'importe' | 'porcentaje';
export type CrecimientoMode = 'mismo-activo' | 'manual';

// v3 — patrimonio dialog two-step taxonomy (Figma 2026-06-10, Wealth manager
// screens 2026/Dialogs for patrimonio). Step 1: TipoPatrimonioTop chooses one
// of 7 top-level categories. Step 2: only Inversión carries a TipoInversion
// sub-select PLUS a Simple/Avanzado discriminator. Other top-level branches
// render a single-pane per-tipo form.
export type TipoPatrimonioTop =
  | 'liquidez'
  | 'inversion'
  | 'plan-pensiones'
  | 'private-equity'
  | 'inmobiliario'
  | 'participaciones'
  | 'deudas';

export type TipoInversion =
  | 'fondos'
  | 'acciones-cotizadas'
  | 'seguros-ahorro'
  | 'renta-fija'
  | 'etf'
  | 'cartera'
  | 'otros';

/** PPI / PPE / EPSV — radio shown only when tipoTop === 'plan-pensiones'. */
export type PlanPensionesTipo = 'ppi' | 'ppe' | 'epsv';

/** Picked by the host on the Inversión branch only. Other branches don't
 *  carry a mode discriminator — the per-tipo form is the whole surface. */
export type PatrimonioAddMode = 'simple' | 'avanzado';

/** Single titular split. Mirrors apps/site/src/app/pages/demos/shared/
 *  titulares-block TitularRow shape — kept in store-flavored form so we
 *  can persist alongside the asset. */
export interface PatrimonioTitular {
  id: string;
  titularId: string;
  porcentaje: number;
}

export interface PatrimonioAsset {
  id: string;
  nombre: string;
  tipo: PatrimonioTipo;
  valor: number;

  // ── v2 universal fields (Brief C — apply across tipos) ────────────────
  titular?: string;
  /** ¿Patrimonio futuro? — PDF p.1 universal branch. */
  patrimonioFuturo?: boolean;
  /** Año en que se espera obtener el activo (when patrimonioFuturo === true). */
  anoObtencion?: number;
  /** ¿Generará ingresos? (only meaningful when patrimonioFuturo === true). */
  generaIngresos?: boolean;
  frecuencia?: Frecuencia;
  tipoGeneracion?: TipoGeneracion;
  /** Value paired with tipoGeneracion (€ if importe, % if porcentaje). */
  generacionValor?: number;
  /** No IPC option per Borja 2026-02-27. */
  crecimientoMode?: CrecimientoMode;
  /** Manual growth % when crecimientoMode === 'manual'. */
  crecimientoManual?: number;

  // ── v2 tipo-specific fields (Brief C — per-tipo subfield matrix) ──────
  rentabilidadRiesgo?: RentabilidadRiesgo;
  /** Dividend yield % (Acciones cotizadas, Participaciones empresariales). */
  dividendoAnual?: number;
  /** Revalorización esperada % — Inmobiliario only, default 2%. */
  revalorizacion?: number;
  /** Inmobiliario regulatory risk grade. */
  nivelRiesgo?: NivelRiesgo;
  /** Inmobiliario use. */
  uso?: InmobiliarioUso;
  /** Net rental income % — Inmobiliario when uso === 'inversion', or Otros activos. */
  ingresosNetos?: number;
  /** Deudas annual interest rate %. */
  tipoInteres?: number;
  /** Deudas average remaining term, years. */
  plazoMedio?: number;
  /** Deudas — id of the patrimonio asset this debt finances, or 'ninguno'. */
  activoFinanciado?: string;

  // ── v3 two-step dialog (Figma 2026-06-10) ─────────────────────────────
  // Additive: existing v1/v2 modals keep writing `tipo` only; the v3 modal
  // writes BOTH the legacy `tipo` (best-effort match for downstream readers
  // like desinversiones-futuras) AND `tipoTop` + optionally `tipoInversion`
  // for round-tripping the new shape.
  tipoTop?: TipoPatrimonioTop;
  /** Only set when tipoTop === 'inversion'. */
  tipoInversion?: TipoInversion;
  /** Inversión branch only. Other top-level tipos are single-pane (no toggle). */
  addMode?: PatrimonioAddMode;
  /** Plan de pensiones radio (PPI / PPE / EPSV). */
  planPensionesTipo?: PlanPensionesTipo;
  /** Multi-row Titulares replaces the v2 single `titular`. v3 modals write this;
   *  legacy readers fall back to `titular`. */
  titulares?: PatrimonioTitular[];
  /** ¿Hay financiación asociada? — shown on every branch except Deudas. */
  financiacionAsociada?: boolean;
  /** Plan de pensiones · Derechos consolidados (€). */
  derechosConsolidados?: number;
  /** Plan de pensiones · Derechos consolidados previos a 2007 (€).
   *  Hard rule from Figma: must be ≤ derechosConsolidados. */
  derechosConsolidadosPrevios2007?: number;
  /** Inversión Avanzado section 1 — nombre del activo (search-select). */
  nombreActivo?: string;
  /** Inversión Avanzado section 1 — cartera (search-select). */
  cartera?: string;
  /** Inversión Avanzado section 1 — entidad (search-select).
   *  Also surfaced on Plan de pensiones, Liquidez (per-Figma). */
  entidad?: string;
  /** Inversión Avanzado section 1 — valor de compra (€). */
  valorCompra?: number;
  /** Inversión Avanzado section 2 — aportación periódica anual estimada (€). */
  aportacionPeriodicaAnual?: number;
  /** IPC vs Manual for aportación growth rate. */
  tipoTasaCrecimientoAportacion?: 'ipc' | 'manual';
  /** Tasa de crecimiento de la aportación (%) when tipo === 'manual'. */
  tasaCrecimientoAportacion?: number;
  /** Inversión Avanzado · Revalorización esperada mode. */
  tipoRevalorizacionEsperada?: 'automatica' | 'perfil-riesgo' | 'manual';
  /** Rentabilidad anual (%) when tipoRevalorizacionEsperada === 'manual'. */
  rentabilidadAnualManual?: number;
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

// ── Objetivos · Protección familiar (Brief H) ───────────────────────────────
export type ProductoProteccionTipo =
  | 'seguro-vida'
  | 'incapacidad-temporal'
  | 'incapacidad-permanente'
  | 'dependencia'
  | 'salud';

export interface ProductoProteccion {
  id: string;
  tipo: ProductoProteccionTipo;
  beneficiarioId: string;
  capital: number;
  prima: number;
}

export interface ProteccionFamiliarPerson {
  activa: boolean;
  productos: ProductoProteccion[];
}

export interface ProteccionFamiliarData {
  cliente: ProteccionFamiliarPerson;
  conyuge: ProteccionFamiliarPerson;
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

// ── Objetivos · Inversiones futuras (Brief F · V2) ─────────────────────────
//
// V2 dialog (Figma file `T3hIzIj78bTHVJhpSimJyK`, node `68489:167246`):
// 8 tipos, each with its own set of type-specific fields. Mirrors the
// patrimonio inventory taxonomy.
export type InversionFuturaTipo =
  | 'liquidez'
  | 'fondos'
  | 'acciones-cotizadas'
  | 'participaciones-empresariales'
  | 'private-equity'
  | 'inmobiliario'
  | 'otros-activos'
  | 'deudas';

/** Risk profile, shared between Fondos / Participaciones / Private equity / Otros. */
export type InversionFuturaRiesgo =
  | 'nulo'
  | 'bajo'
  | 'moderado'
  | 'alto'
  | 'muy-alto';

/** Use of a Vivienda / Inmobiliario asset (Figma: Inmobiliario.Uso de la vivienda). */
export type InversionFuturaUsoVivienda =
  | 'principal'
  | 'secundaria'
  | 'inversion';

interface InversionFuturaBase {
  id: string;
  /** User-facing label. */
  nombre: string;
  /** Year of acquisition / target year. */
  anio: number | null;
  /** Valor actual (€). Renamed from `importe` for parity with Figma copy. */
  importe: number;
  /** Family-member id ('cliente' | 'conyuge' | hijo.id | ascendiente.id) or null. */
  titular: string | null;
  /**
   * `¿Hay financiación asociada?` — shown on all tipos except Deudas
   * (Deudas IS a debt, so the field is meaningless there).
   */
  financiacionAsociada: boolean | null;
}

export interface InversionFuturaLiquidez extends InversionFuturaBase {
  tipo: 'liquidez';
}

export interface InversionFuturaFondos extends InversionFuturaBase {
  tipo: 'fondos';
  rentabilidadRiesgo: InversionFuturaRiesgo | null;
}

export interface InversionFuturaAcciones extends InversionFuturaBase {
  tipo: 'acciones-cotizadas';
  dividendoAnualPct: number | null;
}

export interface InversionFuturaParticipaciones extends InversionFuturaBase {
  tipo: 'participaciones-empresariales';
  rentabilidadRiesgo: InversionFuturaRiesgo | null;
  dividendoAnualPct: number | null;
}

export interface InversionFuturaPrivateEquity extends InversionFuturaBase {
  tipo: 'private-equity';
  compromisoPago: number;
  desembolsoRealizado: number;
  anioFinDesembolsos: number | null;
  anioInicioDistribuciones: number | null;
  anioFinDistribuciones: number | null;
  rentabilidadRiesgo: InversionFuturaRiesgo | null;
}

export interface InversionFuturaInmobiliario extends InversionFuturaBase {
  tipo: 'inmobiliario';
  /** Revalorización esperada (%). */
  revalorizacionEsperadaPct: number | null;
  nivelRiesgo: InversionFuturaRiesgo | null;
  uso: InversionFuturaUsoVivienda | null;
}

export interface InversionFuturaOtrosActivos extends InversionFuturaBase {
  tipo: 'otros-activos';
  rentabilidadRiesgo: InversionFuturaRiesgo | null;
  ingresosNetosAnualesPct: number | null;
}

export interface InversionFuturaDeudas extends InversionFuturaBase {
  tipo: 'deudas';
  /** Tipo de interés (%). */
  tipoInteresPct: number | null;
  /** Plazo medio pendiente, en años. */
  plazoAnios: number | null;
  /** Id of the inversión future this deuda finances, or null. */
  activoFinanciadoId: string | null;
}

/** Freshly added row — the user hasn't picked Tipo yet. */
export interface InversionFuturaDraft extends InversionFuturaBase {
  tipo: null;
}

export type InversionFuturaRow =
  | InversionFuturaDraft
  | InversionFuturaLiquidez
  | InversionFuturaFondos
  | InversionFuturaAcciones
  | InversionFuturaParticipaciones
  | InversionFuturaPrivateEquity
  | InversionFuturaInmobiliario
  | InversionFuturaOtrosActivos
  | InversionFuturaDeudas;

// ── Diagnóstico — shared scenario type (Briefs I / J / K / L) ─────────────
//
// Authored here because Brief I lands first. Briefs J (Estrategias), K
// (Optimización liquidez) and L (Optimización asset allocation) all import
// this type — see `2026-05-26-awp-diagnostico-estrategias.md` for the
// `ScenarioWithActual` widening that Brief J adds on top.
export type Scenario = 'objetivo' | 'optimista' | 'medio' | 'pesimista';

export interface ScenarioRow {
  scenario: Scenario;
  /** € — años cubiertos × gasto anual estimado. */
  coberturaVital: number;
  legadoInmobiliario: number;
  legadoFinanciero: number;
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

const EMPTY_PERSONA: PersonaBase = {
  alias: '',
  residenciaFiscal: '',
  anoNacimiento: null,
  gradoDiscapacidad: null,
  tipoActividad: null,
  anoJubilacion: null,
  anosCotizados: null,
  anoDejoCotizar: null,
  tipoCotizacion: null,
};

const EMPTY_CLIENTE: ClienteData = { ...EMPTY_PERSONA };

/**
 * Default cliente seed = Marco Fernández Castro (the first AWP persona).
 *
 * Kept inline (not imported from the personas fixture) so the store has no
 * runtime dependency on the personas list — keeps personas.ts importing
 * the cliente types one-way. Personas activation goes through
 * `activatePersona(payload)` which writes a snapshot caller-supplied;
 * the caller (the /clientes page) constructs the payload from
 * AWP_PERSONAS.
 */
const SEEDED_CLIENTE: ClienteData = {
  alias: 'Marco Fernández Castro',
  residenciaFiscal: 'Madrid',
  anoNacimiento: 1984,
  gradoDiscapacidad: 'sin',
  tipoActividad: 'activo',
  anoJubilacion: null,
  anosCotizados: 18,
  anoDejoCotizar: null,
  tipoCotizacion: 'regimen-general',
};

const SEEDED_CONYUGE: ConyugeData = {
  alias: 'Laura Castro',
  residenciaFiscal: 'Madrid',
  anoNacimiento: 1986,
  gradoDiscapacidad: 'sin',
  tipoActividad: 'activo',
  anoJubilacion: null,
  anosCotizados: 16,
  anoDejoCotizar: null,
  tipoCotizacion: 'regimen-general',
};

const SEEDED_HIJOS: HijoData[] = [
  {
    id: 'hijo-seed-1',
    alias: 'Lucía Fernández',
    anoNacimiento: 2020,
    gradoDiscapacidad: 'sin',
    delCliente: true,
  },
];

/**
 * Payload accepted by `activatePersona()`. Structural (not the Persona
 * type itself) so the store stays ignorant of the personas fixture.
 */
export interface ActivatePersonaPayload {
  id: string;
  cliente: ClienteData;
  conyugeStatus: ConyugeStatus;
  conyuge: ConyugeData | null;
  hijos: Omit<HijoData, 'id'>[];
  ascendientes: Omit<AscendienteData, 'id'>[];
}

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
let nextProductoId = 1;
let nextPlanificacionId = 1;

// ── Listado · Planificaciones per cliente (Brief Listado) ─────────────────
//
// v1 model: one cliente per WealthPlannerStore instance. Each Planificacion
// is a named container the gestor switches between; the cliente identity
// (Información básica) persists across plans because it lives on the same
// store. Plan-scoped data (patrimonio, objetivos, etc.) is NOT yet split
// per plan in v1 — that migration is the deferred `:simulationId` chore.
export type PlanificacionEstado = 'borrador' | 'activa' | 'archivada';

export interface Planificacion {
  id: string;
  nombre: string;
  createdAt: string;
  estado: PlanificacionEstado;
  gestor: string;
  /** Route the "Abrir" action navigates to. v1 hardcodes the flat AWP routes. */
  route: string;
}

@Injectable({ providedIn: 'root' })
export class WealthPlannerStore {
  // ──────────────────────────────────────────────────────────────────────
  // Familia (Brief A)
  // ──────────────────────────────────────────────────────────────────────

  readonly cliente = signal<ClienteData>({ ...SEEDED_CLIENTE });
  readonly conyugeStatus = signal<ConyugeStatus>('yes');
  readonly conyuge = signal<ConyugeData | null>({ ...SEEDED_CONYUGE });
  readonly hijos = signal<HijoData[]>(SEEDED_HIJOS.map((h) => ({ ...h })));
  readonly ascendientes = signal<AscendienteData[]>([]);

  /**
   * Id of the currently-active persona (the cliente loaded in the store).
   * Default matches the seeded cliente (Marco) so direct visits to
   * /listado-planificaciones still resolve to a valid persona.
   */
  readonly activeClienteId = signal<string | null>('marco-fernandez-castro');

  /**
   * Backwards-compatible boolean for consumers in other briefs (Sociedades,
   * Protección familiar). `true` exactly when the explicit answer is "yes"
   * AND we have cónyuge data; falls back to the conyuge() null-check so
   * `tienePareja()` and `conyuge()` never disagree.
   */
  readonly tienePareja = computed<boolean>(
    () => this.conyugeStatus() === 'yes' && this.conyuge() !== null,
  );

  /** Sidebar chip state derived from cliente completeness (Figma fields). */
  readonly familiaState = computed<SectionState>(() => {
    const c = this.cliente();
    if (!c.alias.trim()) return 'empty';
    const required =
      c.alias.trim() &&
      c.residenciaFiscal.trim() &&
      c.anoNacimiento !== null &&
      c.tipoActividad !== null;
    return required ? 'complete' : 'in-progress';
  });

  /** True if the Cónyuge form has the same four required fields filled. */
  readonly conyugeComplete = computed<boolean>(() => {
    const co = this.conyuge();
    if (co === null) return false;
    return (
      co.alias.trim() !== '' &&
      co.residenciaFiscal.trim() !== '' &&
      co.anoNacimiento !== null &&
      co.tipoActividad !== null
    );
  });

  // Mutations
  setCliente(partial: Partial<ClienteData>): void {
    this.cliente.update((c) => ({ ...c, ...partial }));
  }

  /**
   * Replace the entire cliente slice with a persona's snapshot. Used by
   * the /clientes page: clicking a persona card swaps the store's cliente
   * + cónyuge + hijos + ascendientes en bloc, then navigates to the
   * per-cliente listado. Generates fresh ids for hijos / ascendientes so
   * downstream code doesn't reuse persona-fixture ids.
   */
  activatePersona(payload: ActivatePersonaPayload): void {
    this.activeClienteId.set(payload.id);
    this.cliente.set({ ...payload.cliente });
    this.conyugeStatus.set(payload.conyugeStatus);
    this.conyuge.set(payload.conyuge ? { ...payload.conyuge } : null);
    this.hijos.set(
      payload.hijos.map((h) => ({ ...h, id: `hijo-${nextHijoId++}` })),
    );
    this.ascendientes.set(
      payload.ascendientes.map((a) => ({ ...a, id: `asc-${nextAscendienteId++}` })),
    );
  }

  /**
   * Set the cónyuge presence answer. Side effects:
   *  - `yes` — lazily creates an empty cónyuge form if none exists.
   *  - `no` / `unanswered` — clears cónyuge data so downstream selectors
   *    don't see stale fields.
   */
  setConyugeStatus(status: ConyugeStatus): void {
    this.conyugeStatus.set(status);
    if (status === 'yes') {
      if (this.conyuge() === null) {
        this.conyuge.set({ ...EMPTY_PERSONA });
      }
    } else {
      this.conyuge.set(null);
    }
  }

  setConyuge(partial: Partial<ConyugeData>): void {
    this.conyuge.update((c) => (c === null ? null : { ...c, ...partial }));
  }

  addHijo(): void {
    const id = `hijo-${nextHijoId++}`;
    this.hijos.update((rows) => [
      ...rows,
      {
        id,
        alias: '',
        anoNacimiento: null,
        gradoDiscapacidad: null,
        delCliente: true,
      },
    ]);
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
        alias: '',
        parentesco: null,
        anoNacimiento: null,
        gradoDiscapacidad: null,
        delCliente: false,
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
    out.push({
      id: 'cliente',
      label: c.alias.trim() || 'Cliente',
      porcentaje: 0,
    });
    if (this.tienePareja()) {
      const co = this.conyuge();
      out.push({
        id: 'conyuge',
        label: co?.alias.trim() ? co.alias : 'Cónyuge',
        porcentaje: 0,
      });
    }
    this.hijos().forEach((h, i) => {
      out.push({
        id: h.id,
        label: h.alias.trim() || `Hijo ${i + 1}`,
        porcentaje: 0,
      });
    });
    this.ascendientes().forEach((a, i) => {
      out.push({
        id: a.id,
        label: a.alias.trim() || `Ascendiente ${i + 1}`,
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

  addAsset(asset: PatrimonioAsset): void {
    this.patrimonio.update((arr) => [...arr, asset]);
  }

  updateAsset(id: string, partial: Partial<PatrimonioAsset>): void {
    this.patrimonio.update((arr) =>
      arr.map((a) => (a.id === id ? { ...a, ...partial } : a)),
    );
  }

  removeAsset(id: string): void {
    this.patrimonio.update((arr) => arr.filter((a) => a.id !== id));
  }

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

  addInversionFutura(): InversionFuturaDraft {
    const next: InversionFuturaDraft = {
      id: `inv-fut-${nextInversionFuturaId++}`,
      nombre: '',
      tipo: null,
      anio: null,
      importe: 0,
      titular: null,
      financiacionAsociada: null,
    };
    this.inversionesFuturas.update((rows) => [...rows, next]);
    return next;
  }

  updateInversionFutura(
    id: string,
    partial: Partial<InversionFuturaRow>,
  ): void {
    this.inversionesFuturas.update((rows) =>
      rows.map((row) =>
        row.id === id ? ({ ...row, ...partial } as InversionFuturaRow) : row,
      ),
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

  // ──────────────────────────────────────────────────────────────────────
  // Objetivos · Protección familiar (Brief H)
  // ──────────────────────────────────────────────────────────────────────

  readonly proteccionFamiliarEstablished = signal<boolean>(false);
  readonly proteccionFamiliar = signal<ProteccionFamiliarData>({
    cliente: { activa: false, productos: [] },
    conyuge: { activa: false, productos: [] },
  });

  /**
   * `empty` when the gate is off. Once the gate flips on we're at least
   * `in-progress`; reaching `complete` requires at least one product on
   * cliente, plus at least one on conyuge when `tienePareja()` is true.
   */
  readonly proteccionFamiliarState = computed<SectionState>(() => {
    if (!this.proteccionFamiliarEstablished()) return 'empty';
    const pf = this.proteccionFamiliar();
    if (pf.cliente.productos.length === 0) return 'in-progress';
    if (this.tienePareja() && pf.conyuge.productos.length === 0) return 'in-progress';
    return 'complete';
  });

  setProteccionFamiliarEstablished(value: boolean): void {
    this.proteccionFamiliarEstablished.set(value);
  }

  setClienteActiva(value: boolean): void {
    this.proteccionFamiliar.update((current) => ({
      ...current,
      cliente: { ...current.cliente, activa: value },
    }));
  }

  setConyugeActiva(value: boolean): void {
    this.proteccionFamiliar.update((current) => ({
      ...current,
      conyuge: { ...current.conyuge, activa: value },
    }));
  }

  addProteccionProducto(row: 'cliente' | 'conyuge', producto: Omit<ProductoProteccion, 'id'>): ProductoProteccion {
    const next: ProductoProteccion = { ...producto, id: `prod-prot-${nextProductoId++}` };
    this.proteccionFamiliar.update((current) => {
      const person = current[row];
      return {
        ...current,
        [row]: { activa: true, productos: [...person.productos, next] },
      } as ProteccionFamiliarData;
    });
    return next;
  }

  updateProteccionProducto(row: 'cliente' | 'conyuge', id: string, partial: Partial<ProductoProteccion>): void {
    this.proteccionFamiliar.update((current) => {
      const person = current[row];
      return {
        ...current,
        [row]: {
          activa: person.activa,
          productos: person.productos.map((p) => (p.id === id ? { ...p, ...partial } : p)),
        },
      } as ProteccionFamiliarData;
    });
  }

  removeProteccionProducto(row: 'cliente' | 'conyuge', id: string): void {
    this.proteccionFamiliar.update((current) => {
      const person = current[row];
      const nextProductos = person.productos.filter((p) => p.id !== id);
      return {
        ...current,
        [row]: { activa: nextProductos.length > 0, productos: nextProductos },
      } as ProteccionFamiliarData;
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // Diagnóstico · Patrimonio previsto (Brief I)
  // ──────────────────────────────────────────────────────────────────────
  //
  // Read-only Diagnóstico output — seeded from PDF p.7-8 mocks. Real
  // projection engine is Conclusiones territory (Brief M); for now these
  // are static numbers the gestor sees as soon as Patrimonio previsto
  // mounts. Briefs J/K/L will derive their own outputs off this baseline.

  readonly patrimonioPrevisto = signal<ScenarioRow[]>([
    { scenario: 'objetivo',  coberturaVital: 3_020_000, legadoInmobiliario: 1_520_000, legadoFinanciero: 0 },
    { scenario: 'optimista', coberturaVital: 4_120_000, legadoInmobiliario: 1_930_000, legadoFinanciero: 0 },
    { scenario: 'medio',     coberturaVital: 2_730_000, legadoInmobiliario: 1_220_000, legadoFinanciero: 0 },
    { scenario: 'pesimista', coberturaVital: 1_030_000, legadoInmobiliario:         0, legadoFinanciero: 0 },
  ]);

  /** Sidebar chip — always `complete` because this is a derived read-only output. */
  readonly patrimonioPrevistoState = computed<SectionState>(() => 'complete');

  // ──────────────────────────────────────────────────────────────────────
  // Listado · Planificaciones per cliente (Brief Listado)
  // ──────────────────────────────────────────────────────────────────────
  //
  // Seeded with 3 plans so all three estado chips are visible on first
  // visit. Newest first per the locked sort order (no filter in v1).

  readonly planificaciones = signal<Planificacion[]>([
    {
      id: 'plan-q1-2026',
      nombre: 'Planificación 2026 Q1',
      createdAt: '2026-01-15T10:00:00Z',
      estado: 'activa',
      gestor: 'Juan García Pérez',
      route: '/demos/wealth-planner-2026/familia',
    },
    {
      id: 'plan-q2-2026',
      nombre: 'Planificación 2026 Q2 — revisión',
      createdAt: '2026-04-03T14:30:00Z',
      estado: 'borrador',
      gestor: 'Juan García Pérez',
      route: '/demos/wealth-planner-2026/familia',
    },
    {
      id: 'plan-2025-final',
      nombre: 'Planificación 2025 final',
      createdAt: '2025-12-20T09:00:00Z',
      estado: 'archivada',
      gestor: 'Juan García Pérez',
      route: '/demos/wealth-planner-2026/familia',
    },
  ]);

  /** Sorted reverse-chronologically (newest first). v1 has no filter. */
  readonly planificacionesSorted = computed<Planificacion[]>(() =>
    [...this.planificaciones()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  /**
   * Append a new borrador planificación. Cliente Información básica is
   * inherited automatically because it lives on the same store.
   */
  addPlanificacion(nombre: string): Planificacion {
    const next: Planificacion = {
      id: `plan-${nextPlanificacionId++}`,
      nombre: nombre.trim() || 'Planificación sin nombre',
      createdAt: new Date().toISOString(),
      estado: 'borrador',
      gestor: 'Juan García Pérez',
      route: '/demos/wealth-planner-2026/familia',
    };
    this.planificaciones.update((rows) => [...rows, next]);
    return next;
  }

  renamePlanificacion(id: string, nombre: string): void {
    const trimmed = nombre.trim();
    if (!trimmed) return;
    this.planificaciones.update((rows) =>
      rows.map((p) => (p.id === id ? { ...p, nombre: trimmed } : p)),
    );
  }

  duplicarPlanificacion(id: string): Planificacion | null {
    const source = this.planificaciones().find((p) => p.id === id);
    if (!source) return null;
    const next: Planificacion = {
      ...source,
      id: `plan-${nextPlanificacionId++}`,
      nombre: `${source.nombre} (copia)`,
      createdAt: new Date().toISOString(),
      estado: 'borrador',
    };
    this.planificaciones.update((rows) => [...rows, next]);
    return next;
  }

  archivarPlanificacion(id: string): void {
    this.planificaciones.update((rows) =>
      rows.map((p) => (p.id === id ? { ...p, estado: 'archivada' as const } : p)),
    );
  }

  /** v1-only — used by the empty-state demo to clear the seed. */
  clearPlanificaciones(): void {
    this.planificaciones.set([]);
  }
}
