import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export type Vista = 'actual' | 'simulada' | 'comparada';
export type Escenario = 'medio' | 'optimista' | 'pesimista' | 'todos';
export type Detalle = 'agregada' | 'activo' | 'objetivo';

/** Palette variant — passed in from the proposal page.
 *  v1/v2/v3 are the original 2026-Q1 production options (kept for diff).
 *  a/b/c are the 2026-Q2 candidates being evaluated against this real chart;
 *  one of them will become the canonical --chart-stacked-{1..7} token set
 *  once the design decision is locked. All keep red as the deuda color so any
 *  value below zero is unmistakably a debt. */
export type ChartPalette = 'v1' | 'v2' | 'v3' | 'a' | 'b' | 'c';
export type LegendPlacement = 'top' | 'bottom';

/** External data point — when [data] is bound, the chart switches to single-
 *  bar mode driven entirely by the consumer's series. */
export interface EvolucionDataPoint {
  age: number;
  value: number;
}

/** Universal deuda token — applied to any negative value regardless of asset
 *  class or palette. "Debt is debt" — the seniors' rule. */
const DEUDA_COLOR = 'var(--chart-deuda)';

/** Asset class — used when Detalle = "Por tipo de activo" (stacked bars + toggleable legend). */
interface AssetClass {
  key: string;
  label: string;
  ratio: number;
}

/** Life event — pinned at a given age along the x-axis. Renders as an icon
 *  bubble at the top of the column + a dashed guide line down to the
 *  baseline. Hover shows the label. Per data-viz-skill: paired position +
 *  shape so the highlight isn't color-only. */
export type LifeEventIcon = 'briefcase' | 'gift' | 'home' | 'now';

export interface LifeEvent {
  age: number;
  label: string;
  iconKey: LifeEventIcon;
}

const ASSET_CLASSES: AssetClass[] = [
  { key: 'inmobiliario', label: 'Inmobiliario', ratio: 0.32 },
  { key: 'inversiones', label: 'Inversiones', ratio: 0.22 },
  { key: 'pensiones', label: 'Planes de pensiones', ratio: 0.22 },
  { key: 'privateEquity', label: 'Private equity', ratio: 0.08 },
  { key: 'participaciones', label: 'Participaciones', ratio: 0.07 },
  { key: 'liquidez', label: 'Liquidez', ratio: 0.05 },
  { key: 'otro', label: 'Otro', ratio: 0.04 },
];

const PALETTES: Record<ChartPalette, Record<string, string> & { base: string; barOnly: string }> = {
  v1: {
    inmobiliario:    'var(--chart-legacy-v1-1)',
    inversiones:     'var(--chart-legacy-v1-2)',
    pensiones:       'var(--chart-legacy-v1-3)',
    privateEquity:   'var(--chart-legacy-v1-4)',
    participaciones: 'var(--chart-legacy-v1-5)',
    liquidez:        'var(--chart-legacy-v1-6)',
    otro:            'var(--chart-legacy-v1-7)',
    base: 'var(--action-700)',
    barOnly: 'var(--action-700)',
  },
  v2: {
    inmobiliario:    'var(--chart-legacy-v2-1)',
    inversiones:     'var(--chart-legacy-v2-2)',
    pensiones:       'var(--chart-legacy-v2-3)',
    privateEquity:   'var(--chart-legacy-v2-4)',
    participaciones: 'var(--chart-legacy-v2-5)',
    liquidez:        'var(--chart-legacy-v2-6)',
    otro:            'var(--chart-legacy-v2-7)',
    base: 'var(--action-700)',
    barOnly: 'var(--action-700)',
  },
  v3: {
    inmobiliario:    'var(--chart-legacy-v3-1)',
    inversiones:     'var(--chart-legacy-v3-2)',
    pensiones:       'var(--chart-legacy-v3-3)',
    privateEquity:   'var(--chart-legacy-v3-4)',
    participaciones: 'var(--chart-legacy-v3-5)',
    liquidez:        'var(--chart-legacy-v3-6)',
    otro:            'var(--chart-legacy-v3-7)',
    base: 'var(--action-700)',
    barOnly: 'var(--action-700)',
  },
  a: {
    inmobiliario:    'var(--chart-palette-a-1)',
    inversiones:     'var(--chart-palette-a-2)',
    pensiones:       'var(--chart-palette-a-3)',
    privateEquity:   'var(--chart-palette-a-4)',
    participaciones: 'var(--chart-palette-a-5)',
    liquidez:        'var(--chart-palette-a-6)',
    otro:            'var(--chart-palette-a-7)',
    base: 'var(--action-700)',
    barOnly: 'var(--action-700)',
  },
  b: {
    inmobiliario:    'var(--chart-palette-b-1)',
    inversiones:     'var(--chart-palette-b-2)',
    pensiones:       'var(--chart-palette-b-3)',
    privateEquity:   'var(--chart-palette-b-4)',
    participaciones: 'var(--chart-palette-b-5)',
    liquidez:        'var(--chart-palette-b-6)',
    otro:            'var(--chart-palette-b-7)',
    base: 'var(--action-700)',
    barOnly: 'var(--action-700)',
  },
  c: {
    inmobiliario:    'var(--chart-palette-c-1)',
    inversiones:     'var(--chart-palette-c-2)',
    pensiones:       'var(--chart-palette-c-3)',
    privateEquity:   'var(--chart-palette-c-4)',
    participaciones: 'var(--chart-palette-c-5)',
    liquidez:        'var(--chart-palette-c-6)',
    otro:            'var(--chart-palette-c-7)',
    base: 'var(--action-700)',
    barOnly: 'var(--action-700)',
  },
};

const LIFE_EVENTS: LifeEvent[] = [
  { age: 63, label: 'Retiro esperado', iconKey: 'briefcase' },
  { age: 65, label: 'Jubilación', iconKey: 'gift' },
  { age: 70, label: 'Emancipación hijo 1', iconKey: 'home' },
];

interface FinancialObjetivo {
  age: number;
  value: number;
  label: string;
  iconKey: 'target' | 'home-plus' | 'shield';
}

