import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import {
  AnimatedChartComponent,
  ButtonComponent,
  CheckboxComponent,
  InputComponent,
  ModalComponent,
  SegmentedControlComponent,
  SelectComponent,
  SwitchComponent,
  TabItemComponent,
  TabsComponent,
  type ChartColumn,
  type SegmentedOption,
  type SelectOption,
} from '@coherence/ui';

import { DemoShellComponent } from '../demo-shell/demo-shell.component';
import { MUNICIPIOS_ES } from './municipios-es';

type Route = 'welcome' | 'datos' | 'medidas' | 'resumen';
type Variant = 'basica' | 'completa' | 'personalizada';

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
  municipio: string;
  certificado: string;
  etiqueta: string;
  tamano: number;
  habitantes: number;
  calefaccion: string;
  refrigeracion: string;
}

const MEDIDAS: Medida[] = [
  { id: 'sate',     name: '"SATE" - Sistema de aislamiento exterior',           impact: 'medio', cae: true,  basic: 38045,  full: 271885 },
  { id: 'aisla',    name: 'Aislamiento de cámara interior (muros, buhardillas y tejados)', impact: 'bajo', cae: true,  basic: 14267,  full: 14267 },
  { id: 'cubierta', name: 'Actuaciones en cubiertas',                            impact: 'medio', cae: true,  basic: 10313,  full: 14267 },
  { id: 'solar',    name: 'Paneles solares térmicos para ACS',                   impact: 'bajo',  cae: true,  basic: 5100,   full: 4200 },
  { id: 'aero',     name: 'Aerotermia',                                          impact: 'alto',  cae: true,  basic: 56892,  full: 56892 },
  { id: 'suelo',    name: 'Suelo radiante/refrigerante',                         impact: 'medio', cae: false, basic: 52800,  full: 52800 },
  { id: 'ilum',     name: 'Sustitución iluminación',                             impact: 'none',  cae: false, basic: 8580,   full: 46800 },
  { id: 'vent',     name: 'Sustitución de ventanas',                             impact: 'medio', cae: true,  basic: 69300,  full: 324000 },
  { id: 'caldera',  name: 'Sustitución y mejora de calderas centrales',         impact: 'bajo',  cae: true,  basic: null,   full: 70695 },
  { id: 'fv',       name: 'Paneles solares fotovoltaicos - Autoconsumo',        impact: 'bajo',  cae: false, basic: 15135,  full: 20022 },
  { id: 'reparti',  name: 'Repartidores de coste (calefacciones centrales)',     impact: 'alto',  cae: false, basic: null,   full: 25000 },
  { id: 'audit',    name: 'Auditoría energética',                                impact: 'bajo',  cae: false, basic: 900,    full: 900 },
  { id: 'ascensor', name: 'Renovación y mejora de ascensores',                   impact: 'alto',  cae: true,  basic: null,   full: 117500 },
];

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
    DemoShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './laboral-kutxa-sarevi.page.html',
  styleUrl: './laboral-kutxa-sarevi.page.scss',
})
export class LaboralKutxaSareviPage {
  readonly route = signal<Route>('welcome');
  readonly refCode = signal('b8TpBXx3');

  // Two-way modal opens (afi-modal uses [open]/(openChange))
  readonly recuperarOpen = signal(false);
  readonly infoOpen = signal(false);
  readonly infoMedida = signal<Medida | null>(null);

  readonly data = signal<DatosState>({
    tipoVivienda: 'Piso',
    buscarDir: 'No',
    municipio: '',
    certificado: '',
    etiqueta: 'E',
    tamano: 120,
    habitantes: 2,
    calefaccion: '',
    refrigeracion: '',
  });

  readonly selected = signal<string[]>(['aero', 'fv']);
  readonly variant = signal<Variant>('basica');
  readonly expandedId = signal<string | null>(null);
  readonly autoCalc = signal(false);
  readonly customImporte = signal(36043);

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

  // Bar-chart shown on the medidas screen — live preview of the reduction
  // percentages that the currently-selected measures would produce. Same
  // visual language as the resumen chart so both screens read as one story.
  readonly medidasReductionColumns: ChartColumn[] = [
    {
      title: 'Ahorro económico',
      value: 99,
      appendString: '%',
      caption: 'menos gasto anual',
      color: 'var(--color-laboral-kutxa-verde-500)',
    },
    {
      title: 'Consumo energético',
      value: 99,
      appendString: '%',
      caption: 'menos kWh/año',
      color: 'var(--color-laboral-kutxa-verde-700)',
    },
    {
      title: 'Emisiones CO₂',
      value: 14,
      appendString: '%',
      caption: 'menos kg/año',
      color: 'var(--color-laboral-kutxa-magenta-500)',
    },
  ];

  // Bar-chart breakdown of the post-reforma reductions (max = 100% scale).
  // Colors mix the data-viz series palette with LK-specific magenta so the
  // financial bar (€) reads as a brand-tinted accent vs the verde sustainability
  // bars. Visible on the resumen screen inside the bento layout.
  readonly ahorroChartColumns: ChartColumn[] = [
    {
      title: 'Consumo',
      value: 64,
      appendString: '%',
      caption: 'reducción',
      color: 'var(--color-laboral-kutxa-verde-500)',
    },
    {
      title: 'Emisiones',
      value: 64,
      appendString: '%',
      caption: 'reducción',
      color: 'var(--color-laboral-kutxa-verde-700)',
    },
    {
      title: 'Gasto',
      value: 71,
      appendString: '%',
      caption: 'menos €/año',
      color: 'var(--color-laboral-kutxa-magenta-500)',
    },
  ];

  readonly tipoOptions: SegmentedOption[] = [
    { value: 'Piso', label: 'Piso' },
    { value: 'Chalet adosado', label: 'Chalet adosado' },
    { value: 'Chalet independiente', label: 'Chalet independiente' },
  ];

  readonly siNoOptions: SegmentedOption[] = [
    { value: 'Sí', label: 'Sí' },
    { value: 'No', label: 'No' },
  ];

  readonly municipioOptions: SelectOption[] = MUNICIPIOS_ES.map((v) => ({
    value: v,
    label: v,
  }));

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

  readonly variantOptions: SegmentedOption[] = [
    { value: 'basica', label: 'Reforma básica' },
    { value: 'completa', label: 'Reforma completa' },
    { value: 'personalizada', label: 'Reforma personalizada' },
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
    return !!(d.tipoVivienda && d.municipio && d.certificado && d.calefaccion && d.refrigeracion);
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

  setMunicipio(value: string | number | null): void {
    this.data.update((d) => ({ ...d, municipio: value == null ? '' : String(value) }));
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

  toggleExpanded(id: string): void {
    this.expandedId.update((cur) => (cur === id ? null : id));
  }

  collapseExpanded(): void {
    this.expandedId.set(null);
  }

  setAutoCalc(value: boolean): void {
    this.autoCalc.set(value);
  }

  setCustomImporte(value: string | number | null): void {
    const raw = value == null ? '' : String(value);
    const n = parseInt(raw.replace(/\D/g, ''), 10) || 0;
    this.customImporte.set(n);
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
    alert('Un asesor de Laboral Kutxa se pondrá en contacto contigo.');
  }

  private monthly(p: number, rA: number, n: number): number {
    const r = rA / 12;
    return Math.round(((p * r) / (1 - Math.pow(1 + r, -n))) * 100) / 100;
  }

  private carenciaInterest(p: number, rA: number): number {
    return Math.round(((p * rA) / 12) * 100) / 100;
  }
}
