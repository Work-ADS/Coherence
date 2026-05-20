import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  SidebarComponent,
  NavSectionComponent,
  NavItemComponent,
  SelectComponent,
  IconButtonComponent,
  ButtonComponent,
  SegmentedControlComponent,
  LogoComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

type ThemeMode = 'light' | 'dark';

const ALL_TOKEN_ROWS: (TokenRow & { category: string })[] = [
  // Color
  { category: 'Color', property: 'Sidebar background', token: '--nav-sidebar', semantic: '--control-background-default', primitive: '--color-afi-control-50' },
  { category: 'Color', property: 'Border', token: '--border-subtle', semantic: '--border-subtle', primitive: '--color-afi-control-100' },
  { category: 'Color', property: 'Pin (active)', token: '--brand-primary-foreground-default', semantic: '--brand-primary-foreground-default', primitive: '--color-afi-azul-profundo-0 (#FFFFFF)' },
  { category: 'Color', property: 'Pin (idle)', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-400' },
  { category: 'Color', property: 'Section trigger hover', token: '--nav-item-background-hover', semantic: '--control-background-hover', primitive: '--color-afi-control-100' },
  { category: 'Color', property: 'Section active text', token: '--nav-item-foreground-selected', semantic: '—', primitive: '--color-afi-azul-profundo-500 (#062D3F)' },
  { category: 'Color', property: 'Tree line', token: '--border-subtle', semantic: '--border-subtle', primitive: '--color-afi-control-100' },
  { category: 'Color', property: 'Trail marker', token: '--brand-primary-border-default', semantic: '--brand-primary-border-default', primitive: '--color-afi-azul-profundo-500 (#062D3F)' },
  // Spacing
  { category: 'Spacing', property: 'Logo row height', token: '--dimension-12', semantic: '--dimension-12', primitive: '48px' },
  { category: 'Spacing', property: 'Logo row padding', token: '--space-md', semantic: '--space-md', primitive: '--dimension-4 (16px)' },
  { category: 'Spacing', property: 'Content padding', token: '--space-xs', semantic: '--space-xs', primitive: '--dimension-2 (8px)' },
  { category: 'Spacing', property: 'Children indent', token: '--space-md', semantic: '--space-md', primitive: '--dimension-4 (16px)' },
  // Border Radius
  { category: 'Border Radius', property: 'Pin/toggle buttons', token: '--radius-sm', semantic: '--radius-sm', primitive: '6px' },
  { category: 'Border Radius', property: 'Section trigger', token: '--radius-sm', semantic: '--radius-sm', primitive: '6px' },
  // Motion
  { category: 'Motion', property: 'Width transition', token: '--duration-base', semantic: '--duration-base', primitive: '200ms' },
  { category: 'Motion', property: 'Easing', token: '--easing-standard', semantic: '--easing-standard', primitive: 'cubic-bezier(0.2, 0, 0, 1)' },
  { category: 'Motion', property: 'Chevron rotation', token: '--duration-fast', semantic: '--duration-fast', primitive: '150ms' },
  { category: 'Motion', property: 'Expand/collapse', token: '--duration-base', semantic: '--duration-base', primitive: '200ms (grid-template-rows)' },
];

@Component({
  selector: 'app-sidebar-page',
  standalone: true,
  imports: [
    RouterLink,
    SidebarComponent,
    NavSectionComponent,
    NavItemComponent,
    SelectComponent,
    IconButtonComponent,
    ButtonComponent,
    SegmentedControlComponent,
    LogoComponent,
    TokensTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <!-- Breadcrumb -->
      <nav class="text-body-sm text-neutral-400 mb-space-4" aria-label="Breadcrumb">
        <a routerLink="/componentes" class="hover:text-canvas-fg transition-colors duration-fast">Components</a>
        <span class="mx-1.5 text-neutral-300">/</span>
        <span class="text-canvas-fg">Sidebar</span>
      </nav>

      <!-- Header -->
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">PATTERN</p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Sidebar</h1>

      <!-- Context -->
      <p class="max-w-[640px] text-body-md text-neutral-500 mb-space-6">
        A vertical navigation rail that houses the app's primary navigation structure.
        Supports three modes — static (always open), collapsible (toggle button), and
        hover-expand (expand on hover, pin to lock open). Composes NavSection groups
        with NavItem children, tree-line visuals, and a logo slot at the top.
      </p>

      <!-- Use Cases -->
      <section class="mb-space-10">
        <h2 id="use-cases" class="text-section text-canvas-fg mb-space-4">Use Cases</h2>
        <ul class="list-disc pl-space-6 space-y-space-2 text-body-md text-neutral-500 max-w-[640px]">
          <li><span class="font-medium">App shell navigation</span> — persistent sidebar with grouped nav items for multi-section apps.</li>
          <li><span class="font-medium">Collapsible mode</span> — sidebar collapses to icon-only rail to save space; labels reappear on expand.</li>
          <li><span class="font-medium">Hover-expand mode</span> — sidebar stays collapsed until hovered; pinnable for permanent expansion.</li>
          <li><span class="font-medium">Grouped sections</span> — NavSections with chevron expand/collapse and optional tree-line visuals.</li>
          <li><span class="font-medium">Logo + footer slots</span> — top slot for branding, bottom slot for user info or settings.</li>
        </ul>
      </section>

      <!-- ─── Controls ─── -->
      <div class="flex flex-wrap items-center gap-space-6 mb-space-8">
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Mode</span>
          <afi-select
            [options]="modeOptions"
            [value]="sidebarMode()"
            (valueChange)="sidebarMode.set($event + '')"
            size="sm"
            ariaLabel="Sidebar mode"
          />
        </div>
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Variant</span>
          <afi-select
            [options]="variantOptions"
            [value]="sidebarVariant()"
            (valueChange)="sidebarVariant.set($event + '')"
            size="sm"
            ariaLabel="Sidebar variant"
          />
        </div>
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Active item</span>
          <afi-select
            [options]="activeOptions"
            [value]="activeItem()"
            (valueChange)="activeItem.set($event + '')"
            size="sm"
            ariaLabel="Active item"
          />
        </div>
        <!-- Theme toggle -->
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Theme</span>
          <afi-icon-button
            [ariaLabel]="mode() === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
            variant="outline"
            size="sm"
            (clicked)="toggleMode()"
          >
            @if (mode() === 'light') {
              <svg slot="icon" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            } @else {
              <svg slot="icon" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            }
          </afi-icon-button>
        </div>
      </div>

      <!-- ─── Live preview ─── -->
      <div
        class="rounded-lg border border-neutral-700 overflow-hidden mb-space-8"
        [class.bg-white]="mode() === 'light'"
        [class.bg-neutral-950]="mode() === 'dark'"
        style="height: 480px;"
      >
        <afi-sidebar [mode]="$any(sidebarMode())" [variant]="$any(sidebarVariant())" ariaLabel="Demo sidebar">
          <div slot="top">
            <coherence-logo variant="color" size="sm" />
          </div>

          <afi-nav-section label="Platform" [defaultExpanded]="true">
            <afi-nav-item label="Dashboard" [active]="activeItem() === 'dashboard'">
              <svg slot="icon" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </afi-nav-item>
            <afi-nav-item label="Analytics" [active]="activeItem() === 'analytics'">
              <svg slot="icon" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </afi-nav-item>
            <afi-nav-item label="Settings" [active]="activeItem() === 'settings'">
              <svg slot="icon" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </afi-nav-item>
          </afi-nav-section>

          <afi-nav-section label="Resources">
            <afi-nav-item label="Documentation" [active]="activeItem() === 'docs'">
              <svg slot="icon" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </afi-nav-item>
            <afi-nav-item label="Support" [active]="activeItem() === 'support'" [badge]="3">
              <svg slot="icon" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </afi-nav-item>
          </afi-nav-section>

          <div slot="bottom" class="text-body-sm text-neutral-400">
            v1.0.0
          </div>
        </afi-sidebar>
      </div>

      <!-- ─── Tokens ─── -->
      <section class="mb-space-10">
        <div class="flex items-center justify-between mb-space-4">
          <h2 id="tokens" class="text-section text-canvas-fg">Tokens</h2>
          <afi-button
            variant="secondary"
            size="sm"
            [ariaLabel]="tokensCopied() ? 'Copied' : 'Copy tokens'"
            (clicked)="copyTokens()"
          >
            {{ tokensCopied() ? 'Copied' : 'Copy' }}
          </afi-button>
        </div>
        <div class="mb-space-4">
          <afi-segmented-control
            [options]="tokenCategoryOptions"
            [(value)]="tokenCategory"
            size="sm"
            ariaLabel="Token category"
          />
        </div>
        <afi-tokens-table [rows]="filteredTokenRows()" title="" />
      </section>

      <!-- ─── Accessibility ─── -->
      <section class="mb-space-10">
        <h2 id="accessibility" class="text-section text-canvas-fg mb-space-4">Accessibility</h2>
        <ul class="list-disc pl-space-6 space-y-space-2 text-body-md text-neutral-500 max-w-[640px]">
          <li>Sidebar uses <code class="font-mono text-body-sm">&lt;nav&gt;</code> with <code class="font-mono text-body-sm">aria-label</code>.</li>
          <li>Expand/collapse state exposed via <code class="font-mono text-body-sm">aria-expanded</code>.</li>
          <li>NavSection triggers use <code class="font-mono text-body-sm">aria-expanded</code> and <code class="font-mono text-body-sm">aria-controls</code>.</li>
          <li>Keyboard navigation: Arrow Up/Down moves between items, Home/End jump to first/last.</li>
          <li>Pin and collapse buttons have descriptive <code class="font-mono text-body-sm">aria-label</code>.</li>
          <li>Supports <code class="font-mono text-body-sm">prefers-reduced-motion</code> — width and expand transitions disabled.</li>
        </ul>
      </section>

      <!-- ─── Dos & Don'ts ─── -->
      <section class="mb-space-10">
        <h2 id="dos-donts" class="text-section text-canvas-fg mb-space-4">Dos & Don'ts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-6">
          <div class="rounded-lg border border-green-200 bg-green-50/40 p-space-6">
            <p class="text-body-sm font-medium text-green-700 mb-space-3">Do</p>
            <ul class="list-disc pl-space-5 space-y-space-2 text-body-sm text-neutral-600">
              <li>Group related nav items into sections with clear labels.</li>
              <li>Use tree lines to show hierarchy in nested navigation.</li>
              <li>Place logo in the top slot for consistent branding.</li>
              <li>Provide a pin option for hover-expand mode.</li>
            </ul>
          </div>
          <div class="rounded-lg border border-red-200 bg-red-50/40 p-space-6">
            <p class="text-body-sm font-medium text-red-700 mb-space-3">Don't</p>
            <ul class="list-disc pl-space-5 space-y-space-2 text-body-sm text-neutral-600">
              <li>Don't nest more than 2 levels deep — flatten the hierarchy.</li>
              <li>Don't use more than 7±2 items per section.</li>
              <li>Don't hide critical navigation behind hover-expand without pin.</li>
              <li>Don't mix navigation and action buttons in the same section.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class SidebarPage {
  readonly sidebarMode = signal('static');
  readonly sidebarVariant = signal('neutral');
  readonly activeItem = signal('dashboard');
  readonly mode = signal<ThemeMode>('dark');
  readonly tokenCategory = signal('Color');
  readonly tokensCopied = signal(false);

  readonly modeOptions: SelectOption[] = [
    { label: 'Static', value: 'static' },
    { label: 'Collapsible', value: 'collapsible' },
    { label: 'Hover-expand', value: 'hover-expand' },
  ];

  readonly variantOptions: SelectOption[] = [
    { label: 'Neutral', value: 'neutral' },
    { label: 'Brand', value: 'brand' },
  ];

  readonly activeOptions: SelectOption[] = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Analytics', value: 'analytics' },
    { label: 'Settings', value: 'settings' },
    { label: 'Documentation', value: 'docs' },
    { label: 'Support', value: 'support' },
  ];

  readonly tokenCategoryOptions = [
    { value: 'Color', label: 'Color' },
    { value: 'Spacing', label: 'Spacing' },
    { value: 'Border Radius', label: 'Border Radius' },
    { value: 'Motion', label: 'Motion' },
  ];

  readonly filteredTokenRows = computed(() => {
    const cat = this.tokenCategory();
    return ALL_TOKEN_ROWS
      .filter(r => r.category === cat)
      .map(({ category, ...rest }) => rest);
  });

  toggleMode(): void {
    this.mode.set(this.mode() === 'light' ? 'dark' : 'light');
  }

  copyTokens(): void {
    const text = ALL_TOKEN_ROWS.map(r => `${r.property}: ${r.token}`).join('\n');
    navigator.clipboard.writeText(text);
    this.tokensCopied.set(true);
    setTimeout(() => this.tokensCopied.set(false), 2000);
  }
}