const OBJETIVOS: FinancialObjetivo[] = [
  { age: 58, value: 900_000, label: 'Fondo de emergencia · 30.000 €', iconKey: 'shield' },
  { age: 66, value: 1_250_000, label: 'Vivienda vacacional · 250.000 €', iconKey: 'home-plus' },
  { age: 72, value: 1_100_000, label: 'Herencia mínima · 400.000 €', iconKey: 'target' },
];

const ESCENARIO_FACTOR: Record<Escenario, number> = {
  medio: 1.0,
  optimista: 1.15,
  pesimista: 0.85,
  todos: 1.0,
};

interface TodosSerie {
  key: string;
  label: string;
  color: string;
  factor: number;
  marker: 'circle' | 'square' | 'diamond';
}

const TODOS_SERIES: TodosSerie[] = [
  { key: 'pesimista', label: 'Pesimista', color: 'var(--chart-legacy-v1-6)', factor: 0.85, marker: 'diamond' },
  { key: 'medio',     label: 'Medio',     color: 'var(--chart-legacy-v1-1)', factor: 1.0,  marker: 'square' },
  { key: 'optimista', label: 'Optimista', color: 'var(--chart-legacy-v1-4)', factor: 1.15, marker: 'circle' },
];

const PATRIMONIO_XMIN = 55;
const PATRIMONIO_XMAX = 90;
const PATRIMONIO_YMIN = -500_000;
const PATRIMONIO_YMAX = 1_800_000;
const PATRIMONIO_YTICKS = [-500_000, 0, 500_000, 1_000_000, 1_500_000];
const PATRIMONIO_XTICKS = [55, 60, 65, 70, 75, 80, 85, 90];

/**
 * Evolución bar chart — the AWP "main" projection chart.
 *
 * Two modes:
 *   1. **Patrimonio mode (default).** No `[data]` input. Renders the bespoke
 *      Luis-Santander patrimonio curves, reactive to vista/escenario/detalle,
 *      with life-event hitos + financial objetivos.
 *   2. **Data mode.** Bind `[data]` to an `EvolucionDataPoint[]` series. The
 *      chart switches to single-bar mode driven by the consumer's data, with
 *      x and y domains derived from the input. Patrimonio-specific toggles
 *      (hitos / objetivos / scenarios / asset stacks) are suppressed.
 */
