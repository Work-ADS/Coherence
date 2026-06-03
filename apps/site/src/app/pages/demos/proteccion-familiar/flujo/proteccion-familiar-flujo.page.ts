import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import {
  ButtonComponent,
  ChartLineComponent,
  CheckboxComponent,
  InputComponent,
  LogoComponent,
  PageHeaderComponent,
  SectionComponent,
  SelectComponent,
  StepperComponent,
  SwitchComponent,
} from '@coherence/ui';
import type { LineSeries, SelectOption } from '@coherence/ui';

import { DemoShellComponent } from '../../demo-shell/demo-shell.component';
import { ProductIdentityBarComponent } from '../../../../components/product-identity-bar/product-identity-bar.component';
import { WealthPlannerStore } from '../../wealth-planner-2026/store';

type ProteccionRow = 'cliente' | 'conyuge';
type StepKey = 'patrimonio' | 'impacto' | 'simulacion';

interface InmobiliarioSeed {
  id: string;
  nombre: string;
  tipo: string;
  importe: number;
  max: number;
}

interface LiquidezSeed {
  id: string;
  nombre: string;
  tipo: string;
  entidad: string;
  importe: number;
  max: number;
}

interface InversionChildSeed {
  id: string;
  nombre: string;
  isin: string;
  badge?: string;
  badgeIcon?: 'afi';
  tipo: string;
  entidad: string;
  importe: number;
  max: number;
}

interface InversionSeed {
  id: string;
  nombre: string;
  /** When present this row is a cartera that expands into child positions. */
  carteraCount?: number;
  isin?: string;
  badge?: string;
  badgeIcon?: 'afi';
  tipo: string;
  entidad: string;
  importe: number;
  max: number;
  children?: InversionChildSeed[];
}

interface PensionSeed {
  id: string;
  nombre: string;
  badge?: string;
  badgeIcon?: 'afi';
  isin: string;
  entidad: string;
  derechosAntes2007: number;
  derechosTotal: number;
  /** Max corresponds to derechosTotal — the toggle locks the input to it. */
  max: number;
}

interface SimpleSeed {
  id: string;
  nombre: string;
  importe: number;
  max: number;
}

interface SeguroVidaSeed {
  id: string;
  nombre: string;
  entidad: string;
  vencimiento: number;
  primaAnual: number;
  capitalFallecimiento: number;
  capitalInvalidez: number;
  /** Max corresponds to capitalFallecimiento — the toggle locks the input to it. */
  max: number;
}

const INMOBILIARIO_SEED: InmobiliarioSeed[] = [
  { id: 'inm-1', nombre: 'Vivienda Madrid', tipo: 'Vivienda habitual', importe: 361500, max: 361500 },
  { id: 'inm-2', nombre: 'Apartamento Barcelona', tipo: 'Tipo', importe: 100000, max: 100000 },
];

const LIQUIDEZ_SEED: LiquidezSeed[] = [
  { id: 'liq-1', nombre: 'Cuenta 123', tipo: 'Cuenta corriente', entidad: 'Banco Santander', importe: 50000, max: 100000 },
  { id: 'liq-2', nombre: 'Depósito ING', tipo: 'Depósito', entidad: 'ING', importe: 50000, max: 50000 },
];

