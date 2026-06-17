import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

import {
  ButtonComponent,
  InputComponent,
  ModalComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
  SegmentedControlComponent,
  SelectComponent,
} from '@coherence/ui';
import type { SegmentedOption, SelectOption } from '@coherence/ui';

import {
  TIPO_INVERSION_LABEL,
  TIPO_PATRIMONIO_TOP_LABEL,
  type CrecimientoMode,
  type Frecuencia,
  type PatrimonioAddMode,
  type TipoGeneracion,
  type TipoInversion,
  type TipoPatrimonioTop,
} from '../../wealth-planner-2026/store';

export interface TitularOption {
  value: string | number;
  label: string;
}

export type YesNo = 'si' | 'no';
export type TipoRevalorizacion = 'automatica' | 'manual';

export interface PatrimonioAddDialogPayload {
  category: TipoPatrimonioTop;
  mode: PatrimonioAddMode;
  inversionType: TipoInversion | null;
  nombre: string;
  valor: string;
  entidad: string | null;
  patrimonioFuturo: YesNo;
  anoObtencion: string;
  generaIngresos: YesNo;
  frecuencia: Frecuencia | null;
  tipoGeneracion: TipoGeneracion;
  importeIngresos: string;
  porcentajeIngresos: string;
  crecimientoMode: CrecimientoMode;
  crecimientoManual: string;
  tipoRevalorizacion: TipoRevalorizacion;
  revalorizacionManual: string;
  titularPorcentajes: Record<string, string>;
}

const CATEGORY_OPTIONS_ORDER: ReadonlyArray<TipoPatrimonioTop> = [
  'liquidez',
  'inversion',
  'inmobiliario',
  'private-equity',
  'plan-pensiones',
  'participaciones',
  'otros-activos',
  'deudas',
  'seguro-vida',
];

const INVERSION_OPTIONS_ORDER: ReadonlyArray<TipoInversion> = [
  'acciones-cotizadas',
  'fondos',
  'seguros-ahorro',
  'renta-fija',
  'etf',
  'cartera',
  'otros',
];

const FRECUENCIA_OPTIONS: SelectOption[] = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' },
];

const YES_NO_OPTIONS: ReadonlyArray<{ value: YesNo; label: string }> = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
];

const TIPO_GENERACION_OPTIONS: ReadonlyArray<{ value: TipoGeneracion; label: string }> = [
  { value: 'importe', label: 'Importe' },
  { value: 'porcentaje', label: 'Porcentaje' },
];

const CRECIMIENTO_OPTIONS: ReadonlyArray<{ value: CrecimientoMode; label: string }> = [
  { value: 'mismo-activo', label: 'Mismo que el del activo' },
  { value: 'manual', label: 'Manual' },
];

const REVALORIZACION_OPTIONS: ReadonlyArray<{ value: TipoRevalorizacion; label: string }> = [
  { value: 'automatica', label: 'Automática' },
  { value: 'manual', label: 'Manual' },
];

@Component({
  selector: 'site-patrimonio-add-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    InputComponent,
    ModalComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
    SegmentedControlComponent,
    SelectComponent,
  ],
  templateUrl: './patrimonio-add-dialog.component.html',
  styleUrl: './patrimonio-add-dialog.component.scss',
})
export class PatrimonioAddDialogComponent {
  readonly open = input<boolean>(false);
  readonly category = input<TipoPatrimonioTop | null>(null);
  readonly modeChoiceEnabled = input<boolean>(true);
  readonly titularOptions = input<ReadonlyArray<TitularOption>>([]);
  readonly entidadOptions = input<SelectOption[]>([]);

  readonly openChange = output<boolean>();
  readonly saved = output<PatrimonioAddDialogPayload>();

  readonly selectedCategory = signal<TipoPatrimonioTop | null>(null);
  readonly inversionType = signal<TipoInversion | null>(null);
  readonly addMode = signal<PatrimonioAddMode>('simple');

