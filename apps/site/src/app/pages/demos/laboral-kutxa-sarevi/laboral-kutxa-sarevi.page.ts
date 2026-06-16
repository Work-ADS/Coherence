import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  AnimatedChartComponent,
  ButtonComponent,
  CheckboxComponent,
  InputComponent,
  ModalComponent,
  SegmentedControlComponent,
  SelectComponent,
  StepperComponent,
  SwitchComponent,
  TabItemComponent,
  TabsComponent,
  type ChartColumn,
  type SegmentedOption,
  type SelectOption,
  type StepperItem,
} from '@coherence/ui';

import { BcFooterComponent } from '../../../components/bc-footer';
import { RadioCardGroupComponent } from '../../../components/radio-card-group';
import { DemoShellComponent } from '../demo-shell/demo-shell.component';
import { MUNICIPIOS_ES } from './municipios-es';

type Route = 'welcome' | 'datos' | 'medidas' | 'resumen';
type Variant = 'basica' | 'completa' | 'personalizada';
type SareviBrand = 'laboral-kutxa' | 'unicaja' | 'banco-cooperativo';

interface StepNavItem {
  key: Exclude<Route, 'welcome'>;
  number: string;
  label: string;
}

export interface Medida {
  id: string;
  name: string;
  impact: 'alto' | 'medio' | 'bajo' | 'none' | null;
  cae: boolean;
  basic: number | null;
  full: number | null;
}

interface DatosState {
  tipoVivienda: string;
  buscarDir: string;
  direccion: string;
  municipio: string;
  anoConstruccion: string;
  certificado: string;
  etiqueta: string;
  tamano: number;
  habitantes: number;
  plantas: number;
  calefaccion: string;
  refrigeracion: string;
}

const MEDIDAS: Medida[] = [
  { id: 'sate',     name: 'Sistema de aislamiento térmico por el exterior (SATE)', impact: 'medio', cae: true,  basic: 38045,  full: 271885 },
  { id: 'aisla',    name: 'Aislamiento de cámara interior (muros, buhardillas y tejados)', impact: 'bajo', cae: true,  basic: 14267,  full: 14267 },
  { id: 'cubierta', name: 'Mejora de cubiertas',                                  impact: 'medio', cae: true,  basic: 10313,  full: 14267 },
  { id: 'solar',    name: 'Paneles solares térmicos para agua caliente sanitaria (ACS)', impact: 'bajo', cae: true, basic: 5100, full: 4200 },
  { id: 'aero',     name: 'Aerotermia',                                          impact: 'alto',  cae: true,  basic: 56892,  full: 56892 },
  { id: 'suelo',    name: 'Suelo radiante y refrigerante',                       impact: 'medio', cae: false, basic: 52800,  full: 52800 },
  { id: 'ilum',     name: 'Sustitución de la iluminación',                       impact: 'none',  cae: false, basic: 8580,   full: 46800 },
  { id: 'vent',     name: 'Sustitución de ventanas',                             impact: 'medio', cae: true,  basic: 69300,  full: 324000 },
  { id: 'caldera',  name: 'Sustitución y mejora de calderas centrales',         impact: 'bajo',  cae: true,  basic: null,   full: 70695 },
  { id: 'fv',       name: 'Paneles solares fotovoltaicos para autoconsumo',     impact: 'bajo',  cae: false, basic: 15135,  full: 20022 },
  { id: 'reparti',  name: 'Repartidores de coste (calefacciones centrales)',     impact: 'alto',  cae: false, basic: null,   full: 25000 },
  { id: 'audit',    name: 'Auditoría energética',                                impact: 'bajo',  cae: false, basic: 900,    full: 900 },
  { id: 'ascensor', name: 'Renovación y mejora de ascensores',                   impact: 'alto',  cae: true,  basic: null,   full: 117500 },
];

interface ParamDef {
  id: string;
  label: string;
  unit: string;
  defaultValue: number;
}

const MEDIDA_PARAMS: Record<string, readonly ParamDef[]> = {
  ilum: [
    { id: 'count',    label: 'Número de luminarias a sustituir', unit: 'luminarias', defaultValue: 10 },
    { id: 'unitCost', label: 'Coste por luminaria',              unit: '€',          defaultValue: 65 },
  ],
  vent: [
    { id: 'unitCost', label: 'Precio por nueva ventana',         unit: '€',          defaultValue: 700 },
    { id: 'count',    label: 'Número de ventanas a sustituir',   unit: 'ventanas',   defaultValue: 30 },
  ],
};

