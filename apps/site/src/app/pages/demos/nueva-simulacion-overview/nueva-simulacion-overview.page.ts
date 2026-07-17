import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  BadgeV2Component,
  ButtonV2Component,
  CardV2Component,
  ChartBarComponent,
  ChartLineComponent,
  LoadingOverlayComponent,
  NavbarV2Component,
  NavItemV2Component,
  NavSectionV2Component,
  SidebarV2Component,
} from '@coherence/ui';
import type { BadgeV2Tone, BarDatum, LineSeries, NavbarV2Action } from '@coherence/ui';

interface RecentSim {
  title: string;
  outcome: string;
  chip: string;
  tone: BadgeV2Tone;
  when: string;
}

interface Person {
  name: string;
  rel: string;
}

interface Alert {
  tag: string;
  tone: BadgeV2Tone;
  text: string;
}

/**
 * Nueva simulación · Overview — goal-driven client dashboard (concept surface).
 *
 * The gestor opens a client and lands here: base profile (Familia / Patrimonio /
 * Ingresos y gastos) always in the sidebar, plus a bento of "life answers"
 * (patrimonio neto, cuánto dura el dinero, año libre de deuda…) over a wealth
 * projection. Simulations are goal-scoped scenarios layered on top; recent ones
 * surface both in the sidebar and the strip, each wearing its provenance badge
 * (Ajustado / Hipotético).
 *
 * Composed entirely from foundations-modern primitives (data-foundation="modern"):
 * sidebar-v2 / navbar-v2 chrome, card-v2 tiles, chart-line / chart-bar, badge-v2.
 * On first paint the tiles play the stagger-reveal (light tier) from motion.scss.
 */
@Component({
  selector: 'site-nueva-simulacion-overview',
  standalone: true,
  imports: [
    SidebarV2Component,
    NavSectionV2Component,
    NavItemV2Component,
    NavbarV2Component,
    CardV2Component,
    ButtonV2Component,
    BadgeV2Component,
    ChartLineComponent,
    ChartBarComponent,
    LoadingOverlayComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nueva-simulacion-overview.page.html',
  styleUrl: './nueva-simulacion-overview.page.scss',
})
export class NuevaSimulacionOverviewPage {
  readonly sidebarCollapsed = signal(false);

  /** Brief initial load — shows the default loading animation, then the bento
   *  reveals with the stagger. */
  readonly loading = signal(true);

  constructor() {
    setTimeout(() => this.loading.set(false), 1100);
  }

  /** Wealth projection — the plan lifts the curve, doing nothing flattens it.
   *  x is a Date (Jan 1 of each year) so the axis shows years, not compact k. */
  readonly projection: LineSeries[] = [
    {
      key: 'Con plan',
      points: [
        { x: new Date(2026, 0, 1), y: 4_820_000 },
        { x: new Date(2032, 0, 1), y: 5_600_000 },
        { x: new Date(2038, 0, 1), y: 6_500_000 },
        { x: new Date(2044, 0, 1), y: 7_450_000 },
        { x: new Date(2052, 0, 1), y: 8_300_000 },
        { x: new Date(2060, 0, 1), y: 9_050_000 },
      ],
    },
    {
      key: 'Sin plan',
      points: [
        { x: new Date(2026, 0, 1), y: 4_820_000 },
        { x: new Date(2032, 0, 1), y: 4_980_000 },
        { x: new Date(2038, 0, 1), y: 5_080_000 },
        { x: new Date(2044, 0, 1), y: 5_150_000 },
        { x: new Date(2052, 0, 1), y: 5_180_000 },
        { x: new Date(2060, 0, 1), y: 5_120_000 },
      ],
    },
  ];

  /** Asset allocation — part-to-whole, values are percentages. */
  readonly allocation: BarDatum[] = [
    { key: 'Inmobiliario', value: 44 },
    { key: 'Financiero', value: 39 },
    { key: 'Liquidez', value: 17 },
  ];

  readonly family: Person[] = [
    { name: 'Elena Serrano', rel: '58 · titular' },
    { name: 'Marc Puig', rel: '60 · cónyuge' },
    { name: 'Dos hijos', rel: '24 · 27' },
  ];

  readonly alerts: Alert[] = [
    { tag: 'Jubilación', tone: 'warning', text: 'aportación por debajo del objetivo' },
    { tag: 'Vivienda', tone: 'neutral', text: 'tasación con 3 años de antigüedad' },
  ];

  readonly recentSims: RecentSim[] = [
    {
      title: 'Jubilación anticipada a los 60',
      outcome: 'Jubilación 4 años antes · el dinero dura hasta 2068',
      chip: 'Ajustado',
      tone: 'info',
      when: 'Actualizada hace 2 días',
    },
    {
      title: 'Venta de la segunda vivienda',
      outcome: 'Activo hipotético en 2032 · legado +380 k€',
      chip: 'Hipotético',
      tone: 'warning',
      when: 'Actualizada hace 1 semana',
    },
    {
      title: 'Aportación extra al plan',
      outcome: '+500 €/mes al plan · jubilación 91%',
      chip: 'Ajustado',
      tone: 'info',
      when: 'Actualizada hace 3 semanas',
    },
  ];

  onNav(_action: NavbarV2Action): void {
    // Concept surface — navbar actions are inert in the demo.
  }
}
