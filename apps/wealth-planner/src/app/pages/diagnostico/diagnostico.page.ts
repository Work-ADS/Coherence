import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CardComponent } from '@coherence/ui';
import { BadgeComponent } from '@coherence/ui';
import { ButtonComponent } from '@coherence/ui';
import { PageHeaderComponent } from '@coherence/ui';
import { ChartLineComponent } from '@coherence/ui/chart';
import { ChartBarComponent } from '@coherence/ui/chart';
import type { LineSeries, BarDatum } from '@coherence/ui/chart';
import { TelemetryService } from '../../data/telemetry.service';

interface EvolucionRow {
  year: number;
  optimista: number;
  base: number;
  pesimista: number;
}

interface CashflowRow {
  year: number;
  income: number;
  expense: number;
  net: number;
}

interface AssetRow {
  class: string;
  percentage: number;
  color: string;
}

interface EscenarioRow {
  label: string;
  values: [string, string, string];
}

interface DiagnosticoData {
  evolucion: EvolucionRow[];
  cashflow: CashflowRow[];
  assetAllocation: AssetRow[];
  escenarios: {
    columns: [string, string, string];
    rows: EscenarioRow[];
  };
}

@Component({
  selector: 'wp-diagnostico',
  standalone: true,
  imports: [
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    PageHeaderComponent,
    ChartLineComponent,
    ChartBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; }
    .donut-segment { transition: opacity 180ms ease-out; }
    .donut-segment:hover { opacity: 0.8; }
    @media (prefers-reduced-motion: reduce) {
      .donut-segment { transition-duration: 0ms; }
    }
  `,
  template: `
    <div class="max-w-[1440px] mx-auto px-space-8 py-space-8">
      <!-- Top bar -->
      <div class="flex items-center justify-between mb-space-6">
        <afi-button variant="ghost" size="sm" (clicked)="onVolver()">
          ← Volver al demo
        </afi-button>
        <afi-badge intent="info" size="sm">Concept · Wealth Planner</afi-badge>
      </div>

      <!-- Page header -->
      <afi-page-header title="Diagnóstico" subtitle="Tu trayectoria financiera en 10 años" [sticky]="false" />

      <!-- Charts grid -->
      @if (loaded()) {
        <!-- Top row: Evolución (2/3) + Asset Allocation donut (1/3) -->
        <div class="grid grid-cols-3 gap-space-6 mb-space-6">
          <div class="col-span-2">
            <afi-card variant="elevated" padding="lg">
              <afi-chart-line
                [data]="evolucionSeries()"
                title="Evolución patrimonial"
                subtitle="Proyección a 10 años (€)"
                height="320px"
                [showMarkers]="true"
                [baselineZero]="true"
              />
            </afi-card>
          </div>
          <div class="col-span-1">
            <afi-card variant="elevated" padding="lg">
              <div class="mb-space-3">
                <h3 class="text-section text-canvas-fg">Distribución de activos</h3>
                <p class="text-body-sm text-neutral-500 mt-space-1">Asignación objetivo</p>
              </div>
              <!-- Static SVG donut (no DS donut primitive) -->
              <svg viewBox="0 0 200 200" class="block mx-auto" style="max-width: 200px" role="img" aria-label="Gráfico de distribución de activos">
                @for (segment of donutSegments(); track segment.label) {
                  <path
                    class="donut-segment"
                    [attr.d]="segment.path"
                    [attr.fill]="segment.color"
                    [attr.stroke]="'var(--canvas-base)'"
                    stroke-width="2"
                  >
                    <title>{{ segment.label }}: {{ segment.pct }}%</title>
                  </path>
                }
                <circle cx="100" cy="100" r="50" fill="var(--canvas-base)" />
                <text x="100" y="96" text-anchor="middle" class="fill-canvas-fg" style="font-size: 20px; font-weight: 600;">100%</text>
                <text x="100" y="114" text-anchor="middle" class="fill-neutral-500" style="font-size: 11px;">Asignado</text>
              </svg>
              <!-- Legend -->
              <div class="mt-space-4 space-y-space-2">
                @for (asset of assetAllocation(); track asset.class) {
                  <div class="flex items-center justify-between text-body-sm">
                    <div class="flex items-center gap-space-2">
                      <span class="inline-block w-3 h-3 rounded-sm" [style.background]="asset.color"></span>
                      <span class="text-canvas-fg">{{ asset.class }}</span>
                    </div>
                    <span class="text-neutral-500 tabular-nums">{{ asset.percentage }}%</span>
                  </div>
                }
              </div>
            </afi-card>
          </div>
        </div>

        <!-- Middle row: Cashflow bar chart -->
        <div class="mb-space-6">
          <afi-card variant="elevated" padding="lg">
            <afi-chart-bar
              [data]="cashflowBars()"
              title="Flujo de caja anual"
              subtitle="Ingresos netos proyectados (€)"
              height="280px"
            />
          </afi-card>
        </div>

        <!-- Bottom row: Escenario table -->
        <afi-card variant="elevated" padding="lg">
          <h3 class="text-section text-canvas-fg mb-space-4">Escenarios comparados</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-body-sm" role="table">
              <thead>
                <tr class="border-b border-hairline">
                  <th class="text-left py-space-3 pr-space-4 text-neutral-500 font-medium" scope="col"></th>
                  @for (col of escenarioColumns(); track col) {
                    <th class="text-right py-space-3 px-space-4 text-neutral-500 font-medium" scope="col">{{ col }}</th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (row of escenarioRows(); track row.label) {
                  <tr class="border-b border-hairline last:border-b-0">
                    <td class="py-space-3 pr-space-4 text-canvas-fg font-medium">{{ row.label }}</td>
                    @for (val of row.values; track $index) {
                      <td class="py-space-3 px-space-4 text-right tabular-nums text-canvas-fg">{{ val }}</td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </afi-card>
      }

      <!-- Footer badge -->
      <footer class="mt-space-16 pb-space-8 text-center">
        <afi-badge intent="neutral" size="sm">Concepto — generado en 4 días</afi-badge>
      </footer>
    </div>
  `,
})
export class DiagnosticoPage implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly telemetry = inject(TelemetryService);

  readonly loaded = signal(false);
  readonly evolucionSeries = signal<LineSeries[]>([]);
  readonly cashflowBars = signal<BarDatum[]>([]);
  readonly assetAllocation = signal<AssetRow[]>([]);
  readonly escenarioColumns = signal<string[]>([]);
  readonly escenarioRows = signal<EscenarioRow[]>([]);
  readonly donutSegments = signal<Array<{ path: string; color: string; label: string; pct: number }>>([]);

  ngOnInit(): void {
    this.telemetry.emit('teaser.diagnostico.viewed');
    this.http.get<DiagnosticoData>('/assets/data/diagnostico.json').subscribe((data) => {
      // Evolución → LineSeries
      const series: LineSeries[] = [
        { key: 'Optimista', points: data.evolucion.map((r) => ({ x: r.year, y: r.optimista })) },
        { key: 'Base', points: data.evolucion.map((r) => ({ x: r.year, y: r.base })) },
        { key: 'Pesimista', points: data.evolucion.map((r) => ({ x: r.year, y: r.pesimista })) },
      ];
      this.evolucionSeries.set(series);

      // Cashflow → BarDatum (net income per year)
      const bars: BarDatum[] = data.cashflow.map((r) => ({
        key: String(r.year),
        value: r.net,
      }));
      this.cashflowBars.set(bars);

      // Asset allocation
      this.assetAllocation.set(data.assetAllocation);

      // Donut segments
      this.donutSegments.set(this.buildDonut(data.assetAllocation));

      // Escenarios
      this.escenarioColumns.set([...data.escenarios.columns]);
      this.escenarioRows.set(data.escenarios.rows);

      this.loaded.set(true);
    });
  }

  onVolver(): void {
    this.telemetry.emit('teaser.diagnostico.volver-clicked');
    // Placeholder — Wealth Planner is its own product, not connected to Propuestas
    window.history.back();
  }

  private buildDonut(assets: AssetRow[]): Array<{ path: string; color: string; label: string; pct: number }> {
    const cx = 100;
    const cy = 100;
    const r = 80;
    let cumulative = 0;
    return assets.map((a) => {
      const startAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
      cumulative += a.percentage;
      const endAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
      const largeArc = a.percentage > 50 ? 1 : 0;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
      return { path, color: a.color, label: a.class, pct: a.percentage };
    });
  }
}