@Component({
  selector: 'afi-evolucion-bar-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./evolucion-bar-chart.component.scss'],
  template: `
    <div class="relative flex flex-col gap-space-3">
      <!-- Legend (shapes + labels) -->
      <div
        class="flex flex-wrap items-center gap-space-3 gap-y-space-1 min-h-6 text-body-sm"
        [class.justify-end]="legendPlacement() === 'top'"
        [class.justify-start]="legendPlacement() === 'bottom'"
        [class.order-1]="legendPlacement() === 'top'"
        [class.order-2]="legendPlacement() === 'bottom'"
      >
        @for (s of legendSeries(); track s.key) {
          @if (s.interactive) {
            <button
              type="button"
              (click)="toggleSeries(s.key)"
              [class.opacity-30]="isHidden(s.key)"
              class="inline-flex items-center gap-space-2 text-neutral-600 transition-opacity duration-fast cursor-pointer hover:text-canvas-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action rounded"
            >
              <span class="w-2 h-2 rounded-full" [style.backgroundColor]="s.color"></span>
              <span>{{ s.label }}</span>
              <span aria-hidden="true" class="text-caption text-neutral-500">{{
                isHidden(s.key) ? '+' : '×'
              }}</span>
            </button>
          } @else {
            <span
              class="relative inline-flex items-center gap-space-2 text-neutral-600 group/tt"
              [class.cursor-help]="!!s.tooltip"
            >
              @switch (s.mark) {
                @case ('line') {
                  <span class="relative inline-flex items-center w-6 h-3">
                    <span
                      class="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2"
                      [style.backgroundColor]="s.color"
                    ></span>
                    <span
                      class="absolute left-1/2 top-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 bg-white border-[1.5px]"
                      [style.borderColor]="s.color"
                    ></span>
                  </span>
                }
                @case ('dashed') {
                  <span class="relative inline-flex items-center w-6 h-3">
                    <span
                      class="absolute left-0 right-0 top-1/2 -translate-y-1/2"
                      style="border-top: 1.5px dashed currentColor;"
                      [style.color]="s.color"
                    ></span>
                  </span>
                }
                @case ('band') {
                  <span class="relative inline-block w-7 h-4 overflow-hidden rounded-sm">
                    <span
                      class="absolute inset-0"
                      [style.backgroundColor]="s.color"
                      style="opacity: 0.10;"
                    ></span>
                    <span
                      class="absolute inset-y-[0.1875rem] inset-x-0"
                      [style.backgroundColor]="s.color"
                      style="opacity: 0.24;"
                    ></span>
                    <span
                      class="absolute left-0 right-0 top-1/2 h-[1.5px] -translate-y-1/2"
                      [style.backgroundColor]="s.color"
                    ></span>
                  </span>
                }
                @default {
                  <span class="w-2 h-2 rounded-full" [style.backgroundColor]="s.color"></span>
                }
              }
              <span>{{ s.label }}</span>
              @if (s.tooltip) {
                <svg
                  class="w-3.5 h-3.5 text-neutral-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <span role="tooltip" class="tt-pop">{{ s.tooltip }}</span>
              }
            </span>
          }
        }
      </div>

      <!-- Chart -->
      <svg
        viewBox="0 0 960 320"
        class="w-full h-auto"
        [class.order-1]="legendPlacement() === 'bottom'"
        [class.order-2]="legendPlacement() === 'top'"
        role="img"
        [attr.aria-label]="ariaLabel()"
      >
        <!-- Grid + Y-axis labels — labels sit ABOVE the gridline,
             text-anchor="start" so the leading digit ("1" / "5" / "0")
             lines up with the chart's left edge. Per component-skill
             §"Persistent trigger alignment": the always-visible trigger
             is the alignment anchor — the Ver-datos toggle below the
             chart shares this same left edge. -->
        <g>
          @for (t of yTicks(); track t) {
            <line
              [attr.x1]="padLeft"
              [attr.x2]="960 - padRight"
              [attr.y1]="yFor(t)"
              [attr.y2]="yFor(t)"
              stroke="var(--border-hairline)"
              stroke-dasharray="2,3"
            />
            <text
              [attr.x]="padLeft"
              [attr.y]="yFor(t) - 6"
              text-anchor="start"
              class="chart-text-axis"
            >
              {{ formatY(t) }}
            </text>
          }
        </g>

        <!-- Soft column highlight on hover -->
        @if (hoveredAge() !== null) {
          <rect
            [attr.x]="columnX(hoveredAge()!)"
            [attr.y]="padTop"
            [attr.width]="columnWidth()"
            [attr.height]="chartHeight"
            fill="var(--color-neutral-100)"
            opacity="0.5"
            pointer-events="none"
          />
        }

        <!-- Life-event markers — visible whenever events are present and
             the toggle is on. Patrimonio mode defaults to LIFE_EVENTS;
             data mode opts in by binding [events]. -->
        @if (mostrarHitos() && events().length > 0) {
          @for (e of events(); track e.age) {
            <line
              [attr.x1]="columnX(e.age) + columnWidth() / 2"
              [attr.x2]="columnX(e.age) + columnWidth() / 2"
              [attr.y1]="padTop + 22"
              [attr.y2]="yFor(0)"
              stroke="var(--color-neutral-300)"
              stroke-dasharray="2,3"
              stroke-width="1"
              pointer-events="none"
            />
            <g
              [attr.transform]="
                'translate(' + (columnX(e.age) + columnWidth() / 2) + ', ' + (padTop + 11) + ')'
              "
              class="cursor-help"
            >
              <title>{{ e.age }} años — {{ e.label }}</title>
              <circle
                cx="0"
                cy="0"
                r="11"
                fill="var(--surface-elevated)"
                stroke="var(--action-700)"
                stroke-width="1.5"
              />
              <g
                transform="translate(-6, -6) scale(0.5)"
                stroke="var(--action-700)"
                stroke-width="2.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                @switch (e.iconKey) {
                  @case ('briefcase') {
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  }
                  @case ('gift') {
                    <rect x="3" y="8" width="18" height="4" rx="1" />
                    <path d="M12 8v13" />
                    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                    <path d="M7.5 8a2.5 2.5 0 0 1 0-5c2 0 4.5 2 4.5 5" />
                    <path d="M16.5 8a2.5 2.5 0 0 0 0-5c-2 0-4.5 2-4.5 5" />
                  }
                  @case ('home') {
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  }
                  @case ('now') {
                    <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  }
                }
              </g>
            </g>
          }
        }

        <!-- Financial objetivos — patrimonio mode only -->
        @if (mostrarObjetivos() && !isDataMode()) {
          @for (o of objetivos; track o.age) {
            <line
              [attr.x1]="columnX(o.age) + columnWidth() / 2"
              [attr.x2]="columnX(o.age) + columnWidth() / 2"
              [attr.y1]="yFor(o.value) + 10"
              [attr.y2]="yFor(0)"
              stroke="var(--color-neutral-300)"
              stroke-dasharray="2,3"
              stroke-width="1"
              pointer-events="none"
            />
            <g
              [attr.transform]="
                'translate(' + (columnX(o.age) + columnWidth() / 2) + ', ' + yFor(o.value) + ')'
              "
              class="cursor-help"
            >
              <title>{{ o.age }} años — {{ o.label }}</title>
              <rect
                x="-9"
                y="-9"
                width="18"
                height="18"
                rx="2"
                fill="var(--chart-marker-fill)"
                stroke="var(--color-neutral-700)"
                stroke-width="1.25"
                transform="rotate(45)"
              />
              <g
                transform="translate(-5, -5) scale(0.42)"
                stroke="var(--color-neutral-700)"
                stroke-width="2.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                @switch (o.iconKey) {
                  @case ('target') {
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  }
                  @case ('home-plus') {
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2h-4" />
                    <path d="M9 22V12h6v2" />
                    <path d="M17 18h6" />
                    <path d="M20 15v6" />
                  }
                  @case ('shield') {
                    <path
                      d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                    />
                    <path d="m9 12 2 2 4-4" />
                  }
                }
              </g>
            </g>
          }
        }

        <!-- Column hover zones -->
        @for (age of xRange(); track age) {
          <rect
            [attr.x]="columnX(age)"
            [attr.y]="padTop"
            [attr.width]="columnWidth()"
            [attr.height]="chartHeight"
            fill="transparent"
            style="pointer-events: all;"
            (mouseenter)="hoveredAge.set(age)"
            (mouseleave)="hoveredAge.set(null)"
          />
        }

        <!-- ====== RENDER MODE ====== -->
        @switch (renderMode()) {
          @case ('lines-comparada') {
            <path
              [attr.d]="areaPathFor(comparadaBand().outerTop, comparadaBand().outerBottom)"
              fill="var(--chart-band-fill)"
              fill-opacity="0.08"
              stroke="none"
              pointer-events="none"
            />
            <path
              [attr.d]="areaPathFor(comparadaBand().innerTop, comparadaBand().innerBottom)"
              fill="var(--chart-band-fill)"
              fill-opacity="0.18"
              stroke="none"
              pointer-events="none"
            />
            <path
              [attr.d]="pathFor(actualSeries())"
              stroke="var(--color-neutral-500)"
              stroke-width="1.5"
              stroke-dasharray="4,4"
              fill="none"
              pointer-events="none"
            />
            <path
              [attr.d]="pathFor(simuladaSeries())"
              stroke="var(--action-700)"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
              pointer-events="none"
            />
            @if (simuladaSeries()[0]; as p0) {
              <circle
                [attr.cx]="columnX(p0.age) + columnWidth() / 2"
                [attr.cy]="yFor(p0.value)"
                r="5"
                fill="var(--chart-marker-fill)"
                stroke="var(--action-700)"
                stroke-width="2"
                pointer-events="none"
              />
            }
            @if (simuladaSeries()[simuladaSeries().length - 1]; as pN) {
              <circle
                [attr.cx]="columnX(pN.age) + columnWidth() / 2"
                [attr.cy]="yFor(pN.value)"
                r="5"
                fill="var(--chart-marker-fill)"
                stroke="var(--action-700)"
                stroke-width="2"
                pointer-events="none"
              />
              <g
                [attr.transform]="
                  'translate(' +
                  (columnX(pN.age) + columnWidth() / 2) +
                  ', ' +
                  (yFor(pN.value) - 12) +
                  ')'
                "
                pointer-events="none"
              >
                <rect x="-44" y="-22" width="88" height="20" rx="4" fill="var(--action-700)" />
                <text
                  x="0"
                  y="-8"
                  text-anchor="middle"
                  class="chart-text-badge"
                >
                  {{ formatBadge(pN.value) }}
                </text>
              </g>
            }
          }

          @case ('lines-todos') {
            <path
              [attr.d]="areaPathFor(todosBand().outerTop, todosBand().outerBottom)"
              fill="var(--chart-band-fill)"
              fill-opacity="0.08"
              stroke="none"
              pointer-events="none"
            />
            <path
              [attr.d]="areaPathFor(todosBand().innerTop, todosBand().innerBottom)"
              fill="var(--chart-band-fill)"
              fill-opacity="0.18"
              stroke="none"
              pointer-events="none"
            />
            <path
              [attr.d]="pathFor(todosBand().medio)"
              stroke="var(--action-700)"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
              pointer-events="none"
            />
            @if (todosBand().medio[0]; as p0) {
              <circle
                [attr.cx]="columnX(p0.age) + columnWidth() / 2"
                [attr.cy]="yFor(p0.value)"
                r="5"
                fill="var(--chart-marker-fill)"
                stroke="var(--action-700)"
                stroke-width="2"
                pointer-events="none"
              />
            }
            @if (todosBand().medio[todosBand().medio.length - 1]; as pN) {
              <circle
                [attr.cx]="columnX(pN.age) + columnWidth() / 2"
                [attr.cy]="yFor(pN.value)"
                r="5"
                fill="var(--chart-marker-fill)"
                stroke="var(--action-700)"
                stroke-width="2"
                pointer-events="none"
              />
              <g
                [attr.transform]="
                  'translate(' +
                  (columnX(pN.age) + columnWidth() / 2) +
                  ', ' +
                  (yFor(pN.value) - 12) +
                  ')'
                "
                pointer-events="none"
              >
                <rect x="-44" y="-22" width="88" height="20" rx="4" fill="var(--action-700)" />
                <text
                  x="0"
                  y="-8"
                  text-anchor="middle"
                  class="chart-text-badge"
                >
                  {{ formatBadge(pN.value) }}
                </text>
              </g>
            }
          }

          @case ('stacked') {
            @for (d of chartData(); track d.age) {
              <g [attr.opacity]="columnOpacity(d.age)" class="bar-transition" pointer-events="none">
                @for (seg of stackedSegments(d); track seg.key) {
                  <rect
                    [attr.x]="columnX(d.age) + (columnWidth() - barWidth()) / 2"
                    [attr.y]="seg.y"
                    [attr.width]="barWidth()"
                    [attr.height]="seg.h"
                    [attr.fill]="seg.color"
                  >
                    <title>{{ seg.label }} · {{ d.age }} años · {{ formatFull(seg.value) }}</title>
                  </rect>
                }
              </g>
            }
          }

          @default {
            @for (d of chartData(); track d.age) {
              <rect
                class="bar-transition"
                [attr.x]="columnX(d.age) + (columnWidth() - barWidth()) / 2"
                [attr.y]="barY(d.value)"
                [attr.width]="barWidth()"
                [attr.height]="barH(d.value)"
                [attr.fill]="barFillFor(d)"
                [attr.opacity]="barOpacityFor(d)"
                pointer-events="none"
              >
                <title>{{ d.age }} años · {{ formatFull(d.value) }}</title>
              </rect>
            }
          }
        }

        <!-- Zero baseline -->
        <line
          [attr.x1]="padLeft"
          [attr.x2]="960 - padRight"
          [attr.y1]="yFor(0)"
          [attr.y2]="yFor(0)"
          stroke="var(--color-neutral-400)"
          stroke-width="1"
          pointer-events="none"
        />

        <!-- X-axis age labels -->
        <g>
          @for (age of xTicks(); track age) {
            <text
              [attr.x]="columnX(age) + columnWidth() / 2"
              [attr.y]="320 - 8"
              text-anchor="middle"
              class="chart-text-axis"
            >
              {{ age }}
            </text>
          }
        </g>
      </svg>

      <!-- Floating hover tooltip -->
      @if (tooltipData(); as tt) {
        @if (tooltipAnchor(); as anchor) {
          <div
            class="chart-tooltip"
            [style.left]="
              anchor.anchorRight
                ? 'calc(' + anchor.pct + '% - 1rem)'
                : 'calc(' + anchor.pct + '% + 1rem)'
            "
            [style.transform]="anchor.anchorRight ? 'translateX(-100%)' : 'none'"
            role="tooltip"
            aria-live="polite"
          >
            <div class="chart-tooltip__header">
              <p class="chart-tooltip__title">{{ tt.age }} años de edad</p>
              @if (tt.eventLabel) {
                <span class="chart-tooltip__tag">{{ tt.eventLabel }}</span>
              }
            </div>
            @if (tt.rows.length > 0) {
              <div class="chart-tooltip__rows">
                @for (r of tt.rows; track r.label) {
                  <div
                    class="tt-row"
                    [class.tt-row--muted]="r.muted"
                    [class.tt-row--indent]="r.indent"
                  >
                    @switch (r.icon) {
                      @case ('up') {
                        <svg
                          class="tt-chev"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.75"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="3 7.5 6 4.5 9 7.5" />
                        </svg>
                      }
                      @case ('down') {
                        <svg
                          class="tt-chev"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.75"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="3 4.5 6 7.5 9 4.5" />
                        </svg>
                      }
                    }
                    <span class="tt-label">{{ r.label }}</span>
                    <span class="tt-value">{{ r.value }}</span>
                  </div>
                }
              </div>
            }
            @if (tt.total) {
              <div class="tt-footer">
                <span>{{ tt.total.label }}</span>
                <span>{{ tt.total.value }}</span>
              </div>
            }
          </div>
        }
      }

    </div>
  `,
})
export class EvolucionBarChartComponent {
  readonly vista = input<Vista>('actual');
  readonly escenario = input<Escenario>('medio');
  readonly detalle = input<Detalle>('agregada');
  readonly mostrarHitos = input<boolean>(true);
  readonly incluirInmobiliario = input<boolean>(true);
  readonly mostrarObjetivos = input<boolean>(false);
  readonly palette = input<ChartPalette>('a');
  readonly legendPlacement = input<LegendPlacement>('top');

