import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import {
  ButtonComponent,
  InputComponent,
  PageHeaderComponent,
  SelectComponent,
  StepperComponent,
  SwitchComponent,
  TableComponent,
} from '@coherence/ui';
import type { LineSeries, SelectOption, TableColumn } from '@coherence/ui';

import { DemoShellComponent } from '../../demo-shell/demo-shell.component';
import { ProductIdentityBarComponent } from '../../../../components/product-identity-bar/product-identity-bar.component';
import {
  AssetAllocationChartComponent,
  type PatrimonioBreakdownRow,
  type ScenarioBreakdownRow,
  type YearBreakdownPatrimonio,
  type YearBreakdownScenario,
} from '../../wealth-planner-2026/shared/asset-allocation-chart.component';
import { WealthPlannerStore } from '../../wealth-planner-2026/store';
import type {
  AssetAllocationOptimization,
  PatrimonioAsset,
  PerfilRiesgo,
} from '../../wealth-planner-2026/store';

type StepKey = 'definicion' | 'patrimonio' | 'resultados';
type Vista = 'patrimonio-seleccionado' | 'todo-patrimonio';
type Escenario = 'pesimista' | 'medio' | 'optimista';
type CategoryKey = 'inversiones' | 'inmobiliario' | 'liquidez' | 'deuda' | 'otros';

interface CategoryGroup {
  key: CategoryKey;
  label: string;
  assets: PatrimonioAsset[];
}

const STEPS: ReadonlyArray<{ key: StepKey; label: string }> = [
  { key: 'definicion', label: 'Definición' },
  { key: 'patrimonio', label: 'Patrimonio seleccionado' },
  { key: 'resultados', label: 'Resultados' },
];

const PERFIL_OPTIONS: SelectOption[] = [
  { value: 'conservador', label: 'Conservador (2,61 %)' },
  { value: 'moderado', label: 'Moderado (5,20 %)' },
  { value: 'dinamico', label: 'Dinámico (7,13 %)' },
];

const PERFIL_RATES: Record<PerfilRiesgo, number> = {
  conservador: 0.0261,
  moderado: 0.0520,
  dinamico: 0.0713,
};

const VISTA_OPTIONS: SelectOption[] = [
  { value: 'patrimonio-seleccionado', label: 'Patrimonio seleccionado' },
  { value: 'todo-patrimonio', label: 'Todo el patrimonio' },
];

const ESCENARIO_OPTIONS: SelectOption[] = [
  { value: 'pesimista', label: 'Pesimista' },
  { value: 'medio', label: 'Medio' },
  { value: 'optimista', label: 'Optimista' },
];

const ESCENARIO_RATE: Record<Escenario, number> = {
  pesimista: 0.6,
  medio: 1.0,
  optimista: 1.4,
};

const AGE_FROM = 52;
const AGE_TO = 85;
const BIRTH_YEAR = 1978; // cliente edad 48 today (2026) → 1978

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  inversiones: 'Inversiones',
  inmobiliario: 'Inmobiliario',
  liquidez: 'Liquidez',
  deuda: 'Deuda',
  otros: 'Otros',
};

const TIPO_TO_CATEGORY: Record<string, CategoryKey> = {
  inversion: 'inversiones',
  fondos: 'inversiones',
  'acciones-cotizadas': 'inversiones',
  participacion: 'inversiones',
  'participaciones-empresariales': 'inversiones',
  pension: 'inversiones',
  inmobiliario: 'inmobiliario',
  liquidez: 'liquidez',
  deudas: 'deuda',
  otro: 'otros',
};

const TIPO_LABEL: Record<string, string> = {
  inversion: 'Inversión',
  fondos: 'Fondo de inversión',
  'acciones-cotizadas': 'Acciones cotizadas',
  participacion: 'Participación empresarial',
  'participaciones-empresariales': 'Participación empresarial',
  pension: 'Plan de pensiones',
  inmobiliario: 'Inmueble',
  liquidez: 'Cuenta / depósito',
  deudas: 'Deuda',
  otro: 'Otro activo',
};

/**
 * Per-category column shapes — match `patrimonial-proposal` (the canonical
 * `<afi-table>` composition). Inmobiliario drops the Entidad column since
 * the field doesn't apply; all other categories carry Entidad in line
 * with the Patrimonio table seen by the user.
 */
