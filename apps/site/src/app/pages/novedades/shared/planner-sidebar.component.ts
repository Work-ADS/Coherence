import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { LogoComponent, SidebarComponent } from '@coherence/ui';

export type NavItemState = 'empty' | 'in-progress' | 'complete';

export type NavIcon =
  | 'users'
  | 'landmark'
  | 'wallet'
  | 'arrow-down-to-line'
  | 'arrow-up-from-line'
  | 'palmtree'
  | 'trending-up'
  | 'clock'
  | 'shield-plus'
  | 'chart-line'
  | 'git-branch'
  | 'droplets'
  | 'git-fork'
  | 'line-chart'
  | 'target'
  | 'file-text'
  | 'user-check'
  | 'activity'
  | 'list-checks'
  | 'flag';

export type NavItem = {
  key: string;
  label: string;
  state: NavItemState;
  icon: NavIcon;
};

export type NavSection = {
  label: string;
  items: NavItem[];
  /** When true, items in this section render their right-side state dot.
   *  Reserved for the "obligatorios" group (Situación actual) — other groups
   *  are computed/system-driven and don't represent gestor work-in-progress. */
  mandatory?: boolean;
  /** Optional icon shown next to the section label as a visual anchor in
   *  the dense expanded sidebar. Per-item icons are removed in expanded
   *  state — they don't earn their space when labels are already clear. */
  icon?: NavIcon;
};

/**
 * Wealth Planner sidebar used across the Novedades proposals.
 *
 * Flat sections (no collapse) + per-item state dot — inspired by the Claude /
 * Cursor sidebar pattern: quiet section labels above a list of items, each
 * carrying a small indicator that tells you where that step is in the flow.
 *
 * State vocabulary (richerd-approved):
 *   - empty        → hollow ring, muted white
 *   - in-progress  → half-filled disc, azul
 *   - complete     → filled disc + check, success green
 *
 * Active = the item the user is currently viewing. Independent from state —
 * any state can also be active.
 */
