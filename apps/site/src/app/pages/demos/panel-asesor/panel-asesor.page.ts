// external
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// internal (libs)
import { CardV2Component, ChartCompositionComponent } from '@coherence/ui';
import type { BarDatum, CompositionVariant } from '@coherence/ui';

// relative
import { PlannerNavbarV2Component } from '../shared/planner-navbar-v2.component';

const EUR = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type Treatment = 't1' | 't2' | 't3';

/**
 * Panel del asesor — the advisor dashboard surface (brand showcase).
 *
 * One component, three routes: /demos/panel-asesor/{producto|editorial|trazos}
 * pass `data.treatment` (t1/t2/t3) and each renders as a normal full screen —
 * depth-3 demo routes drop the site chrome automatically, and the page brings
 * its own: `site-planner-navbar-v2` (glass breadcrumb bar — client link,
 * inline rename, estado menu, notas/ajustes dropdowns, advisor avatar).
 *
 * The hero (patrimonio total + composition strip) is the first tile; the
 * remaining dashboard tiles land here as they're built. Side-by-side
 * treatment comparison stays at /demos/panel-asesor/hero-lab.
 */
@Component({
  selector: 'site-panel-asesor',
  standalone: true,
  imports: [PlannerNavbarV2Component, CardV2Component, ChartCompositionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './panel-asesor.page.html',
  styleUrl: './panel-asesor.page.scss',
})
export class PanelAsesorPage {
  private readonly route = inject(ActivatedRoute);

  readonly treatment: Treatment = (this.route.snapshot.data['treatment'] as Treatment) ?? 't1';

  readonly stripVariant = computed<CompositionVariant>(() => {
    switch (this.treatment) {
      case 't2':
        return 'blocks';
      case 't3':
        return 'ticks';
      default:
        return 'segments';
    }
  });

  readonly composicion: BarDatum[] = [
    { key: 'Inmobiliario', value: 2_610_000 },
    { key: 'Financiero', value: 558_000 },
    { key: 'Pensiones', value: 430_000 },
    { key: 'Liquidez', value: 124_518.45 },
  ];

  private readonly total = this.composicion.reduce((sum, d) => sum + d.value, 0);

  readonly totalEntero: string;
  readonly totalResto: string;

  constructor() {
    const formatted = EUR.format(this.total);
    const comma = formatted.lastIndexOf(',');
    this.totalEntero = formatted.slice(0, comma);
    this.totalResto = formatted.slice(comma);
  }
}