/**
 * Trailing "Usar todo el activo" column shared by both shapes — rendered
 * via `cellTemplates` projection so the row keeps `afi-switch` + the
 * conditional `afi-input` inside the table rhythm. `usarTodo` is the
 * column key the wizard's HTML wires to via `[cellTemplates]`.
 */
const COLUMN_USAR_TODO: TableColumn = {
  key: 'usarTodo',
  label: 'Usar todo el activo',
  align: 'end',
  width: '220px',
};

const COLUMNS_DEFAULT: TableColumn[] = [
  { key: 'nombre', label: 'Nombre', emphasis: true },
  { key: 'tipo', label: 'Tipo' },
  { key: 'entidad', label: 'Entidad', width: '160px' },
  { key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '140px' },
  COLUMN_USAR_TODO,
];

const COLUMNS_NO_ENTIDAD: TableColumn[] = [
  { key: 'nombre', label: 'Nombre', emphasis: true },
  { key: 'tipo', label: 'Tipo' },
  { key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '140px' },
  COLUMN_USAR_TODO,
];

/**
 * Plan de acción · Optimización del asset allocation — 3-step wizard.
 *
 * Reached from `/optimizacion-asset` (the landing). Mirrors the
 * `proteccion-familiar/flujo` chrome (back arrow + icon + title + Cancelar /
 * Siguiente / Guardar in the chrome actions slot, `afi-stepper` row, then
 * `@switch (currentStepKey())` body).
 *
 * Steps:
 *  1. Definición — Nombre + Perfil de riesgo
 *  2. Patrimonio seleccionado — per-category tables with checkbox + "usar
 *     todo el activo" switch per row.
 *  3. Resultados — three filter selects (Perfil · Escenario · Vista) with
 *     conditional Escenario disabling, and `site-asset-allocation-chart`
 *     wired to two popover modes via `variant`.
 *
 * Optional `?id=…` query param loads an existing optimization for read-only
 * inspection (Step 3 only — Step 1/2 fields still render their saved values).
 */
