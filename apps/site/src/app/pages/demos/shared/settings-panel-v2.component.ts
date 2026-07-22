// external
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

// internal (libs)
import {
  ButtonV2Component,
  IconButtonV2Component,
  InputV2Component,
  SelectV2Component,
} from '@coherence/ui';
import type { SelectV2Option } from '@coherence/ui';

// relative
import type { SimulationSettings } from './settings-dropdown.component';

const CURRENCY_OPTIONS: SelectV2Option[] = [
  { value: 'EUR', label: 'EUR — euro' },
  { value: 'USD', label: 'USD — dólar' },
  { value: 'GBP', label: 'GBP — libra' },
];

const RISK_OPTIONS: SelectV2Option[] = [
  { value: 'conservative', label: 'Conservador' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'aggressive', label: 'Agresivo' },
];

/**
 * Settings panel — identity v2 (foundations-modern).
 *
 * The v2 successor of `site-settings-dropdown`: same contract (simulation
 * settings, save on confirm, document-click / Esc close), rebuilt from v2
 * primitives — select-v2 for moneda + perfil de riesgo, input-v2 for the
 * numeric fields, button-v2 to save.
 */
@Component({
  selector: 'site-settings-panel-v2',
  standalone: true,
  imports: [ButtonV2Component, IconButtonV2Component, InputV2Component, SelectV2Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-panel-v2.component.html',
  styleUrls: ['./settings-panel-v2.component.scss'],
})
export class SettingsPanelV2Component {
  private readonly el = inject(ElementRef);

  readonly open = input<boolean>(false);
  readonly settings = input.required<SimulationSettings>();

  readonly closed = output<void>();
  readonly settingsChanged = output<SimulationSettings>();

  readonly currencyOptions = CURRENCY_OPTIONS;
  readonly riskOptions = RISK_OPTIONS;

  readonly currency = signal<string | null>('EUR');
  readonly riskProfile = signal<string | null>('moderate');
  readonly inflationRate = signal('2,1');
  readonly lifeExpectancy = signal('88');

  constructor() {
    // Re-seed the local draft each time the panel opens.
    effect(() => {
      if (!this.open()) return;
      const s = this.settings();
      this.currency.set(s.currency);
      this.riskProfile.set(s.riskProfile);
      this.inflationRate.set(String(s.inflationRate).replace('.', ','));
      this.lifeExpectancy.set(String(s.lifeExpectancy));
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.el.nativeElement.contains(event.target)) {
      this.closed.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) {
      this.closed.emit();
    }
  }

  save(): void {
    const inflation = Number(this.inflationRate().replace(',', '.'));
    const life = Number(this.lifeExpectancy());
    this.settingsChanged.emit({
      currency: (this.currency() ?? 'EUR') as SimulationSettings['currency'],
      riskProfile: (this.riskProfile() ?? 'moderate') as SimulationSettings['riskProfile'],
      inflationRate: Number.isFinite(inflation) ? inflation : this.settings().inflationRate,
      lifeExpectancy: Number.isFinite(life) ? life : this.settings().lifeExpectancy,
    });
    this.closed.emit();
  }
}