  readonly nombre = signal<string>('');
  readonly valor = signal<string>('');
  readonly entidad = signal<string | null>(null);
  readonly patrimonioFuturo = signal<YesNo>('no');
  readonly anoObtencion = signal<string>('');
  readonly generaIngresos = signal<YesNo>('no');
  readonly frecuencia = signal<Frecuencia | null>(null);
  readonly tipoGeneracion = signal<TipoGeneracion>('importe');
  readonly importeIngresos = signal<string>('');
  readonly porcentajeIngresos = signal<string>('');
  readonly crecimientoMode = signal<CrecimientoMode>('mismo-activo');
  readonly crecimientoManual = signal<string>('');
  readonly tipoRevalorizacion = signal<TipoRevalorizacion>('automatica');
  readonly revalorizacionManual = signal<string>('');
  readonly titularPorcentajes = signal<Record<string, string>>({});

  readonly addModeOptions: SegmentedOption[] = [
    { value: 'simple', label: 'Simple' },
    { value: 'avanzado', label: 'Avanzado' },
  ];

  readonly categoryOptions: SelectOption[] = CATEGORY_OPTIONS_ORDER.map((value) => ({
    value,
    label: TIPO_PATRIMONIO_TOP_LABEL[value],
  }));

  readonly inversionOptions: SelectOption[] = INVERSION_OPTIONS_ORDER.map((value) => ({
    value,
    label: TIPO_INVERSION_LABEL[value],
  }));

  readonly frecuenciaOptions = FRECUENCIA_OPTIONS;
  readonly yesNoOptions = YES_NO_OPTIONS;
  readonly tipoGeneracionOptions = TIPO_GENERACION_OPTIONS;
  readonly crecimientoOptions = CRECIMIENTO_OPTIONS;
  readonly revalorizacionOptions = REVALORIZACION_OPTIONS;

  readonly categoryLabel = computed(() => {
    const c = this.selectedCategory();
    return c ? TIPO_PATRIMONIO_TOP_LABEL[c] : '';
  });

  readonly dialogTitle = computed(() => {
    const label = this.categoryLabel();
    return label ? `Añadir ${label.toLowerCase()}` : 'Añadir activo';
  });

  readonly isAvanzado = computed(() => this.addMode() === 'avanzado');
  readonly showEntidad = computed(
    () => this.isAvanzado() && this.selectedCategory() === 'liquidez',
  );
  readonly showAvanzadoExtras = computed(() => this.isAvanzado());

  constructor() {
    effect(() => {
      const c = this.category();
      if (c !== null) this.selectedCategory.set(c);
    });
  }

  onOpenChange(next: boolean): void {
    if (!next) this.resetForm();
    this.openChange.emit(next);
  }

  onCategoryChange(value: string | number | null): void {
    if (value === null) return;
    const next = String(value) as TipoPatrimonioTop;
    if (!CATEGORY_OPTIONS_ORDER.includes(next)) return;
    this.selectedCategory.set(next);
    if (next !== 'inversion') this.inversionType.set(null);
  }

  onInversionTypeChange(value: string | number | null): void {
    if (value === null) {
      this.inversionType.set(null);
      return;
    }
    const next = String(value) as TipoInversion;
    if (INVERSION_OPTIONS_ORDER.includes(next)) this.inversionType.set(next);
  }

  onModeChange(value: string): void {
    if (value === 'simple' || value === 'avanzado') this.addMode.set(value);
  }

  setNombre(value: string | number | null): void {
    this.nombre.set(value === null ? '' : String(value));
  }

  setValor(value: string | number | null): void {
    this.valor.set(value === null ? '' : String(value));
  }

  setEntidad(value: string | number | null): void {
    this.entidad.set(value === null ? null : String(value));
  }

  setPatrimonioFuturo(value: string): void {
    if (value === 'si' || value === 'no') this.patrimonioFuturo.set(value);
  }

  setAnoObtencion(value: string | number | null): void {
    this.anoObtencion.set(value === null ? '' : String(value));
  }

