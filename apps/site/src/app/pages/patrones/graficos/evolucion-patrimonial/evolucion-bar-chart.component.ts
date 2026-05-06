import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export type Vista = 'actual' | 'simulada' | 'comparada';
export type Escenario = 'medio' | 'optimista' | 'pesimista' | 'todos';
export type Detalle = 'agregada' | 'activo' | 'objetivo';

/** Palette variant — passed in from the proposal page (V1 = original,
 *  V2 = higher-contrast monocromático, V3 = brand accents). All three keep
 *  red as the deuda color so any value below zero is unmistakably a debt. */
export type ChartPalette = 'v1' | 'v2' | 'v3';
export type LegendPlacement = 'top' | 'bottom';

/** Universal deuda red — applied to any negative value regardless of asset
 *  class or palette. "Debt is debt" — the seniors' rule. */
const DEUDA_COLOR = '#C81E1E';

/** Asset class — used when Detalle = "Por tipo de activo" (stacked bars + toggleable legend). */
interface AssetClass {
  key: string;
  label: string;
  ratio: number;
}

/** Life event — used when Detalle = "Por tipo de objetivo". */
interface LifeEvent {
  age: number;
  label: string;
  iconKey: 'briefcase' | 'gift' | 'home';
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

/** Per-version palettes for the asset-class stack and the single-bar base.
 *  V1 = original azul navy ramp (low contrast, very calm).
 *  V2 = same hue family but spaced wider — bigger steps between adjacent
 *       activos so a gestor can tell them apart at a glance.
 *  V3 = brand-accented mix — keeps the navy spine and sprinkles afi-azul,
 *       afi-verde and warm amber on smaller classes for max distinguishability
 *       without abandoning the brand. */
const PALETTES: Record<ChartPalette, Record<string, string> & { base: string; barOnly: string }> = {
  v1: {
    inmobiliario: '#041F2C',
    inversiones: '#1A3A4E',
    pensiones: '#2D5472',
    privateEquity: '#456F92',
    participaciones: '#5E8AB0',
    liquidez: '#7FA5C4',
    otro: '#A6C2D9',
    base: 'var(--action-700)',
    barOnly: 'var(--action-700)',
  },
  v2: {
    inmobiliario: '#041F2C',
    inversiones: '#0E4F73',
    pensiones: '#1F7AA8',
    privateEquity: '#37BBF4',
    participaciones: '#7BD3F8',
    liquidez: '#B8E4FA',
    otro: '#DEF1FB',
    base: 'var(--action-700)',
    barOnly: 'var(--action-700)',
  },
  v3: {
    inmobiliario: '#041F2C',
    inversiones: '#0085CA',
    pensiones: '#13B26F',
    privateEquity: '#F5A623',
    participaciones: '#9C5BD6',
    liquidez: '#7FA5C4',
    otro: '#A6C2D9',
    base: 'var(--action-700)',
    barOnly: 'var(--action-700)',
  },
};

const LIFE_EVENTS: LifeEvent[] = [
  { age: 63, label: 'Retiro esperado', iconKey: 'briefcase' },
  { age: 65, label: 'Jubilación', iconKey: 'gift' },
  { age: 70, label: 'Emancipación hijo 1', iconKey: 'home' },
];

/** Financial objetivos — milestones pinned at specific (age, value) points on the chart.
 * Distinct from hitos vitales: hitos are *when*, objetivos are *how much to have by then*. */
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

/** Factors applied to the base trajectory when a specific scenario is selected. */
const ESCENARIO_FACTOR: Record<Escenario, number> = {
  medio: 1.0,
  optimista: 1.15,
  pesimista: 0.85,
  todos: 1.0,
};

/** Three scenario lines rendered in the "todos" mode. */
interface TodosSerie {
  key: string;
  label: string;
  color: string;
  factor: number;
  marker: 'circle' | 'square' | 'diamond';
}

const TODOS_SERIES: TodosSerie[] = [
  { key: 'pesimista', label: 'Pesimista', color: '#7FA5C4', factor: 0.85, marker: 'diamond' },
  { key: 'medio', label: 'Medio', color: '#041F2C', factor: 1.0, marker: 'square' },
  { key: 'optimista', label: 'Optimista', color: '#456F92', factor: 1.15, marker: 'circle' },
];

/**
 * Evolución patrimonial — chart body.
 *
 * Monochromatic Azul palette. Reactive to Vista + Escenario + Detalle.
 *
 * Render modes (picked from the three filters):
 *   - lines-comparada: 2 lines (Actual grey, Simulada Azul) with markers
 *   - lines-todos:     3 lines (Pesimista/Medio/Optimista), Azul ramp + shape markers
 *   - stacked:         stacked bars by asset class (Detalle=activo), interactive legend
 *   - single:          single bar per year; dips below zero in muted grey
 *
 * Hover affordances: ghost ceiling rect (Jira-style) on column hover.
 * Life-event markers pinned above bars when Detalle=objetivo.
 */
@Component({
  selector: 'afi-evolucion-bar-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
    .bar-transition {
      transition: opacity 180ms ease-out;
    }
    .bar-transition:hover {
      opacity: 0.82;
    }
    @media (prefers-reduced-motion: reduce) {
      .bar-transition {
        transition-duration: 0ms;
      }
    }
    /* Help-cursor chip tooltip — same visual as the planner top bar tt-pop. */
    .tt-pop {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 6px;
      max-width: 280px;
      padding: 6px 10px;
      font-size: 11px;
      line-height: 15px;
      color: #ffffff;
      background: #0f172a;
      border-radius: 4px;
      white-space: normal;
      text-align: left;
      pointer-events: none;
      opacity: 0;
      transition: opacity 120ms ease-out;
      z-index: 60;
      width: max-content;
    }
    .group\\/tt:hover .tt-pop,
    .group\\/tt:focus-within .tt-pop {
      opacity: 1;
    }

    /* Floating hover tooltip — mirrors the Figma "organism/tooltip/escenarios/base".
       Positioned inside the chart container, pointer-events: none so hovering it
       doesn't steal focus from the column beneath. */
    .chart-tooltip {
      position: absolute;
      top: 16px;
      z-index: 30;
      width: 280px;
      padding: 14px 16px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow:
        0 2px 6px 2px rgba(0, 0, 0, 0.09),
        0 1px 2px rgba(0, 0, 0, 0.22);
      pointer-events: none;
      font-size: 13px;
      line-height: 16px;
    }
    .chart-tooltip__title {
      font-size: 17px;
      line-height: 24px;
      font-weight: 600;
      color: #111418;
      margin-bottom: 12px;
    }
    .chart-tooltip__rows {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .tt-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      line-height: 18px;
      font-weight: 600;
      color: #111418;
    }
    .tt-row--muted {
      color: #5d6266;
    }
    .tt-row--indent {
      padding-left: 4px;
    }
    .tt-chev {
      width: 12px;
      height: 12px;
      flex-shrink: 0;
      color: currentColor;
    }
    .tt-label {
      flex: 1 1 auto;
      min-width: 0;
    }
    .tt-value {
      min-width: 80px;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .tt-footer {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 600;
      color: #111418;
      font-size: 13px;
    }
    .tt-footer > span:last-child {
      font-variant-numeric: tabular-nums;
      min-width: 80px;
      text-align: right;
    }
  `,
  template: `
    <div class="relative flex flex-col gap-space-3">
      <!-- Legend (shapes + labels) + inline hover summary on the right edge.
           Summary shows: age + optional event + aggregate (or Patrimonio neto). -->
      <div
        class="flex flex-wrap items-center gap-space-3 gap-y-space-1 min-h-[24px] text-body-sm"
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
                      class="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2"
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
                  <!-- Two-tier band chip mirroring the chart: wider outer + narrower inner -->
                  <span class="relative inline-block w-7 h-4 overflow-hidden rounded-sm">
                    <span
                      class="absolute inset-0"
                      [style.backgroundColor]="s.color"
                      style="opacity: 0.10;"
                    ></span>
                    <span
                      class="absolute inset-y-[3px] inset-x-0"
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
        <!-- Grid + Y-axis labels -->
        <g>
          @for (t of yTicks; track t) {
            <line
              [attr.x1]="padLeft"
              [attr.x2]="960 - padRight"
              [attr.y1]="yFor(t)"
              [attr.y2]="yFor(t)"
              stroke="var(--border-hairline)"
              stroke-dasharray="2,3"
            />
            <text
              [attr.x]="padLeft - 8"
              [attr.y]="yFor(t) + 4"
              text-anchor="end"
              style="font-size: 13px"
              fill="var(--color-neutral-500)"
            >
              {{ formatY(t) }}
            </text>
          }
        </g>

        <!-- Soft column highlight (lighter ghost ceiling) — works with the
             brightened hovered bar below as the primary affordance. -->
        @if (hoveredAge() !== null) {
          <rect
            [attr.x]="columnX(hoveredAge()!)"
            [attr.y]="padTop"
            [attr.width]="columnWidth"
            [attr.height]="chartHeight"
            fill="var(--color-neutral-100)"
            opacity="0.5"
            pointer-events="none"
          />
        }

        <!-- Life-event markers — global Ajustes setting: shown on ALL render modes
             (single / stacked / lines-comparada / lines-todos) when toggled on. -->
        @if (mostrarHitos()) {
          @for (e of events; track e.age) {
            <!-- Dashed guide down from the icon to the zero line -->
            <line
              [attr.x1]="columnX(e.age) + columnWidth / 2"
              [attr.x2]="columnX(e.age) + columnWidth / 2"
              [attr.y1]="padTop + 22"
              [attr.y2]="yFor(0)"
              stroke="var(--color-neutral-300)"
              stroke-dasharray="2,3"
              stroke-width="1"
              pointer-events="none"
            />

            <!-- Icon bubble (with hover tooltip via <title>) -->
            <g
              [attr.transform]="
                'translate(' + (columnX(e.age) + columnWidth / 2) + ', ' + (padTop + 11) + ')'
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
                }
              </g>
            </g>
          }
        }

        <!-- Financial objetivos — pinned at their (age, value) points on the chart.
             Distinct from hitos vitales: these are "target milestones" (fondo emergencia,
             vivienda, herencia) rather than life events (retiro, jubilación). -->
        @if (mostrarObjetivos()) {
          @for (o of objetivos; track o.age) {
            <!-- Soft connector from the marker to the x-axis baseline -->
            <line
              [attr.x1]="columnX(o.age) + columnWidth / 2"
              [attr.x2]="columnX(o.age) + columnWidth / 2"
              [attr.y1]="yFor(o.value) + 10"
              [attr.y2]="yFor(0)"
              stroke="var(--color-neutral-300)"
              stroke-dasharray="2,3"
              stroke-width="1"
              pointer-events="none"
            />

            <!-- Diamond marker + Lucide-style icon (neutral so it doesn't steal from the primary line) -->
            <g
              [attr.transform]="
                'translate(' + (columnX(o.age) + columnWidth / 2) + ', ' + yFor(o.value) + ')'
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
                fill="#ffffff"
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

        <!-- Column hover zones (invisible, full chart height) -->
        @for (age of xRange; track age) {
          <rect
            [attr.x]="columnX(age)"
            [attr.y]="padTop"
            [attr.width]="columnWidth"
            [attr.height]="chartHeight"
            fill="transparent"
            style="pointer-events: all;"
            (mouseenter)="hoveredAge.set(age)"
            (mouseleave)="hoveredAge.set(null)"
          />
        }

        <!-- ====== RENDER MODE ====== -->
        @switch (renderMode()) {
          <!-- ---- LINES: Comparada — Actual (dashed grey) + Simulada (solid Azul + 2-tier confidence band) ---- -->
          @case ('lines-comparada') {
            <!-- Outer band (±30%, "rango posible") -->
            <path
              [attr.d]="areaPathFor(comparadaBand().outerTop, comparadaBand().outerBottom)"
              fill="#37BBF4"
              fill-opacity="0.08"
              stroke="none"
              pointer-events="none"
            />
            <!-- Inner band (±15%, "rango probable") -->
            <path
              [attr.d]="areaPathFor(comparadaBand().innerTop, comparadaBand().innerBottom)"
              fill="#37BBF4"
              fill-opacity="0.18"
              stroke="none"
              pointer-events="none"
            />
            <!-- Actual line — muted, dashed, no markers so it reads as "reference" -->
            <path
              [attr.d]="pathFor(actualSeries())"
              stroke="var(--color-neutral-500)"
              stroke-width="1.5"
              stroke-dasharray="4,4"
              fill="none"
              pointer-events="none"
            />
            <!-- Simulada line — primary Azul, 2.5px -->
            <path
              [attr.d]="pathFor(simuladaSeries())"
              stroke="var(--action-700)"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
              pointer-events="none"
            />
            <!-- Endpoint rings (Simulada start + end) -->
            @if (simuladaSeries()[0]; as p0) {
              <circle
                [attr.cx]="columnX(p0.age) + columnWidth / 2"
                [attr.cy]="yFor(p0.value)"
                r="5"
                fill="#ffffff"
                stroke="var(--action-700)"
                stroke-width="2"
                pointer-events="none"
              />
            }
            @if (simuladaSeries()[simuladaSeries().length - 1]; as pN) {
              <circle
                [attr.cx]="columnX(pN.age) + columnWidth / 2"
                [attr.cy]="yFor(pN.value)"
                r="5"
                fill="#ffffff"
                stroke="var(--action-700)"
                stroke-width="2"
                pointer-events="none"
              />
              <!-- Endpoint value badge -->
              <g
                [attr.transform]="
                  'translate(' +
                  (columnX(pN.age) + columnWidth / 2) +
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
                  fill="#ffffff"
                  style="font-size: 12px; font-weight: 600;"
                >
                  {{ formatBadge(pN.value) }}
                </text>
              </g>
            }
          }

          <!-- ---- LINES: Todos escenarios — Medio (primary) + 2-tier confidence band ---- -->
          @case ('lines-todos') {
            <!-- Outer band (±30% around Medio, "rango posible") -->
            <path
              [attr.d]="areaPathFor(todosBand().outerTop, todosBand().outerBottom)"
              fill="#37BBF4"
              fill-opacity="0.08"
              stroke="none"
              pointer-events="none"
            />
            <!-- Inner band (Pesimista / Optimista, "rango probable") -->
            <path
              [attr.d]="areaPathFor(todosBand().innerTop, todosBand().innerBottom)"
              fill="#37BBF4"
              fill-opacity="0.18"
              stroke="none"
              pointer-events="none"
            />
            <!-- Medio — primary Azul solid line -->
            <path
              [attr.d]="pathFor(todosBand().medio)"
              stroke="var(--action-700)"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
              pointer-events="none"
            />
            <!-- Endpoint rings on Medio -->
            @if (todosBand().medio[0]; as p0) {
              <circle
                [attr.cx]="columnX(p0.age) + columnWidth / 2"
                [attr.cy]="yFor(p0.value)"
                r="5"
                fill="#ffffff"
                stroke="var(--action-700)"
                stroke-width="2"
                pointer-events="none"
              />
            }
            @if (todosBand().medio[todosBand().medio.length - 1]; as pN) {
              <circle
                [attr.cx]="columnX(pN.age) + columnWidth / 2"
                [attr.cy]="yFor(pN.value)"
                r="5"
                fill="#ffffff"
                stroke="var(--action-700)"
                stroke-width="2"
                pointer-events="none"
              />
              <g
                [attr.transform]="
                  'translate(' +
                  (columnX(pN.age) + columnWidth / 2) +
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
                  fill="#ffffff"
                  style="font-size: 12px; font-weight: 600;"
                >
                  {{ formatBadge(pN.value) }}
                </text>
              </g>
            }
          }

          <!-- ---- STACKED BARS: Detalle = Tipo de activo ---- -->
          @case ('stacked') {
            @for (d of chartData(); track d.age) {
              <g [attr.opacity]="columnOpacity(d.age)" class="bar-transition" pointer-events="none">
                @for (seg of stackedSegments(d); track seg.key) {
                  <rect
                    [attr.x]="columnX(d.age) + (columnWidth - barWidth) / 2"
                    [attr.y]="seg.y"
                    [attr.width]="barWidth"
                    [attr.height]="seg.h"
                    [attr.fill]="seg.color"
                  >
                    <title>{{ seg.label }} · {{ d.age }} años · {{ formatFull(seg.value) }}</title>
                  </rect>
                }
              </g>
            }
          }

          <!-- ---- SINGLE BARS: Agregada / Objetivo, supports negative.
                 Hovered bar brightens to AFI Azul 500 (#0085CA) — brand color
                 lights up on interaction against the dark navy base. -->
          @default {
            @for (d of chartData(); track d.age) {
              <rect
                class="bar-transition"
                [attr.x]="columnX(d.age) + (columnWidth - barWidth) / 2"
                [attr.y]="barY(d.value)"
                [attr.width]="barWidth"
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

        <!-- Zero baseline (drawn last so it sits over bars/lines at y=0) -->
        <line
          [attr.x1]="padLeft"
          [attr.x2]="960 - padRight"
          [attr.y1]="yFor(0)"
          [attr.y2]="yFor(0)"
          stroke="var(--color-neutral-400)"
          stroke-width="1"
          pointer-events="none"
        />

        <!-- X-axis age labels every 5 years -->
        <g>
          @for (age of xTicks; track age) {
            <text
              [attr.x]="columnX(age) + columnWidth / 2"
              [attr.y]="320 - 8"
              text-anchor="middle"
              style="font-size: 13px"
              fill="var(--color-neutral-500)"
            >
              {{ age }}
            </text>
          }
        </g>
      </svg>

      <!-- Floating hover tooltip — Figma-style white card -->
      @if (tooltipData(); as tt) {
        @if (tooltipAnchor(); as anchor) {
          <div
            class="chart-tooltip"
            [style.left]="
              anchor.anchorRight
                ? 'calc(' + anchor.pct + '% - 16px)'
                : 'calc(' + anchor.pct + '% + 16px)'
            "
            [style.transform]="anchor.anchorRight ? 'translateX(-100%)' : 'none'"
            role="tooltip"
            aria-live="polite"
          >
            <p class="chart-tooltip__title">{{ tt.age }} años de edad</p>
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
  /** Toggle via Ajustes. When false, life-event icons hide even in Detalle=objetivo. */
  readonly mostrarHitos = input<boolean>(true);
  /** Toggle via Ajustes. When false, Inmobiliario category is excluded from stacked bars. */
  readonly incluirInmobiliario = input<boolean>(true);
  /** Toggle via Ajustes. When true, financial objetivos are pinned at their (age, value) points. */
  readonly mostrarObjetivos = input<boolean>(false);
  readonly palette = input<ChartPalette>('v1');
  readonly legendPlacement = input<LegendPlacement>('top');

  readonly hoveredAge = signal<number | null>(null);
  readonly hiddenSeries = signal<Set<string>>(new Set());

  /** Compact summary shown inline at the end of the legend row on hover.
   * Uses aggregateForHover when defined (stacked / comparada), otherwise
   * falls back to Patrimonio neto (single) or Medio (todos). */
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
    // single
    const d = this.chartData().find((x) => x.age === age);
    return d ? { label: 'Patrimonio neto', value: this.formatFull(d.value) } : null;
  });

  /** Floating tooltip rows for the hovered column — shape matches the Figma design.
   * Varies by renderMode: stacked shows asset breakdown with parent row, line modes
   * show the series values, single mode collapses to a Patrimonio neto footer. */
  readonly tooltipData = computed<{
    age: number;
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
      if (d) total = { label: 'Patrimonio neto', value: this.formatFull(d.value) };
    }

    return { age, rows, total };
  });

  /** Anchor info for positioning the floating tooltip next to the hovered column. */
  readonly tooltipAnchor = computed<{ pct: number; anchorRight: boolean } | null>(() => {
    const age = this.hoveredAge();
    if (age === null) return null;
    const xCenter = this.columnX(age) + this.columnWidth / 2;
    const pct = (xCenter / this.width) * 100;
    return { pct, anchorRight: pct > 55 };
  });

  // Geometry
  readonly padLeft = 70;
  readonly padRight = 20;
  readonly padTop = 24;
  readonly padBottom = 32;
  readonly width = 960;
  readonly height = 320;
  readonly chartWidth = this.width - this.padLeft - this.padRight;
  readonly chartHeight = this.height - this.padTop - this.padBottom;
  readonly columnWidth = this.chartWidth / 36;
  readonly barWidth = this.columnWidth * 0.7;

  // Y domain supports negatives — Actual dips below zero near age 90
  readonly yMin = -500_000;
  readonly yMax = 1_800_000;
  readonly yTicks = [-500_000, 0, 500_000, 1_000_000, 1_500_000];
  readonly xTicks = [55, 60, 65, 70, 75, 80, 85, 90];
  readonly xRange = Array.from({ length: 36 }, (_, i) => 55 + i);
  readonly events = LIFE_EVENTS;
  readonly objetivos = OBJETIVOS;

  // --- Scales ---
  yFor(value: number): number {
    const clamped = Math.max(this.yMin, Math.min(this.yMax, value));
    const t = (clamped - this.yMin) / (this.yMax - this.yMin);
    return this.padTop + (1 - t) * this.chartHeight;
  }
  columnX(age: number): number {
    return this.padLeft + (age - 55) * this.columnWidth;
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
    if (abs >= 1_000_000)
      return `${sign}${(abs / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)}M €`;
    if (abs >= 1_000) return `${sign}${abs / 1_000}K €`;
    return `${v} €`;
  }
  formatFull(v: number): string {
    return Math.round(v).toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });
  }

  // --- Base data (Luis, Santander middle-manager) ---
  private actualValue(age: number): number {
    // Ramp 780k → 1.28M by age 63, then decline to -50k by age 90 (goes negative near the end)
    if (age <= 63) {
      const t = (age - 55) / 8;
      return Math.round(780_000 + t * (1_280_000 - 780_000));
    }
    const t = (age - 63) / 27;
    return Math.round(1_280_000 + t * (-50_000 - 1_280_000));
  }
  private simuladaValue(age: number): number {
    // Ramp 780k → 1.4M by age 64, then decline to 120k by age 90 (stays positive)
    if (age <= 64) {
      const t = (age - 55) / 9;
      return Math.round(780_000 + t * (1_400_000 - 780_000));
    }
    const t = (age - 64) / 26;
    return Math.round(1_400_000 + t * (120_000 - 1_400_000));
  }

  // --- Render mode ---
  readonly renderMode = computed<'lines-comparada' | 'lines-todos' | 'stacked' | 'single'>(() => {
    if (this.vista() === 'comparada') return 'lines-comparada';
    if (this.escenario() === 'todos') return 'lines-todos';
    if (this.detalle() === 'activo') return 'stacked';
    return 'single';
  });

  // --- Chart data ---
  readonly chartData = computed(() => {
    const f = ESCENARIO_FACTOR[this.escenario()];
    const useSim = this.vista() === 'simulada';
    const out = [] as { age: number; value: number }[];
    for (let age = 55; age <= 90; age++) {
      const base = useSim ? this.simuladaValue(age) : this.actualValue(age);
      out.push({ age, value: base * f });
    }
    return out;
  });

  /** Points for the Actual line in Comparada. Not scaled by escenario (factor fixed at 1). */
  readonly actualSeries = computed(() => {
    const out = [] as { age: number; value: number }[];
    for (let age = 55; age <= 90; age++) out.push({ age, value: this.actualValue(age) });
    return out;
  });

  /** Points for the Simulada line in Comparada. */
  readonly simuladaSeries = computed(() => {
    const out = [] as { age: number; value: number }[];
    for (let age = 55; age <= 90; age++) out.push({ age, value: this.simuladaValue(age) });
    return out;
  });

  /** Three scenario series for Todos mode — all based on currently-selected Vista's base trajectory, scaled. */
  readonly todosSeriesData = computed(() => {
    const useSim = this.vista() === 'simulada';
    return TODOS_SERIES.map((s) => ({
      ...s,
      points: Array.from({ length: 36 }, (_, i) => {
        const age = 55 + i;
        const base = useSim ? this.simuladaValue(age) : this.actualValue(age);
        return { age, value: base * s.factor };
      }),
    }));
  });

  /** SVG path string from a series of (age, value) points. */
  pathFor(points: { age: number; value: number }[]): string {
    if (!points.length) return '';
    return points
      .map((p, i) => {
        const x = this.columnX(p.age) + this.columnWidth / 2;
        const y = this.yFor(p.value);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  /** Closed-area path between two (same-length, same-age) series — top goes left→right,
   * bottom goes right→left, then close. Used for the confidence band in the line variants. */
  areaPathFor(
    top: { age: number; value: number }[],
    bottom: { age: number; value: number }[],
  ): string {
    if (!top.length || !bottom.length) return '';
    const xy = (p: { age: number; value: number }) => {
      const x = this.columnX(p.age) + this.columnWidth / 2;
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

  /** Short-form euro label for endpoint badges: "€ 2.34M" / "€ 245K" / "€ 850". */
  formatBadge(v: number): string {
    const abs = Math.abs(v);
    const sign = v < 0 ? '-' : '';
    if (abs >= 1_000_000) return `${sign}€ ${(abs / 1_000_000).toFixed(2).replace('.', ',')}M`;
    if (abs >= 1_000) return `${sign}€ ${Math.round(abs / 1_000)}K`;
    return `${sign}€ ${Math.round(abs)}`;
  }

  /** Two-tier confidence band for the Comparada view — inner ±15% (likely),
   * outer ±30% (possible). Both centered on the Simulada projection. */
  readonly comparadaBand = computed(() => {
    const center = this.simuladaSeries();
    return {
      innerTop: center.map((p) => ({ age: p.age, value: p.value * 1.15 })),
      innerBottom: center.map((p) => ({ age: p.age, value: p.value * 0.85 })),
      outerTop: center.map((p) => ({ age: p.age, value: p.value * 1.3 })),
      outerBottom: center.map((p) => ({ age: p.age, value: p.value * 0.7 })),
    };
  });

  /** Two-tier confidence band for the Todos view — inner = Optimista/Pesimista,
   * outer = ±30% around Medio. Medio drawn as the primary line. */
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

  // --- Stacked segments (Detalle = Tipo de activo) ---
  // Negative totals (deuda) collapse to a single red segment — debt is debt
  // regardless of asset class, and seeing it monochromatic red makes it
  // unmistakable against the colored stack above the zero line.
  stackedSegments(d: {
    age: number;
    value: number;
  }): { key: string; label: string; color: string; value: number; y: number; h: number }[] {
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
    for (const a of visible) {
      const segValue = d.value * (a.ratio / totalRatio);
      const yBottom = this.yFor(running);
      const yTop = this.yFor(running + segValue);
      out.push({
        key: a.key,
        label: a.label,
        color: palette[a.key] ?? palette.base,
        value: segValue,
        y: Math.min(yTop, yBottom),
        h: Math.abs(yBottom - yTop),
      });
      running += segValue;
    }
    return out;
  }

  // --- Legend series ---
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
          color: '#37BBF4',
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
          color: '#37BBF4',
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
    return `Evolución patrimonial — vista ${this.vista()}, escenario ${this.escenario()}, detalle ${this.detalle()}. Edades 55 a 90.`;
  });

  // --- Hover helpers (legend rows show their values inline on hover) ---

  /** Life event at the currently-hovered age, when Detalle = objetivo. */
  readonly hoveredEvent = computed<LifeEvent | null>(() => {
    const age = this.hoveredAge();
    if (age === null || this.detalle() !== 'objetivo') return null;
    return LIFE_EVENTS.find((e) => e.age === age) ?? null;
  });

  /**
   * Extra aggregate row shown on hover when the sum of legend values doesn't
   * already tell the full story: Diferencia in Comparada, Patrimonio neto in
   * stacked mode (sum of the visible asset classes). No aggregate for single
   * or Todos modes.
   */
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

  /** Current value for a legend series key at the hovered age, or null when no hover / no match. */
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

    // single mode — only one series (the "patrimonio" entry)
    if (key === 'patrimonio') {
      const d = this.chartData().find((x) => x.age === age);
      return d ? this.formatFull(d.value) : null;
    }
    return null;
  }

  /** Fill for a single bar. Base colors only — dimming of non-hovered bars
   * is done with opacity (see barOpacityFor) so the effect stays soft, matching
   * the Tipo de activo stacked mode. Negative values always render red — debt
   * is debt, regardless of palette or hover state. */
  barFillFor(d: { age: number; value: number }): string {
    if (d.value < 0) return DEUDA_COLOR;
    if (d.age === this.hoveredAge()) return 'var(--color-afi-azul-500)';
    return PALETTES[this.palette()].barOnly;
  }

  /** Opacity for a single bar. Full on hover / at rest, dimmed (0.35) when
   * another column is hovered — same treatment as stacked columns. */
  barOpacityFor(d: { age: number }): number {
    const h = this.hoveredAge();
    if (h === null || h === d.age) return 1;
    return 0.35;
  }

  /** Opacity for a column's group in stacked mode — dims siblings when something is hovered. */
  columnOpacity(age: number): number {
    const h = this.hoveredAge();
    if (h === null) return 1;
    return h === age ? 1 : 0.35;
  }
}