@Component({
  selector: 'site-planner-sidebar',
  standalone: true,
  imports: [LogoComponent, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: contents;
    }
    :host ::ng-deep .planner-sidebar afi-sidebar > nav > button[aria-label*='navegación'] {
      display: none !important;
    }
    /* Let tooltips escape the narrow rail. Inner scroll container keeps its own overflow. */
    :host ::ng-deep .planner-sidebar afi-sidebar > nav {
      overflow: visible !important;
    }
    :host ::ng-deep .planner-sidebar afi-sidebar {
      overflow: visible !important;
    }
    /* Tighter widths: expanded stays readable, collapsed shrinks close to Figma's rail.
       Also tighten the sidebar body padding so icons sit centered in the narrow rail. */
    :host ::ng-deep .planner-sidebar afi-sidebar > nav > div[role='list'] {
      padding-left: 8px !important;
      padding-right: 8px !important;
    }
    /* Narrow rail: slim the top + bottom slot padding to fit the logo/avatar in ~52px. */
    :host ::ng-deep .planner-rail-collapsed afi-sidebar > nav > div:first-child,
    :host ::ng-deep .planner-rail-collapsed afi-sidebar > nav > div:last-child {
      padding-left: 8px !important;
      padding-right: 8px !important;
    }
    /* When collapsed, the Afi icon logo can drop a touch for better optical centering. */
    :host ::ng-deep .planner-rail-collapsed coherence-logo {
      height: var(--dim-20, 20px) !important;
    }
    /* Custom nav item (not using afi-nav-item so we can have a trailing state dot) */
    .pn-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      width: 100%;
      padding: 6px 8px;
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.85);
      font-size: 13px;
      line-height: 18px;
      text-align: left;
      background: transparent;
      border: 0;
      cursor: pointer;
      transition:
        background-color 120ms ease-out,
        color 120ms ease-out;
    }
    /* When the sidebar is collapsed (only icon visible), center the icon in the rail */
    .planner-rail-collapsed .pn-item {
      justify-content: center;
      padding-left: 0;
      padding-right: 0;
    }
    .pn-item:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #ffffff;
    }
    .pn-item:focus-visible {
      outline: 2px solid #37bbf4;
      outline-offset: 2px;
    }
    .pn-item.is-active {
      background: rgba(55, 187, 244, 0.14);
      color: #ffffff;
      font-weight: 600;
    }
    .pn-item .pn-icon,
    .pn-item .pn-state {
      flex-shrink: 0;
      color: currentColor;
    }
    .pn-item .pn-icon {
      width: 16px;
      height: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .pn-item .pn-icon > svg {
      width: 16px;
      height: 16px;
    }
    .pn-item .pn-label {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pn-item .pn-state {
      width: 12px;
      height: 12px;
      opacity: 0.75;
    }

    /* Gestor footer typography — strong hierarchy between name and role */
    .gestor-avatar-text {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .gestor-name {
      font-size: 13px;
      line-height: 16px;
      font-weight: 500;
      color: #ffffff;
    }
    .gestor-role {
      font-size: 10px;
      line-height: 14px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 1px;
    }
    /* Section label pill — matches Figma: small, tracked, secondary fg, rounded pill at 8/4 */
    .section-label {
      font-size: 11px;
      line-height: 16px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.55);
      font-weight: 600;
    }
    /* Section-group icon — visual anchor next to the section label when expanded.
       Sized like a glyph beside small uppercase text. */
    .section-icon {
      flex-shrink: 0;
      width: 14px;
      height: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.55);
    }
    .section-icon > svg {
      width: 14px;
      height: 14px;
    }
    /* Tooltip — shown next to the collapsed-mode gestor avatar. Pops to the right. */
    .tt-pop-right {
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 8px;
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
    .group\\/tt:hover .tt-pop-right,
    .group\\/tt:focus-within .tt-pop-right {
      opacity: 1;
    }
  `,
  template: `
    <div
      class="planner-sidebar flex shrink-0"
      [class.planner-rail-collapsed]="!expanded()"
      style="
        --surface-quiet: #041F2C;
        --surface-base: #041F2C;
        --surface-100: rgba(255,255,255,0.08);
        --surface-muted: rgba(255,255,255,0.05);
        --canvas-fg: #ffffff;
        --border-hairline: rgba(255,255,255,0.12);
        --color-neutral-400: rgba(255,255,255,0.6);
        --color-neutral-500: rgba(255,255,255,0.75);
        --color-neutral-600: rgba(255,255,255,0.85);
        --color-neutral-700: rgba(255,255,255,0.9);
        --color-neutral-900: #ffffff;
        --color-action-900: #ffffff;
        --color-action: #37BBF4;
        --action: #37BBF4;
        --action-900: #ffffff;
        color: #ffffff;"
    >
      <afi-sidebar
        #sidebarRef
        mode="collapsible"
        [ariaLabel]="ariaLabel()"
        [width]="{ collapsed: '52px', expanded: '244px' }"
        (expandedChange)="onExpandedChange($event)"
      >
        <!-- Top slot: logo + toggle (stacks vertically when collapsed for narrow rail) -->
        <div
          slot="top"
          class="flex items-center gap-space-2 min-w-0 w-full"
          [class.!flex-col]="!expanded()"
          [class.!gap-[6px]]="!expanded()"
        >
          @if (expanded()) {
            <coherence-logo variant="negativo" size="sm" />
            <div class="w-px h-4 bg-white/30 shrink-0"></div>
            <span class="text-body-sm font-light truncate flex-1">Wealth planner</span>
          } @else {
            <coherence-logo form="icon" variant="negativo" size="sm" />
          }
          <button
            type="button"
            (click)="toggleCollapse()"
            [attr.title]="
              (expanded() ? 'Ocultar barra lateral' : 'Mostrar barra lateral') + ' (⌘O)'
            "
            class="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded hover:bg-white/10 text-white/80 transition-colors"
            [attr.aria-label]="expanded() ? 'Ocultar barra lateral' : 'Mostrar barra lateral'"
            aria-keyshortcuts="Meta+O Control+O"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
              @if (expanded()) {
                <path d="m16 15-3-3 3-3" />
              } @else {
                <path d="m14 9 3 3-3 3" />
              }
            </svg>
          </button>
        </div>

        <!-- Flat nav groups — section label + items with state dots. No chevrons. -->
        <div class="w-full flex flex-col gap-space-5 mt-space-2">
          @for (section of sections(); track section.label) {
            <div class="flex flex-col gap-space-1">
              @if (expanded()) {
                <div class="flex items-center gap-space-2 px-space-2 mb-space-1">
                  @if (section.icon) {
                    <span class="section-icon">
                      @switch (section.icon) {
                        @case ('user-check') {
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <polyline points="17 11 19 13 23 9" />
                          </svg>
                        }
                        @case ('target') {
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                          </svg>
                        }
                        @case ('activity') {
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                          </svg>
                        }
                        @case ('list-checks') {
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <path d="m3 17 2 2 4-4" />
                            <path d="m3 7 2 2 4-4" />
                            <path d="M13 6h8" />
                            <path d="M13 12h8" />
                            <path d="M13 18h8" />
                          </svg>
                        }
                        @case ('flag') {
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                            <line x1="4" x2="4" y1="22" y2="15" />
                          </svg>
                        }
                        @case ('file-text') {
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                            <path d="M10 9H8" />
                            <path d="M16 13H8" />
                            <path d="M16 17H8" />
                          </svg>
                        }
                      }
                    </span>
                  }
                  <p class="section-label">{{ section.label }}</p>
                </div>
              }
              <div class="flex flex-col">
                @for (item of section.items; track item.key) {
                  <span class="relative w-full inline-flex group/tt">
                    <button
                      type="button"
                      class="pn-item"
                      [class.is-active]="item.key === activeKey()"
                      [attr.aria-current]="item.key === activeKey() ? 'page' : null"
                      [attr.aria-label]="item.label"
                    >
                      <!-- Per-item icon: kept only when collapsed (the icon IS the label).
                           In expanded state it'd just compete with the clear text label. -->
                      @if (!expanded()) {
                        <span class="pn-icon">
                          @switch (item.icon) {
                            @case ('users') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M18 21a8 8 0 0 0-16 0" />
                                <circle cx="10" cy="8" r="5" />
                                <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                              </svg>
                            }
                            @case ('landmark') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <line x1="3" x2="21" y1="22" y2="22" />
                                <line x1="6" x2="6" y1="18" y2="11" />
                                <line x1="10" x2="10" y1="18" y2="11" />
                                <line x1="14" x2="14" y1="18" y2="11" />
                                <line x1="18" x2="18" y1="18" y2="11" />
                                <polygon points="12 2 20 7 4 7" />
                              </svg>
                            }
                            @case ('wallet') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <path
                                  d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
                                />
                                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                              </svg>
                            }
                            @case ('arrow-down-to-line') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M12 17V3" />
                                <path d="m6 11 6 6 6-6" />
                                <path d="M19 21H5" />
                              </svg>
                            }
                            @case ('arrow-up-from-line') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <path d="m18 9-6-6-6 6" />
                                <path d="M12 3v14" />
                                <path d="M5 21h14" />
                              </svg>
                            }
                            @case ('palmtree') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" />
                                <path
                                  d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3"
                                />
                                <path
                                  d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35z"
                                />
                                <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" />
                              </svg>
                            }
                            @case ('trending-up') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                <polyline points="16 7 22 7 22 13" />
                              </svg>
                            }
                            @case ('clock') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                            }
                            @case ('shield-plus') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <path
                                  d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                                />
                                <path d="M9 12h6" />
                                <path d="M12 9v6" />
                              </svg>
                            }
                            @case ('chart-line') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                                <path d="m19 9-5 5-4-4-3 3" />
                              </svg>
                            }
                            @case ('git-branch') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <line x1="6" x2="6" y1="3" y2="15" />
                                <circle cx="18" cy="6" r="3" />
                                <circle cx="6" cy="18" r="3" />
                                <path d="M18 9a9 9 0 0 1-9 9" />
                              </svg>
                            }
                            @case ('droplets') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <path
                                  d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.09 3 12.25c0 2.22 1.8 4.05 4 4.05z"
                                />
                                <path
                                  d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"
                                />
                              </svg>
                            }
                            @case ('git-fork') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <circle cx="12" cy="18" r="3" />
                                <circle cx="6" cy="6" r="3" />
                                <circle cx="18" cy="6" r="3" />
                                <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
                                <path d="M12 12v3" />
                              </svg>
                            }
                            @case ('line-chart') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M3 3v18h18" />
                                <path d="m19 9-5 5-4-4-3 3" />
                              </svg>
                            }
                            @case ('target') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="6" />
                                <circle cx="12" cy="12" r="2" />
                              </svg>
                            }
                            @case ('file-text') {
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                              >
                                <path
                                  d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
                                />
                                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                                <path d="M10 9H8" />
                                <path d="M16 13H8" />
                                <path d="M16 17H8" />
                              </svg>
                            }
                          }
                        </span>
                      }
                      @if (expanded()) {
                        <!-- Label -->
                        <span class="pn-label">{{ item.label }}</span>
                        <!-- Right state dot: only on mandatory sections (Situación actual). Other sections
                             are computed/system-driven, so a per-item dot would imply gestor work that
                             can't actually be done — misleading. -->
                        @if (section.mandatory) {
                          @switch (item.state) {
                            @case ('empty') {
                              <svg
                                class="pn-state"
                                viewBox="0 0 16 16"
                                fill="none"
                                aria-hidden="true"
                              >
                                <circle
                                  cx="8"
                                  cy="8"
                                  r="5"
                                  stroke="currentColor"
                                  stroke-width="1.3"
                                  fill="none"
                                />
                              </svg>
                            }
                            @case ('in-progress') {
                              <svg
                                class="pn-state"
                                viewBox="0 0 16 16"
                                fill="none"
                                aria-hidden="true"
                              >
                                <circle
                                  cx="8"
                                  cy="8"
                                  r="5.25"
                                  stroke="currentColor"
                                  stroke-width="1.4"
                                  fill="none"
                                />
                                <path d="M8 2.75 A 5.25 5.25 0 0 1 8 13.25 Z" fill="currentColor" />
                              </svg>
                            }
                          }
                        }
                      }
                    </button>
                    @if (!expanded()) {
                      <span role="tooltip" class="tt-pop-right">{{ item.label }}</span>
                    }
                  </span>
                }
              </div>
            </div>
          }
        </div>

        <!-- Gestor footer — slot=bottom of afi-sidebar -->
        <div slot="bottom" class="flex items-center gap-space-2 min-w-0 w-full">
          <span class="relative inline-flex group/tt">
            <span
              class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white shrink-0 gestor-avatar-text"
              [attr.aria-label]="gestorName() + ' · ' + gestorRole()"
            >
              {{ gestorInitials() }}
            </span>
            @if (!expanded()) {
              <span role="tooltip" class="tt-pop-right"
                >{{ gestorName() }} · {{ gestorRole() }}</span
              >
            }
          </span>
          @if (expanded()) {
            <div class="min-w-0 flex-1 flex flex-col">
              <span class="gestor-name truncate">{{ gestorName() }}</span>
              <span class="gestor-role truncate">{{ gestorRole() }}</span>
            </div>
          }
        </div>
      </afi-sidebar>
    </div>
  `,
})
export class PlannerSidebarComponent {
  readonly activeKey = input<string>('');
  readonly ariaLabel = input<string>('Navegación del planificador financiero');
  readonly gestorName = input<string>('Elena Torres');
  readonly gestorRole = input<string>('Gestora');
  readonly gestorInitials = input<string>('ET');
  readonly expandedChange = output<boolean>();
  readonly toggled = output<boolean>();

  readonly sidebarRef = viewChild<SidebarComponent>('sidebarRef');
  readonly expanded = signal(true);

  readonly sections = computed<NavSection[]>(() => [
    {
      label: 'Situación actual',
      mandatory: true,
      icon: 'user-check',
      items: [
        { key: 'familia', label: 'Familia', state: 'complete', icon: 'users' },
        { key: 'sociedades', label: 'Sociedades', state: 'complete', icon: 'landmark' },
        { key: 'patrimonio', label: 'Patrimonio', state: 'complete', icon: 'wallet' },
        { key: 'ingresos', label: 'Ingresos', state: 'in-progress', icon: 'arrow-down-to-line' },
        { key: 'gastos', label: 'Gastos', state: 'empty', icon: 'arrow-up-from-line' },
      ],
    },
    {
      label: 'Objetivos',
      icon: 'target',
      items: [
        { key: 'legado-retiro', label: 'Legado y retiro', state: 'in-progress', icon: 'palmtree' },
        {
          key: 'inversiones-futuras',
          label: 'Inversiones futuras',
          state: 'empty',
          icon: 'trending-up',
        },
        {
          key: 'desinversiones-futuras',
          label: 'Desinversiones futuras',
          state: 'empty',
          icon: 'clock',
        },
        {
          key: 'proteccion-familiar',
          label: 'Protección familiar',
          state: 'empty',
          icon: 'shield-plus',
        },
      ],
    },
    {
      label: 'Diagnóstico',
      icon: 'activity',
      items: [
        {
          key: 'patrimonio-previsto',
          label: 'Patrimonio previsto',
          state: 'empty',
          icon: 'chart-line',
        },
        { key: 'estrategias', label: 'Estrategias', state: 'empty', icon: 'git-branch' },
      ],
    },
    {
      label: 'Plan de acción',
      icon: 'list-checks',
      items: [
        {
          key: 'optimizacion-liquidez',
          label: 'Optimización de la liquidez',
          state: 'empty',
          icon: 'droplets',
        },
        {
          key: 'optimizacion-asset',
          label: 'Optimización del asset allocation',
          state: 'empty',
          icon: 'git-fork',
        },
      ],
    },
    {
      label: 'Conclusiones',
      icon: 'flag',
      items: [
        {
          key: 'evolucion-comparada',
          label: 'Evolución comparada',
          state: 'empty',
          icon: 'line-chart',
        },
        {
          key: 'consecucion-objetivos',
          label: 'Consecución de objetivos',
          state: 'empty',
          icon: 'target',
        },
      ],
    },
    {
      label: 'Informe',
      icon: 'file-text',
      items: [
        {
          key: 'generador-informes',
          label: 'Generador de informes',
          state: 'empty',
          icon: 'file-text',
        },
      ],
    },
  ]);

  toggleCollapse(): void {
    this.sidebarRef()?.toggleCollapse();
  }

  onExpandedChange(e: boolean): void {
    this.expanded.set(e);
    this.expandedChange.emit(e);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      this.toggleCollapse();
    }
  }
}
