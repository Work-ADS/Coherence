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
  SegmentedControlComponent,
  SelectComponent,
} from '@coherence/ui';
import type { SegmentedOption, SelectOption } from '@coherence/ui';

import {
  TIPO_INVERSION_LABEL,
  TIPO_PATRIMONIO_TOP_LABEL,
  type PatrimonioAddMode,
  type TipoInversion,
  type TipoPatrimonioTop,
} from '../../wealth-planner-2026/store';

export interface TitularOption {
  value: string | number;
  label: string;
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

@Component({
  selector: 'site-patrimonio-add-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    InputComponent,
    ModalComponent,
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

  readonly openChange = output<boolean>();
  readonly saved = output<{
    category: TipoPatrimonioTop;
    mode: PatrimonioAddMode;
    inversionType: TipoInversion | null;
  }>();

  readonly selectedCategory = signal<TipoPatrimonioTop | null>(null);
  readonly inversionType = signal<TipoInversion | null>(null);
  readonly addMode = signal<PatrimonioAddMode>('simple');
  readonly nombre = signal<string>('');
  readonly valor = signal<string>('');
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

  readonly categoryLabel = computed(() => {
    const c = this.selectedCategory();
    return c ? TIPO_PATRIMONIO_TOP_LABEL[c] : '';
  });

  readonly dialogTitle = computed(() => {
    const label = this.categoryLabel();
    return label ? `Añadir ${label.toLowerCase()}` : 'Añadir activo';
  });

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
      });
    }
    this.openChange.emit(false);
  }

  private resetForm(): void {
    this.addMode.set('simple');
    this.nombre.set('');
    this.valor.set('');
    this.titularPorcentajes.set({});
    this.inversionType.set(null);
  }
}