  /** External data series. When bound, the chart switches to single-bar mode
   *  driven entirely by this input — patrimonio-specific toggles are
   *  suppressed and x/y domains derive from the data. */
  readonly data = input<EvolucionDataPoint[] | null>(null);
  /** Legend label used in data mode. Defaults to "Serie". */
  readonly seriesLabel = input<string>('Serie');
  /** Compact y-axis tick label in data mode — true uses K€ / M€ shorthand
   *  (default); false uses full euro formatting. */
  readonly compactYAxis = input<boolean>(true);
  /** Override the default LIFE_EVENTS hitos. When null (and mostrarHitos is
   *  true), patrimonio mode falls back to the built-in life events; data
   *  mode renders no markers unless the consumer passes its own. */
  readonly eventsInput = input<LifeEvent[] | null>(null, { alias: 'events' });

  readonly hoveredAge = signal<number | null>(null);
  readonly hiddenSeries = signal<Set<string>>(new Set());

  readonly isDataMode = computed(() => this.data() !== null);

  readonly hoverSummary = computed<{ label: string; value: string } | null>(() => {
    const age = this.hoveredAge();
    if (age === null) return null;
    const agg = this.aggregateForHover();
    if (agg) return agg;
    const mode = this.renderMode();
    if (mode === 'lines-todos') {
      const medio = this.todosSeriesData().find((s) => s.key === 'medio');
      const p = medio?.points.find((x) => x.age === age);
      return p ? { label: 'Medio', value: this.formatFull(p.value) } : null;
    }
    const d = this.chartData().find((x) => x.age === age);
    if (!d) return null;
    const label = this.isDataMode() ? this.seriesLabel() : 'Patrimonio neto';
    return { label, value: this.formatFull(d.value) };
  });