  setGeneraIngresos(value: string): void {
    if (value === 'si' || value === 'no') this.generaIngresos.set(value);
  }

  setFrecuencia(value: string | number | null): void {
    if (
      value === 'mensual' ||
      value === 'trimestral' ||
      value === 'semestral' ||
      value === 'anual'
    ) {
      this.frecuencia.set(value);
    }
  }

  setTipoGeneracion(value: string): void {
    if (value === 'importe' || value === 'porcentaje') this.tipoGeneracion.set(value);
  }

  setImporteIngresos(value: string | number | null): void {
    this.importeIngresos.set(value === null ? '' : String(value));
  }

  setPorcentajeIngresos(value: string | number | null): void {
    this.porcentajeIngresos.set(value === null ? '' : String(value));
  }

  setCrecimientoMode(value: string): void {
    if (value === 'mismo-activo' || value === 'manual') this.crecimientoMode.set(value);
  }

  setCrecimientoManual(value: string | number | null): void {
    this.crecimientoManual.set(value === null ? '' : String(value));
  }

  setTipoRevalorizacion(value: string): void {
    if (value === 'automatica' || value === 'manual') this.tipoRevalorizacion.set(value);
  }

  setRevalorizacionManual(value: string | number | null): void {
    this.revalorizacionManual.set(value === null ? '' : String(value));
  }

  setTitularPorcentaje(id: string | number, value: string | number | null): void {
    const key = String(id);
    const str = value === null ? '' : String(value);
    this.titularPorcentajes.update((curr) => ({ ...curr, [key]: str }));
  }

  porcentajeFor(id: string | number): string {
    return this.titularPorcentajes()[String(id)] ?? '';
  }

  cancel(): void {
    this.openChange.emit(false);
  }

  accept(): void {
    const cat = this.selectedCategory();
    if (cat) {
      this.saved.emit({
        category: cat,
        mode: this.addMode(),
        inversionType: cat === 'inversion' ? this.inversionType() : null,
        nombre: this.nombre(),
        valor: this.valor(),
        entidad: this.showEntidad() ? this.entidad() : null,
        patrimonioFuturo: this.patrimonioFuturo(),
        anoObtencion: this.patrimonioFuturo() === 'si' ? this.anoObtencion() : '',
        generaIngresos: this.generaIngresos(),
        frecuencia: this.generaIngresos() === 'si' ? this.frecuencia() : null,
        tipoGeneracion: this.tipoGeneracion(),
        importeIngresos:
          this.generaIngresos() === 'si' && this.tipoGeneracion() === 'importe'
            ? this.importeIngresos()
            : '',
        porcentajeIngresos:
          this.generaIngresos() === 'si' && this.tipoGeneracion() === 'porcentaje'
            ? this.porcentajeIngresos()
            : '',
        crecimientoMode: this.crecimientoMode(),
        crecimientoManual:
          this.generaIngresos() === 'si' &&
          this.tipoGeneracion() === 'importe' &&
          this.crecimientoMode() === 'manual'
            ? this.crecimientoManual()
            : '',
        tipoRevalorizacion: this.tipoRevalorizacion(),
        revalorizacionManual:
          this.tipoRevalorizacion() === 'manual' ? this.revalorizacionManual() : '',
        titularPorcentajes: this.titularPorcentajes(),
      });
    }
    this.openChange.emit(false);
  }

  private resetForm(): void {
    this.addMode.set('simple');
    this.nombre.set('');
    this.valor.set('');
    this.entidad.set(null);
    this.inversionType.set(null);
    this.patrimonioFuturo.set('no');
    this.anoObtencion.set('');
    this.generaIngresos.set('no');
    this.frecuencia.set(null);
    this.tipoGeneracion.set('importe');
    this.importeIngresos.set('');
    this.porcentajeIngresos.set('');
    this.crecimientoMode.set('mismo-activo');
    this.crecimientoManual.set('');
    this.tipoRevalorizacion.set('automatica');
    this.revalorizacionManual.set('');
    this.titularPorcentajes.set({});
  }
}