const INVERSIONES_SEED: InversionSeed[] = [
  {
    id: 'inv-cartera-2025',
    nombre: 'Cartera 2025',
    carteraCount: 3,
    isin: 'ES812421237101238',
    tipo: 'Cartera',
    entidad: 'Banco Santander',
    importe: 16000,
    max: 16000,
    children: [],
  },
  {
    id: 'inv-cartera-2024',
    nombre: 'Cartera 2024',
    carteraCount: 3,
    isin: 'ES812421237101238',
    tipo: 'Cartera',
    entidad: 'Banco Santander',
    importe: 14000,
    max: 14000,
    children: [],
  },
  {
    id: 'inv-amazon',
    nombre: 'Amazon Inc',
    badge: 'RV Americana',
    badgeIcon: 'afi',
    isin: 'US0378331005',
    tipo: 'Acciones cotizadas',
    entidad: 'Renta 4',
    importe: 1000,
    max: 1000,
  },
  {
    id: 'inv-bankinter',
    nombre: 'Bankinter capital plus, FI',
    badge: 'Monetario',
    isin: 'ES0114868039',
    tipo: 'Fondos de inversión',
    entidad: 'Bankinter',
    importe: 50000,
    max: 150000,
  },
  {
    id: 'inv-r4-global',
    nombre: 'R4 global equity',
    badge: 'RV Internacional',
    badgeIcon: 'afi',
    isin: 'ES002938485',
    tipo: 'Fondos de inversión',
    entidad: 'Renta4',
    importe: 10000,
    max: 10000,
  },
];

const PENSIONES_SEED: PensionSeed[] = [
  {
    id: 'pp-r4',
    nombre: 'R4 PP',
    badge: 'RV Internacional',
    badgeIcon: 'afi',
    isin: 'DGS#4230',
    entidad: 'Renta4',
    derechosAntes2007: 5000,
    derechosTotal: 7500,
    max: 7500,
  },
];

const PARTICIPACIONES_SEED: SimpleSeed[] = [
  { id: 'part-1', nombre: 'Tech Innovations S.A', importe: 30000, max: 30000 },
  { id: 'part-2', nombre: 'Eco Foods Corp.', importe: 20000, max: 20000 },
];

const OTROS_SEED: SimpleSeed[] = [
  { id: 'otro-1', nombre: 'Obras de arte', importe: 600000, max: 600000 },
];

const SEGUROS_VIDA_SEED: SeguroVidaSeed[] = [
  {
    id: 'sv-1',
    nombre: 'Seguro de vida Santander',
    entidad: 'Banco Santander',
    vencimiento: 2060,
    primaAnual: 100,
    capitalFallecimiento: 600000,
    capitalInvalidez: 400000,
    max: 600000,
  },
  {
    id: 'sv-2',
    nombre: 'Seguro de vida BBVA',
    entidad: 'BBVA',
    vencimiento: 2070,
    primaAnual: 100,
    capitalFallecimiento: 270000,
    capitalInvalidez: 150000,
    max: 270000,
  },
];

// ── Step 2 — Impacto en ingresos y gastos ───────────────────────────────
interface ImpactoRow {
  id: string;
  concepto: string;
  inicio: string;
  fin: string;
  incremento: string;
  frecuencia: string;
  valor: number;
}

const IMPACTO_INGRESOS_SEED: ImpactoRow[] = [
  { id: 'imp-i-1', concepto: 'Nómina Luisa', inicio: 'Ahora', fin: 'Jubilación', incremento: '2,50%', frecuencia: 'Mensual', valor: 25000 },
  { id: 'imp-i-2', concepto: 'Nómina viudedad', inicio: 'Ahora', fin: 'Indefinido', incremento: '—', frecuencia: 'Mensual', valor: 4000 },
  { id: 'imp-i-3', concepto: 'Nómina Manuel', inicio: 'Ahora', fin: 'Jubilación', incremento: '2,50%', frecuencia: 'Mensual', valor: 4500 },
  { id: 'imp-i-4', concepto: 'Herencia Manuel', inicio: '2030', fin: '2040', incremento: '—', frecuencia: 'Mensual', valor: 25000 },
  { id: 'imp-i-5', concepto: 'Pensión de jubilación Manuel', inicio: 'Jubilación', fin: 'Indefinido', incremento: 'IPC', frecuencia: 'Mensual', valor: 65000 },
  { id: 'imp-i-6', concepto: 'Pensión de jubilación Luisa', inicio: 'Jubilación', fin: 'Indefinido', incremento: 'IPC', frecuencia: 'Anual', valor: 35000 },
];