  readonly tooltipData = computed<{
    age: number;
    eventLabel: string | null;
    rows: {
      label: string;
      value: string;
      muted?: boolean;
      indent?: boolean;
      icon?: 'up' | 'down' | '';
    }[];
    total: { label: string; value: string; delta?: 'up' | 'down' | '' } | null;
  } | null>(() => {
    const age = this.hoveredAge();
    if (age === null) return null;
    const mode = this.renderMode();
    const eventLabel = this.events().find((e) => e.age === age)?.label ?? null;
    const rows: {
      label: string;
      value: string;
      muted?: boolean;
      indent?: boolean;
      icon?: 'up' | 'down' | '';
    }[] = [];
    let total: { label: string; value: string; delta?: 'up' | 'down' | '' } | null = null;

    if (mode === 'stacked') {
      const d = this.chartData().find((x) => x.age === age);
      if (!d) return null;
      const segs = this.stackedSegments(d);
      const activosSum = segs.reduce((s, seg) => s + seg.value, 0);
      rows.push({ label: 'Activos', value: this.formatFull(activosSum), icon: 'up' });
      for (const seg of segs) {
        rows.push({
          label: seg.label,
          value: this.formatFull(seg.value),
          muted: true,
          indent: true,
          icon: 'down',
        });
      }
      total = { label: 'Patrimonio neto', value: this.formatFull(d.value) };
    } else if (mode === 'lines-comparada') {
      const a = this.actualSeries().find((p) => p.age === age);
      const s = this.simuladaSeries().find((p) => p.age === age);
      if (s) rows.push({ label: 'Situación simulada', value: this.formatFull(s.value) });
      if (a) rows.push({ label: 'Situación actual', value: this.formatFull(a.value), muted: true });
      if (a && s) {
        const delta = s.value - a.value;
        const sign = delta >= 0 ? '+' : '';
        total = {
          label: 'Diferencia',
          value: `${sign}${this.formatFull(delta)}`,
          delta: delta >= 0 ? 'up' : 'down',
        };
      }
    } else if (mode === 'lines-todos') {
      const series = this.todosSeriesData();
      const opt = series.find((s) => s.key === 'optimista')?.points.find((p) => p.age === age);
      const medio = series.find((s) => s.key === 'medio')?.points.find((p) => p.age === age);
      const pes = series.find((s) => s.key === 'pesimista')?.points.find((p) => p.age === age);
      if (opt) rows.push({ label: 'Optimista', value: this.formatFull(opt.value), muted: true });
      if (medio) rows.push({ label: 'Medio', value: this.formatFull(medio.value) });
      if (pes) rows.push({ label: 'Pesimista', value: this.formatFull(pes.value), muted: true });
    } else {
      const d = this.chartData().find((x) => x.age === age);
      if (d) {
        const label = this.isDataMode() ? this.seriesLabel() : 'Patrimonio neto';
        total = { label, value: this.formatFull(d.value) };
      }
    }

    return { age, eventLabel, rows, total };
  });

  readonly tooltipAnchor = computed<{ pct: number; anchorRight: boolean } | null>(() => {
    const age = this.hoveredAge();
    if (age === null) return null;
    const xCenter = this.columnX(age) + this.columnWidth() / 2;
    const pct = (xCenter / this.width) * 100;
    return { pct, anchorRight: pct > 55 };
  });

