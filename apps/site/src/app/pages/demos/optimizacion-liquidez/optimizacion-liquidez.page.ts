import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import {
  ButtonComponent,
  IconButtonComponent,
  MenuComponent,
  MenuItemComponent,
  PageHeaderComponent,
  SwitchComponent,
  TableComponent,
} from '@coherence/ui';
import type { LineSeries, TableCellTone, TableColumn } from '@coherence/ui';

import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import {
  LiquidezEvolucionChartComponent,
  type YearBreakdown,
} from '../wealth-planner-2026/shared/liquidez-evolucion-chart.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';

type PerfilRiesgo = 'conservador' | 'moderado' | 'dinamico';

interface OptLiqRow {
  [key: string]: unknown;
  id: string;
}

const AGE_FROM = 52;
const AGE_TO = 90;

const PERFIL_RATES: Record<PerfilRiesgo, number> = {
  conservador: 0.01,
  moderado: 0.03,
  dinamico: 0.05,
};

const PERFIL_LABELS: Record<PerfilRiesgo, string> = {
  conservador: 'Conservador (1 %)',
  moderado: 'Moderado (3 %)',
  dinamico: 'Dinámico (5 %)',
};

/**
 * Plan de acción · Optimización de la liquidez (PDF §4.b / Wave 3).
 *
 * Gated by a page-level switch (mirrors Legado y retiro). When activated:
 *   1. Evolución esperada del exceso de liquidez — line chart with three
 *      scenarios (pesimista / medio / optimista), filtered by Perfil de
 *      riesgo, with a click-to-pin año/acumulado popover delegated to
 *      `site-liquidez-evolucion-chart`.
 *   2. Resumen de rentabilidades generadas — read-only summary table.
 *
 * All numbers are mock data — same convention as Estrategias.
 */
@Component({
  selector: 'site-optimizacion-liquidez-page',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    MenuComponent,
    MenuItemComponent,
    PageHeaderComponent,
    SwitchComponent,
    TableComponent,
    ObjetivosPageShellComponent,
    LiquidezEvolucionChartComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './optimizacion-liquidez.page.html',
  styleUrl: './optimizacion-liquidez.page.scss',
})
export class OptimizacionLiquidezPage {
  readonly store = inject(WealthPlannerStore);

  // ── Perfil de riesgo (single-select chip-dropdown) ──────────────────────
  readonly perfilRiesgo = signal<PerfilRiesgo>('conservador');
  readonly perfilMenuOpen = signal<boolean>(false);
  readonly perfilOptions: ReadonlyArray<{ value: PerfilRiesgo; label: string }> = [
    { value: 'conservador', label: PERFIL_LABELS.conservador },
    { value: 'moderado', label: PERFIL_LABELS.moderado },
    { value: 'dinamico', label: PERFIL_LABELS.dinamico },
  ];
  readonly perfilLabel = computed<string>(() => PERFIL_LABELS[this.perfilRiesgo()]);

  // ── Chart series (3 scenarios × age 52..90, with per-scenario color) ────
  readonly chartSeries = computed<LineSeries[]>(() => {
    const rate = PERFIL_RATES[this.perfilRiesgo()];
    return [
      {
        ...buildSeries('Escenario pesimista', AGE_FROM, AGE_TO, 90_000, rate * 0.6),
        color: 'var(--feedback-error-foreground)',
      },
      {
        ...buildSeries('Escenario medio', AGE_FROM, AGE_TO, 150_000, rate),
        color: 'var(--color-action-500)',
      },
      {
        ...buildSeries('Escenario optimista', AGE_FROM, AGE_TO, 220_000, rate * 1.4),
        color: 'var(--feedback-success-foreground)',
      },
    ];
  });

  // ── Popover breakdowns (Año + Acumulado) keyed by age ───────────────────
  readonly anoBreakdown = computed<readonly YearBreakdown[]>(() =>
    rangeAges().map((age) => ({ age, rows: anoRowsFor(age) })),
  );

  readonly acumuladoBreakdown = computed<readonly YearBreakdown[]>(() =>
    rangeAges().map((age) => ({ age, rows: acumuladoRowsFor(age) })),
  );

  // ── Resumen de rentabilidades table ─────────────────────────────────────
  readonly resumenColumns: TableColumn[] = [
    { key: 'concepto', label: 'Concepto' },
    {
      key: 'pesimista',
      label: 'Escenario pesimista',
      align: 'end',
      toneKey: 'tPesimista',
    },
    { key: 'medio', label: 'Escenario medio', align: 'end', toneKey: 'tMedio' },
    {
      key: 'optimista',
      label: 'Escenario optimista',
      align: 'end',
      toneKey: 'tOptimista',
    },
  ];

