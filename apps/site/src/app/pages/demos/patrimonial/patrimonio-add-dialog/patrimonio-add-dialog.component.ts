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
  CheckboxComponent,
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
  type PatrimonioAsset,
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
  id: string | null;
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
  titularesActivos: Record<string, boolean>;
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
    CheckboxComponent,
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
  readonly existing = input<PatrimonioAsset | null>(null);
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
  // Default: Cliente owns 100% of every new activo. The checkbox is disabled
  // in the template so the user can't drop themselves out; the porcentaje
  // stays editable (set to 0 if the activo is wholly owned by someone else).
  readonly titularesActivos = signal<Record<string, boolean>>({ cliente: true });
  readonly titularPorcentajes = signal<Record<string, string>>({ cliente: '100' });
  readonly titularesManualmente = signal<Set<string>>(new Set());

  readonly titularesTotal = computed<number>(() => {
    const activos = this.titularesActivos();
    const porcentajes = this.titularPorcentajes();
    let total = 0;
    for (const [id, isActive] of Object.entries(activos)) {
      if (!isActive) continue;
      const n = Number.parseFloat(porcentajes[id] ?? '0');
      if (Number.isFinite(n)) total += n;
    }
    return total;
  });

  readonly titularesTotalState = computed<'under' | 'exact' | 'over'>(() => {
    const t = this.titularesTotal();
    if (t > 100) return 'over';
    if (t === 100) return 'exact';
    return 'under';
  });

  readonly titularesTotalLabel = computed<string>(() => {
    const t = this.titularesTotal();
    // Round to whole number for display when integer-ish; keep 1 decimal otherwise.
    const formatted = Number.isInteger(t) ? t.toString() : t.toFixed(1);
    return `Total: ${formatted} %`;
  });

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

  readonly isEditing = computed(() => this.existing() !== null);

  readonly dialogTitle = computed(() => {
    const label = this.categoryLabel();
    if (!label) return this.isEditing() ? 'Editando activo' : 'Añadir activo';
    return this.isEditing()
      ? `Editando ${label.toLowerCase()}`
      : `Añadir ${label.toLowerCase()}`;
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

    effect(() => {
      const ex = this.existing();
      if (ex) this.hydrateFromExisting(ex);
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

  setTitularActivo(id: string | number, checked: boolean): void {
    const key = String(id);
    this.titularesActivos.update((curr) => ({ ...curr, [key]: checked }));
    if (!checked) {
      // Unchecking clears the porcentaje + the manual flag for that titular.
      this.titularesManualmente.update((set) => {
        if (!set.has(key)) return set;
        const next = new Set(set);
        next.delete(key);
        return next;
      });
      this.titularPorcentajes.update((curr) => ({ ...curr, [key]: '' }));
    }
    this.autoDistributeTitulares();
  }

  isTitularActivo(id: string | number): boolean {
    return this.titularesActivos()[String(id)] === true;
  }

  setTitularPorcentaje(id: string | number, value: string | number | null): void {
    const key = String(id);
    const str = value === null ? '' : String(value);
    // First user keystroke on a titular marks it as manually-edited so the
    // auto-split logic stops overwriting it.
    this.titularesManualmente.update((set) => {
      if (set.has(key)) return set;
      const next = new Set(set);
      next.add(key);
      return next;
    });
    this.titularPorcentajes.update((curr) => ({ ...curr, [key]: str }));
    // Redistribute the remaining (100 - manual-sum) across the still-auto
    // titulares so siblings track the user's manual edit in real time.
    this.autoDistributeTitulares();
  }

  porcentajeFor(id: string | number): string {
    return this.titularPorcentajes()[String(id)] ?? '';
  }

  /** The asset is being added to the user's own wealth plan, so the user
   *  (Cliente) is always at least partly involved. The checkbox is disabled
   *  to prevent accidental "no titulares" state; the user can still set
   *  their porcentaje to 0 if the asset is wholly owned by someone else. */
  isUserTitular(id: string | number): boolean {
    return String(id) === 'cliente';
  }

  /** Split the remaining percent (after honoring manually-edited titulares)
   *  evenly across the still-auto active titulares. First entry takes any
   *  rounding leftover so the active titulares sum to 100 when no manual
   *  values are in play. */
  private autoDistributeTitulares(): void {
    const activos = this.titularesActivos();
    const manual = this.titularesManualmente();
    const porcentajes = { ...this.titularPorcentajes() };

    let manualSum = 0;
    const autoIds: string[] = [];

    for (const [id, isActive] of Object.entries(activos)) {
      if (!isActive) continue;
      if (manual.has(id)) {
        const n = Number.parseFloat(porcentajes[id] ?? '0');
        manualSum += Number.isFinite(n) ? n : 0;
      } else {
        autoIds.push(id);
      }
    }

    if (autoIds.length === 0) {
      this.titularPorcentajes.set(porcentajes);
      return;
    }

    const remaining = Math.max(0, 100 - manualSum);
    const base = Math.floor(remaining / autoIds.length);
    const extra = remaining - base * autoIds.length;
    autoIds.forEach((id, i) => {
      porcentajes[id] = String(base + (i < extra ? 1 : 0));
    });
    this.titularPorcentajes.set(porcentajes);
  }

  cancel(): void {
    this.openChange.emit(false);
  }

  accept(): void {
    const cat = this.selectedCategory();
    if (cat) {
      this.saved.emit({
        id: this.existing()?.id ?? null,
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
        titularesActivos: this.titularesActivos(),
        titularPorcentajes: this.titularPorcentajes(),
      });
    }
    this.openChange.emit(false);
  }

  private hydrateFromExisting(asset: PatrimonioAsset): void {
    if (asset.tipoTop) this.selectedCategory.set(asset.tipoTop);
    this.addMode.set(asset.addMode ?? 'simple');
    this.nombre.set(asset.nombre);
    this.valor.set(Number.isFinite(asset.valor) ? String(asset.valor) : '');
    this.entidad.set(asset.entidad ?? null);
    this.inversionType.set(asset.tipoInversion ?? null);

    this.patrimonioFuturo.set(asset.patrimonioFuturo ? 'si' : 'no');
    this.anoObtencion.set(asset.anoObtencion ? String(asset.anoObtencion) : '');

    this.generaIngresos.set(asset.generaIngresos ? 'si' : 'no');
    this.frecuencia.set(asset.frecuencia ?? null);
    this.tipoGeneracion.set(asset.tipoGeneracion ?? 'importe');
    if (asset.tipoGeneracion === 'porcentaje') {
      this.porcentajeIngresos.set(
        asset.generacionValor != null ? String(asset.generacionValor) : '',
      );
      this.importeIngresos.set('');
    } else {
      this.importeIngresos.set(
        asset.generacionValor != null ? String(asset.generacionValor) : '',
      );
      this.porcentajeIngresos.set('');
    }
    this.crecimientoMode.set(asset.crecimientoMode ?? 'mismo-activo');
    this.crecimientoManual.set(
      asset.crecimientoManual != null ? String(asset.crecimientoManual) : '',
    );

    const activos: Record<string, boolean> = {};
    const porcentajes: Record<string, string> = {};
    const manual = new Set<string>();
    for (const t of asset.titulares ?? []) {
      activos[t.titularId] = true;
      porcentajes[t.titularId] = String(t.porcentaje);
      // Treat persisted porcentajes as manual so re-opening edit doesn't
      // overwrite the user's saved values via auto-distribute.
      manual.add(t.titularId);
    }
    // No saved titulares (seed asset, freshly migrated v1/v2 row) → default
    // to Cliente owning the full activo so the dialog opens with a sane,
    // sum-to-100 state.
    if (Object.keys(activos).length === 0) {
      activos['cliente'] = true;
      porcentajes['cliente'] = '100';
    }
    this.titularesActivos.set(activos);
    this.titularPorcentajes.set(porcentajes);
    this.titularesManualmente.set(manual);

    this.tipoRevalorizacion.set(
      asset.revalorizacion != null && asset.revalorizacion !== 0 ? 'manual' : 'automatica',
    );
    this.revalorizacionManual.set(
      asset.revalorizacion != null ? String(asset.revalorizacion) : '',
    );
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
    // Defaults: Cliente owns 100% of the new activo. The checkbox itself is
    // disabled in the template so the user can't accidentally drop themselves
    // out — they can still set the porcentaje to 0 if the activo is wholly
    // owned by someone else.
    this.titularesActivos.set({ cliente: true });
    this.titularPorcentajes.set({ cliente: '100' });
    this.titularesManualmente.set(new Set());
  }
}
