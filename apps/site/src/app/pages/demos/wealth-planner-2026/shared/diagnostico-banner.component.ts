import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BadgeComponent, type BadgeIntent } from '@coherence/ui';

import { WealthPlannerStore } from '../store';

type ScenarioProjection = {
  label: string;
  value: string;
  intent: BadgeIntent;
  note: string | null;
};

@Component({
  selector: 'site-diagnostico-banner',
  standalone: true,
  imports: [BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './diagnostico-banner.component.html',
  styleUrls: ['./diagnostico-banner.component.scss'],
})
export class DiagnosticoBannerComponent {
  readonly store = inject(WealthPlannerStore);

  private readonly numberFormatter = new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 2,
  });

  readonly edadRetiroLabel = computed<string>(() => {
    const edadRetiro = this.store.legadoRetiro().edadRetiro;
    return edadRetiro === null ? 'Sin definir' : `${edadRetiro} años`;
  });

  readonly legadoLabel = computed<string>(() => {
    const lr = this.store.legadoRetiro();

    if (lr.legadoObjetivo === 'mantener-todo') {
      return 'Mantener todo el patrimonio';
    }

    if (lr.legadoObjetivo === 'mantener-vivienda') {
      return 'Mantener vivienda principal';
    }

    if (lr.legadoObjetivo === 'manual') {
      const count = lr.activosConservar.length;
      const activos = count === 1 ? '1 activo' : `${count} activos`;
      const adicional =
        lr.patrimonioFinancieroAdicional > 0
          ? ` + ${this.formatEuro(lr.patrimonioFinancieroAdicional)} en patrimonio financiero`
          : '';
      return `${activos}${adicional}`;
    }

    return 'Sin definir';
  });

  readonly scenarios = computed<ScenarioProjection[]>(() => [
    {
      label: 'Optimista',
      value: this.formatCompactEuro(1920000),
      intent: 'success',
      note: null,
    },
    {
      label: 'Medio',
      value: this.formatCompactEuro(530000),
      intent: 'warning',
      note: null,
    },
    {
      label: 'Pesimista',
      value: this.formatCompactEuro(0),
      intent: 'error',
      note: 'Agota a los 92 años',
    },
  ]);

  private formatEuro(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  private formatCompactEuro(value: number): string {
    if (value >= 1000000) {
      return `${this.numberFormatter.format(value / 1000000)} M€`;
    }

    if (value >= 1000) {
      return `${this.numberFormatter.format(value / 1000)} k€`;
    }

    return `${this.numberFormatter.format(value)} €`;
  }
}