const IMPACT_LABEL: Record<NonNullable<Medida['impact']>, string> = {
  alto: 'Impacto alto',
  medio: 'Impacto medio',
  bajo: 'Impacto bajo',
  none: 'No hay impacto',
};

const MEDIDA_INFO_QUE = `El sistema de aislamiento térmico de exterior (SATE) es un sistema de aislamiento compuesto por paneles sintéticos colocados en las paredes exteriores del edificio. Estos paneles forman un ensamblaje que aísla tanto térmicamente como desde el punto de vista acústico, reduciendo sustancialmente el consumo de energía necesaria para enfriar el interior en los meses de mayor calor, y calentar en los meses más fríos.

Además de la mejora del aislamiento térmico y acústico, genera mejoras estéticas, en la medida en que recubren la fachada antigua del edificio.`;

const MEDIDA_INFO_COMO = `El sistema SATE considerado se compone de poliestireno expandido EPS de 8 cm, salvo en la planta baja que se considera poliestireno extruido XPS. El acabado exterior considerado es revoco + pintura de fachada.

Para estimar los costes de esta medida se tienen en cuenta los siguientes factores:

Coste fijo de 60 €/m² si la instalación si hay menos de tres plantas y de 100 € en caso de que sean más. Este coste incluye el propio SATE y otros costes derivados de materiales pequeños (silicona, tornillos, bridas...).
Coste de mano de obra variable por provincia. Según los costes salariales y, por lo tanto, coste de mano de obra de implantación del SATE en una determinada provincia se estima que el precio puede variar entre 45 €/m² (provincias con alto coste de mano de obra), 30 €/m² (provincias con coste medio de mano de obra) y 15 €/m² (provincias con coste bajo de mano de obra).

Coste de andamios y permisos necesarios que suponemos solo serán necesarios en el caso de que haya más de dos plantas. En estos casos la fórmula utilizada para conocer el precio por metro cuadrado es la siguiente: PLANTAS * 0,6 + 3.000 / SUPERFICIE MUROS LATERALES1(m²).

Coste acondicionamiento previo de la fachada variable en función del año de construcción.`;

const ENERGY_GRADES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const BRAND_CONFIG: Record<SareviBrand, {
  demoSlug: string;
  demoRoute: string;
  brandName: string;
  logoSrc: string;
  logoAlt: string;
  refCode: string;
  chartPrimary: string;
  chartSecondary: string;
  chartAccent: string;
  advisorCopy: string;
}> = {
  'laboral-kutxa': {
    demoSlug: 'laboral-kutxa-sarevi',
    demoRoute: '/demos/laboral-kutxa-sarevi/demo',
    brandName: 'Laboral Kutxa',
    logoSrc: 'assets/logos/laboral-kutxa/logo.png',
    logoAlt: 'Laboral Kutxa',
    refCode: 'b8TpBXx3',
    chartPrimary: 'var(--color-laboral-kutxa-verde-500)',
    chartSecondary: 'var(--color-laboral-kutxa-verde-700)',
    chartAccent: 'var(--color-laboral-kutxa-magenta-500)',
    advisorCopy: 'Un asesor de Laboral Kutxa se pondrá en contacto contigo.',
  },
  unicaja: {
    demoSlug: 'sarevi-unicaja',
    demoRoute: '/demos/sarevi-unicaja/demo',
    brandName: 'Unicaja',
    logoSrc: 'assets/logos/unicaja/logo-dark.svg',
    logoAlt: 'Unicaja',
    refCode: 'uC9kQ4w2',
    chartPrimary: 'var(--color-unicaja-secondary-500)',
    chartSecondary: 'var(--color-unicaja-secondary-700)',
    chartAccent: 'var(--color-unicaja-primary-500)',
    advisorCopy: 'Un asesor de Unicaja se pondrá en contacto contigo.',
  },
  'banco-cooperativo': {
    demoSlug: 'sarevi-banco-cooperativo',
    demoRoute: '/demos/sarevi-banco-cooperativo/demo',
    brandName: 'Banco Cooperativo Español',
    logoSrc: 'assets/logos/banco-cooperativo/logo.png',
    logoAlt: 'Banco Cooperativo Español',
    refCode: 'bC5fEz1k',
    chartPrimary: 'var(--color-banco-cooperativo-verde-cooperativo-500)',
    chartSecondary: 'var(--color-banco-cooperativo-verde-oscuro-500)',
    chartAccent: 'var(--color-banco-cooperativo-amarillo-espiga-500)',
    advisorCopy: 'Un asesor de Banco Cooperativo Español se pondrá en contacto contigo.',
  },
};