@Component({
  selector: 'site-optimizacion-asset-flujo-page',
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    InputComponent,
    PageHeaderComponent,
    SelectComponent,
    StepperComponent,
    SwitchComponent,
    TableComponent,
    DemoShellComponent,
    ProductIdentityBarComponent,
    AssetAllocationChartComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './optimizacion-asset-flujo.page.html',
  styleUrls: ['./optimizacion-asset-flujo.page.scss'],
})
export class OptimizacionAssetFlujoPage {
  readonly store = inject(WealthPlannerStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly demoSlug = 'optimizacion-asset-flujo';
  readonly demoRoute = '/demos/wealth-planner-2026/optimizacion-asset/nuevo';
  readonly landingRoute = '/demos/wealth-planner-2026/optimizacion-asset';

  /** Optional ?id=… to view-detail an existing optimization. */
  readonly editingId = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('id'))),
    { initialValue: null as string | null },
  );

  readonly editing = computed<AssetAllocationOptimization | null>(() =>
    this.store.optimizacionAssetById(this.editingId()),
  );

  // ── Stepper state ─────────────────────────────────────────────────────
  readonly currentStep = signal<number>(1);
  readonly currentStepKey = computed<StepKey>(() => {
    const i = Math.min(Math.max(this.currentStep(), 1), STEPS.length) - 1;
    return STEPS[i]!.key;
  });
  readonly stepperItems = STEPS.map((s) => ({ key: s.key, label: s.label }));

  // ── Identity bar breadcrumb ───────────────────────────────────────────
  //
  // Per Richard 2026-06-16:
  //   1. Client's name      → /listado-planificaciones (their planificaciones list)
  //   2. Page section label → no route, we're on it
  //   3. Simulation name    → no route, current leaf
  //
  // Client name falls back to "Cliente" when the seeded alias is empty.
  readonly identityBreadcrumb = computed(() => {
    const cliente = this.store.cliente();
    const clientLabel = cliente.alias?.trim() || 'Cliente';
    const simulacionLabel = this.editing()?.nombre ?? (this.nombre().trim() || 'Nueva optimización');
    return [
      { label: clientLabel, route: '/listado-planificaciones' },
      { label: 'Optimización del asset allocation' },
      { label: simulacionLabel },
    ];
  });

  // ── Step 1: Definición ────────────────────────────────────────────────
  readonly nombre = signal<string>('');
  readonly perfilRiesgo = signal<PerfilRiesgo>('moderado');
  readonly perfilOptions = PERFIL_OPTIONS;

  // ── Step 2: Patrimonio seleccionado ───────────────────────────────────
  /** Selected patrimonio ids. Selection is global across category tables;
   *  each table renders only the rows that belong to its bucket and reports
   *  selectedChange events scoped to its own group. */
  readonly selectedIds = signal<Set<string>>(new Set());

  /**
   * Per-asset "Usar todo el activo" switch state. An id present here AND
   * in `selectedIds()` means the row's switch is ON (full asset value
   * applies). Newly-selected rows default ON; deselecting a row removes
   * its id from both this set and `assetPercentages`. Persisted as
   * `wholeAssetIds` in the saved optimization.
   */
  readonly wholeAssetIds = signal<Set<string>>(new Set());

  /**
   * Per-asset percentage applied when the switch is OFF. Whole-number
   * percent (50 → use 50 % of the asset's valor). Only consulted for ids
   * in `selectedIds()` but NOT in `wholeAssetIds()`. Defaults to 50 the
   * first time a row's switch toggles OFF.
   */
  readonly assetPercentages = signal<Map<string, number>>(new Map());

  readonly DEFAULT_PARTIAL_PERCENT = 50;

  readonly categoryGroups = computed<CategoryGroup[]>(() => {
    const buckets: Record<CategoryKey, PatrimonioAsset[]> = {
      inversiones: [],
      inmobiliario: [],
      liquidez: [],
      deuda: [],
      otros: [],
    };
    for (const asset of this.store.patrimonio()) {
      const cat = TIPO_TO_CATEGORY[asset.tipo as string] ?? 'otros';
      buckets[cat].push(asset);
    }
    return (Object.keys(buckets) as CategoryKey[])
      .filter((key) => buckets[key].length > 0)
      .map((key) => ({ key, label: CATEGORY_LABELS[key], assets: buckets[key] }));
  });

  /** Memoize one Map of group rows; keyed lookups stay O(1). */
  readonly rowsByGroup = computed<Map<CategoryKey, Record<string, unknown>[]>>(() => {
    const out = new Map<CategoryKey, Record<string, unknown>[]>();
    for (const group of this.categoryGroups()) {
      out.set(
        group.key,
        group.assets.map((a) => ({
          id: a.id,
          nombre: a.nombre,
          tipo: TIPO_LABEL[a.tipo as string] ?? a.tipo,
          entidad: a.entidad ?? '—',
          valor: EUR_FORMATTER.format(a.valor),
        })),
      );
    }
    return out;
  });

  rowsFor(key: CategoryKey): Record<string, unknown>[] {
    return this.rowsByGroup().get(key) ?? [];
  }

  selectedRowsFor(key: CategoryKey): Record<string, unknown>[] {
    const set = this.selectedIds();
    return this.rowsFor(key).filter((r) => set.has(r['id'] as string));
  }

  onGroupSelectionChange(key: CategoryKey, selected: Record<string, unknown>[]): void {
    const groupRowIds = new Set(this.rowsFor(key).map((r) => r['id'] as string));
    const nextSelectedInGroup = new Set(selected.map((r) => r['id'] as string));

    // Sync selectedIds first so derived signals (and `Usar todo el activo`
    // defaults below) read the post-change selection.
    this.selectedIds.update((prev) => {
      const next = new Set(prev);
      for (const id of groupRowIds) {
        if (nextSelectedInGroup.has(id)) next.add(id);
        else next.delete(id);
      }
      return next;
    });

    // Newly-selected rows default the switch to ON; deselected rows shed
    // both whole-asset + partial-percentage entries so the saved payload
    // never carries stale state for unchecked assets.
    this.wholeAssetIds.update((prev) => {
      const next = new Set(prev);
      for (const id of groupRowIds) {
        if (nextSelectedInGroup.has(id)) next.add(id);
        else next.delete(id);
      }
      return next;
    });
    this.assetPercentages.update((prev) => {
      const next = new Map(prev);
      for (const id of groupRowIds) {
        if (!nextSelectedInGroup.has(id)) next.delete(id);
      }
      return next;
    });
  }

  isWholeAsset(id: string): boolean {
    return this.wholeAssetIds().has(id);
  }

  setWholeAsset(id: string, on: boolean): void {
    this.wholeAssetIds.update((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
    if (on) {
      // Clearing the percentage on toggle-back-ON keeps "ON = use 100 %"
      // unambiguous in the saved payload.
      this.assetPercentages.update((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    } else if (!this.assetPercentages().has(id)) {
      // Seed the partial value the first time the user flips the switch off.
      this.assetPercentages.update((prev) => {
        const next = new Map(prev);
        next.set(id, this.DEFAULT_PARTIAL_PERCENT);
        return next;
      });
    }
  }

  percentageFor(id: string): number {
    return this.assetPercentages().get(id) ?? this.DEFAULT_PARTIAL_PERCENT;
  }

  setPercentage(id: string, raw: string | number | null): void {
    const parsed =
      typeof raw === 'number'
        ? raw
        : raw === null || raw === ''
          ? this.DEFAULT_PARTIAL_PERCENT
          : Number(raw);
    if (!Number.isFinite(parsed)) return;
    const clamped = Math.max(0, Math.min(100, Math.round(parsed)));
    this.assetPercentages.update((prev) => {
      const next = new Map(prev);
      next.set(id, clamped);
      return next;
    });
  }

  /** Inmobiliario omits Entidad — the field doesn't apply there. */
  columnsFor(key: CategoryKey): TableColumn[] {
    return key === 'inmobiliario' ? COLUMNS_NO_ENTIDAD : COLUMNS_DEFAULT;
  }

  /** Total + count, projected via slot="extraInfo" alongside the section title. */
  groupTotal(key: CategoryKey): number {
    return this.categoryGroups()
      .find((g) => g.key === key)
      ?.assets.reduce((acc, a) => acc + (a.valor ?? 0), 0) ?? 0;
  }

  groupActivosLabel(key: CategoryKey): string {
    const n = this.categoryGroups().find((g) => g.key === key)?.assets.length ?? 0;
    return n === 1 ? '1 activo' : `${n} activos`;
  }

  formatEuro(n: number): string {
    return EUR_FORMATTER.format(n);
  }

  readonly patrimonioAfectado = computed<number>(() => {
    const whole = this.wholeAssetIds();
    const pcts = this.assetPercentages();
    return this.store
      .patrimonio()
      .filter((a) => this.selectedIds().has(a.id))
      .reduce((acc, a) => {
        const fraction = whole.has(a.id)
          ? 1
          : (pcts.get(a.id) ?? this.DEFAULT_PARTIAL_PERCENT) / 100;
        return acc + (a.valor ?? 0) * fraction;
      }, 0);
  });

  readonly canAdvanceFromDefinicion = computed<boolean>(() => this.nombre().trim().length > 0);
  readonly canAdvanceFromPatrimonio = computed<boolean>(() => this.selectedIds().size > 0);

  // ── Step 3: Resultados ────────────────────────────────────────────────
  readonly vista = signal<Vista>('patrimonio-seleccionado');
  readonly escenario = signal<Escenario>('medio');
  readonly vistaOptions = VISTA_OPTIONS;
  readonly escenarioOptions = ESCENARIO_OPTIONS;

  readonly escenarioDisabled = computed<boolean>(
    () => this.vista() === 'patrimonio-seleccionado',
  );

  /** Series: 4 lines (3 escenarios + Aportaciones) for Mode A, 2 lines
   *  (Situación actual + Situación simulada) for Mode B. */
  readonly chartSeries = computed<LineSeries[]>(() => {
    const baseRate = PERFIL_RATES[this.perfilRiesgo()];
    if (this.vista() === 'patrimonio-seleccionado') {
      const base = this.patrimonioAfectado() || 150_000;
      return [
        {
          ...buildCurve('Escenario pesimista', AGE_FROM, AGE_TO, base, baseRate * 0.6),
          color: 'var(--feedback-error-foreground)',
        },
        {
          ...buildCurve('Escenario medio', AGE_FROM, AGE_TO, base, baseRate),
          color: 'var(--feedback-warning-foreground)',
        },
        {
          ...buildCurve('Escenario optimista', AGE_FROM, AGE_TO, base, baseRate * 1.4),
          color: 'var(--feedback-success-foreground)',
        },
        {
          ...buildCurve('Aportaciones', AGE_FROM, AGE_TO, base, 0.008),
          color: 'var(--color-action-500)',
        },
      ];
    }
    const totalPatrimonio = this.store
      .patrimonio()
      .reduce((acc, a) => acc + (a.valor ?? 0), 0);
    const escFactor = ESCENARIO_RATE[this.escenario()];
    return [
      {
        ...buildCurve('Situación actual', AGE_FROM, AGE_TO, totalPatrimonio, 0.015 * escFactor),
        color: 'var(--foreground-tertiary-default)',
      },
      {
        ...buildCurve('Situación simulada', AGE_FROM, AGE_TO, totalPatrimonio, baseRate * escFactor),
        color: 'var(--color-action-500)',
      },
    ];
  });

  readonly legendItems = computed(() => {
    if (this.vista() === 'patrimonio-seleccionado') {
      return [
        { label: 'Escenario pesimista', color: 'var(--feedback-error-foreground)', shape: 'dot' as const },
        { label: 'Escenario medio', color: 'var(--feedback-warning-foreground)', shape: 'dot' as const },
        { label: 'Escenario optimista', color: 'var(--feedback-success-foreground)', shape: 'dot' as const },
        { label: 'Aportaciones', color: 'var(--color-action-500)', shape: 'dot' as const },
      ];
    }
    return [
      { label: 'Situación actual', color: 'var(--foreground-tertiary-default)', shape: 'triangle' as const },
      { label: 'Situación simulada', color: 'var(--color-action-500)', shape: 'dot' as const },
    ];
  });

  // ── Popover breakdowns (Mode A: scenario; Mode B: patrimonio tree) ────
  readonly anoBreakdown = computed<readonly YearBreakdownScenario[]>(() =>
    rangeAges().map((age) => ({ age, rows: scenarioAnoRowsFor(age, PERFIL_RATES[this.perfilRiesgo()]) })),
  );

  readonly acumuladoBreakdown = computed<readonly YearBreakdownScenario[]>(() =>
    rangeAges().map((age) => ({ age, rows: scenarioAcumuladoRowsFor(age, PERFIL_RATES[this.perfilRiesgo()]) })),
  );

  readonly patrimonioBreakdown = computed<readonly YearBreakdownPatrimonio[]>(() => {
    const groups = this.categoryGroups();
    return rangeAges().map((age) => ({
      age,
      rows: buildPatrimonioRows(age, groups, this.editing()?.nombre ?? this.nombre()),
    }));
  });

  readonly birthYear = BIRTH_YEAR;

  // ── Init: hydrate from editing target if present ──────────────────────
  constructor() {
    queueMicrotask(() => this.hydrateFromEditing());
  }

  private hydrateFromEditing(): void {
    const existing = this.editing();
    if (!existing) return;
    this.nombre.set(existing.nombre);
    this.perfilRiesgo.set(existing.perfilRiesgo);
    this.selectedIds.set(new Set(existing.selectedAssetIds));
    this.wholeAssetIds.set(new Set(existing.wholeAssetIds));
    this.assetPercentages.set(new Map(Object.entries(existing.partialAssetPercentages ?? {})));
    // Jump directly to Resultados since this is a view-existing flow.
    this.currentStep.set(STEPS.length);
  }

  // ── Step 1 handlers ───────────────────────────────────────────────────
  setNombre(v: string | number | null): void {
    this.nombre.set(typeof v === 'string' ? v : String(v ?? ''));
  }

  setPerfilRiesgo(v: string | number | null): void {
    if (v === 'conservador' || v === 'moderado' || v === 'dinamico') {
      this.perfilRiesgo.set(v);
    }
  }

  // ── Step 3 handlers ───────────────────────────────────────────────────
  setVista(v: string | number | null): void {
    if (v === 'patrimonio-seleccionado' || v === 'todo-patrimonio') {
      this.vista.set(v);
    }
  }

  setEscenario(v: string | number | null): void {
    if (v === 'pesimista' || v === 'medio' || v === 'optimista') {
      this.escenario.set(v);
    }
  }

  // ── Stepper navigation ────────────────────────────────────────────────
  goPrev(): void {
    this.currentStep.update((s) => Math.max(1, s - 1));
  }

  goNext(): void {
    this.currentStep.update((s) => Math.min(STEPS.length, s + 1));
  }

  canAdvance(): boolean {
    const key = this.currentStepKey();
    if (key === 'definicion') return this.canAdvanceFromDefinicion();
    if (key === 'patrimonio') return this.canAdvanceFromPatrimonio();
    return true;
  }

  onStepClicked(event: { key: string; index: number }): void {
    this.currentStep.set(event.index);
  }

  cancel(): void {
    this.router.navigate([this.landingRoute]);
  }

  guardar(): void {
    const id = this.editing()?.id ?? this.store.nextOptimizacionAssetId();
    const selectedIds = Array.from(this.selectedIds());
    const wholeIds = Array.from(this.wholeAssetIds()).filter((wid) =>
      this.selectedIds().has(wid),
    );
    const partialEntries: Record<string, number> = {};
    for (const aid of selectedIds) {
      if (!this.wholeAssetIds().has(aid)) {
        partialEntries[aid] = this.percentageFor(aid);
      }
    }
    const payload: AssetAllocationOptimization = {
      id,
      nombre: this.nombre().trim() || 'Optimización sin nombre',
      perfilRiesgo: this.perfilRiesgo(),
      perfilRentabilidad: PERFIL_RATES[this.perfilRiesgo()],
      patrimonioAfectado: this.patrimonioAfectado(),
      valorFinalOptimizado: estimateFinalValue(
        this.patrimonioAfectado(),
        PERFIL_RATES[this.perfilRiesgo()],
      ),
      selectedAssetIds: selectedIds,
      wholeAssetIds: wholeIds,
      partialAssetPercentages:
        Object.keys(partialEntries).length > 0 ? partialEntries : undefined,
    };
    if (this.editing()) {
      this.store.updateOptimizacionAsset(id, payload);
    } else {
      this.store.addOptimizacionAsset(payload);
    }
    this.router.navigate([this.landingRoute]);
  }

}

// ── Pure helpers ────────────────────────────────────────────────────────────

function rangeAges(): number[] {
  return Array.from({ length: AGE_TO - AGE_FROM + 1 }, (_, i) => AGE_FROM + i);
}

function buildCurve(
  key: string,
  from: number,
  to: number,
  base: number,
  rate: number,
): LineSeries {
  const span = to - from;
  return {
    key,
    points: Array.from({ length: span + 1 }, (_, i) => {
      const age = from + i;
      const y = Math.round(base * (1 + rate * i) * (1 + (rate * i * i) / 80));
      return { x: age, y };
    }),
  };
}

function estimateFinalValue(base: number, rate: number): number {
  // Project base ~30 yrs forward at the perfil rate.
  return Math.round(base * Math.pow(1 + rate, 30));
}

/**
 * Mode A · Año rows — Figma artboard 5 (id 346:320104). Mirrors the values
 * Richard sketched at age 67 in the production screenshot ("Año 2030").
 */
function scenarioAnoRowsFor(age: number, perfilRate: number): readonly ScenarioBreakdownRow[] {
  const factor = Math.max(0.4, (age - 50) / 9);
  const prev = 148_500 * factor;
  const acc = 150_000 * factor;
  return [
    {
      concepto: 'Ahorro acumulado el año anterior',
      pesimista: Math.round(prev),
      medio: Math.round(prev * 1.36),
      optimista: Math.round(prev * 1.86),
    },
    {
      concepto: 'Aportaciones del año',
      pesimista: 500,
      medio: 500,
      optimista: 500,
      signed: true,
    },
    {
      concepto: 'Rentabilidad del ahorro',
      pesimista: Math.round(1_300 * factor),
      medio: Math.round(8_500 * factor),
      optimista: Math.round(14_000 * factor),
      signed: true,
    },
    {
      concepto: 'Rentabilidad en el año',
      pesimista: perfilRate * 0.6,
      medio: perfilRate,
      optimista: perfilRate * 1.4,
      pctRow: true,
      muted: true,
    },
    {
      concepto: 'Ahorro acumulado actual',
      pesimista: Math.round(acc),
      medio: Math.round(acc * 1.36),
      optimista: Math.round(acc * 1.93),
    },
  ];
}

/**
 * Mode A · Acumulado rows — Figma artboard 6 (id 346:321964).
 */
function scenarioAcumuladoRowsFor(age: number, perfilRate: number): readonly ScenarioBreakdownRow[] {
  const factor = Math.max(0.4, (age - 50) / 9);
  return [
    {
      concepto: 'Aportaciones totales',
      pesimista: Math.round(152_500 * factor),
      medio: Math.round(152_500 * factor),
      optimista: Math.round(152_500 * factor),
    },
    {
      concepto: 'Rentabilidad total de las aportaciones',
      pesimista: Math.round(-2_500 * factor),
      medio: Math.round(45_000 * factor),
      optimista: Math.round(137_500 * factor),
      signed: true,
    },
    {
      concepto: 'Rentabilidad media anual',
      pesimista: perfilRate * 0.4,
      medio: perfilRate,
      optimista: perfilRate * 1.6,
      pctRow: true,
      muted: true,
    },
    {
      concepto: 'Ahorro acumulado actual',
      pesimista: Math.round(150_000 * factor),
      medio: Math.round(197_500 * factor),
      optimista: Math.round(290_000 * factor),
    },
  ];
}

/**
 * Mode B · Patrimonio tree rows — Figma production shot (Año 68 → Vista =
 * Todo el patrimonio). Categories carry children that collapse by default
 * except Inversiones (the one the user is actively optimizing).
 */
function buildPatrimonioRows(
  age: number,
  groups: readonly CategoryGroup[],
  optimizationName: string,
): readonly PatrimonioBreakdownRow[] {
  const factor = Math.max(0.6, (age - 48) / 20);
  const inversionesGroup = groups.find((g) => g.key === 'inversiones');
  const inmobiliarioGroup = groups.find((g) => g.key === 'inmobiliario');
  const liquidezGroup = groups.find((g) => g.key === 'liquidez');
  const deudaGroup = groups.find((g) => g.key === 'deuda');

  const rows: PatrimonioBreakdownRow[] = [];

  if (inversionesGroup) {
    const total = inversionesGroup.assets.reduce((acc, a) => acc + a.valor, 0);
    const children: PatrimonioBreakdownRow[] = inversionesGroup.assets.map((a) => ({
      concepto: a.nombre,
      actual: Math.round(a.valor * factor),
      simulada: Math.round(a.valor * factor),
    }));
    children.push({
      concepto: 'Colchón de liquidez',
      actual: 0,
      simulada: Math.round(229_356 * factor * 0.05),
    });
    children.push({
      concepto: optimizationName || 'Optimización pendiente',
      actual: 0,
      simulada: Math.round(443_622 * factor * 0.05),
    });
    rows.push({
      concepto: 'Inversiones',
      actual: Math.round(total * factor),
      simulada: Math.round(total * factor * 1.7),
      defaultOpen: true,
      children,
    });
  }

  if (inmobiliarioGroup) {
    const total = inmobiliarioGroup.assets.reduce((acc, a) => acc + a.valor, 0);
    rows.push({
      concepto: 'Inmobiliario',
      actual: Math.round(total * factor * 11),
      simulada: Math.round(total * factor * 10.5),
      defaultOpen: false,
      children: inmobiliarioGroup.assets.map((a) => ({
        concepto: a.nombre,
        actual: Math.round(a.valor * factor * 11),
        simulada: Math.round(a.valor * factor * 10.5),
      })),
    });
  }

  if (liquidezGroup) {
    const total = liquidezGroup.assets.reduce((acc, a) => acc + a.valor, 0);
    rows.push({
      concepto: 'Liquidez',
      actual: Math.round(total * factor * 72),
      simulada: Math.round(total * factor * 88),
      defaultOpen: false,
      children: liquidezGroup.assets.map((a) => ({
        concepto: a.nombre,
        actual: Math.round(a.valor * factor * 72),
        simulada: Math.round(a.valor * factor * 88),
      })),
    });
  }

  rows.push({
    concepto: 'Deuda',
    actual: deudaGroup ? Math.round(-93_599 * factor) : Math.round(-93_599 * factor),
    simulada: deudaGroup ? Math.round(-93_599 * factor) : Math.round(-93_599 * factor),
    defaultOpen: false,
    children: [],
  });

  const total = rows.reduce(
    (acc, r) => ({ actual: acc.actual + r.actual, simulada: acc.simulada + r.simulada }),
    { actual: 0, simulada: 0 },
  );
  rows.push({
    concepto: 'Total',
    actual: total.actual,
    simulada: total.simulada,
    total: true,
  });

  return rows;
}

const EUR_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});