const IMPACTO_GASTOS_SEED: ImpactoRow[] = [
  { id: 'imp-g-1', concepto: 'Ocio y otros gastos', inicio: 'Ahora', fin: 'Jubilación', incremento: 'IPC', frecuencia: 'Mensual', valor: 15000 },
  { id: 'imp-g-2', concepto: 'Vivienda y manutención Manuel y Luisa', inicio: 'Ahora', fin: 'Indefinido', incremento: 'IPC', frecuencia: 'Mensual', valor: 35000 },
  { id: 'imp-g-3', concepto: 'Dependencia y cuidados', inicio: '2027', fin: 'Indefinido', incremento: 'IPC', frecuencia: 'Anual', valor: 50000 },
  { id: 'imp-g-4', concepto: 'Gastos Manuel', inicio: 'Ahora', fin: 'Indefinido', incremento: '—', frecuencia: 'Mensual', valor: 8000 },
  { id: 'imp-g-5', concepto: 'Gastos María', inicio: 'Ahora', fin: 'Indefinido', incremento: '—', frecuencia: 'Anual', valor: 12000 },
  { id: 'imp-g-6', concepto: 'IRPF Luisa', inicio: 'Ahora', fin: 'Jubilación', incremento: '—', frecuencia: 'Anual', valor: 15000 },
  { id: 'imp-g-7', concepto: 'IRPF Manuel', inicio: 'Ahora', fin: 'Jubilación', incremento: '—', frecuencia: 'Anual', valor: 14000 },
];

// ── Step 3 — Simulación ────────────────────────────────────────────────
type Plazo = 'manual' | 'esperanza-conyuge';

const PLAZO_OPTIONS: SelectOption[] = [
  { value: 'manual', label: 'Manual' },
  { value: 'esperanza-conyuge', label: '28 años (esperanza de vida del cónyuge)' },
];

interface ScenarioKPI {
  scenario: 'pesimista' | 'medio' | 'optimista';
  label: string;
  probability: string;
  year: string;
  detail?: string;
}

const SIMULACION_KPIS: ScenarioKPI[] = [
  { scenario: 'pesimista', label: 'Escenario pesimista', probability: 'Se supera el 90 % de las veces', year: '2041' },
  { scenario: 'medio',     label: 'Escenario medio',     probability: 'Se supera el 50 % de las veces', year: 'Sin límite', detail: 'Capital en 2045: 250.000 €' },
  { scenario: 'optimista', label: 'Escenario optimista', probability: 'Se supera el 10 % de las veces', year: 'Sin límite', detail: 'Capital en 2045: 1.000.000 €' },
];

interface SSRow {
  concepto: string;
  pensionAnual: number;
  veinteAnios: number;
}

const SIMULACION_SS_SEED: SSRow[] = [
  { concepto: 'Cónyuge', pensionAnual: 9275, veinteAnios: 226709 },
  { concepto: 'Hijo 1 (hasta los 25 años)', pensionAnual: 3745, veinteAnios: 41119 },
  { concepto: 'Hijo 2 (hasta los 25 años)', pensionAnual: 3745, veinteAnios: 15449 },
];

const SIMULACION_CHART_DATA: LineSeries[] = [
  {
    key: 'pesimista',
    points: [
      { x: 2025, y: 1900000 }, { x: 2027, y: 1700000 }, { x: 2030, y: 1300000 },
      { x: 2033, y: 850000 }, { x: 2036, y: 400000 }, { x: 2039, y: 100000 },
      { x: 2041, y: 0 },
    ],
  },
  {
    key: 'medio',
    points: [
      { x: 2025, y: 1900000 }, { x: 2027, y: 1820000 }, { x: 2030, y: 1600000 },
      { x: 2033, y: 1300000 }, { x: 2036, y: 950000 }, { x: 2039, y: 600000 },
      { x: 2042, y: 350000 }, { x: 2045, y: 250000 },
    ],
  },
  {
    key: 'optimista',
    points: [
      { x: 2025, y: 1900000 }, { x: 2027, y: 1940000 }, { x: 2030, y: 1900000 },
      { x: 2033, y: 1750000 }, { x: 2036, y: 1550000 }, { x: 2039, y: 1300000 },
      { x: 2042, y: 1100000 }, { x: 2045, y: 1000000 },
    ],
  },
];

