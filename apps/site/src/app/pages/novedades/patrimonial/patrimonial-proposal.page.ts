import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  afterNextRender,
  computed,
  signal,
  viewChild,
  viewChildren,
  type WritableSignal,
} from '@angular/core';

import {
  ButtonComponent,
  InputComponent,
  KbdComponent,
  PageHeaderComponent,
  SelectComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { GraphCardHeaderComponent } from '../../patrones/graficos/evolucion-patrimonial/graph-card-header.component';
import { ActionToastComponent } from '../shared/action-toast.component';
import { bridgeDesignReviewVersion } from '../shared/design-review-bridge';
import { PlannerSidebarComponent } from '../shared/planner-sidebar.component';
import { PlannerTopBarComponent } from '../shared/planner-top-bar.component';
import { VersionToggleComponent, type VersionOption } from '../shared/version-toggle.component';

type LayoutVersion = 'v1' | 'v2' | 'v3';

type AssetColumn = {
  key: string;
  label: string;
  align?: 'end';
  emphasis?: boolean;
  width: string;
};

type AssetRow = {
  id?: string;
  name: string;
  nameTags?: string[];
  subtitle?: string | null;
  entidad: string;
  valorNum: number;
  cells: Record<string, string>;
  children?: AssetRow[];
};

type AssetSection = {
  key: string;
  title: string;
  total: string;
  description: string;
  columns: AssetColumn[];
  rows: AssetRow[];
};

type AddedAsset = {
  sectionKey: string;
  row: AssetRow;
};

/**
 * Propuesta — Patrimonio.
 *
 * Página de listado: navegación completa, cabecera con acciones y métricas,
 * pestañas por clase de activo y tablas desglosadas.
 *
 * Figma reference: node `298:74807`.
 */
@Component({
  selector: 'site-patrimonial-proposal-page',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    KbdComponent,
    PageHeaderComponent,
    SelectComponent,
    GraphCardHeaderComponent,
    ActionToastComponent,
    PlannerSidebarComponent,
    PlannerTopBarComponent,
    VersionToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .tabs-scroll::-webkit-scrollbar {
      display: none;
    }
    .tabs-scroll {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    /* === Coherence brand tab transition ===
       Reusable pattern for any tab strip: a single .tab-indicator slides beneath
       the active trigger (measured via viewChildren), and each .tab-panel plays
       a soft fade+lift on enter. Pair with an @for track key that includes the
       active value so panels re-mount when the user switches. */
    .tab-indicator {
      position: absolute;
      bottom: -1px; /* sits on the bottom border of the tab strip */
      height: 2px;
      background: var(--color-action, #37bbf4);
      border-radius: 2px 2px 0 0;
      pointer-events: none;
      transition:
        left 260ms cubic-bezier(0.4, 0, 0.2, 1),
        width 260ms cubic-bezier(0.4, 0, 0.2, 1),
        opacity 180ms ease-out;
    }
    /* Panel enters by sliding horizontally — direction follows the tab movement:
       forward (left → right through the tab list) slides in from the right,
       backward slides in from the left. Matches animate-ui's glide feel. */
    @keyframes tabPanelEnterForward {
      from {
        opacity: 0;
        transform: translateX(28px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes tabPanelEnterBackward {
      from {
        opacity: 0;
        transform: translateX(-28px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    .tab-panel {
      animation: tabPanelEnterForward 300ms cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform, opacity;
    }
    .tab-panel.tab-panel--backward {
      animation-name: tabPanelEnterBackward;
    }
    @media (prefers-reduced-motion: reduce) {
      .tab-indicator {
        transition: none;
      }
      .tab-panel {
        animation: none;
      }
    }

    /* Tooltip pattern shared with planner-top-bar + chart legend. */
    .tt-pop {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 6px;
      padding: 4px 8px;
      font-size: 11px;
      line-height: 16px;
      color: #ffffff;
      background: #0f172a;
      border-radius: 4px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 120ms ease-out;
      z-index: 60;
    }
    .group\\/tt:hover .tt-pop,
    .group\\/tt:focus-within .tt-pop {
      opacity: 1;
    }

    @keyframes newAssetEnter {
      0% {
        opacity: 0;
        transform: translateY(-8px);
        background: var(--action-100);
        box-shadow: inset 2px 0 0 var(--action-700);
      }
      45% {
        opacity: 1;
        transform: translateY(0);
        background: var(--action-50);
        box-shadow: inset 2px 0 0 var(--action-700);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
        background: transparent;
        box-shadow: inset 2px 0 0 transparent;
      }
    }
    .new-asset-row {
      animation: newAssetEnter 1400ms cubic-bezier(0.2, 0.8, 0.2, 1);
      will-change: transform, opacity, background;
    }
    @media (prefers-reduced-motion: reduce) {
      .new-asset-row {
        animation-duration: 80ms;
        transform: none;
      }
    }
  `,
  template: `
    <div class="h-screen flex bg-canvas-base overflow-hidden">
      <site-planner-sidebar activeKey="patrimonio" />

      <!-- Main column: top bar + content -->
      <div class="flex-1 flex flex-col min-w-0">
        <site-planner-top-bar
          decisionesRoute="/novedades/patrimonial-decisiones"
          clientName="Ricard Vazquez Fajardo"
        />

        <main class="flex-1 min-w-0 overflow-y-auto">
          <div class="max-w-[1180px] mx-auto py-space-8">
            <!-- Page header — Patrimonio. Versión toggle pinned to the top-right
                 lets seniors compare layout variants across reviews; V1 is the
                 current implementation, V2/V3 are stubs ready for future
                 explorations (e.g. grouped vs. flat list, sticky totals row). -->
            <div class="relative">
              <afi-page-header
                title="Patrimonio"
                subtitle="Gestiona y visualiza todos tus activos y pasivos. Aquí puedes agregar, modificar y analizar tus inversiones, inmuebles, cuentas bancarias y más, para tener una visión completa de tu patrimonio financiero."
                [sticky]="false"
                [scrollFade]="false"
              >
                <span slot="breadcrumb" class="uppercase tracking-wider text-action-700"
                  >SITUACIÓN ACTUAL</span
                >
              </afi-page-header>
              <div class="absolute top-0 right-space-8">
                <site-version-toggle
                  [versions]="versions"
                  [value]="version()"
                  ariaLabel="Versión del layout de Patrimonio"
                  (valueChange)="setVersion($event)"
                />
              </div>
            </div>

            <!-- Data cards — whole-patrimonio summary, unaffected by filters. Sits above the
                 filter strip so the stable "identity" context is always visible up top. -->
            <div class="mx-space-8 mt-space-6 grid grid-cols-3 gap-space-6">
              <div>
                <p class="text-body-sm text-neutral-500 mb-space-1">Patrimonio neto</p>
                <p class="text-section text-canvas-fg">1.240.000 €</p>
                <p class="text-body-sm text-neutral-500 mt-space-1">Activos menos deudas</p>
              </div>
              <div>
                <p class="text-body-sm text-neutral-500 mb-space-1">Liquidez disponible</p>
                <p class="text-section text-canvas-fg">65.200 €</p>
                <p class="text-body-sm text-neutral-500 mt-space-1">Disponible a corto plazo</p>
              </div>
              <div>
                <p class="text-body-sm text-neutral-500 mb-space-1">Patrimonio invertido</p>
                <p class="text-section text-canvas-fg">539.600 €</p>
                <p class="text-body-sm text-neutral-500 mt-space-1">
                  Inversión, pensiones y private equity
                </p>
              </div>
            </div>

            <!-- Tabs — macro view switch (which section). Hairline above separates the
                 session-level summary (data cards) from the filterable area below. -->
            <div class="mx-space-8 mt-space-6 pt-space-5 border-t border-border-hairline relative">
              <div
                #tabsScroll
                (scroll)="onTabsScroll($event)"
                class="tabs-scroll relative flex items-end gap-space-5 border-b border-border-hairline overflow-x-auto"
              >
                @for (t of tabs(); track t.key) {
                  <button
                    #tabBtn
                    type="button"
                    (click)="setActiveTab(t.key)"
                    class="inline-flex items-center gap-space-2 pb-space-2 text-body-sm whitespace-nowrap transition-colors"
                    [class.text-action]="activeTab() === t.key"
                    [class.font-medium]="activeTab() === t.key"
                    [class.text-neutral-500]="activeTab() !== t.key"
                    [class.hover:text-canvas-fg]="activeTab() !== t.key"
                  >
                    <span>{{ t.label }}</span>
                    <span
                      class="inline-flex items-center justify-center px-1.5 min-w-[22px] h-5 rounded-full border border-border-hairline text-caption text-neutral-500"
                      >{{ t.count }}</span
                    >
                  </button>
                }
                <!-- Sliding indicator — bottom edge, animated via CSS transition -->
                <span
                  class="tab-indicator"
                  [style.left]="indicatorStyle()['left']"
                  [style.width]="indicatorStyle()['width']"
                  [style.opacity]="indicatorStyle()['opacity']"
                  aria-hidden="true"
                ></span>
              </div>
              <!-- Left-edge chevron: only shows once the user has scrolled past the start. -->
              @if (canScrollLeft()) {
                <div
                  class="absolute left-0 bottom-0 top-[20px] flex items-center pointer-events-none pr-space-6"
                  style="background: linear-gradient(to left, rgba(255,255,255,0), var(--canvas-base) 60%);"
                >
                  <button
                    type="button"
                    (click)="scrollTabs(-1)"
                    class="pointer-events-auto inline-flex items-center justify-center w-6 h-6 rounded text-neutral-500 hover:text-canvas-fg hover:bg-surface-muted"
                    aria-label="Pestañas anteriores"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fill-rule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              }
              <!-- Right-edge chevron: hides once the user has scrolled to the end. -->
              @if (canScrollRight()) {
                <div
                  class="absolute right-0 bottom-0 top-[20px] flex items-center pointer-events-none pl-space-6"
                  style="background: linear-gradient(to right, rgba(255,255,255,0), var(--canvas-base) 60%);"
                >
                  <button
                    type="button"
                    (click)="scrollTabs(1)"
                    class="pointer-events-auto inline-flex items-center justify-center w-6 h-6 rounded text-neutral-500 hover:text-canvas-fg hover:bg-surface-muted"
                    aria-label="Más pestañas"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fill-rule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              }
            </div>

            <!-- Filter strip — narrows the current tab's view. Sits just above the tables
                 (below the tabs) because filters are within-view refinements. -->
            <div class="mx-space-8 mt-space-4 flex items-center gap-space-4 min-w-0">
              <!-- Zone 1: search + live suggestions -->
              <div class="relative w-[260px] shrink-0">
                <svg
                  class="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clip-rule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar en patrimonio..."
                  [value]="searchQuery()"
                  (input)="onSearchInput($event)"
                  (focus)="onSearchFocus()"
                  (blur)="onSearchBlur()"
                  role="combobox"
                  aria-autocomplete="list"
                  [attr.aria-expanded]="searchFocused() && searchSuggestions().length > 0"
                  aria-controls="patrimonio-search-suggestions"
                  class="h-8 w-full pl-8 pr-3 text-body-sm rounded-md border border-border-hairline bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  aria-label="Buscar en patrimonio"
                />
                @if (searchQuery()) {
                  <button
                    type="button"
                    (mousedown)="$event.preventDefault()"
                    (click)="searchQuery.set('')"
                    class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 rounded hover:bg-surface-100 text-neutral-500"
                    aria-label="Limpiar búsqueda"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.75"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                }

                <!-- Live autocomplete — shown while focused with a non-empty query -->
                @if (searchFocused() && searchSuggestions().length > 0) {
                  <div
                    id="patrimonio-search-suggestions"
                    role="listbox"
                    class="absolute left-0 right-0 top-full mt-1 z-50 max-h-[320px] overflow-y-auto p-space-1 bg-surface-elevated border border-border-hairline rounded-md shadow-lg"
                  >
                    @for (sug of searchSuggestions(); track sug.name) {
                      <button
                        type="button"
                        role="option"
                        (mousedown)="$event.preventDefault()"
                        (click)="pickSuggestion(sug.name)"
                        class="w-full flex items-center gap-space-3 text-left px-space-2 py-space-2 rounded hover:bg-surface-muted text-body-sm"
                      >
                        <svg
                          class="w-4 h-4 text-neutral-400 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.75"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.3-4.3" />
                        </svg>
                        <span class="flex-1 min-w-0 flex flex-col leading-tight">
                          <span class="text-canvas-fg font-medium truncate">{{ sug.name }}</span>
                          <span class="text-caption text-neutral-500 truncate"
                            >{{ sug.section }} · {{ sug.entidad }}</span
                          >
                        </span>
                        <span class="text-caption text-neutral-600 tabular-nums shrink-0">{{
                          sug.valor
                        }}</span>
                      </button>
                    }
                  </div>
                }
                @if (searchFocused() && searchQuery() && searchSuggestions().length === 0) {
                  <div
                    class="absolute left-0 right-0 top-full mt-1 z-50 px-space-3 py-space-3 bg-surface-elevated border border-border-hairline rounded-md shadow-lg text-body-sm text-neutral-500"
                  >
                    Sin coincidencias en tu patrimonio.
                  </div>
                }
              </div>

              <!-- Zone 2: filter chips (Entidad / Min / Max).
                   No overflow — chip values are compactified (100M €) so a single line fits.
                   Overflow-x:auto clipped the dropdowns (any overflow on an ancestor clips
                   absolute-positioned children on BOTH axes per CSS spec). -->
              <div class="flex items-center gap-space-2 flex-wrap">
                <!-- Entidad multiselect -->
                <div class="relative shrink-0">
                  <div
                    class="inline-flex items-center h-8 border rounded-full text-body-sm transition-colors"
                    [class.border-border-hairline]="selectedEntidades().size === 0"
                    [class.border-action-700]="selectedEntidades().size > 0"
                    [class.bg-surface]="selectedEntidades().size === 0"
                    [class.bg-action-700/5]="selectedEntidades().size > 0"
                  >
                    @if (selectedEntidades().size > 0) {
                      <button
                        type="button"
                        (click)="clearEntidades(); $event.stopPropagation()"
                        class="inline-flex items-center justify-center h-full pl-space-2 pr-1 text-neutral-500 hover:text-canvas-fg transition-colors rounded-l-full"
                        aria-label="Quitar filtro de entidad"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="m15 9-6 6" />
                          <path d="m9 9 6 6" />
                        </svg>
                      </button>
                    }
                    <button
                      type="button"
                      (click)="entidadMenuOpen.set(!entidadMenuOpen())"
                      class="inline-flex items-center gap-space-2 h-full pr-space-2"
                      [class.pl-space-3]="selectedEntidades().size === 0"
                      [class.pl-space-2]="selectedEntidades().size > 0"
                      aria-haspopup="menu"
                      [attr.aria-expanded]="entidadMenuOpen()"
                    >
                      <span class="text-canvas-fg font-medium">Entidad</span>
                      @if (selectedEntidades().size > 0) {
                        <span class="w-px h-4 bg-neutral-300" aria-hidden="true"></span>
                        <span class="font-medium text-action-700">{{ entidadChipLabel() }}</span>
                      }
                      <svg
                        class="w-3 h-3 text-neutral-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  @if (entidadMenuOpen()) {
                    <div
                      class="fixed inset-0 z-40"
                      (click)="entidadMenuOpen.set(false)"
                      aria-hidden="true"
                    ></div>
                    <div
                      role="menu"
                      aria-label="Filtrar por entidad"
                      class="absolute left-0 top-full mt-1 z-50 min-w-[220px] p-space-2 bg-surface-elevated border border-border-hairline rounded-md shadow-lg"
                    >
                      <!-- Todos — select all / clear all -->
                      <button
                        type="button"
                        role="menuitemcheckbox"
                        [attr.aria-checked]="isAllEntidadesSelected()"
                        (click)="toggleAllEntidades()"
                        class="w-full flex items-center gap-space-2 text-left px-space-2 py-space-2 rounded hover:bg-surface-muted text-body-sm text-canvas-fg"
                      >
                        <span
                          class="inline-flex items-center justify-center w-4 h-4 rounded border"
                          [class.border-border-hairline]="!isAllEntidadesSelected()"
                          [class.bg-action-700]="isAllEntidadesSelected()"
                          [class.border-action-700]="isAllEntidadesSelected()"
                        >
                          @if (isAllEntidadesSelected()) {
                            <svg
                              class="w-3 h-3 text-white"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              aria-hidden="true"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          }
                        </span>
                        <span class="flex-1 font-medium">Todos</span>
                      </button>
                      <div class="h-px bg-border-hairline my-space-1 -mx-space-2"></div>
                      @for (e of availableEntidades(); track e) {
                        <button
                          type="button"
                          role="menuitemcheckbox"
                          [attr.aria-checked]="isEntidadSelected(e)"
                          (click)="toggleEntidad(e)"
                          class="w-full flex items-center gap-space-2 text-left px-space-2 py-space-2 rounded hover:bg-surface-muted text-body-sm text-canvas-fg"
                        >
                          <span
                            class="inline-flex items-center justify-center w-4 h-4 rounded border"
                            [class.border-border-hairline]="!isEntidadSelected(e)"
                            [class.bg-action-700]="isEntidadSelected(e)"
                            [class.border-action-700]="isEntidadSelected(e)"
                          >
                            @if (isEntidadSelected(e)) {
                              <svg
                                class="w-3 h-3 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            }
                          </span>
                          <span class="flex-1">{{ e }}</span>
                        </button>
                      }
                    </div>
                  }
                </div>

                <!-- Min € -->
                <div class="relative shrink-0">
                  <div
                    class="inline-flex items-center h-8 border rounded-full text-body-sm transition-colors"
                    [class.border-border-hairline]="filterMin() === null"
                    [class.border-action-700]="filterMin() !== null"
                    [class.bg-surface]="filterMin() === null"
                    [class.bg-action-700/5]="filterMin() !== null"
                  >
                    @if (filterMin() !== null) {
                      <button
                        type="button"
                        (click)="clearMin(); $event.stopPropagation()"
                        class="inline-flex items-center justify-center h-full pl-space-2 pr-1 text-neutral-500 hover:text-canvas-fg transition-colors rounded-l-full"
                        aria-label="Quitar filtro mínimo"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="m15 9-6 6" />
                          <path d="m9 9 6 6" />
                        </svg>
                      </button>
                    }
                    <button
                      type="button"
                      (click)="minMenuOpen.set(!minMenuOpen())"
                      class="inline-flex items-center gap-space-2 h-full pr-space-2"
                      [class.pl-space-3]="filterMin() === null"
                      [class.pl-space-2]="filterMin() !== null"
                      aria-haspopup="dialog"
                      [attr.aria-expanded]="minMenuOpen()"
                    >
                      <span class="text-canvas-fg font-medium">Min</span>
                      @if (minChipLabel(); as lbl) {
                        <span class="w-px h-4 bg-neutral-300" aria-hidden="true"></span>
                        <span class="font-medium tabular-nums text-action-700">{{ lbl }}</span>
                      } @else {
                        <span class="text-neutral-400">€</span>
                      }
                      <svg
                        class="w-3 h-3 text-neutral-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  @if (minMenuOpen()) {
                    <div
                      class="fixed inset-0 z-40"
                      (click)="minMenuOpen.set(false)"
                      aria-hidden="true"
                    ></div>
                    <div
                      role="dialog"
                      aria-label="Valor mínimo"
                      class="absolute left-0 top-full mt-1 z-50 w-[240px] p-space-3 bg-surface-elevated border border-border-hairline rounded-md shadow-lg"
                    >
                      <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-2">
                        Valor mínimo
                      </p>
                      <div class="relative">
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          placeholder="0"
                          inputmode="numeric"
                          [value]="filterMin() ?? ''"
                          (input)="onMinInput($event)"
                          (keydown.enter)="minMenuOpen.set(false)"
                          class="h-9 w-full pl-3 pr-8 text-body-sm tabular-nums rounded-md border border-border-hairline bg-canvas-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                          aria-label="Valor mínimo en euros"
                        />
                        <span
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-body-sm text-neutral-500 pointer-events-none"
                          >€</span
                        >
                      </div>
                      <div class="mt-space-3 flex items-center justify-between">
                        <button
                          type="button"
                          (click)="clearMin()"
                          class="text-body-sm text-neutral-500 hover:text-canvas-fg"
                          [class.invisible]="filterMin() === null"
                        >
                          Limpiar
                        </button>
                        <button
                          type="button"
                          (click)="minMenuOpen.set(false)"
                          class="text-body-sm text-action-700 font-medium hover:underline"
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  }
                </div>

                <!-- Max € -->
                <div class="relative shrink-0">
                  <div
                    class="inline-flex items-center h-8 border rounded-full text-body-sm transition-colors"
                    [class.border-border-hairline]="filterMax() === null"
                    [class.border-action-700]="filterMax() !== null"
                    [class.bg-surface]="filterMax() === null"
                    [class.bg-action-700/5]="filterMax() !== null"
                  >
                    @if (filterMax() !== null) {
                      <button
                        type="button"
                        (click)="clearMax(); $event.stopPropagation()"
                        class="inline-flex items-center justify-center h-full pl-space-2 pr-1 text-neutral-500 hover:text-canvas-fg transition-colors rounded-l-full"
                        aria-label="Quitar filtro máximo"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="m15 9-6 6" />
                          <path d="m9 9 6 6" />
                        </svg>
                      </button>
                    }
                    <button
                      type="button"
                      (click)="maxMenuOpen.set(!maxMenuOpen())"
                      class="inline-flex items-center gap-space-2 h-full pr-space-2"
                      [class.pl-space-3]="filterMax() === null"
                      [class.pl-space-2]="filterMax() !== null"
                      aria-haspopup="dialog"
                      [attr.aria-expanded]="maxMenuOpen()"
                    >
                      <span class="text-canvas-fg font-medium">Max</span>
                      @if (maxChipLabel(); as lbl) {
                        <span class="w-px h-4 bg-neutral-300" aria-hidden="true"></span>
                        <span class="font-medium tabular-nums text-action-700">{{ lbl }}</span>
                      } @else {
                        <span class="text-neutral-400">€</span>
                      }
                      <svg
                        class="w-3 h-3 text-neutral-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  @if (maxMenuOpen()) {
                    <div
                      class="fixed inset-0 z-40"
                      (click)="maxMenuOpen.set(false)"
                      aria-hidden="true"
                    ></div>
                    <div
                      role="dialog"
                      aria-label="Valor máximo"
                      class="absolute left-0 top-full mt-1 z-50 w-[240px] p-space-3 bg-surface-elevated border border-border-hairline rounded-md shadow-lg"
                    >
                      <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-2">
                        Valor máximo
                      </p>
                      <div class="relative">
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          placeholder="sin límite"
                          inputmode="numeric"
                          [value]="filterMax() ?? ''"
                          (input)="onMaxInput($event)"
                          (keydown.enter)="maxMenuOpen.set(false)"
                          class="h-9 w-full pl-3 pr-8 text-body-sm tabular-nums rounded-md border border-border-hairline bg-canvas-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                          aria-label="Valor máximo en euros"
                        />
                        <span
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-body-sm text-neutral-500 pointer-events-none"
                          >€</span
                        >
                      </div>
                      <div class="mt-space-3 flex items-center justify-between">
                        <button
                          type="button"
                          (click)="clearMax()"
                          class="text-body-sm text-neutral-500 hover:text-canvas-fg"
                          [class.invisible]="filterMax() === null"
                        >
                          Limpiar
                        </button>
                        <button
                          type="button"
                          (click)="maxMenuOpen.set(false)"
                          class="text-body-sm text-action-700 font-medium hover:underline"
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  }
                </div>

                @if (anyFilterActive()) {
                  <button
                    type="button"
                    (click)="clearAllFilters()"
                    class="shrink-0 inline-flex items-center gap-space-1 h-8 px-space-2 text-body-sm text-neutral-500 hover:text-canvas-fg whitespace-nowrap"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.75"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    Limpiar filtros
                  </button>
                }
              </div>

              <span class="w-px h-5 bg-border-hairline shrink-0 ml-auto" aria-hidden="true"></span>
              <afi-button
                variant="primary"
                size="sm"
                iconStart="plus"
                ariaLabel="Añadir patrimonio"
                (clicked)="addDialogOpen.set(true)"
              >
                <svg
                  slot="iconStart"
                  class="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                Añadir patrimonio
                <kbd
                  class="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-sm text-[11px] font-mono bg-white/20 text-white border border-white/25"
                  >A</kbd
                >
              </afi-button>
            </div>

            <!-- Table sections — each renders with its own column schema
                 (dynamic CSS grid built from section.columns widths).
                 Track key includes activeTab() so panels re-mount on tab change and
                 re-play the .tab-panel entrance animation. -->
            <div
              class="mx-space-8 mt-space-6 flex flex-col pb-space-10"
              [class.gap-space-12]="version() === 'v1'"
              [class.gap-space-8]="version() !== 'v1'"
            >
              @for (s of visibleSections(); track s.key + '::' + activeTab()) {
                @if (filteredRows(s); as rows) {
                  @if (rows.length > 0) {
                    <section
                      class="tab-panel"
                      [class.border-t]="version() !== 'v1'"
                      [class.border-border-hairline]="version() !== 'v1'"
                      [class.pt-space-4]="version() !== 'v1'"
                      [class.tab-panel--backward]="tabDirection() === 'backward'"
                    >
                      @if (version() === 'v1') {
                        <!-- V1 keeps the original patrimonial table setup: roomy sections
                             and a floating graph-style header. -->
                        <div class="mb-space-4 max-w-[760px]">
                          <afi-graph-card-header
                            [label]="s.title"
                            [headline]="s.description"
                            [comparison]="tableHeaderMeta(s, rows.length)"
                          />
                        </div>
                      } @else {
                        <!-- V2/V3 keep the newer compact feedback version for comparison. -->
                        <div class="flex flex-col mb-space-4">
                          <div class="flex items-baseline gap-space-2">
                            <p class="text-body-md-600 text-canvas-fg">{{ s.title }}</p>
                            <span class="text-body-sm text-neutral-500 tabular-nums">
                              @if (anyFilterActive() && rows.length !== s.rows.length) {
                                · {{ rows.length }} de {{ sectionRowCount(s) }}
                              } @else {
                                · {{ sectionRowCount(s) }}
                                {{ sectionRowCount(s) === 1 ? 'activo' : 'activos' }}
                              }
                            </span>
                          </div>
                          <h2 class="text-section text-canvas-fg">{{ s.total }}</h2>
                        </div>
                      }
                      <!-- Free-flowing table — grid built from section.columns widths -->
                      <div>
                        <!-- Header row -->
                        <div
                          class="grid gap-space-3 text-body-sm border-b border-border-hairline pb-space-2"
                          [style.grid-template-columns]="gridTemplateFor(s)"
                        >
                          <button
                            type="button"
                            class="flex items-center gap-1 font-medium text-canvas-fg text-left hover:text-action transition-colors"
                          >
                            <span>Nombre</span>
                            <svg
                              class="w-3 h-3 text-neutral-500"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              aria-hidden="true"
                            >
                              <path d="m7 15 5 5 5-5" />
                              <path d="m17 9-5-5-5 5" />
                            </svg>
                          </button>
                          @for (c of s.columns; track c.key) {
                            @if (c.emphasis) {
                              <button
                                type="button"
                                class="flex items-center gap-1 font-medium text-canvas-fg hover:text-action transition-colors"
                                [class.justify-end]="c.align === 'end'"
                                [class.text-right]="c.align === 'end'"
                              >
                                <span>{{ c.label }}</span>
                                <svg
                                  class="w-3 h-3 text-neutral-500"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  aria-hidden="true"
                                >
                                  <path d="m7 15 5 5 5-5" />
                                  <path d="m17 9-5-5-5 5" />
                                </svg>
                              </button>
                            } @else {
                              <span
                                class="font-medium text-canvas-fg"
                                [class.text-right]="c.align === 'end'"
                                >{{ c.label }}</span
                              >
                            }
                          }
                          <span></span>
                        </div>

                        <!-- Rows -->
                        @for (row of rows; track row.id ?? row.name) {
                          <!-- Parent / standalone row -->
                          <div
                            #assetRow
                            class="grid gap-space-3 text-body-sm py-space-2 border-b last:border-b-0 border-border-hairline items-center"
                            [class.new-asset-row]="isLatestAdded(row)"
                            [attr.data-asset-row-id]="row.id ?? null"
                            [style.grid-template-columns]="gridTemplateFor(s)"
                          >
                            <div class="min-w-0 flex items-start gap-space-2">
                              @if (row.children && row.children.length > 0) {
                                <button
                                  type="button"
                                  (click)="toggleRow(s.key, row.name)"
                                  class="inline-flex items-center justify-center w-5 h-5 mt-0.5 rounded hover:bg-surface-100 text-neutral-500 shrink-0 transition-transform"
                                  [attr.aria-expanded]="isRowExpanded(s.key, row.name)"
                                  [attr.aria-label]="
                                    (isRowExpanded(s.key, row.name) ? 'Contraer ' : 'Expandir ') +
                                    row.name
                                  "
                                >
                                  <svg
                                    class="w-3.5 h-3.5 transition-transform duration-150"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    aria-hidden="true"
                                    [style.transform]="
                                      isRowExpanded(s.key, row.name)
                                        ? 'rotate(90deg)'
                                        : 'rotate(0deg)'
                                    "
                                  >
                                    <polyline points="9 18 15 12 9 6" />
                                  </svg>
                                </button>
                              }
                              <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-space-2">
                                  <p class="font-medium text-canvas-fg truncate">{{ row.name }}</p>
                                  @if (isLatestAdded(row)) {
                                    <span
                                      class="inline-flex items-center h-5 px-space-2 rounded-full bg-system-info-bg text-system-info-fg text-caption font-medium whitespace-nowrap"
                                      >Nuevo</span
                                    >
                                  }
                                  @for (tag of row.nameTags ?? []; track tag) {
                                    <span class="text-caption text-neutral-500 whitespace-nowrap">{{
                                      tag
                                    }}</span>
                                  }
                                </div>
                                @if (row.subtitle) {
                                  <p class="text-caption text-neutral-500 truncate">
                                    {{ row.subtitle }}
                                  </p>
                                }
                              </div>
                            </div>
                            @for (c of s.columns; track c.key) {
                              <span
                                [class]="c.align === 'end' ? 'text-right tabular-nums' : ''"
                                [class.text-canvas-fg]="c.emphasis"
                                [class.font-medium]="c.emphasis"
                                [class.text-neutral-700]="!c.emphasis"
                              >
                                {{ row.cells[c.key] }}
                              </span>
                            }
                            <div class="relative">
                              <button
                                type="button"
                                class="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-surface-100 text-neutral-500"
                                aria-label="Acciones de la fila"
                                aria-haspopup="menu"
                                [attr.aria-expanded]="rowActionsOpen() === rowActionId(s, row)"
                                (click)="toggleRowActions(s, row)"
                              >
                                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path
                                    d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
                                  />
                                </svg>
                              </button>
                              @if (rowActionsOpen() === rowActionId(s, row)) {
                                <div
                                  class="fixed inset-0 z-40"
                                  (click)="rowActionsOpen.set(null)"
                                  aria-hidden="true"
                                ></div>
                                <div
                                  role="menu"
                                  class="absolute right-0 top-full mt-1 z-50 min-w-[160px] p-space-1 bg-canvas-base border border-border-hairline rounded-md shadow-lg"
                                >
                                  <button
                                    type="button"
                                    role="menuitem"
                                    class="w-full flex items-center gap-space-2 px-space-2 py-space-2 rounded text-left text-body-sm text-canvas-fg hover:bg-surface-muted"
                                    (click)="rowActionsOpen.set(null)"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    type="button"
                                    role="menuitem"
                                    class="w-full flex items-center gap-space-2 px-space-2 py-space-2 rounded text-left text-body-sm text-canvas-fg hover:bg-surface-muted"
                                    (click)="rowActionsOpen.set(null)"
                                  >
                                    Duplicar
                                  </button>
                                  <div class="h-px bg-border-hairline my-space-1"></div>
                                  <button
                                    type="button"
                                    role="menuitem"
                                    class="w-full flex items-center gap-space-2 px-space-2 py-space-2 rounded text-left text-body-sm text-system-error-fg hover:bg-system-error-bg"
                                    (click)="rowActionsOpen.set(null)"
                                  >
                                    Borrar
                                  </button>
                                </div>
                              }
                            </div>
                          </div>

                          <!-- Child rows — indented under the parent, no background -->
                          @if (isRowExpanded(s.key, row.name)) {
                            @for (child of row.children ?? []; track child.id ?? child.name) {
                              <div
                                class="grid gap-space-3 text-body-sm py-space-2 border-b last:border-b-0 border-border-hairline items-center"
                                [style.grid-template-columns]="gridTemplateFor(s)"
                              >
                                <div class="min-w-0 pl-space-10 relative">
                                  <!-- Thin guideline threading the children back to the parent -->
                                  <span
                                    aria-hidden="true"
                                    class="absolute left-[18px] top-0 bottom-0 w-px bg-border-hairline"
                                  ></span>
                                  <div class="flex items-center gap-space-2">
                                    <p class="font-medium text-canvas-fg truncate">
                                      {{ child.name }}
                                    </p>
                                    @for (tag of child.nameTags ?? []; track tag) {
                                      <span
                                        class="text-caption text-neutral-500 whitespace-nowrap"
                                        >{{ tag }}</span
                                      >
                                    }
                                  </div>
                                  @if (child.subtitle) {
                                    <p class="text-caption text-neutral-500 truncate">
                                      {{ child.subtitle }}
                                    </p>
                                  }
                                </div>
                                @for (c of s.columns; track c.key) {
                                  <span
                                    [class]="c.align === 'end' ? 'text-right tabular-nums' : ''"
                                    [class.text-canvas-fg]="c.emphasis"
                                    [class.font-medium]="c.emphasis"
                                    [class.text-neutral-700]="!c.emphasis"
                                  >
                                    {{ child.cells[c.key] }}
                                  </span>
                                }
                                <span></span>
                              </div>
                            }
                          }
                        }
                      </div>
                    </section>
                  }
                }
              }
              @if (anyFilterActive() && visibleCount() === 0) {
                <div
                  class="flex flex-col items-center text-center gap-space-3 py-space-8 border border-dashed border-border-hairline rounded-md max-w-[640px] mx-auto"
                >
                  <svg
                    class="w-8 h-8 text-neutral-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                    <path d="M8 11h6" />
                  </svg>
                  <div>
                    <p class="text-body-md text-canvas-fg font-medium">
                      Ningún activo coincide con los filtros
                    </p>
                    <p class="text-body-sm text-neutral-500 mt-space-1">
                      Prueba ampliar el rango o quitar alguna entidad seleccionada.
                    </p>
                  </div>
                  <afi-button variant="ghost" size="sm" (clicked)="clearAllFilters()"
                    >Limpiar filtros</afi-button
                  >
                </div>
              }
              <p
                class="text-body-sm text-neutral-500 border-t border-border-hairline pt-space-4 max-w-[640px]"
              >
                {{ tableExplainer() }} Todo esto se formalizará en variantes del
                <code class="font-mono">afi-table</code>.
              </p>
            </div>
          </div>
        </main>
      </div>

      <!-- "+ Añadir" dialog — Stripe-style: form on the left, live preview chart on the right -->
      @if (addDialogOpen()) {
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-space-6"
          (click)="addDialogOpen.set(false)"
          role="presentation"
        >
          <div
            role="dialog"
            aria-label="Añadir activo"
            class="bg-canvas-base border border-border-hairline rounded-lg shadow-xl w-[1040px] max-w-full h-[640px] max-h-[calc(100vh-48px)] flex flex-col overflow-hidden"
            (click)="$event.stopPropagation()"
          >
            <!-- Stripe-style top bar: X · hairline · title -->
            <header
              class="flex items-center gap-space-3 px-space-4 h-12 border-b border-border-hairline bg-canvas-base shrink-0"
            >
              <button
                type="button"
                (click)="addDialogOpen.set(false)"
                class="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-surface-100 text-neutral-500 hover:text-canvas-fg transition-colors"
                aria-label="Cerrar"
              >
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M4.22 4.22a.75.75 0 011.06 0L10 8.94l4.72-4.72a.75.75 0 111.06 1.06L11.06 10l4.72 4.72a.75.75 0 11-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 01-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 010-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <span class="w-px h-5 bg-border-hairline shrink-0" aria-hidden="true"></span>
              <h2 class="text-body-md font-medium text-canvas-fg">Añadir activo</h2>
            </header>

            <!-- Body: form left · live resumen right -->
            <div class="flex-1 min-h-0 flex overflow-hidden">
              <!-- Left: form -->
              <div class="flex-[1.1] min-w-0 flex flex-col border-r border-border-hairline">
                <div class="flex-1 overflow-y-auto px-space-6 py-space-6 flex flex-col gap-space-4">
                  <afi-select
                    label="Tipo de activo"
                    [options]="addTipoOptions"
                    [value]="addTipo()"
                    (valueChange)="setAddTipo($event)"
                  />

                  @if (addTipo() === 'inversion') {
                    <afi-select
                      label="Subtipo"
                      [options]="addSubtipoOptions"
                      [value]="addSubtipo()"
                      (valueChange)="setAddSubtipo($event)"
                    />
                  }

                  @if (isCartera()) {
                    <!-- Cartera mode: dedicated name field first -->
                    <afi-input
                      label="Nombre de la cartera"
                      type="text"
                      placeholder="Ej: Cartera 2025"
                      [value]="addDescripcion()"
                      (valueChange)="setAddDescripcion($event)"
                    />
                    <afi-select
                      label="Entidad"
                      [options]="addEntidadOptions"
                      [value]="addEntidad()"
                      (valueChange)="setAddEntidad($event)"
                    />
                    <afi-input
                      label="ISIN (opcional)"
                      type="text"
                      placeholder="Ej: ES0124XYZ1234"
                      [value]="addIsin()"
                      (valueChange)="setAddIsin($event)"
                    />

                    <!-- Composición — all labels locked at 12px; hierarchy by weight + color. -->
                    <div class="mt-space-2">
                      <p class="text-[12px] leading-[16px] font-medium text-canvas-fg">
                        Composición
                      </p>
                      <p class="text-[12px] leading-[16px] text-neutral-500 mt-0.5 mb-space-2">
                        Añade las posiciones que forman esta cartera.
                      </p>

                      <!-- Header row — same 12px, medium weight + neutral-700 for the column labels -->
                      <div
                        class="grid grid-cols-[1fr,120px,120px,28px] gap-space-2 text-[12px] leading-[16px] font-medium text-neutral-700 px-space-1 pb-space-1 border-b border-border-hairline"
                      >
                        <span>Nombre</span>
                        <span>Tipo</span>
                        <span class="text-right">Importe €</span>
                        <span></span>
                      </div>

                      @for (h of addHoldings(); track h.id) {
                        <div
                          class="grid grid-cols-[1fr,120px,120px,28px] gap-space-2 items-center py-space-2 border-b last:border-b-0 border-border-hairline"
                        >
                          <input
                            type="text"
                            placeholder="Ej: iShares MSCI World"
                            [value]="h.name"
                            (input)="setHoldingName(h.id, inputValue($event))"
                            class="h-8 px-space-2 text-body-sm rounded-md border border-border-hairline bg-canvas-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                            [attr.aria-label]="'Nombre de la posición ' + h.id"
                          />
                          <afi-select
                            size="sm"
                            [options]="addHoldingTipoOptions"
                            [value]="h.tipo"
                            (valueChange)="setHoldingTipo(h.id, $event)"
                            [ariaLabel]="'Tipo de la posición ' + h.id"
                          />
                          <input
                            type="number"
                            min="0"
                            step="100"
                            placeholder="0"
                            inputmode="numeric"
                            [value]="h.importe"
                            (input)="setHoldingImporte(h.id, inputValue($event))"
                            class="h-8 px-space-2 text-body-sm tabular-nums text-right rounded-md border border-border-hairline bg-canvas-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                            [attr.aria-label]="'Importe de la posición ' + h.id"
                          />
                          <button
                            type="button"
                            (click)="removeHolding(h.id)"
                            class="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-surface-muted text-neutral-500 hover:text-canvas-fg transition-colors"
                            [attr.aria-label]="'Eliminar posición ' + h.id"
                          >
                            <svg
                              class="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="1.75"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </div>
                      }

                      <!-- Ghost "new row" button — sits under the last holding, not in the header -->
                      <button
                        type="button"
                        (click)="addHolding()"
                        class="mt-space-2 inline-flex items-center gap-space-2 px-space-2 py-space-2 rounded text-body-sm text-neutral-500 hover:text-canvas-fg hover:bg-surface-muted transition-colors"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          />
                        </svg>
                        Añadir posición
                      </button>

                      <!-- Auto-total -->
                      <div
                        class="flex items-center justify-between mt-space-3 pt-space-2 border-t border-border-hairline"
                      >
                        <p class="text-body-sm text-neutral-500">Importe total (auto)</p>
                        <p class="text-body-md font-semibold tabular-nums text-canvas-fg">
                          {{ formatEuro(addHoldingsTotal()) }}
                        </p>
                      </div>
                    </div>
                  } @else {
                    <!-- Simple mode: standalone Importe + Descripción as before -->
                    <afi-input
                      label="Importe"
                      type="number"
                      placeholder="0"
                      hint="En euros. El resumen de la derecha se actualiza al instante."
                      [value]="addImporte()"
                      (valueChange)="setAddImporte($event)"
                    />
                    <afi-select
                      label="Entidad"
                      [options]="addEntidadOptions"
                      [value]="addEntidad()"
                      (valueChange)="setAddEntidad($event)"
                    />
                    <afi-input
                      label="Descripción (opcional)"
                      type="text"
                      placeholder="Ej: cuenta de ahorro, cartera equity..."
                      [value]="addDescripcion()"
                      (valueChange)="setAddDescripcion($event)"
                    />
                  }
                </div>
              </div>

              <!-- Right: reactive resumen — row preview + patrimonio diff -->
              <div class="flex-1 min-w-0 flex flex-col bg-surface-quiet">
                <div class="flex-1 overflow-y-auto px-space-6 py-space-6 flex flex-col gap-space-4">
                  <div>
                    <p class="text-body-sm font-medium text-neutral-700 mb-space-2">Resumen</p>
                    <h3 class="text-section text-canvas-fg">Así quedará el nuevo activo</h3>
                    <p class="text-body-sm text-neutral-700 mt-space-1">
                      Revisa la fila y su impacto antes de guardar.
                    </p>
                  </div>

                  <!-- Card A — Row preview (adapts when Cartera: shows parent + indented children).
                       Typography trimmed to Figma/Granola/Stripe cadence: 11–13px, one bold focal figure. -->
                  <div class="mt-space-2">
                    <p class="text-body-sm font-medium text-canvas-fg mb-space-2">
                      Fila nueva en {{ addSectionForTipo() }}
                    </p>
                    <div
                      class="bg-canvas-base border border-border-hairline rounded-md overflow-hidden"
                    >
                      <!-- Parent row -->
                      <div
                        class="flex items-start justify-between gap-space-3 px-space-3 py-space-2"
                      >
                        <div class="min-w-0 flex-1">
                          <p class="text-[13px] leading-[18px] font-medium text-canvas-fg truncate">
                            {{ addResumenRowName() }}
                          </p>
                          <div
                            class="mt-0.5 flex items-center gap-space-2 text-[11px] leading-[16px] text-neutral-500"
                          >
                            @if (isCartera()) {
                              <span>Cartera</span>
                              @if (addIsin()) {
                                <span aria-hidden="true">·</span>
                                <span class="font-mono">{{ addIsin() }}</span>
                              }
                            } @else {
                              <span>{{ addTipoLabel() }}</span>
                            }
                            <span aria-hidden="true">·</span>
                            <span>{{ addEntidadLabel() }}</span>
                          </div>
                        </div>
                        <p
                          class="tabular-nums text-[13px] font-semibold shrink-0"
                          [class.text-canvas-fg]="addImporteNum() > 0"
                          [class.text-neutral-400]="addImporteNum() === 0"
                        >
                          @if (addImporteNum() > 0) {
                            {{ formatEuro(addImporteNum()) }}
                          } @else {
                            — €
                          }
                        </p>
                      </div>

                      <!-- Child rows when Cartera: each holding indented with a guideline -->
                      @if (isCartera() && addHoldings().length > 0) {
                        <div class="border-t border-border-hairline">
                          @for (h of addHoldings(); track h.id) {
                            <div
                              class="flex items-center gap-space-3 pl-space-10 pr-space-3 py-[6px] relative border-b last:border-b-0 border-border-hairline"
                            >
                              <span
                                aria-hidden="true"
                                class="absolute left-[18px] top-0 bottom-0 w-px bg-border-hairline"
                              ></span>
                              <div class="min-w-0 flex-1">
                                <p class="text-[12px] leading-[16px] text-canvas-fg truncate">
                                  @if (h.name) {
                                    {{ h.name }}
                                  } @else {
                                    <span class="text-neutral-400 italic">Sin nombre</span>
                                  }
                                </p>
                                <p class="text-[11px] leading-[14px] text-neutral-500">
                                  {{ holdingTipoLabel(h.tipo) }}
                                </p>
                              </div>
                              <p class="tabular-nums text-[12px] text-neutral-700 shrink-0">
                                @if (parseImporte(h.importe); as n) {
                                  {{ formatEuro(n) }}
                                } @else {
                                  <span class="text-neutral-400">— €</span>
                                }
                              </p>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Card B — Patrimonio total diff, tightened -->
                  <div>
                    <p class="text-body-sm font-medium text-canvas-fg mb-space-2">
                      Impacto en patrimonio
                    </p>
                    <div class="bg-canvas-base border border-border-hairline rounded-md p-space-4">
                      <p class="text-body-sm text-neutral-500">Patrimonio total</p>
                      <div class="mt-space-1 flex items-center gap-space-2">
                        <span class="text-body-sm tabular-nums text-neutral-500">{{
                          formatEuro(1240000)
                        }}</span>
                        <svg
                          class="w-3 h-3 text-neutral-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.75"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="5" x2="19" y1="12" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                        <strong class="text-body-md font-semibold tabular-nums text-canvas-fg">{{
                          formatEuro(1240000 + addImporteNum())
                        }}</strong>
                      </div>
                      @if (addImporteNum() > 0) {
                        <p
                          class="mt-space-3 inline-flex items-center gap-space-2 text-body-sm font-medium text-action-700 tabular-nums"
                        >
                          <svg
                            class="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                            <polyline points="16 7 22 7 22 13" />
                          </svg>
                          +{{ formatEuro(addImporteNum()) }}
                          <span class="text-neutral-500"
                            >({{ formatPercent((addImporteNum() / 1240000) * 100) }})</span
                          >
                        </p>
                      } @else {
                        <p class="mt-space-3 text-body-sm text-neutral-500">
                          Introduce un importe para ver el impacto.
                        </p>
                      }
                    </div>
                  </div>

                  <p class="text-body-sm text-neutral-600 leading-relaxed">
                    Se guardará en
                    <span class="font-medium text-canvas-fg">{{ addSectionForTipo() }}</span
                    >. Después podrás editarlo desde la fila.
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer actions — committed controls live at the bottom of the modal. -->
            <footer
              class="h-14 px-space-4 border-t border-border-hairline bg-canvas-base shrink-0 flex items-center justify-end gap-space-3"
            >
              <p
                class="text-caption text-neutral-500 inline-flex items-center gap-space-1 mr-space-1"
              >
                <afi-kbd [keys]="escShortcut" size="sm" /> para cancelar
              </p>
              <afi-button variant="ghost" size="sm" (clicked)="addDialogOpen.set(false)"
                >Cancelar</afi-button
              >
              <afi-button variant="primary" size="sm" (clicked)="saveNewActivo()"
                >Guardar activo</afi-button
              >
            </footer>
          </div>
        </div>
      }

      <!-- Page-level toast for saveNewActivo confirmation -->
      <site-action-toast
        [visible]="savedToastVisible()"
        [message]="savedToastMessage()"
        undoLabel="Cerrar"
        (undo)="savedToastVisible.set(false)"
        (dismissed)="savedToastVisible.set(false)"
      />
    </div>
  `,
})
export class PatrimonialProposalPage {
  constructor() {
    // Measure the tab strip after first render so the left/right chevrons
    // reflect actual overflow from page load (not just after the user scrolls).
    afterNextRender(() => this.measureTabs());

    bridgeDesignReviewVersion(this.version as unknown as WritableSignal<string>);
  }

  readonly addDialogOpen = signal(false);
  readonly rowActionsOpen = signal<string | null>(null);
  readonly addTipo = signal<string>('liquidez');
  readonly addImporte = signal<string>('');
  readonly addEntidad = signal<string>('santander');
  readonly addDescripcion = signal<string>('');
  readonly escShortcut: string[] = ['Esc'];

  /** Page-level layout version. V1 is the current implementation with the
   *  senior-feedback fixes from this round. V2 / V3 are stubs ready to host
   *  future explorations — variants are kept side-by-side so seniors can
   *  compare across reviews instead of overwriting prior work. */
  readonly version = signal<LayoutVersion>('v1');
  readonly versions: VersionOption[] = [
    { key: 'v1', label: 'Versión 1' },
    { key: 'v2', label: 'Versión 2' },
    { key: 'v3', label: 'Versión 3' },
  ];
  setVersion(v: string): void {
    if (v === 'v1' || v === 'v2' || v === 'v3') this.version.set(v);
  }

  readonly addTipoOptions: SelectOption[] = [
    { value: 'liquidez', label: 'Liquidez' },
    { value: 'inversion', label: 'Inversión' },
    { value: 'inmobiliario', label: 'Inmobiliario' },
    { value: 'pension', label: 'Plan de pensiones' },
    { value: 'participacion', label: 'Participación empresarial' },
    { value: 'otro', label: 'Otro' },
  ];

  /** Sub-tipos revealed when Tipo = Inversión. `cartera` is the most complex
   * case and unlocks an ISIN field + a dynamic Composición list below. */
  readonly addSubtipoOptions: SelectOption[] = [
    { value: 'cartera', label: 'Cartera' },
    { value: 'fondo', label: 'Fondo' },
    { value: 'etf', label: 'ETF' },
    { value: 'accion', label: 'Acción' },
  ];

  readonly addHoldingTipoOptions: SelectOption[] = [
    { value: 'etf', label: 'ETF' },
    { value: 'fondo', label: 'Fondo' },
    { value: 'accion', label: 'Acción' },
    { value: 'bono', label: 'Bono' },
    { value: 'liquidez', label: 'Liquidez' },
  ];

  readonly addEntidadOptions: SelectOption[] = [
    { value: 'santander', label: 'Santander' },
    { value: 'ing', label: 'ING' },
    { value: 'bankinter', label: 'Bankinter' },
    { value: 'renta-4', label: 'Renta 4' },
    { value: 'degiro', label: 'Degiro' },
    { value: 'indexa', label: 'Indexa Capital' },
  ];

  // ---- Cartera state (most complex patrimonio: parent + holdings) ----
  readonly addSubtipo = signal<string>('cartera');
  readonly addIsin = signal<string>('');
  readonly addHoldings = signal<{ id: number; name: string; tipo: string; importe: string }[]>([
    { id: 1, name: 'iShares MSCI World', tipo: 'etf', importe: '42000' },
    { id: 2, name: 'Global Bond Fund', tipo: 'fondo', importe: '20300' },
  ]);

  setAddSubtipo(v: string | number | null): void {
    this.addSubtipo.set(v !== null ? String(v) : '');
  }
  setAddIsin(v: string | number | null): void {
    this.addIsin.set(v !== null ? String(v) : '');
  }

  isCartera(): boolean {
    return this.addTipo() === 'inversion' && this.addSubtipo() === 'cartera';
  }

  addHoldingsTotal(): number {
    return this.addHoldings().reduce((s, h) => s + (parseFloat(h.importe) || 0), 0);
  }

  addHolding(): void {
    const next = Math.max(0, ...this.addHoldings().map((h) => h.id)) + 1;
    this.addHoldings.update((rows) => [...rows, { id: next, name: '', tipo: 'etf', importe: '' }]);
  }
  removeHolding(id: number): void {
    this.addHoldings.update((rows) => rows.filter((h) => h.id !== id));
  }
  setHoldingName(id: number, v: string | number | null): void {
    this.addHoldings.update((rows) =>
      rows.map((h) => (h.id === id ? { ...h, name: v !== null ? String(v) : '' } : h)),
    );
  }
  setHoldingTipo(id: number, v: string | number | null): void {
    this.addHoldings.update((rows) =>
      rows.map((h) => (h.id === id ? { ...h, tipo: v !== null ? String(v) : '' } : h)),
    );
  }
  setHoldingImporte(id: number, v: string | number | null): void {
    this.addHoldings.update((rows) =>
      rows.map((h) => (h.id === id ? { ...h, importe: v !== null ? String(v) : '' } : h)),
    );
  }
  holdingTipoLabel(tipo: string): string {
    return this.addHoldingTipoOptions.find((o) => o.value === tipo)?.label ?? tipo;
  }
  inputValue(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }

  /** Parses a numeric string. Returns null if empty / not a number — so the
   * preview can distinguish "not typed yet" from "0". */
  parseImporte(s: string): number | null {
    if (!s || !s.trim()) return null;
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  }

  // ---- Edit mode (stub) — toggled by the pencil icon in the control strip.
  //      Full edit-mode UI (checkboxes, bulk-delete, etc.) will follow; for now
  //      the toggle wires the button state + tooltip label flip. ----

  // ---- Save flow: switch tab to the new activo's section + confirmation toast ----
  readonly savedToastVisible = signal(false);
  readonly savedToastMessage = signal<string>('');
  readonly addedAssets = signal<AddedAsset[]>([]);
  readonly latestAddedAssetId = signal<string | null>(null);
  private savedToastTimer?: ReturnType<typeof setTimeout>;
  private latestAddedTimer?: ReturnType<typeof setTimeout>;

  /** Maps the current `addTipo()` to the matching section `key` in `this.sections`. */
  private sectionKeyForTipo(): string {
    switch (this.addTipo()) {
      case 'liquidez':
        return 'liquidez';
      case 'inversion':
        return 'inversiones';
      case 'inmobiliario':
        return 'inmobiliario';
      case 'pension':
        return 'planes-pensiones';
      case 'participacion':
        return 'participaciones';
      default:
        return 'otros';
    }
  }

  saveNewActivo(): void {
    const newAsset = this.buildNewAsset();

    // Compose the confirmation message
    let msg: string;
    if (this.isCartera()) {
      const name = newAsset.row.name;
      const n = newAsset.row.children?.length ?? 0;
      msg = `Cartera «${name}» añadida con ${n} ${n === 1 ? 'posición' : 'posiciones'}`;
    } else {
      msg = `Activo añadido a ${this.addSectionForTipo()}`;
    }

    this.addedAssets.update((rows) => [newAsset, ...rows]);
    this.latestAddedAssetId.set(newAsset.row.id ?? null);
    if (newAsset.row.children && newAsset.row.id) {
      this.expandedRows.update((rows) =>
        new Set(rows).add(`${newAsset.sectionKey}::${newAsset.row.name}`),
      );
    }

    // Switch to the target tab so the user can see where the activo landed
    this.setActiveTab(newAsset.sectionKey);
    setTimeout(() => this.scrollLatestAddedIntoView(), 0);

    // Close dialog + reset form (keep addTipo so consecutive adds of the same type are fast)
    this.addDialogOpen.set(false);
    this.addImporte.set('');
    this.addDescripcion.set('');
    this.addIsin.set('');
    this.addHoldings.set([{ id: 1, name: '', tipo: 'etf', importe: '' }]);

    // Fire the toast (5s auto-dismiss)
    this.savedToastMessage.set(msg);
    this.savedToastVisible.set(true);
    clearTimeout(this.savedToastTimer);
    this.savedToastTimer = setTimeout(() => this.savedToastVisible.set(false), 5000);
    clearTimeout(this.latestAddedTimer);
    this.latestAddedTimer = setTimeout(() => this.latestAddedAssetId.set(null), 9000);
  }

  private buildNewAsset(): AddedAsset {
    const id = `new-${Date.now()}`;
    const sectionKey = this.sectionKeyForTipo();
    const name = this.addResumenRowName();
    const entidad = this.addEntidadLabel() || '—';
    const value = this.addImporteNum();
    const valueLabel = this.formatEuro(value);
    const row: AssetRow = {
      id,
      name,
      entidad,
      valorNum: value,
      cells: this.cellsForNewAsset(sectionKey, valueLabel, entidad),
      subtitle: this.subtitleForNewAsset(),
    };

    if (this.isCartera()) {
      row.nameTags = ['Cartera'];
      row.children = this.addHoldings()
        .filter((h) => h.name.trim() || this.parseImporte(h.importe))
        .map((h, index) => {
          const childValue = this.parseImporte(h.importe) ?? 0;
          const tipo = this.holdingTipoLabel(h.tipo);
          return {
            id: `${id}-holding-${h.id}`,
            name: h.name.trim() || `Posición ${index + 1}`,
            nameTags: [tipo],
            entidad,
            valorNum: childValue,
            cells: { tipo, entidad, valor: this.formatEuro(childValue) },
          };
        });
    }

    return { sectionKey, row };
  }

  private cellsForNewAsset(
    sectionKey: string,
    valueLabel: string,
    entidad: string,
  ): Record<string, string> {
    switch (sectionKey) {
      case 'liquidez':
        return { tipo: 'Cuenta', entidad, valor: valueLabel };
      case 'inversiones':
        return {
          tipo: this.isCartera() ? 'Cartera' : this.addSubtipoLabel(),
          entidad,
          valor: valueLabel,
        };
      case 'inmobiliario':
        return { uso: 'Pendiente de clasificar', valor: valueLabel };
      case 'planes-pensiones':
        return { entidad, derechosAntiguos: '—', derechos: valueLabel };
      default:
        return { valor: valueLabel };
    }
  }

  private subtitleForNewAsset(): string | null {
    if (this.isCartera() && this.addIsin().trim()) return this.addIsin().trim();
    if (this.addTipo() === 'inmobiliario') return this.addEntidadLabel();
    return null;
  }

  setAddTipo(v: string | number | null): void {
    this.addTipo.set(v !== null ? String(v) : '');
  }
  setAddImporte(v: string | number | null): void {
    this.addImporte.set(v !== null ? String(v) : '');
  }
  setAddEntidad(v: string | number | null): void {
    this.addEntidad.set(v !== null ? String(v) : '');
  }
  setAddDescripcion(v: string | number | null): void {
    this.addDescripcion.set(v !== null ? String(v) : '');
  }

  addImporteNum(): number {
    // Cartera mode: auto-sum from holdings. Otherwise use the typed Importe.
    if (this.isCartera()) return this.addHoldingsTotal();
    const n = parseFloat(this.addImporte());
    if (isNaN(n)) return 0;
    return Math.max(0, n); // dialog is an add-flow; clamp negatives to 0 for the preview
  }

  formatEuro(n: number): string {
    return Math.round(n).toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });
  }

  formatPercent(n: number): string {
    return `${n.toFixed(1).replace('.', ',')} %`;
  }

  /** Section display name for a given addTipo — used in the row-preview caption. */
  addSectionForTipo(): string {
    switch (this.addTipo()) {
      case 'liquidez':
        return 'Liquidez';
      case 'inversion':
        return 'Inversiones';
      case 'inmobiliario':
        return 'Inmobiliario';
      case 'pension':
        return 'Planes de pensiones y EPSV';
      case 'participacion':
        return 'Participaciones empresariales';
      default:
        return 'Otros activos';
    }
  }

  /** Name shown in the row-preview card — description if typed, else a placeholder by tipo. */
  addResumenRowName(): string {
    const desc = this.addDescripcion().trim();
    if (desc) return desc;
    switch (this.addTipo()) {
      case 'liquidez':
        return 'Nueva cuenta';
      case 'inversion':
        return 'Nueva inversión';
      case 'inmobiliario':
        return 'Nuevo inmueble';
      case 'pension':
        return 'Nuevo plan de pensiones';
      case 'participacion':
        return 'Nueva participación';
      default:
        return 'Nuevo activo';
    }
  }

  /** Label of the selected tipo — used in the preview row's Tipo cell. */
  addTipoLabel(): string {
    return this.addTipoOptions.find((o) => o.value === this.addTipo())?.label ?? '';
  }

  addSubtipoLabel(): string {
    return this.addSubtipoOptions.find((o) => o.value === this.addSubtipo())?.label ?? 'Inversión';
  }

  /** Label of the selected entidad — used in the preview row's Entidad cell. */
  addEntidadLabel(): string {
    return this.addEntidadOptions.find((o) => o.value === this.addEntidad())?.label ?? '';
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (this.isTypingTarget(e)) return;
    if (
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey &&
      e.key.toLowerCase() === 'a' &&
      !this.addDialogOpen()
    ) {
      e.preventDefault();
      this.addDialogOpen.set(true);
      return;
    }
    if (e.key === 'Escape' && this.addDialogOpen()) {
      e.preventDefault();
      this.addDialogOpen.set(false);
    }
  }

  private isTypingTarget(e: Event): boolean {
    // composedPath pierces Shadow DOM (e.g. design-review widget),
    // so we catch typing in widgets that mount under document.body.
    const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
    for (const node of path) {
      if (!(node instanceof Element)) continue;
      const tag = node.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if ((node as HTMLElement).isContentEditable) return true;
    }
    return false;
  }

  readonly addShortcut: string[] = ['A'];

  // ---- Section data model ----
  // Each section defines its own columns so tables can have different schemas
  // (Deudas has Plazo + Tipo interés + Capital pendiente; Seguros has
  // Año vencimiento + Prima + Capital fallecimiento + Capital invalidez, etc).
  readonly sections: AssetSection[] = [
    {
      key: 'liquidez',
      title: 'Liquidez',
      total: '65.200 €',
      description: '65.200 € disponibles en liquidez.',
      columns: [
        { key: 'tipo', label: 'Tipo', width: '140px' },
        { key: 'entidad', label: 'Entidad', width: '160px' },
        { key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '140px' },
      ],
      rows: [
        {
          name: 'Cuenta corriente 123',
          entidad: 'Santander',
          valorNum: 45200,
          cells: { tipo: 'Cuenta corriente', entidad: 'Santander', valor: '45.200 €' },
        },
        {
          name: 'Depósito ING',
          entidad: 'ING',
          valorNum: 20000,
          cells: { tipo: 'Depósito', entidad: 'ING', valor: '20.000 €' },
        },
      ],
    },
    {
      key: 'inversiones',
      title: 'Inversiones',
      total: '205.500 €',
      description: '205.500 € invertidos en carteras, fondos y acciones.',
      columns: [
        { key: 'tipo', label: 'Tipo', width: '140px' },
        { key: 'entidad', label: 'Entidad', width: '160px' },
        { key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '140px' },
      ],
      rows: [
        {
          name: 'Cartera 2023',
          subtitle: 'ES0124XYZ1234',
          entidad: 'Renta 4',
          valorNum: 62300,
          cells: { tipo: 'Cartera', entidad: 'Renta 4', valor: '62.300 €' },
          children: [
            {
              name: 'iShares MSCI World',
              nameTags: ['ETF', 'RV Internacional'],
              entidad: 'Renta 4',
              valorNum: 42000,
              cells: { tipo: 'ETF', entidad: 'Renta 4', valor: '42.000 €' },
            },
            {
              name: 'Global Bond Fund',
              nameTags: ['Fondo', 'RF Global'],
              entidad: 'Renta 4',
              valorNum: 20300,
              cells: { tipo: 'Fondo', entidad: 'Renta 4', valor: '20.300 €' },
            },
          ],
        },
        {
          name: 'Cartera 2024',
          subtitle: 'ES0124XYZ1235',
          entidad: 'Renta 4',
          valorNum: 58900,
          cells: { tipo: 'Cartera', entidad: 'Renta 4', valor: '58.900 €' },
          children: [
            {
              name: 'Vanguard S&P 500',
              nameTags: ['ETF', 'RV Americana'],
              entidad: 'Renta 4',
              valorNum: 30000,
              cells: { tipo: 'ETF', entidad: 'Renta 4', valor: '30.000 €' },
            },
            {
              name: 'EU Small Cap',
              nameTags: ['Fondo', 'RV Europa'],
              entidad: 'Renta 4',
              valorNum: 28900,
              cells: { tipo: 'Fondo', entidad: 'Renta 4', valor: '28.900 €' },
            },
          ],
        },
        {
          name: 'Amazon Inc',
          subtitle: 'US0231001111',
          entidad: 'Degiro',
          valorNum: 12400,
          cells: { tipo: 'Acción', entidad: 'Degiro', valor: '12.400 €' },
        },
        {
          name: 'Bankinter capital plus, FI',
          subtitle: 'ES0114XX0001',
          entidad: 'Bankinter',
          valorNum: 30100,
          cells: { tipo: 'Fondo', entidad: 'Bankinter', valor: '30.100 €' },
        },
        {
          name: 'Ix global equity',
          subtitle: 'IE0056XXYY00',
          entidad: 'Indexa Capital',
          valorNum: 41800,
          cells: { tipo: 'Fondo', entidad: 'Indexa Capital', valor: '41.800 €' },
        },
      ],
    },
    {
      key: 'inmobiliario',
      title: 'Inmobiliario',
      total: '730.000 €',
      description: '730.000 € en patrimonio inmobiliario.',
      columns: [
        { key: 'uso', label: 'Uso', width: '1fr' },
        { key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '180px' },
      ],
      rows: [
        {
          name: 'Vivienda habitual Madrid',
          entidad: '—',
          valorNum: 450000,
          cells: { uso: 'Residencia principal', valor: '450.000 €' },
        },
        {
          name: 'Apartamento Barcelona',
          entidad: '—',
          valorNum: 280000,
          cells: { uso: 'Alquiler vacacional', valor: '280.000 €' },
        },
      ],
    },
    {
      key: 'private-equity',
      title: 'Private equity',
      total: '263.500 €',
      description: '263.500 € en inversiones privadas.',
      columns: [
        { key: 'entidad', label: 'Entidad', width: '160px' },
        { key: 'compromiso', label: 'Compromiso', align: 'end', width: '160px' },
        { key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '140px' },
      ],
      rows: [
        {
          name: 'Fondo Arcano Partners I',
          subtitle: 'Capital riesgo · 2021',
          entidad: 'Arcano',
          valorNum: 185000,
          cells: { entidad: 'Arcano', compromiso: '200.000 €', valor: '185.000 €' },
        },
        {
          name: 'Nauta Tech Invest V',
          subtitle: 'Venture capital · 2023',
          entidad: 'Nauta Capital',
          valorNum: 78500,
          cells: { entidad: 'Nauta Capital', compromiso: '100.000 €', valor: '78.500 €' },
        },
      ],
    },
    {
      key: 'planes-pensiones',
      title: 'Planes de pensiones y EPSV',
      total: '70.600 €',
      description: '70.600 € en derechos consolidados.',
      columns: [
        { key: 'entidad', label: 'Entidad', width: '140px' },
        {
          key: 'derechosAntiguos',
          label: 'Derechos consolidados anteriores a 2007',
          align: 'end',
          width: '1fr',
        },
        {
          key: 'derechos',
          label: 'Derechos consolidados',
          align: 'end',
          emphasis: true,
          width: '200px',
        },
      ],
      rows: [
        {
          name: 'R4 PP',
          nameTags: ['AI.co', 'RV Internacional'],
          subtitle: 'DGS#4230',
          entidad: 'Renta 4',
          valorNum: 58200,
          cells: { entidad: 'Renta 4', derechosAntiguos: '12.400 €', derechos: '58.200 €' },
        },
        {
          name: 'EPSV Geroa',
          nameTags: ['Mixto moderado'],
          subtitle: 'DGS#1012',
          entidad: 'Geroa Pentsioak',
          valorNum: 12400,
          cells: { entidad: 'Geroa Pentsioak', derechosAntiguos: '—', derechos: '12.400 €' },
        },
      ],
    },
    {
      key: 'participaciones',
      title: 'Participaciones empresariales',
      total: '205.000 €',
      description: '205.000 € en participaciones empresariales.',
      columns: [{ key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '1fr' }],
      rows: [
        {
          name: 'Startup TechCo SL',
          subtitle: '15% participación',
          entidad: '—',
          valorNum: 120000,
          cells: { valor: '120.000 €' },
        },
        {
          name: 'Inversiones Familia SL',
          subtitle: '33% participación',
          entidad: '—',
          valorNum: 85000,
          cells: { valor: '85.000 €' },
        },
      ],
    },
    {
      key: 'otros',
      title: 'Otros activos',
      total: '42.000 €',
      description: '42.000 € en otros activos.',
      columns: [{ key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '1fr' }],
      rows: [
        {
          name: 'Colección de arte',
          subtitle: 'Tasación 2024',
          entidad: '—',
          valorNum: 42000,
          cells: { valor: '42.000 €' },
        },
      ],
    },
    {
      key: 'deudas',
      title: 'Deudas',
      total: '275.000 €',
      description: '275.000 € de deuda pendiente.',
      columns: [
        { key: 'entidad', label: 'Entidad', width: '140px' },
        { key: 'plazo', label: 'Plazo pendiente', align: 'end', width: '1fr' },
        { key: 'tipoInteres', label: 'Tipo de interés', align: 'end', width: '1fr' },
        {
          key: 'capitalPendiente',
          label: 'Capital pendiente',
          align: 'end',
          emphasis: true,
          width: '160px',
        },
      ],
      rows: [
        {
          name: 'Hipoteca Vivienda Madrid',
          entidad: 'ING',
          valorNum: 180000,
          cells: {
            entidad: 'ING',
            plazo: '18 años',
            tipoInteres: '2,35 %',
            capitalPendiente: '180.000 €',
          },
        },
        {
          name: 'Hipoteca Apartamento Barcelona',
          entidad: 'BBVA',
          valorNum: 95000,
          cells: {
            entidad: 'BBVA',
            plazo: '12 años',
            tipoInteres: '3,10 %',
            capitalPendiente: '95.000 €',
          },
        },
      ],
    },
    {
      key: 'seguros',
      title: 'Seguros de vida',
      total: '330.000 €',
      description: '330.000 € de capital asegurado.',
      columns: [
        { key: 'vencimiento', label: 'Año de vencimiento', align: 'end', width: '160px' },
        { key: 'prima', label: 'Prima anual', align: 'end', width: '140px' },
        { key: 'fallecimiento', label: 'Capital de fallecimiento', align: 'end', width: '200px' },
        {
          key: 'invalidez',
          label: 'Capital de invalidez',
          align: 'end',
          emphasis: true,
          width: '180px',
        },
      ],
      rows: [
        {
          name: 'Seguro de vida Santander',
          subtitle: 'Banco Santander',
          entidad: 'Santander',
          valorNum: 150000,
          cells: {
            vencimiento: '2045',
            prima: '420 €',
            fallecimiento: '150.000 €',
            invalidez: '120.000 €',
          },
        },
        {
          name: 'Seguro de vida BBVA',
          subtitle: 'BBVA',
          entidad: 'BBVA',
          valorNum: 180000,
          cells: {
            vencimiento: '2040',
            prima: '520 €',
            fallecimiento: '180.000 €',
            invalidez: '150.000 €',
          },
        },
      ],
    },
  ];

  /** Tabs — "Todos" + one chip per section. Clicking filters the section list. */
  readonly activeTab = signal<string>('todos');
  readonly tabs = computed(() => {
    this.addedAssets();
    const base = [
      {
        key: 'todos',
        label: 'Todos',
        count: this.sections.reduce((s, sec) => s + this.sectionRowCount(sec), 0),
      },
    ];
    return base.concat(
      this.sections.map((sec) => ({
        key: sec.key,
        label: sec.title,
        count: this.sectionRowCount(sec),
      })),
    );
  });

  // ---- Animate tabs (Coherence brand transition) ----
  // Sliding underline indicator: we measure each tab button's offsetLeft/Width
  // and drive a single absolute-positioned span with a CSS transition on left/width.
  // Panels use a CSS keyframe that re-plays every time activeTab changes because
  // the @for track string includes activeTab() — forcing fresh DOM nodes. The
  // keyframe direction (slide-in-from-right vs slide-in-from-left) follows the
  // direction of tab movement so the motion reads as "advancing" or "going back".
  readonly tabDirection = signal<'forward' | 'backward'>('forward');

  setActiveTab(key: string): void {
    const list = this.tabs();
    const prevIdx = list.findIndex((t) => t.key === this.activeTab());
    const nextIdx = list.findIndex((t) => t.key === key);
    this.tabDirection.set(nextIdx >= prevIdx ? 'forward' : 'backward');
    this.activeTab.set(key);
  }
  readonly tabRefs = viewChildren<ElementRef<HTMLElement>>('tabBtn');
  readonly tabsScrollEl = viewChild<ElementRef<HTMLElement>>('tabsScroll');
  readonly assetRowRefs = viewChildren<ElementRef<HTMLElement>>('assetRow');
  private readonly resizeTick = signal(0);

  // Tab overflow affordances — show a chevron on each side only when there's more
  // to scroll in that direction. Updated from (scroll) on the container + resize.
  readonly tabsScrollLeft = signal(0);
  readonly tabsScrollWidth = signal(0);
  readonly tabsClientWidth = signal(0);
  readonly canScrollLeft = computed(() => this.tabsScrollLeft() > 1);
  readonly canScrollRight = computed(
    () => this.tabsScrollLeft() + this.tabsClientWidth() < this.tabsScrollWidth() - 1,
  );

  onTabsScroll(e: Event): void {
    const el = e.target as HTMLElement;
    this.tabsScrollLeft.set(el.scrollLeft);
    this.tabsScrollWidth.set(el.scrollWidth);
    this.tabsClientWidth.set(el.clientWidth);
  }
  /** Run once after the view measures, and on every resize, so the right chevron appears at load. */
  measureTabs(): void {
    const el = this.tabsScrollEl()?.nativeElement;
    if (!el) return;
    this.tabsScrollLeft.set(el.scrollLeft);
    this.tabsScrollWidth.set(el.scrollWidth);
    this.tabsClientWidth.set(el.clientWidth);
  }

  scrollTabs(direction: 1 | -1): void {
    const el = this.tabsScrollEl()?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: 220 * direction, behavior: 'smooth' });
  }

  private scrollLatestAddedIntoView(): void {
    const id = this.latestAddedAssetId();
    if (!id) return;
    const row = this.assetRowRefs().find((ref) => ref.nativeElement.dataset['assetRowId'] === id);
    row?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }

  readonly indicatorStyle = computed<Record<string, string>>(() => {
    this.resizeTick();
    const refs = this.tabRefs();
    const active = this.activeTab();
    const index = this.tabs().findIndex((t) => t.key === active);
    const el = refs[index]?.nativeElement;
    if (!el) return { left: '0px', width: '0px', opacity: '0' };
    return { left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px`, opacity: '1' };
  });

  @HostListener('window:resize')
  onWindowResize(): void {
    this.resizeTick.update((v) => v + 1);
    this.measureTabs();
  }

  /** Sections actually shown on the page — tab-filtered. "todos" shows everything. */
  readonly visibleSections = computed(() => {
    const t = this.activeTab();
    return t === 'todos' ? this.sections : this.sections.filter((s) => s.key === t);
  });

  private rowsForSection(section: AssetSection): AssetRow[] {
    const added = this.addedAssets()
      .filter((item) => item.sectionKey === section.key)
      .map((item) => item.row);
    return added.concat(section.rows);
  }

  isLatestAdded(row: AssetRow): boolean {
    return !!row.id && row.id === this.latestAddedAssetId();
  }

  rowActionId(section: AssetSection, row: AssetRow): string {
    return `${section.key}::${row.id ?? row.name}`;
  }

  toggleRowActions(section: AssetSection, row: AssetRow): void {
    const id = this.rowActionId(section, row);
    this.rowActionsOpen.set(this.rowActionsOpen() === id ? null : id);
  }

  /** Internal: count of visible rows (including children) for the tab count pill. */
  sectionRowCount(section: AssetSection): number {
    return this.rowsForSection(section).reduce((n, r) => n + 1 + (r.children?.length ?? 0), 0);
  }

  tableHeaderMeta(section: AssetSection, visibleRows: number): string {
    const total = this.sectionRowCount(section);
    const count =
      this.anyFilterActive() && visibleRows !== section.rows.length
        ? `${visibleRows} de ${total}`
        : `${total}`;
    const noun = total === 1 ? 'activo' : 'activos';
    const columns = section.columns.map((c) => c.label).join(', ');
    return `${count} ${noun} · Columnas: ${columns}`;
  }

  tableExplainer(): string {
    const active = this.activeTab();
    const section = this.sections.find((s) => s.key === active);
    if (section) {
      return `${section.title} muestra ${section.description.toLowerCase()} Las columnas cambian para enseñar solo los datos útiles de ese tipo de patrimonio.`;
    }
    return 'Cada sección define sus propias columnas según el tipo de activo: deudas aporta plazo pendiente, tipo de interés y capital pendiente; seguros aporta vencimiento, prima y capitales asegurados; inversiones permite desplegar holdings internos.';
  }

  /** Inversiones has expandable carteras — track which row keys are open. */
  readonly expandedRows = signal<Set<string>>(new Set());
  isRowExpanded(sectionKey: string, rowName: string): boolean {
    return this.expandedRows().has(`${sectionKey}::${rowName}`);
  }
  toggleRow(sectionKey: string, rowName: string): void {
    const s = new Set(this.expandedRows());
    const id = `${sectionKey}::${rowName}`;
    if (s.has(id)) s.delete(id);
    else s.add(id);
    this.expandedRows.set(s);
  }

  /** Grid template string per section — name column (flex) + per-config column widths + 32px actions. */
  gridTemplateFor(section: AssetSection): string {
    const parts = ['minmax(320px, 1fr)'].concat(section.columns.map((c) => c.width));
    parts.push('32px');
    return parts.join(' ');
  }

  // ---- Filter state ----
  readonly searchQuery = signal<string>('');
  readonly searchFocused = signal(false);
  readonly selectedEntidades = signal<Set<string>>(new Set<string>());
  readonly filterMin = signal<number | null>(null);
  readonly filterMax = signal<number | null>(null);

  readonly entidadMenuOpen = signal(false);
  readonly minMenuOpen = signal(false);
  readonly maxMenuOpen = signal(false);

  /** Autocomplete suggestions — flattened matches across every section's rows
   * (including expandable children), filtered by the current search query. */
  readonly searchSuggestions = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return [] as { name: string; section: string; entidad: string; valor: string }[];
    const out: { name: string; section: string; entidad: string; valor: string }[] = [];
    const push = (r: AssetRow, sectionTitle: string) => {
      const cellValues = Object.values(r.cells).join(' ');
      const hay =
        `${r.name} ${r.subtitle ?? ''} ${(r.nameTags ?? []).join(' ')} ${r.entidad} ${cellValues}`.toLowerCase();
      if (hay.includes(q)) {
        // Prefer a cell ending in "€" as the trailing label; fall back to the first cell.
        const values = Object.values(r.cells);
        const euro =
          values.find((v) => typeof v === 'string' && v.trim().endsWith('€')) ?? values[0] ?? '';
        out.push({ name: r.name, section: sectionTitle, entidad: r.entidad, valor: euro });
      }
    };
    for (const s of this.sections) {
      for (const r of this.rowsForSection(s)) {
        push(r, s.title);
        if (out.length >= 8) return out;
        for (const c of r.children ?? []) {
          push(c, s.title);
          if (out.length >= 8) return out;
        }
      }
    }
    return out;
  });

  onSearchFocus(): void {
    this.searchFocused.set(true);
  }
  onSearchBlur(): void {
    // Delay so a click on a suggestion fires before we hide the dropdown.
    setTimeout(() => this.searchFocused.set(false), 150);
  }
  pickSuggestion(name: string): void {
    this.searchQuery.set(name);
    this.searchFocused.set(false);
  }

  /** Unique entidades across every section's rows (plus children) — only
   * entidades the user actually has patrimonio in. Excludes "—" placeholder. */
  readonly availableEntidades = computed(() => {
    const s = new Set<string>();
    for (const sec of this.sections) {
      for (const r of this.rowsForSection(sec)) {
        if (r.entidad && r.entidad !== '—') s.add(r.entidad);
        for (const c of r.children ?? []) if (c.entidad && c.entidad !== '—') s.add(c.entidad);
      }
    }
    return [...s].sort((a, b) => a.localeCompare(b, 'es'));
  });

  /** Human-readable label shown on each filter chip — reflects applied state. */
  readonly entidadChipLabel = computed(() => {
    const n = this.selectedEntidades().size;
    const total = this.availableEntidades().length;
    if (n === 0) return 'Todas';
    if (n === total) return 'Todas';
    if (n === 1) return [...this.selectedEntidades()][0];
    return `${n} seleccionadas`;
  });
  readonly minChipLabel = computed(() => {
    const v = this.filterMin();
    return v === null ? null : this.formatEuroCompact(v);
  });
  readonly maxChipLabel = computed(() => {
    const v = this.filterMax();
    return v === null ? null : this.formatEuroCompact(v);
  });

  /** Short-form euro for chip labels — keeps the action bar from stretching.
   *  9.000 → "9K €", 150.000 → "150K €", 1.500.000 → "1,5M €", 100.000.000 → "100M €". */
  formatEuroCompact(n: number): string {
    const abs = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    if (abs >= 1_000_000) {
      const m = abs / 1_000_000;
      const label =
        m >= 10 ? Math.round(m).toString() : m.toFixed(1).replace('.', ',').replace(',0', '');
      return `${sign}${label}M €`;
    }
    if (abs >= 1_000) {
      return `${sign}${Math.round(abs / 1_000)}K €`;
    }
    return `${sign}${Math.round(abs)} €`;
  }

  isEntidadSelected(e: string): boolean {
    return this.selectedEntidades().has(e);
  }
  toggleEntidad(e: string): void {
    const s = new Set(this.selectedEntidades());
    if (s.has(e)) s.delete(e);
    else s.add(e);
    this.selectedEntidades.set(s);
  }
  clearEntidades(): void {
    this.selectedEntidades.set(new Set());
  }
  isAllEntidadesSelected(): boolean {
    const all = this.availableEntidades();
    const sel = this.selectedEntidades();
    return all.length > 0 && sel.size === all.length;
  }
  toggleAllEntidades(): void {
    if (this.isAllEntidadesSelected()) {
      this.selectedEntidades.set(new Set());
    } else {
      this.selectedEntidades.set(new Set(this.availableEntidades()));
    }
  }
  clearMin(): void {
    this.filterMin.set(null);
    this.minMenuOpen.set(false);
  }
  clearMax(): void {
    this.filterMax.set(null);
    this.maxMenuOpen.set(false);
  }

  onSearchInput(e: Event): void {
    this.searchQuery.set((e.target as HTMLInputElement).value);
  }
  onMinInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value.trim();
    this.filterMin.set(v === '' ? null : Number(v));
  }
  onMaxInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value.trim();
    this.filterMax.set(v === '' ? null : Number(v));
  }

  /** Returns the rows of a section that pass the search + entidad + min/max filters.
   * Parent row keeps if it matches, OR if any of its children match (so we can
   * still surface Carteras whose inner holdings match the filter). */
  filteredRows(section: AssetSection): AssetRow[] {
    const q = this.searchQuery().trim().toLowerCase();
    const ents = this.selectedEntidades();
    const min = this.filterMin();
    const max = this.filterMax();
    const latestId = this.latestAddedAssetId();
    const matches = (r: AssetRow) => {
      if (r.id && r.id === latestId) return true;
      if (q) {
        const hay =
          `${r.name} ${r.subtitle ?? ''} ${(r.nameTags ?? []).join(' ')} ${r.entidad} ${Object.values(r.cells).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (ents.size > 0 && !ents.has(r.entidad)) return false;
      if (min !== null && r.valorNum < min) return false;
      if (max !== null && r.valorNum > max) return false;
      return true;
    };
    return this.rowsForSection(section).filter(
      (r) => matches(r) || (r.children ?? []).some(matches),
    );
  }

  /** Aggregate of rows visible across the currently-visible sections
   * (respects both the tab filter and the search/entidad/min/max filters). */
  readonly visibleCount = computed(() => {
    return this.visibleSections().reduce((sum, s) => sum + this.filteredRows(s).length, 0);
  });

  readonly anyFilterActive = computed(
    () =>
      this.searchQuery().trim() !== '' ||
      this.selectedEntidades().size > 0 ||
      this.filterMin() !== null ||
      this.filterMax() !== null,
  );

  clearAllFilters(): void {
    this.searchQuery.set('');
    this.selectedEntidades.set(new Set());
    this.filterMin.set(null);
    this.filterMax.set(null);
  }
}