  readonly resumenRows = computed<OptLiqRow[]>(() => {
    const rate = PERFIL_RATES[this.perfilRiesgo()];
    const conceptos = [
      {
        id: 'exceso-medio',
        concepto: 'Exceso de liquidez medio empezando a retiro (60 años)',
        base: 480_000,
      },
      {
        id: 'rent-jubilacion',
        concepto: 'Rentabilidad acumulada hasta jubilación a retiro (60 años)',
        base: 32_000,
        pctBase: 0.045,
      },
      {
        id: 'rent-esperanza',
        concepto: 'Hasta esperanza de vida (90 años)',
        base: 178_000,
        pctBase: 0.083,
      },
      {
        id: 'rent-100',
        concepto: 'Rentabilidad esperada hasta los 100 años',
        base: 226_000,
        pctBase: 0.092,
      },
    ];

    return conceptos.map(({ id, concepto, base, pctBase }) => {
      const pes = Math.round(base * (1 + rate * 0.4));
      const med = Math.round(base * (1 + rate * 1.2));
      const opt = Math.round(base * (1 + rate * 2.4));
      const subPes = pctBase !== undefined ? `Rentabilidad: ${formatPct(pctBase * 0.6)} (${formatPct(pctBase * 0.6 / 30)} anual)` : null;
      const subMed = pctBase !== undefined ? `Rentabilidad: ${formatPct(pctBase)} (${formatPct(pctBase / 30)} anual)` : null;
      const subOpt = pctBase !== undefined ? `Rentabilidad: ${formatPct(pctBase * 1.6)} (${formatPct(pctBase * 1.6 / 30)} anual)` : null;
      return {
        id,
        concepto,
        pesimista: subPes !== null ? `${formatEuro(pes)}\n${subPes}` : formatEuro(pes),
        medio: subMed !== null ? `${formatEuro(med)}\n${subMed}` : formatEuro(med),
        optimista: subOpt !== null ? `${formatEuro(opt)}\n${subOpt}` : formatEuro(opt),
        tPesimista: 'danger' satisfies TableCellTone,
        tMedio: 'info' satisfies TableCellTone,
        tOptimista: 'success' satisfies TableCellTone,
      };
    });
  });

  // ── Switch + perfil handlers ────────────────────────────────────────────
  setOptimizacionLiquidezEstablished(value: boolean): void {
    this.store.setOptimizacionLiquidezEstablished(value);
  }

  setPerfilRiesgo(value: PerfilRiesgo): void {
    this.perfilRiesgo.set(value);
    this.perfilMenuOpen.set(false);
  }

  exportChart(): void {
    // Mock — real implementation would emit a PDF/PNG of the chart section.
  }
}

// ── Pure helpers ──────────────────────────────────────────────────────────

function rangeAges(): number[] {
  return Array.from({ length: AGE_TO - AGE_FROM + 1 }, (_, i) => AGE_FROM + i);
}

function buildSeries(key: string, from: number, to: number, base: number, rate: number): LineSeries {
  return {
    key,
    points: Array.from({ length: to - from + 1 }, (_, i) => {
      const age = from + i;
      const y = Math.round(base * i * (1 + rate * i));
      return { x: age, y };
    }),
  };
}

/**
 * Rows for the Año variant — uses the Figma-anchored values at age 59 as
 * the reference shape; scales linearly off `(age - 52)` for surrounding
 * years so the popover never shows zeros mid-range.
 */
function anoRowsFor(age: number) {
  const factor = Math.max(0.4, (age - 50) / 9);
  return [
    {
      concepto: 'Exceso de liquidez previo',
      pesimista: Math.round(165_762 * factor),
      medio: Math.round(202_762 * factor),
      optimista: Math.round(253_252 * factor),
    },
    {
      concepto: 'Ingresos del año',
      pesimista: Math.round(202_992 * factor),
      medio: Math.round(250_992 * factor),
      optimista: Math.round(325_034 * factor),
    },
    {
      concepto: 'Rentabilidad del exceso de liquidez en el año',
      pesimista: Math.round(593 * factor),
      medio: Math.round(10_025 * factor),
      optimista: Math.round(15_025 * factor),
    },
    {
      concepto: 'Gastos del año',
      pesimista: -Math.round(190_912 * factor),
      medio: -Math.round(190_912 * factor),
      optimista: -Math.round(190_912 * factor),
    },
    {
      concepto: 'Colchón de liquidez',
      pesimista: -50_000,
      medio: -50_000,
      optimista: -50_000,
    },
    {
      concepto: 'Exceso de liquidez en el año',
      pesimista: Math.round(128_435 * factor),
      medio: Math.round(200_435 * factor),
      optimista: Math.round(352_399 * factor),
    },
  ];
}

function acumuladoRowsFor(age: number) {
  const factor = Math.max(0.4, (age - 50) / 9);
  return [
    {
      concepto: 'Liquidez inicial',
      pesimista: 23_394,
      medio: 23_394,
      optimista: 23_394,
    },
    {
      concepto: 'Ingresos acumulados',
      pesimista: Math.round(422_399 * factor),
      medio: Math.round(500_399 * factor),
      optimista: Math.round(570_222 * factor),
    },
    {
      concepto: 'Rentabilidad acumulada del exceso de liquidez',
      pesimista: Math.round(7_384 * factor),
      medio: Math.round(32_334 * factor),
      optimista: Math.round(68_757 * factor),
    },
    {
      concepto: 'Gastos acumulados',
      pesimista: -Math.round(259_974 * factor),
      medio: -Math.round(259_974 * factor),
      optimista: -Math.round(259_974 * factor),
    },
    {
      concepto: 'Colchón de liquidez',
      pesimista: -50_000,
      medio: -50_000,
      optimista: -50_000,
    },
    {
      concepto: 'Exceso de liquidez en el año',
      pesimista: Math.round(128_435 * factor),
      medio: Math.round(200_215 * factor),
      optimista: Math.round(352_399 * factor),
    },
  ];
}

const EUR_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const PCT_FORMATTER = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatEuro(value: number): string {
  return EUR_FORMATTER.format(value);
}

function formatPct(value: number): string {
  return `${PCT_FORMATTER.format(value * 100)} %`;
}
