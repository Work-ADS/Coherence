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
  SelectComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import type {
  Frecuencia,
  HijoData,
  IngresoGastoRow,
  InicioKind,
  FinalizacionKind,
} from '../store';

export type IngresoGastoMode = 'ingreso' | 'gasto';

/**
 * Add/edit form modal shared by Ingresos + Gastos pages.
 *
 * One component, two pages: distinct only by `mode` input + the seed copy.
 * Form structure (V2 Figma, 888lN7vbJSc4gLYt7nP3DW):
 *   - Concepto
 *   - Importe €
 *   - Frecuencia
 *   - Es un ingreso/gasto futuro? → Radio Sí/No → Inicio when Sí
 *   - Finalización
 *   - Incrementa con IPC? → Radio Sí/No → Manual % when No
 */
@Component({
  selector: 'site-ingreso-gasto-form-modal',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    ModalComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
    SelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ingreso-gasto-form-modal.component.html',
  styleUrls: ['./ingreso-gasto-form-modal.component.scss'],
})
export class IngresoGastoFormModalComponent {
  // ── Inputs ────────────────────────────────────────────────────────────
  readonly open = input<boolean>(false);
  readonly mode = input.required<IngresoGastoMode>();
  readonly initialValue = input<IngresoGastoRow | null>(null);
  readonly familyHijos = input<HijoData[]>([]);
  /** Retiro/jubilación age from Patrimonio when known; null otherwise. */
  readonly retiroAge = input<number | null>(null);

  // ── Outputs ───────────────────────────────────────────────────────────
  readonly submitted = output<Omit<IngresoGastoRow, 'id'>>();
  readonly cancelled = output<void>();

  // ── Draft state — mirrors the form; commits on Save ───────────────────
  readonly concepto = signal<string>('');
  readonly isFuturo = signal<boolean>(false);
  readonly inicioKind = signal<InicioKind>('retiro');
  readonly inicioValue = signal<number | null>(null);
  readonly finalizacionKind = signal<FinalizacionKind>('indefinido');
  readonly finalizacionHijoId = signal<string | null>(null);
  readonly finalizacionValue = signal<number | null>(null);
  readonly frecuencia = signal<Frecuencia>('anual');
  readonly incrementaIPC = signal<boolean>(true);
  readonly incrementoManualPct = signal<number>(0);
  readonly valor = signal<number>(0);

  // ── Computed labels ───────────────────────────────────────────────────
  readonly title = computed<string>(() => {
    const isEdit = this.initialValue() !== null;
    const label = this.mode() === 'ingreso' ? 'ingreso' : 'gasto';
    return isEdit
      ? `Editar ${label}`
      : `Añadir ${label}`;
  });

  readonly futuroLabel = computed<string>(() =>
    this.mode() === 'ingreso'
      ? '¿Es un ingreso futuro?'
      : '¿Es un gasto futuro?',
  );

  // ── Option lists ──────────────────────────────────────────────────────
  readonly inicioOptions: SelectOption[] = [
    { value: 'retiro', label: 'A partir de retiro' },
    { value: 'jubilacion', label: 'Jubilación' },
    { value: 'edad', label: 'Manual (edad)' },
    { value: 'ano', label: 'Manual (año)' },
  ];

  readonly finalizacionOptions: SelectOption[] = [
    { value: 'indefinido', label: 'Indefinido' },
    { value: 'retiro-jubilacion', label: 'Hasta retiro o jubilación' },
    { value: 'edad-hijo', label: 'Hasta edad de un hijo' },
    { value: 'edad', label: 'Manual (edad)' },
    { value: 'ano', label: 'Manual (año)' },
  ];

  readonly frecuenciaOptions: SelectOption[] = [
    { value: 'mensual', label: 'Mensual' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'semestral', label: 'Semestral' },
    { value: 'anual', label: 'Anual' },
  ];

  readonly hijoOptions = computed<SelectOption[]>(() =>
    this.familyHijos().map((h, i) => ({
      value: h.id,
      label: h.alias.trim() || `Hijo ${i + 1}`,
    })),
  );

  // ── Inicio kind variants — show edad/año input when applicable ────────
  readonly showsInicioValueInput = computed<boolean>(() => {
    const k = this.inicioKind();
    return k === 'edad' || k === 'ano';
  });

  readonly inicioValueLabel = computed<string>(() =>
    this.inicioKind() === 'edad' ? 'Edad' : 'Año',
  );

  // ── Finalización kind variants ─────────────────────────────────────────
  readonly showsFinalizacionHijo = computed<boolean>(
    () => this.finalizacionKind() === 'edad-hijo',
  );