const STEPS = [
  { key: 'patrimonio', label: 'Patrimonio a disponer' },
  { key: 'impacto', label: 'Impacto en ingresos y gastos' },
  { key: 'simulacion', label: 'Simulación' },
] as const satisfies ReadonlyArray<{ key: StepKey; label: string }>;

/**
 * Protección familiar · Flujo (Brief H-Plus, scope-corrected 2026-06-03).
 *
 * Full-screen 3-step page (NOT a modal — earlier dialog approach was wrong):
 *   1. Patrimonio a disponer  — categorized asset-selection tables
 *   2. Impacto en ingresos y gastos
 *   3. Simulación
 *
 * Reached from `/proteccion-familiar` via the row's "Añadir" CTA, carrying
 * `row=cliente | conyuge` as a query param. Cancelar returns to the parent
 * page; Siguiente advances the stepper (and on the final step would commit
 * back into the store — TODO for the next session).
 */
@Component({
  selector: 'site-proteccion-familiar-flujo-page',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    RouterLink,
    ButtonComponent,
    ChartLineComponent,
    CheckboxComponent,
    InputComponent,
    LogoComponent,
    PageHeaderComponent,
    SectionComponent,
    SelectComponent,
    StepperComponent,
    SwitchComponent,
    DemoShellComponent,
    ProductIdentityBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proteccion-familiar-flujo.page.html',
  styleUrls: ['./proteccion-familiar-flujo.page.scss'],
})
export class ProteccionFamiliarFlujoPage {
  readonly store = inject(WealthPlannerStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly demoSlug = 'proteccion-familiar-flujo';
  readonly demoRoute = '/demos/wealth-planner-2026/proteccion-familiar/flujo';

  /** Which row this flujo configures — derived from the query param. */
  readonly row = toSignal(
    this.route.queryParamMap.pipe(
      map((params): ProteccionRow => (params.get('row') === 'conyuge' ? 'conyuge' : 'cliente')),
    ),
    { initialValue: 'cliente' as ProteccionRow },
  );

  readonly currentStep = signal<number>(1);
  readonly currentStepKey = computed<StepKey>(() => {
    const i = Math.min(Math.max(this.currentStep(), 1), STEPS.length) - 1;
    return STEPS[i]!.key;
  });

  readonly stepperItems = STEPS.map((s) => ({ key: s.key, label: s.label }));

  // ── Subject context (header subtitle) ─────────────────────────────────
  readonly subjectLabel = computed<string>(() => {
    if (this.row() === 'conyuge') {
      const co = this.store.conyuge();
      const name = co?.alias?.trim();
      return name ? `Protección familiar para ${name}` : 'Protección familiar para el cónyuge';
    }
    const c = this.store.cliente();
    const name = c.alias?.trim();
    return name ? `Protección familiar para ${name}` : 'Protección familiar para el cliente';
  });

  readonly identityBreadcrumb = computed(() => [
    { label: 'Wealth Planner', route: '/demos/wealth-planner-2026' },
    { label: 'Protección familiar', route: '/demos/wealth-planner-2026/proteccion-familiar' },
    { label: 'Flujo' },
  ]);

  // ── Seeds exposed to the template ─────────────────────────────────────
  readonly inmobiliario = INMOBILIARIO_SEED;
  readonly liquidez = LIQUIDEZ_SEED;
  readonly inversiones = INVERSIONES_SEED;
  readonly pensiones = PENSIONES_SEED;
  readonly participaciones = PARTICIPACIONES_SEED;
  readonly otros = OTROS_SEED;
  readonly segurosVida = SEGUROS_VIDA_SEED;

  // Step 2
  readonly impactoIngresos = IMPACTO_INGRESOS_SEED;
  readonly impactoGastos = IMPACTO_GASTOS_SEED;

  // Step 3
  readonly plazoOptions = PLAZO_OPTIONS;
  readonly simulacionKpis = SIMULACION_KPIS;
  readonly simulacionSS = SIMULACION_SS_SEED;
  readonly simulacionChartData = SIMULACION_CHART_DATA;

  readonly plazo = signal<Plazo>('manual');
  readonly anosCobertura = signal<number>(20);
  readonly patrimonioPrescindible = signal<number>(150000);
  readonly capitalFallecimientoAsegurado = signal<number>(870000);
  readonly capitalAdicionalACubrir = signal<number>(1000000);
  readonly primaAnualAproximada = signal<number>(7600);
  readonly capitalAdicionalNecesario = signal<number>(1997982);
  readonly simulacionSSTotal = computed(() => {
    const rows = this.simulacionSS;
    return {
      pensionAnual: rows.reduce((acc, r) => acc + r.pensionAnual, 0),
      veinteAnios: rows.reduce((acc, r) => acc + r.veinteAnios, 0),
    };
  });

  setPlazo(value: string | number | null): void {
    if (value === 'manual' || value === 'esperanza-conyuge') {
      this.plazo.set(value);
    }
  }
  setAnosCobertura(v: string | number | null): void {
    const n = typeof v === 'number' ? v : parseInt(String(v ?? '0'), 10);
    if (Number.isFinite(n)) this.anosCobertura.set(n);
  }
  setCapitalAdicionalACubrir(v: string | number | null): void {
    const n = typeof v === 'number' ? v : parseFloat(String(v ?? '0'));
    if (Number.isFinite(n)) this.capitalAdicionalACubrir.set(n);
  }

  // ── Chart year-detail tooltip (Step 3) ────────────────────────────────
  readonly activeYearDetail = signal<{ year: number } | null>(null);
  readonly yearTipMode = signal<'ano' | 'acumulado'>('ano');

  readonly yearTipLines = computed(() => {
    const year = this.activeYearDetail()?.year;
    if (!year) return [];
    const mode = this.yearTipMode();
    // Sample values mirroring the Figma tooltip (year-incremental vs accumulated).
    if (mode === 'ano') {
      return [
        { label: 'Patrimonio del año anterior', pesimista: '1.657.335 €', medio: '1.806.335 €', optimista: '2.105.335 €', total: false },
        { label: 'Ingresos y rentabilidades', pesimista: '+42.665 €', medio: '+43.665 €', optimista: '+44.665 €', total: true },
        { label: 'Rentas del trabajo', pesimista: '+20.000 €', medio: '+20.000 €', optimista: '+20.000 €', total: false },
        { label: 'Pensiones de viudedad y orfandad', pesimista: '+16.765 €', medio: '+16.765 €', optimista: '+16.765 €', total: false },
        { label: 'Rentabilidad del patrimonio', pesimista: '+1.000 €', medio: '+2.000 €', optimista: '+3.000 €', total: false },
        { label: 'Resto de ingresos', pesimista: '+4.900 €', medio: '+4.900 €', optimista: '+4.900 €', total: false },
        { label: 'Inversiones y gastos', pesimista: '-150.000 €', medio: '-150.000 €', optimista: '-150.000 €', total: false },
        { label: 'Patrimonio actual', pesimista: '1.550.000 €', medio: '1.700.000 €', optimista: '2.000.000 €', total: true },
      ];
    }
    return [
      { label: 'Patrimonio de inicio', pesimista: '1.800.000 €', medio: '1.800.000 €', optimista: '1.800.000 €', total: false },
      { label: 'Ingresos y rentabilidades', pesimista: '+200.000 €', medio: '+350.000 €', optimista: '+650.000 €', total: true },
      { label: 'Rentas del trabajo', pesimista: '+60.000 €', medio: '+60.000 €', optimista: '+60.000 €', total: false },
      { label: 'Pensiones de viudedad y orfandad', pesimista: '+50.295 €', medio: '+50.295 €', optimista: '+50.295 €', total: false },
      { label: 'Rentabilidad del patrimonio', pesimista: '+75.005 €', medio: '+225.005 €', optimista: '3,02 %', total: false },
      { label: 'Resto de ingresos', pesimista: '+14.700 €', medio: '+14.700 €', optimista: '+14.700 €', total: false },
      { label: 'Inversiones y gastos', pesimista: '-450.000 €', medio: '-450.000 €', optimista: '-450.000 €', total: false },
      { label: 'Patrimonio actual', pesimista: '1.550.000 €', medio: '1.700.000 €', optimista: '2.000.000 €', total: true },
    ];
  });

  onChartPointActivated(event: { index: number; datum: unknown }): void {
    const point = event.datum as { x?: number | Date; y?: number } | undefined;
    const x = point?.x;
    const year = typeof x === 'number' ? x : x instanceof Date ? x.getFullYear() : null;
    if (year === null) return;
    this.activeYearDetail.set({ year });
  }

  // ── Step 3 — form panel drawer (matches the MobileDrawerService pattern
  //    from planner-sidebar; off-canvas at <1024). Hamburger trigger toggles.
  readonly simFormDrawerOpen = signal<boolean>(false);

  toggleSimFormDrawer(): void {
    this.simFormDrawerOpen.update((v) => !v);
  }

  closeSimFormDrawer(): void {
    this.simFormDrawerOpen.set(false);
  }

  // ── Per-row draft state (page-local for now) ──────────────────────────
  readonly selectedIds = signal<Set<string>>(new Set());
  /** Per-asset "Todo el activo" toggle — when true the importe input locks to max. */
  readonly todoActivo = signal<Record<string, boolean>>({
    'liq-2': true,
    'inv-bankinter': true,
  });
  /** Per-asset draft importe override; missing keys fall back to the seed. */
  readonly importeDraft = signal<Record<string, number>>({});

  // Seed selection so the in-flight demo shows the same checked rows as the Figma.
  constructor() {
    this.selectedIds.set(
      new Set<string>([
        'liq-1',
        'liq-2',
        'inv-bankinter',
        'sv-1',
        'sv-2',
      ]),
    );
    // Seed the chart tooltip so the year-detail panel is visible by default
    // (matches the Figma demo of Step 3 — node 78:189124 / 78:189137).
    this.activeYearDetail.set({ year: 2027 });
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  toggleSelected(id: string, checked: boolean): void {
    this.selectedIds.update((set) => {
      const next = new Set(set);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  isTodoActivo(id: string): boolean {
    return this.todoActivo()[id] === true;
  }

  setTodoActivo(id: string, value: boolean): void {
    this.todoActivo.update((map) => ({ ...map, [id]: value }));
  }

  importeFor(id: string, fallback: number): number {
    const override = this.importeDraft()[id];
    return override === undefined ? fallback : override;
  }

  setImporte(id: string, raw: string | number | null): void {
    const num = typeof raw === 'number' ? raw : parseFloat(String(raw ?? '0'));
    if (!Number.isFinite(num)) return;
    this.importeDraft.update((map) => ({ ...map, [id]: num }));
  }

  // ── Stepper navigation ────────────────────────────────────────────────
  goPrev(): void {
    this.currentStep.update((s) => Math.max(1, s - 1));
  }

  goNext(): void {
    this.currentStep.update((s) => Math.min(STEPS.length, s + 1));
  }

  onStepClicked(event: { key: string; index: number }): void {
    this.currentStep.set(event.index);
  }

  cancel(): void {
    this.router.navigate(['/demos/wealth-planner-2026/proteccion-familiar']);
  }

  // ── Formatters ────────────────────────────────────────────────────────
  formatEuro(n: number | null | undefined, fractionDigits = 0): string {
    if (n === undefined || n === null || !Number.isFinite(n)) return '—';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: fractionDigits,
    }).format(n);
  }

  formatNumber(n: number): string {
    return new Intl.NumberFormat('es-ES').format(n);
  }
}

