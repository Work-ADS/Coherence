import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  ModalComponent,
  ButtonComponent,
  InputComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
  SelectComponent,
  SwitchComponent,
} from '@coherence/ui';

import { PropuestaType } from '../data/propuesta.model';
import { TelemetryService } from '../data/telemetry.service';
import { generatePropuestaId } from './propuesta-name.util';

interface TipoOption {
  value: PropuestaType;
  label: string;
  hint: string;
}

const TIPO_OPTIONS: TipoOption[] = [
  { value: 'nueva', label: 'Nueva', hint: 'Crear una cartera desde cero' },
  { value: 'rebalanceo', label: 'Rebalanceo de carteras individuales', hint: 'Ajustar a pesos objetivo' },
  { value: 'modificacion-libre', label: 'Modificación de cartera / operación adicional', hint: 'Editar posiciones sin modelo' },
  { value: 'reembolso', label: 'Reembolso', hint: 'Solicitar retirada parcial o total' },
  { value: 'operacional', label: 'Operacional', hint: 'Operación administrativa' },
];

const CARTERA_OPTIONS = [
  { label: 'Cartera Conservadora — C001', value: 'c001' },
  { label: 'Cartera Equilibrada — C002', value: 'c002' },
  { label: 'Cartera Agresiva — C003', value: 'c003' },
  { label: 'Cartera Mixta — C004', value: 'c004' },
];

const CARTERA_MODELO_OPTIONS = [
  { label: 'Modelo Conservador 2026', value: 'm001' },
  { label: 'Modelo Equilibrado 2026', value: 'm002' },
  { label: 'Modelo Agresivo 2026', value: 'm003' },
];