@Component({
  selector: 'site-laboral-kutxa-sarevi',
  standalone: true,
  imports: [
    AnimatedChartComponent,
    ButtonComponent,
    CheckboxComponent,
    InputComponent,
    ModalComponent,
    SegmentedControlComponent,
    SelectComponent,
    SwitchComponent,
    TabsComponent,
    TabItemComponent,
    StepperComponent,
    DemoShellComponent,
    BcFooterComponent,
    RadioCardGroupComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './laboral-kutxa-sarevi.page.html',
  styleUrl: './laboral-kutxa-sarevi.page.scss',
})
export class LaboralKutxaSareviPage {
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly brand = signal<SareviBrand>(
    ((): SareviBrand => {
      const fromRoute = this.activatedRoute.snapshot.data['sareviBrand'];
      if (fromRoute === 'unicaja') return 'unicaja';
      if (fromRoute === 'banco-cooperativo') return 'banco-cooperativo';
      return 'laboral-kutxa';
    })(),
  );
  readonly brandConfig = computed(() => BRAND_CONFIG[this.brand()]);

  readonly route = signal<Route>('welcome');
  readonly refCode = computed(() => this.brandConfig().refCode);

  // Two-way modal opens (afi-modal uses [open]/(openChange))
  readonly recuperarOpen = signal(false);
  readonly infoOpen = signal(false);
  readonly infoMedida = signal<Medida | null>(null);

  readonly data = signal<DatosState>({
    tipoVivienda: 'Piso',
    buscarDir: 'No',
    direccion: '96 calle fuencaral',
    municipio: '',
    anoConstruccion: '',
    certificado: '',
    etiqueta: 'E',
    tamano: 120,
    habitantes: 2,
    plantas: 2,
    calefaccion: '',
    refrigeracion: '',
  });

  readonly selected = signal<string[]>(['aero', 'fv']);
  readonly variant = signal<Variant>('basica');
  readonly medidaParams = MEDIDA_PARAMS;

  /** Per-medida `Cálculo automático` toggle (defaults ON). */
  private readonly autoCalcMap = signal<Record<string, boolean>>({});
  /** Per-medida override importe (when auto-calc is OFF). */
  private readonly importeMap = signal<Record<string, number>>({});
  /** Per-medida + per-param value overrides. */
  private readonly paramMap = signal<Record<string, Record<string, number>>>({});

  readonly importeFinanciar = signal(81432);
  readonly plazo = signal(7);
  readonly maxImporte = 81432;

  readonly infoTabIndex = signal(0);

  readonly energyGrades = ENERGY_GRADES;
  readonly impactLabel = IMPACT_LABEL;
  readonly infoQue = MEDIDA_INFO_QUE;
  readonly infoComo = MEDIDA_INFO_COMO;
  readonly steps: StepNavItem[] = [
    { key: 'datos', number: '01', label: 'Datos' },
    { key: 'medidas', number: '02', label: 'Medidas' },
    { key: 'resumen', number: '03', label: 'Resumen' },
  ];

  /** afi-stepper consumes {key, label}; the legacy custom .steps consumes `number`. */
  readonly stepperItems: StepperItem[] = this.steps.map(({ key, label }) => ({ key, label }));

  /** 1-based index of the current route within the 3-step flow. Falls back to 1
   *  on `welcome` so the primitive can render off-screen without crashing. */
  readonly currentStepIndex = computed(() => {
    const r = this.route();
    const idx = this.steps.findIndex((s) => s.key === r);
    return idx >= 0 ? idx + 1 : 1;
  });

  onStepperClicked(payload: { key: string }): void {
    this.goTo(payload.key as Route);
  }

  // Bar-chart shown on the medidas screen — live preview of the reduction
  // percentages that the currently-selected measures would produce. Same
  // visual language as the resumen chart so both screens read as one story.
  readonly medidasReductionColumns = computed<ChartColumn[]>(() => [
    {
      title: 'Gasto al año',
      value: 320,
      appendString: ' €',
      caption: '↓ 99%',
      color: this.brandConfig().chartPrimary,
    },
    {
      title: 'Consumo al año',
      value: 1843,
      appendString: ' kWh',
      caption: '↓ 99%',
      color: this.brandConfig().chartSecondary,
    },
    {
      title: 'Emisiones al año',
      value: 47,
      appendString: ' kg',
      caption: '↓ 14%',
      color: this.brandConfig().chartAccent,
    },
  ]);

  // Bar-chart breakdown of the post-reforma reductions (max = 100% scale).
  // Colors mix the data-viz series palette with LK-specific magenta so the
  // financial bar (€) reads as a brand-tinted accent vs the verde sustainability
  // bars. Visible on the resumen screen inside the bento layout.
  readonly ahorroChartColumns = computed<ChartColumn[]>(() => [
    {
      title: 'Consumo',
      value: 1843,
      appendString: ' kWh',
      caption: '−64% al año',
      color: this.brandConfig().chartPrimary,
    },
    {
      title: 'Emisiones',
      value: 47,
      appendString: ' kg',
      caption: '−64% CO₂/año',
      color: this.brandConfig().chartSecondary,
    },
    {
      title: 'Gasto',
      value: 320,
      appendString: ' €',
      caption: '−71% al año',
      color: this.brandConfig().chartAccent,
    },
  ]);

  readonly tipoOptions: SegmentedOption[] = [
    { value: 'Piso', label: 'Piso' },
    { value: 'Chalet adosado', label: 'Chalet adosado' },
    { value: 'Chalet independiente', label: 'Chalet independiente' },
  ];

  readonly etiquetaOptions: SegmentedOption[] = ENERGY_GRADES.map((g) => ({
    value: g,
    label: g,
  }));

  readonly siNoOptions: SegmentedOption[] = [
    { value: 'Sí', label: 'Sí' },
    { value: 'No', label: 'No' },
  ];

  readonly municipioOptions: SelectOption[] = MUNICIPIOS_ES.map((v) => ({
    value: v,
    label: v,
  }));

  readonly anoConstruccionOptions: SelectOption[] = [
    'Anterior al 2000',
    'De 2000 a 2006',
    'De 2006 a 2013',
    'De 2013 a 2019',
    'Del 2019 a actualidad',
  ].map((v) => ({ value: v, label: v }));

  readonly calefaccionOptions: SelectOption[] = [
    'Caldera de gas natural',
    'Caldera de gasóleo',
    'Bomba de calor',
    'Calefacción eléctrica',
    'Biomasa',
  ].map((v) => ({ value: v, label: v }));

  readonly refrigeracionOptions: SelectOption[] = [
    'Bomba de calor (split)',
    'Aire acondicionado central',
    'Ventiladores',
    'Ninguno',
  ].map((v) => ({ value: v, label: v }));

  readonly variantOptions = computed<SegmentedOption[]>(() => {
    // Unicaja's Sarevi 360 design only ships Básica + Personalizada — drop the
    // middle "completa" tier so the tab strip lines up with the simulator
    // surface the brand team approved.
    const base: SegmentedOption[] = [
      { value: 'basica', label: 'Básica' },
      { value: 'completa', label: 'Completa' },
      { value: 'personalizada', label: 'Personalizada' },
    ];
    return this.brand() === 'unicaja'
      ? base.filter((o) => o.value !== 'completa')
      : base;
  });

  readonly providers: { name: string; desc: string; icon: 'home' | 'check' | 'sun' }[] = [
    {
      name: 'EcoRehab Solutions',
      desc: 'Rehabilitación energética integral. Instalación certificada de SATE, ventanas de alta eficiencia y cubiertas aislantes.',
      icon: 'home',
    },
    {
      name: 'CertiEnergy España',
      desc: 'Auditoría energética y certificación técnica de viviendas. Más de 5.000 proyectos completados con profesionales acreditados.',
      icon: 'check',
    },
    {
      name: 'SolarPlus Instalaciones',
      desc: 'Instalación de aerotermia, paneles solares fotovoltaicos y sistemas de climatización de bajo consumo energético.',
      icon: 'sun',
    },
  ];

  readonly stepN = computed(() => {
    const r = this.route();
    return r === 'datos' ? 1 : r === 'medidas' ? 2 : r === 'resumen' ? 3 : 0;
  });

  stepState(step: StepNavItem): 'done' | 'current' | 'todo' {
    const index = this.steps.findIndex((s) => s.key === step.key) + 1;
    const current = this.stepN();
    return index < current ? 'done' : index === current ? 'current' : 'todo';
  }

  stepAriaLabel(step: StepNavItem, state: 'done' | 'current' | 'todo'): string {
    const suffix = state === 'current' ? ', paso actual' : state === 'done' ? ', paso completado' : '';
    return `${step.label}${suffix}`;
  }

  readonly visibleMedidas = computed(() =>
    MEDIDAS.filter((m) => this.variant() !== 'personalizada' || m.basic != null),
  );

  readonly datosValid = computed(() => {
    const d = this.data();
    const addressOk =
      this.brand() === 'banco-cooperativo'
        ? !!(d.municipio && d.anoConstruccion)
        : !!d.municipio;
    return !!(d.tipoVivienda && addressOk && d.certificado && d.calefaccion && d.refrigeracion);
  });

  readonly afterGrade = computed(() => (this.selected().length >= 3 ? 'A' : 'B'));

  readonly costeObras = 79220;
  readonly costeTram = 1313;
  readonly importeCAE = -9050;
  readonly importeTotal = computed(() => this.costeObras + this.costeTram);
  readonly importeConCAE = computed(() => this.importeTotal() + this.importeCAE);

  readonly costeObrasResumen = 81432;
  readonly deduccionesIRPF = -2198;
  readonly obtenidosCAE = -9049;
  readonly totalResumen = computed(
    () => this.costeObrasResumen + this.deduccionesIRPF + this.obtenidosCAE,
  );

  readonly meses = computed(() => this.plazo() * 12);
  readonly c1Carencia = computed(() => this.carenciaInterest(this.importeFinanciar(), 0.04));
  readonly c1Resto = computed(() =>
    this.monthly(this.importeFinanciar(), 0.04, this.meses() - 12),
  );
  readonly c2Carencia = computed(() => this.carenciaInterest(this.importeFinanciar(), 0.03));
  readonly c2Resto = computed(() =>
    this.monthly(this.importeFinanciar(), 0.03, this.meses() - 12),
  );

  readonly importeFinanciarPct = computed(
    () => (this.importeFinanciar() / this.maxImporte) * 100,
  );
  readonly plazoPct = computed(() => ((this.plazo() - 1) / 6) * 100);

  readonly recuperarCode = signal('');

  goTo(route: Route): void {
    this.route.set(route);
  }

  choose(): void {
    this.route.set('datos');
  }

  setTipoVivienda(value: string): void {
    this.data.update((d) => ({ ...d, tipoVivienda: value }));
  }

  setBuscarDir(value: string): void {
    this.data.update((d) => ({ ...d, buscarDir: value }));
  }

  setDireccion(value: string | number | null): void {
    this.data.update((d) => ({ ...d, direccion: value == null ? '' : String(value) }));
  }

  setMunicipio(value: string | number | null): void {
    this.data.update((d) => ({ ...d, municipio: value == null ? '' : String(value) }));
  }

  setAnoConstruccion(value: string | number | null): void {
    this.data.update((d) => ({ ...d, anoConstruccion: value == null ? '' : String(value) }));
  }

  setCertificado(value: string): void {
    this.data.update((d) => ({ ...d, certificado: value }));
  }

  setEtiqueta(value: string): void {
    this.data.update((d) => ({ ...d, etiqueta: value }));
  }

  setTamano(value: string | number | null): void {
    const raw = value == null ? '' : String(value);
    const n = parseInt(raw.replace(/\D/g, ''), 10) || 0;
    this.data.update((d) => ({ ...d, tamano: n }));
  }

  setHabitantes(value: string | number | null): void {
    const raw = value == null ? '' : String(value);
    const n = parseInt(raw.replace(/\D/g, ''), 10) || 0;
    this.data.update((d) => ({ ...d, habitantes: n }));
  }

  setPlantas(value: string | number | null): void {
    const raw = value == null ? '' : String(value);
    const n = parseInt(raw.replace(/\D/g, ''), 10) || 0;
    this.data.update((d) => ({ ...d, plantas: n }));
  }

  setCalefaccion(value: string | number | null): void {
    this.data.update((d) => ({ ...d, calefaccion: value == null ? '' : String(value) }));
  }

  setRefrigeracion(value: string | number | null): void {
    this.data.update((d) => ({ ...d, refrigeracion: value == null ? '' : String(value) }));
  }

  setVariant(value: string): void {
    if (value === 'basica' || value === 'completa' || value === 'personalizada') {
      this.variant.set(value);
    }
  }

  toggleSelected(id: string): void {
    this.selected.update((arr) => {
      const set = new Set(arr);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return Array.from(set);
    });
  }

  medidaAutoCalc(id: string): boolean {
    return this.autoCalcMap()[id] ?? true;
  }

  medidaImporte(id: string): number {
    const override = this.importeMap()[id];
    if (override != null) return override;
    return MEDIDAS.find((m) => m.id === id)?.basic ?? 0;
  }

  medidaParam(medidaId: string, paramId: string): number {
    const override = this.paramMap()[medidaId]?.[paramId];
    if (override != null) return override;
    const def = MEDIDA_PARAMS[medidaId]?.find((p) => p.id === paramId);
    return def?.defaultValue ?? 0;
  }

  setMedidaAutoCalc(id: string, value: boolean): void {
    this.autoCalcMap.update((m) => ({ ...m, [id]: value }));
  }

  setMedidaImporte(id: string, value: string | number | null): void {
    const raw = value == null ? '' : String(value);
    const n = parseInt(raw.replace(/\D/g, ''), 10) || 0;
    this.importeMap.update((m) => ({ ...m, [id]: n }));
  }

  setMedidaParam(medidaId: string, paramId: string, value: string | number | null): void {
    const raw = value == null ? '' : String(value);
    const n = parseInt(raw.replace(/\D/g, ''), 10) || 0;
    this.paramMap.update((m) => ({ ...m, [medidaId]: { ...m[medidaId], [paramId]: n } }));
  }

  openRecuperar(): void {
    this.recuperarCode.set('');
    this.recuperarOpen.set(true);
  }

  openInfo(m: Medida): void {
    this.infoMedida.set(m);
    this.infoTabIndex.set(0);
    this.infoOpen.set(true);
  }

  openInfoByName(name: string): void {
    this.openInfo({ id: name, name, impact: null, cae: false, basic: 900, full: 900 });
  }

  setRecuperarCode(value: string | number | null): void {
    this.recuperarCode.set(value == null ? '' : String(value));
  }

  recuperar(): void {
    this.recuperarOpen.set(false);
    this.route.set('resumen');
  }

  isSelected(id: string): boolean {
    return this.selected().includes(id);
  }

  price(m: Medida): number | null {
    return this.variant() === 'basica' ? m.basic : m.full;
  }

  formatEuro(n: number | null): string {
    if (n == null) return '—';
    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(n);
    return sign + abs.toLocaleString('es-ES') + ' €';
  }

  formatMoneda(n: number): string {
    return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  setImporte(value: string | number | null): void {
    const raw = value == null ? '' : String(value);
    let n = parseInt(raw.replace(/\D/g, ''), 10);
    if (!Number.isFinite(n)) n = 0;
    n = Math.min(Math.max(0, n), this.maxImporte);
    this.importeFinanciar.set(n);
  }

  onImporteRange(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.importeFinanciar.set(
      Math.min(Math.max(0, parseInt(v, 10) || 0), this.maxImporte),
    );
  }

  onPlazoRange(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.plazo.set(parseInt(v, 10) || 1);
  }

  contactAdvisor(): void {
    alert(this.brandConfig().advisorCopy);
  }

  private monthly(p: number, rA: number, n: number): number {
    const r = rA / 12;
    return Math.round(((p * r) / (1 - Math.pow(1 + r, -n))) * 100) / 100;
  }

  private carenciaInterest(p: number, rA: number): number {
    return Math.round(((p * rA) / 12) * 100) / 100;
  }
}
