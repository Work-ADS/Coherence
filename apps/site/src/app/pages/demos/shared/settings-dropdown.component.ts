import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  IconButtonComponent,
  SegmentedControlComponent,
  SelectComponent,
} from '@coherence/ui';

export interface SimulationSettings {
  currency: 'EUR' | 'USD' | 'GBP';
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  inflationRate: number;
  lifeExpectancy: number;
}

const INFLATION_STEP = 0.1;
const INFLATION_MIN = 0;
const INFLATION_MAX = 20;
const LIFE_STEP = 1;
const LIFE_MIN = 50;
const LIFE_MAX = 120;

/**
 * Settings Dropdown — global simulation settings panel.
 *
 * Replaces the previous full-width drawer. Uses segmented controls for
 * categorical values and number inputs for numeric ones.
 * Pattern: ElevenLabs filter dropdown.
 */
@Component({
  selector: 'site-settings-dropdown',
  standalone: true,
  imports: [IconButtonComponent, SegmentedControlComponent, SelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-dropdown.component.html',
  styleUrls: ['./settings-dropdown.component.scss'],
})
export class SettingsDropdownComponent {
  private readonly el = inject(ElementRef);

  readonly open = input<boolean>(false);
  readonly settings = input.required<SimulationSettings>();

  readonly closed = output<void>();
  readonly settingsChanged = output<SimulationSettings>();

  readonly currency = signal<'EUR' | 'USD' | 'GBP'>('EUR');
  readonly riskProfile = signal<'conservative' | 'moderate' | 'aggressive'>('moderate');
  readonly inflationRate = signal(2.1);
  readonly lifeExpectancy = signal(88);

  readonly currencyOptions = [
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'GBP', label: 'GBP (£)' },
  ];

  readonly riskOptions = [
    { value: 'conservative', label: 'Conservador' },
    { value: 'moderate', label: 'Moderado' },
    { value: 'aggressive', label: 'Agresivo' },
  ];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.el.nativeElement.contains(event.target)) {
      this.emitAndClose();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) {
      this.emitAndClose();
    }
  }

  ngOnChanges(): void {
    const s = this.settings();
    if (s) {
      this.currency.set(s.currency);
      this.riskProfile.set(s.riskProfile);
      this.inflationRate.set(s.inflationRate);
      this.lifeExpectancy.set(s.lifeExpectancy);
    }
  }

  onRiskProfileChange(value: string | number | null): void {
    if (typeof value === 'string') {
      this.riskProfile.set(value as 'conservative' | 'moderate' | 'aggressive');
    }
  }

  onInflationInput(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(val)) this.inflationRate.set(this.clamp(val, INFLATION_MIN, INFLATION_MAX));
  }

  onLifeExpectancyInput(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val)) this.lifeExpectancy.set(this.clamp(val, LIFE_MIN, LIFE_MAX));
  }

  stepInflation(delta: 1 | -1): void {
    const next = this.roundToStep(this.inflationRate() + delta * INFLATION_STEP, INFLATION_STEP);
    this.inflationRate.set(this.clamp(next, INFLATION_MIN, INFLATION_MAX));
  }

  stepLife(delta: 1 | -1): void {
    const next = this.lifeExpectancy() + delta * LIFE_STEP;
    this.lifeExpectancy.set(this.clamp(next, LIFE_MIN, LIFE_MAX));
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private roundToStep(value: number, step: number): number {
    return Math.round(value / step) * step;
  }

  private emitAndClose(): void {
    this.settingsChanged.emit({
      currency: this.currency(),
      riskProfile: this.riskProfile(),
      inflationRate: this.inflationRate(),
      lifeExpectancy: this.lifeExpectancy(),
    });
    this.closed.emit();
  }
}