  // ── Fixed geometry ──────────────────────────────────────────────────────
  // padLeft was 70 (room for right-aligned axis labels). Dropped to 0 once
  // labels moved above the gridlines + left-aligned, so the leading digit
  // of every Y label, the first column's pin / bar, and the Ver-datos
  // trigger below the chart all share the section's content-left edge
  // (component-skill §"Persistent trigger alignment"). padTop bumped to
  // clear the floating Y label above the topmost gridline.
  readonly padLeft = 0;
  readonly padRight = 20;
  readonly padTop = 32;
  readonly padBottom = 32;
  readonly width = 960;
  readonly height = 320;
  readonly chartWidth = this.width - this.padLeft - this.padRight;
  readonly chartHeight = this.height - this.padTop - this.padBottom;

  // ── Derived x/y domains — switch between patrimonio defaults and data ───
  readonly xMin = computed(() => {
    const d = this.data();
    if (d && d.length > 0) return d[0]!.age;
    return PATRIMONIO_XMIN;
  });

  readonly xMax = computed(() => {
    const d = this.data();
    if (d && d.length > 0) return d[d.length - 1]!.age;
    return PATRIMONIO_XMAX;
  });

  readonly columnCount = computed(() => this.xMax() - this.xMin() + 1);
  readonly columnWidth = computed(() => this.chartWidth / this.columnCount());
  readonly barWidth = computed(() => this.columnWidth() * 0.7);

  readonly xRange = computed(() => {
    const min = this.xMin();
    return Array.from({ length: this.columnCount() }, (_, i) => min + i);
  });

  readonly xTicks = computed(() => {
    if (!this.isDataMode()) return PATRIMONIO_XTICKS;
    const min = this.xMin();
    const max = this.xMax();
    const ticks: number[] = [];
    let t = min % 5 === 0 ? min : min + (5 - (min % 5));
    while (t <= max) {
      ticks.push(t);
      t += 5;
    }
    if (ticks[0] !== min) ticks.unshift(min);
    if (ticks[ticks.length - 1] !== max) ticks.push(max);
    return ticks;
  });

  readonly yMin = computed(() => {
    const d = this.data();
    if (!d) return PATRIMONIO_YMIN;
    const minVal = Math.min(0, ...d.map((p) => p.value));
    return minVal === 0 ? 0 : niceFloor(minVal);
  });

  readonly yMax = computed(() => {
    const d = this.data();
    if (!d) return PATRIMONIO_YMAX;
    const maxVal = Math.max(0, ...d.map((p) => p.value));
    return maxVal === 0 ? 1 : niceCeil(maxVal);
  });

