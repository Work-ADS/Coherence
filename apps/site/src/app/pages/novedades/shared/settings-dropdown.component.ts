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
import { SegmentedControlComponent } from '@coherence/ui';

export interface SimulationSettings {
  currency: 'EUR' | 'USD' | 'GBP';
  rounding: 'units' | 'thousands' | 'millions';
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  inflationRate: number;
  lifeExpectancy: number;
}

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
  imports: [SegmentedControlComponent],
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

  // Local mutable copies
  readonly currency = signal<'EUR' | 'USD' | 'GBP'>('EUR');
  readonly rounding = signal<'units' | 'thousands' | 'millions'>('thousands');
  readonly riskProfile = signal<'conservative' | 'moderate' | 'aggressive'>('moderate');
  readonly inflationRate = signal(2.1);
  readonly lifeExpectancy = signal(88);

  readonly currencyOptions = [
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'GBP', label: 'GBP (£)' },
  ];

  readonly roundingOptions = [
    { value: 'units', label: 'Unidades' },
    { value: 'thousands', label: 'Miles' },
    { value: 'millions', label: 'Millones' },
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
      this.rounding.set(s.rounding);
      this.riskProfile.set(s.riskProfile);
      this.inflationRate.set(s.inflationRate);
      this.lifeExpectancy.set(s.lifeExpectancy);
    }
  }

  onInflationInput(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(val)) this.inflationRate.set(val);
  }

  onLifeExpectancyInput(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val)) this.lifeExpectancy.set(val);
  }

  private emitAndClose(): void {
    this.settingsChanged.emit({
      currency: this.currency(),
      rounding: this.rounding(),
      riskProfile: this.riskProfile(),
      inflationRate: this.inflationRate(),
      lifeExpectancy: this.lifeExpectancy(),
    });
    this.closed.emit();
  }
}