@Component({
  selector: 'awm-type-picker',
  standalone: true,
  imports: [
    ModalComponent,
    ButtonComponent,
    InputComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
    SelectComponent,
    SwitchComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-modal
      [open]="open()"
      (openChange)="onOpenChange($event)"
      (closed)="onClosed($event)"
      title="Crear propuesta"
      description="Configura los datos iniciales de la propuesta."
      size="lg"
      [closeOnBackdrop]="true"
    >
      <div class="flex flex-col gap-space-6">
        <!-- Nombre de envío -->
        <afi-input
          label="Nombre de envío"
          placeholder="Ej. Propuesta García — Abril 2026"
          [value]="nombreEnvio()"
          (valueChange)="nombreEnvio.set($any($event))"
        />

        <!-- Número de envío -->
        <afi-input
          label="Número de envío"
          placeholder="Ej. ENV-2026-0042"
          [value]="numeroEnvio()"
          (valueChange)="numeroEnvio.set($any($event))"
        />

        <!-- Tipo de propuesta -->
        <afi-radio-group
          legend="Tipo de propuesta"
          [value]="selectedType()"
          (valueChange)="selectedType.set($any($event))"
        >
          @for (opt of tipoOptions; track opt.value) {
            <afi-radio-group-item
              [value]="opt.value"
              [label]="opt.label"
              [hint]="opt.hint"
              [name]="'tipo-propuesta'"
              [selected]="selectedType() === opt.value"
              (selectedChange)="selectedType.set($any($event))"
            />
          }
        </afi-radio-group>

        <!-- Conditional fields based on type -->
        @if (showCarteraModificar()) {
          <afi-select
            label="Cartera a modificar"
            placeholder="Seleccionar cartera..."
            [options]="carteraOptions"
            [value]="carteraModificar()"
            (valueChange)="carteraModificar.set($any($event))"
          />
        }

        @if (showCarteraObjetivo()) {
          <afi-select
            label="Cartera objetivo"
            placeholder="Seleccionar modelo..."
            [options]="carteraModeloOptions"
            [value]="carteraObjetivo()"
            (valueChange)="carteraObjetivo.set($any($event))"
          />
        }

        @if (showOptimizacionFiscal()) {
          <afi-switch
            label="Optimización fiscal"
            hint="Aplicar criterios de eficiencia fiscal a las operaciones"
            [checked]="optimizacionFiscal()"
            (checkedChange)="optimizacionFiscal.set($event)"
          />
        }

        @if (showGravedadTransicion()) {
          <afi-select
            label="Gravedad de transición"
            placeholder="Seleccionar..."
            [options]="gravedadOptions"
            [value]="gravedadTransicion()"
            (valueChange)="gravedadTransicion.set($any($event))"
          />
        }
      </div>

      <!-- Footer actions -->
      <ng-container slot="footer">
        <afi-button variant="ghost" size="sm" (clicked)="cancel()">
          Cancelar
        </afi-button>
        <afi-button
          variant="primary"
          size="sm"
          [disabled]="!canContinue()"
          (clicked)="continuar()"
        >
          Crear propuesta
        </afi-button>
      </ng-container>
    </afi-modal>
  `,
  styles: [`
    :host { display: contents; }
  `],
})
export class TypePickerComponent {
  private readonly router = inject(Router);
  private readonly telemetry = inject(TelemetryService);

  readonly open = input<boolean>(false);
  readonly openChange = output<boolean>();

  // Form state
  readonly nombreEnvio = signal('');
  readonly numeroEnvio = signal('');
  readonly selectedType = signal<PropuestaType | null>(null);
  readonly carteraModificar = signal<string | null>(null);
  readonly carteraObjetivo = signal<string | null>(null);
  readonly optimizacionFiscal = signal(false);
  readonly gravedadTransicion = signal<string | null>(null);

  // Options data
  readonly tipoOptions = TIPO_OPTIONS;
  readonly carteraOptions = CARTERA_OPTIONS;
  readonly carteraModeloOptions = CARTERA_MODELO_OPTIONS;
  readonly gravedadOptions = [
    { label: 'Baja — cambios mínimos', value: 'baja' },
    { label: 'Media — cambios moderados', value: 'media' },
    { label: 'Alta — reestructuración significativa', value: 'alta' },
  ];

  // Conditional visibility
  readonly showCarteraModificar = computed(() => {
    const t = this.selectedType();
    return t === 'rebalanceo' || t === 'modificacion-libre' || t === 'reembolso';
  });

  readonly showCarteraObjetivo = computed(() => {
    const t = this.selectedType();
    return t === 'nueva' || t === 'rebalanceo';
  });

  readonly showOptimizacionFiscal = computed(() => {
    const t = this.selectedType();
    return t === 'rebalanceo' || t === 'modificacion-libre';
  });

  readonly showGravedadTransicion = computed(() => {
    const t = this.selectedType();
    return t === 'rebalanceo';
  });

  // Validation
  readonly canContinue = computed(() => {
    return !!this.selectedType() && !!this.nombreEnvio().trim();
  });

  continuar(): void {
    const type = this.selectedType();
    if (!type || !this.nombreEnvio().trim()) return;

    const id = generatePropuestaId();

    this.telemetry.emit('propuestas.type-picker.continued', {
      type,
      id,
      name: this.nombreEnvio(),
      numero: this.numeroEnvio(),
    });
    this.openChange.emit(false);
    this.resetForm();

    void this.router.navigate(['/propuesta', id, 'ajustes'], {
      queryParams: { type, name: this.nombreEnvio() },
    });
  }

  cancel(): void {
    this.telemetry.emit('propuestas.type-picker.cancelled');
    this.openChange.emit(false);
    this.resetForm();
  }

  onOpenChange(isOpen: boolean): void {
    if (!isOpen) {
      this.cancel();
    } else {
      this.telemetry.emit('propuestas.type-picker.opened');
    }
    this.openChange.emit(isOpen);
  }

  onClosed(reason: 'esc' | 'backdrop' | 'button'): void {
    if (reason === 'esc' || reason === 'backdrop') {
      this.cancel();
    }
  }

  private resetForm(): void {
    this.nombreEnvio.set('');
    this.numeroEnvio.set('');
    this.selectedType.set(null);
    this.carteraModificar.set(null);
    this.carteraObjetivo.set(null);
    this.optimizacionFiscal.set(false);
    this.gravedadTransicion.set(null);
  }
}