  readonly yTicks = computed(() => {
    if (!this.isDataMode()) return PATRIMONIO_YTICKS;
    const min = this.yMin();
    const max = this.yMax();
    const span = max - min;
    if (span === 0) return [0];
    const stepCount = 4;
    const rawStep = span / stepCount;
    const step = niceCeil(rawStep);
    const ticks: number[] = [];
    for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) {
      ticks.push(v);
    }
    return ticks;
  });

  readonly events = computed<LifeEvent[]>(() => {
    const ext = this.eventsInput();
    if (ext) return ext;
    return this.isDataMode() ? [] : LIFE_EVENTS;
  });
  readonly objetivos = OBJETIVOS;

  // ── Scales ──────────────────────────────────────────────────────────────
  yFor(value: number): number {
    const min = this.yMin();
    const max = this.yMax();
    const clamped = Math.max(min, Math.min(max, value));
    const t = (clamped - min) / (max - min || 1);
    return this.padTop + (1 - t) * this.chartHeight;
  }
  columnX(age: number): number {
    return this.padLeft + (age - this.xMin()) * this.columnWidth();
  }
  barY(value: number): number {
    return value >= 0 ? this.yFor(value) : this.yFor(0);
  }
  barH(value: number): number {
    return Math.abs(this.yFor(value) - this.yFor(0));
  }
  formatY(v: number): string {
    if (v === 0) return '0 €';
    const abs = Math.abs(v);
    const sign = v < 0 ? '-' : '';
    if (this.isDataMode() && !this.compactYAxis()) {
      return `${sign}${abs.toLocaleString('es-ES')} €`;
    }
    if (abs >= 1_000_000)
      return `${sign}${(abs / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)}M €`;
    if (abs >= 1_000) return `${sign}${Math.round(abs / 1_000)}K €`;
    return `${v} €`;
  }
  formatFull(v: number): string {
    return Math.round(v).toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });
  }

  // ── Patrimonio base data (Luis, Santander middle-manager) ───────────────
  private actualValue(age: number): number {
    if (age <= 63) {
      const t = (age - 55) / 8;
      return Math.round(780_000 + t * (1_280_000 - 780_000));
    }
    const t = (age - 63) / 27;
    return Math.round(1_280_000 + t * (-50_000 - 1_280_000));
  }
  private simuladaValue(age: number): number {
    if (age <= 64) {
      const t = (age - 55) / 9;
      return Math.round(780_000 + t * (1_400_000 - 780_000));
    }
    const t = (age - 64) / 26;
    return Math.round(1_400_000 + t * (120_000 - 1_400_000));
  }

  // ── Render mode ─────────────────────────────────────────────────────────
  readonly renderMode = computed<'lines-comparada' | 'lines-todos' | 'stacked' | 'single'>(() => {
    if (this.isDataMode()) return 'single';
    if (this.vista() === 'comparada') return 'lines-comparada';
    if (this.escenario() === 'todos') return 'lines-todos';
    if (this.detalle() === 'activo') return 'stacked';
    return 'single';
  });

  // ── Chart data ──────────────────────────────────────────────────────────
  readonly chartData = computed<EvolucionDataPoint[]>(() => {
    const ext = this.data();
    if (ext) return ext;
    const f = ESCENARIO_FACTOR[this.escenario()];
    const useSim = this.vista() === 'simulada';
    const out: EvolucionDataPoint[] = [];
    for (let age = PATRIMONIO_XMIN; age <= PATRIMONIO_XMAX; age++) {
      const base = useSim ? this.simuladaValue(age) : this.actualValue(age);
      out.push({ age, value: base * f });
    }
    return out;
  });

  readonly actualSeries = computed(() => {
    const out: EvolucionDataPoint[] = [];
    for (let age = PATRIMONIO_XMIN; age <= PATRIMONIO_XMAX; age++)
      out.push({ age, value: this.actualValue(age) });
    return out;
  });

  readonly simuladaSeries = computed(() => {
    const out: EvolucionDataPoint[] = [];
    for (let age = PATRIMONIO_XMIN; age <= PATRIMONIO_XMAX; age++)
      out.push({ age, value: this.simuladaValue(age) });
    return out;
  });

  readonly todosSeriesData = computed(() => {
    const useSim = this.vista() === 'simulada';
    return TODOS_SERIES.map((s) => ({
      ...s,
      points: Array.from({ length: PATRIMONIO_XMAX - PATRIMONIO_XMIN + 1 }, (_, i) => {
        const age = PATRIMONIO_XMIN + i;
        const base = useSim ? this.simuladaValue(age) : this.actualValue(age);
        return { age, value: base * s.factor };
      }),
    }));
  });

  pathFor(points: EvolucionDataPoint[]): string {
    if (!points.length) return '';
    return points
      .map((p, i) => {
        const x = this.columnX(p.age) + this.columnWidth() / 2;
        const y = this.yFor(p.value);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  areaPathFor(top: EvolucionDataPoint[], bottom: EvolucionDataPoint[]): string {
    if (!top.length || !bottom.length) return '';
    const xy = (p: EvolucionDataPoint) => {
      const x = this.columnX(p.age) + this.columnWidth() / 2;
      const y = this.yFor(p.value);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    };
    const tops = top.map((p, i) => `${i === 0 ? 'M' : 'L'}${xy(p)}`).join(' ');
    const bots = [...bottom]
      .reverse()
      .map((p) => `L${xy(p)}`)
      .join(' ');
    return `${tops} ${bots} Z`;
  }

  formatBadge(v: number): string {
    const abs = Math.abs(v);
    const sign = v < 0 ? '-' : '';
    if (abs >= 1_000_000) return `${sign}€ ${(abs / 1_000_000).toFixed(2).replace('.', ',')}M`;
    if (abs >= 1_000) return `${sign}€ ${Math.round(abs / 1_000)}K`;
    return `${sign}€ ${Math.round(abs)}`;
  }

  readonly comparadaBand = computed(() => {
    const center = this.simuladaSeries();
    return {
      innerTop: center.map((p) => ({ age: p.age, value: p.value * 1.15 })),
      innerBottom: center.map((p) => ({ age: p.age, value: p.value * 0.85 })),
      outerTop: center.map((p) => ({ age: p.age, value: p.value * 1.3 })),
      outerBottom: center.map((p) => ({ age: p.age, value: p.value * 0.7 })),
    };
  });

  readonly todosBand = computed(() => {
    const series = this.todosSeriesData();
    const optimista = series.find((s) => s.key === 'optimista')?.points ?? [];
    const pesimista = series.find((s) => s.key === 'pesimista')?.points ?? [];
    const medio = series.find((s) => s.key === 'medio')?.points ?? [];
    return {
      innerTop: optimista,
      innerBottom: pesimista,
      outerTop: medio.map((p) => ({ age: p.age, value: p.value * 1.3 })),
      outerBottom: medio.map((p) => ({ age: p.age, value: p.value * 0.7 })),
      medio,
    };
  });

  stackedSegments(d: EvolucionDataPoint): {
    key: string;
    label: string;
    color: string;
    value: number;
    y: number;
    h: number;
  }[] {
    if (d.value < 0) {
      const yBottom = this.yFor(0);
      const yTop = this.yFor(d.value);
      return [
        {
          key: 'deuda',
          label: 'Deuda',
          color: DEUDA_COLOR,
          value: d.value,
          y: Math.min(yTop, yBottom),
          h: Math.abs(yBottom - yTop),
        },
      ];
    }
    const palette = PALETTES[this.palette()];
    const hidden = this.hiddenSeries();
    const includeInmo = this.incluirInmobiliario();
    const visible = ASSET_CLASSES.filter(
      (a) => !hidden.has(a.key) && (includeInmo || a.key !== 'inmobiliario'),
    );
    const totalRatio = visible.reduce((s, a) => s + a.ratio, 0) || 1;
    let running = 0;
    const out = [];
    for (let i = 0; i < visible.length; i++) {
      const a = visible[i]!;
      const segValue = d.value * (a.ratio / totalRatio);
      const yBottom = this.yFor(running);
      const yTop = this.yFor(running + segValue);
      const gapPx = i === 0 ? 0 : 1;
      out.push({
        key: a.key,
        label: a.label,
        color: palette[a.key] ?? palette.base,
        value: segValue,
        y: Math.min(yTop, yBottom),
        h: Math.max(0, Math.abs(yBottom - yTop) - gapPx),
      });
      running += segValue;
    }
    return out;
  }

  readonly legendSeries = computed<
    {
      key: string;
      label: string;
      color: string;
      interactive: boolean;
      mark: 'dot' | 'line' | 'dashed' | 'band';
      tooltip?: string;
    }[]
  >(() => {
    if (this.isDataMode()) {
      const series = [
        {
          key: 'data',
          label: this.seriesLabel(),
          color: 'var(--action-700)',
          interactive: false,
          mark: 'dot' as const,
        },
      ];
      if (this.chartData().some((d) => d.value < 0)) {
        series.push({
          key: 'deuda',
          label: 'Negativo',
          color: DEUDA_COLOR,
          interactive: false,
          mark: 'dot',
        });
      }
      return series;
    }
    const mode = this.renderMode();
    if (mode === 'lines-comparada') {
      return [
        {
          key: 'simulada',
          label: 'Situación simulada',
          color: 'var(--action-700)',
          interactive: false,
          mark: 'line',
        },
        {
          key: 'actual',
          label: 'Situación actual',
          color: 'var(--color-neutral-500)',
          interactive: false,
          mark: 'dashed',
        },
        {
          key: 'band',
          label: 'Rango estimado',
          color: 'var(--chart-band-fill)',
          interactive: false,
          mark: 'band',
          tooltip:
            'Dos capas de incertidumbre alrededor de la Simulada. Banda interior: ±15% (rango probable). Banda exterior: ±30% (rango posible, eventos extremos). Cuanto más se aleje la realidad del centro, menos probable es.',
        },
      ];
    }
    if (mode === 'lines-todos') {
      return [
        {
          key: 'medio',
          label: 'Escenario medio',
          color: 'var(--action-700)',
          interactive: false,
          mark: 'line',
        },
        {
          key: 'band',
          label: 'Rango de escenarios',
          color: 'var(--chart-band-fill)',
          interactive: false,
          mark: 'band',
          tooltip:
            'Dos capas. Banda interior: entre Pesimista y Optimista — escenarios que el plan contempla. Banda exterior: ±30% alrededor de Medio — eventos extremos fuera del plan.',
        },
      ];
    }
    if (mode === 'stacked') {
      const palette = PALETTES[this.palette()];
      const includeInmo = this.incluirInmobiliario();
      const series = ASSET_CLASSES.filter((a) => includeInmo || a.key !== 'inmobiliario').map(
        (a) => ({
          key: a.key,
          label: a.label,
          color: palette[a.key] ?? palette.base,
          interactive: true,
          mark: 'dot' as const,
        }),
      );
      if (this.chartData().some((d) => d.value < 0)) {
        series.push({
          key: 'deuda',
          label: 'Deuda',
          color: DEUDA_COLOR,
          interactive: false,
          mark: 'dot' as const,
        });
      }
      return series;
    }
    const v = this.vista();
    const series = [
      {
        key: 'patrimonio',
        label: v === 'simulada' ? 'Patrimonio · Simulada' : 'Patrimonio · Actual',
        color: 'var(--action-700)',
        interactive: false,
        mark: 'dot' as const,
      },
    ];
    if (this.chartData().some((d) => d.value < 0)) {
      series.push({
        key: 'deuda',
        label: 'Deuda',
        color: DEUDA_COLOR,
        interactive: false,
        mark: 'dot',
      });
    }
    return series;
  });

  isHidden(key: string): boolean {
    return this.hiddenSeries().has(key);
  }

  toggleSeries(key: string): void {
    const s = new Set(this.hiddenSeries());
    if (s.has(key)) s.delete(key);
    else s.add(key);
    this.hiddenSeries.set(s);
  }

  readonly ariaLabel = computed(() => {
    if (this.isDataMode()) {
      return `${this.seriesLabel()} — edades ${this.xMin()} a ${this.xMax()}.`;
    }
    return `Evolución patrimonial — vista ${this.vista()}, escenario ${this.escenario()}, detalle ${this.detalle()}. Edades ${this.xMin()} a ${this.xMax()}.`;
  });

  readonly hoveredEvent = computed<LifeEvent | null>(() => {
    const age = this.hoveredAge();
    if (age === null || this.detalle() !== 'objetivo') return null;
    return this.events().find((e) => e.age === age) ?? null;
  });

  readonly aggregateForHover = computed<{ label: string; value: string } | null>(() => {
    const age = this.hoveredAge();
    if (age === null) return null;
    const mode = this.renderMode();

    if (mode === 'lines-comparada') {
      const a = this.actualSeries().find((p) => p.age === age);
      const s = this.simuladaSeries().find((p) => p.age === age);
      if (!a || !s) return null;
      const delta = s.value - a.value;
      const sign = delta >= 0 ? '+' : '';
      return { label: 'Diferencia', value: `${sign}${this.formatFull(delta)}` };
    }

    if (mode === 'stacked') {
      const d = this.chartData().find((x) => x.age === age);
      return d ? { label: 'Patrimonio neto', value: this.formatFull(d.value) } : null;
    }

    return null;
  });

  valueForSeries(key: string): string | null {
    const age = this.hoveredAge();
    if (age === null) return null;
    const mode = this.renderMode();

    if (mode === 'lines-comparada') {
      if (key === 'actual')
        return this.formatFull(this.actualSeries().find((p) => p.age === age)?.value ?? 0);
      if (key === 'simulada')
        return this.formatFull(this.simuladaSeries().find((p) => p.age === age)?.value ?? 0);
      return null;
    }

    if (mode === 'lines-todos') {
      const series = this.todosSeriesData().find((s) => s.key === key);
      const p = series?.points.find((x) => x.age === age);
      return p ? this.formatFull(p.value) : null;
    }

    if (mode === 'stacked') {
      const d = this.chartData().find((x) => x.age === age);
      if (!d) return null;
      const seg = this.stackedSegments(d).find((s) => s.key === key);
      return seg ? this.formatFull(seg.value) : null;
    }

    if (key === 'patrimonio' || key === 'data') {
      const d = this.chartData().find((x) => x.age === age);
      return d ? this.formatFull(d.value) : null;
    }
    return null;
  }

  barFillFor(d: EvolucionDataPoint): string {
    if (d.value < 0) return DEUDA_COLOR;
    if (d.age === this.hoveredAge()) return 'var(--color-afi-azul-500)';
    return PALETTES[this.palette()].barOnly;
  }

  barOpacityFor(d: { age: number }): number {
    const h = this.hoveredAge();
    if (h === null || h === d.age) return 1;
    return 0.35;
  }

  columnOpacity(age: number): number {
    const h = this.hoveredAge();
    if (h === null) return 1;
    return h === age ? 1 : 0.35;
  }
}

// ── Nice-number axis helpers ───────────────────────────────────────────────
function niceCeil(v: number): number {
  if (v === 0) return 0;
  const abs = Math.abs(v);
  const log = Math.floor(Math.log10(abs));
  const base = Math.pow(10, log);
  const norm = abs / base;
  let nice: number;
  if (norm <= 1) nice = 1;
  else if (norm <= 2) nice = 2;
  else if (norm <= 5) nice = 5;
  else nice = 10;
  return Math.sign(v || 1) * nice * base;
}

function niceFloor(v: number): number {
  if (v === 0) return 0;
  return -niceCeil(-v);
}