  readonly showsFinalizacionValue = computed<boolean>(() => {
    const k = this.finalizacionKind();
    return k === 'edad-hijo' || k === 'edad' || k === 'ano';
  });

  readonly finalizacionValueLabel = computed<string>(() => {
    const k = this.finalizacionKind();
    if (k === 'ano') return 'Año';
    return 'Edad';
  });

  constructor() {
    // When the modal opens with a fresh initialValue, seed the draft.
    // When the modal opens with null (= "add new"), reset to defaults.
    effect(() => {
      if (!this.open()) return;
      const init = this.initialValue();
      if (init === null) {
        this.resetDraft();
      } else {
        this.seedFrom(init);
      }
    });
  }

  private resetDraft(): void {
    this.concepto.set('');
    this.isFuturo.set(false);
    this.inicioKind.set('retiro');
    this.inicioValue.set(null);
    this.finalizacionKind.set('indefinido');
    this.finalizacionHijoId.set(null);
    this.finalizacionValue.set(null);
    this.frecuencia.set('anual');
    this.incrementaIPC.set(true);
    this.incrementoManualPct.set(0);
    this.valor.set(0);
  }

  private seedFrom(row: IngresoGastoRow): void {
    this.concepto.set(row.concepto);
    this.isFuturo.set(row.isFuturo);
    if (row.inicio) {
      this.inicioKind.set(row.inicio.kind);
      this.inicioValue.set(row.inicio.value);
    } else {
      this.inicioKind.set('retiro');
      this.inicioValue.set(null);
    }
    this.finalizacionKind.set(row.finalizacion.kind);
    this.finalizacionHijoId.set(row.finalizacion.hijoId);
    this.finalizacionValue.set(row.finalizacion.value);
    this.frecuencia.set(row.frecuencia);
    this.incrementaIPC.set(row.incrementaIPC ?? true);
    this.incrementoManualPct.set(row.incrementoManualPct);
    this.valor.set(row.valor);
  }

  // ── Field handlers (normalize afi-input's union type) ────────────────
  private toStr(v: string | number | null): string {
    return v === null ? '' : String(v);
  }
  private toNum(v: string | number | null): number {
    if (v === null || v === '') return 0;
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }
  private toNumOrNull(v: string | number | null): number | null {
    if (v === null || v === '') return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  }

  setConcepto(v: string | number | null): void {
    this.concepto.set(this.toStr(v));
  }
  setIsFuturo(checked: boolean): void {
    this.isFuturo.set(checked);
    if (!checked) {
      // Reset inicio when switching to "No"
      this.inicioKind.set('retiro');
      this.inicioValue.set(null);
    }
  }
  setIncrementaIPC(checked: boolean): void {
    this.incrementaIPC.set(checked);
    if (checked) {
      this.incrementoManualPct.set(0);
    }
  }
  setInicioKind(v: string | number | null): void {
    this.inicioKind.set((v as InicioKind | null) ?? 'retiro');
    // Reset value when the kind changes.
    this.inicioValue.set(null);
  }
  setInicioValue(v: string | number | null): void {
    this.inicioValue.set(this.toNumOrNull(v));
  }
  setFinalizacionKind(v: string | number | null): void {
    this.finalizacionKind.set(
      (v as FinalizacionKind | null) ?? 'indefinido',
    );
    this.finalizacionHijoId.set(null);
    this.finalizacionValue.set(null);
  }
  setFinalizacionHijo(v: string | number | null): void {
    this.finalizacionHijoId.set(this.toStr(v) || null);
  }
  setFinalizacionValue(v: string | number | null): void {
    this.finalizacionValue.set(this.toNumOrNull(v));
  }
  setFrecuencia(v: string | number | null): void {
    this.frecuencia.set((v as Frecuencia | null) ?? 'anual');
  }
  setIncremento(v: string | number | null): void {
    this.incrementoManualPct.set(this.toNum(v));
  }
  setValor(v: string | number | null): void {
    this.valor.set(this.toNum(v));
  }

  // ── Submit / cancel ───────────────────────────────────────────────────
  onSubmit(): void {
    this.submitted.emit({
      concepto: this.concepto(),
      isFuturo: this.isFuturo(),
      inicio: this.isFuturo()
        ? { kind: this.inicioKind(), value: this.inicioValue() }
        : null,
      finalizacion: {
        kind: this.finalizacionKind(),
        hijoId: this.finalizacionHijoId(),
        value: this.finalizacionValue(),
      },
      frecuencia: this.frecuencia(),
      incrementaIPC: this.incrementaIPC(),
      incrementoManualPct: this.incrementoManualPct(),
      valor: this.valor(),
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
