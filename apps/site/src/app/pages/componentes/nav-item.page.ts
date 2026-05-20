import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  NavItemComponent,
  SelectComponent,
  IconButtonComponent,
  ButtonComponent,
  SegmentedControlComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

type ThemeMode = 'light' | 'dark';
type NavVariant = 'neutral' | 'brand';

const NEUTRAL_TOKEN_ROWS: (TokenRow & { category: string })[] = [
  // Background
  { category: 'Background', property: 'Idle', token: '--nav-item-background-default', semantic: 'transparent', primitive: 'transparent' },
  { category: 'Background', property: 'Hover', token: '--nav-item-background-hover', semantic: '--control-background-hover', primitive: '--color-afi-control-100' },
  { category: 'Background', property: 'Active', token: '--nav-item-background-active', semantic: '--control-background-active', primitive: '--color-afi-control-100' },
  { category: 'Background', property: 'Selected', token: '--nav-item-background-selected', semantic: '--control-background-selected', primitive: '--color-afi-control-100' },
  { category: 'Background', property: 'Sidebar', token: '--nav-sidebar', semantic: '--control-background-default', primitive: '--color-afi-control-50' },
  // Foreground
  { category: 'Foreground', property: 'Idle', token: '--nav-item-foreground-default', semantic: '--control-foreground-default', primitive: '--color-afi-control-800' },
  { category: 'Foreground', property: 'Hover', token: '--nav-item-foreground-hover', semantic: '--control-foreground-hover', primitive: '--color-afi-control-900' },
  { category: 'Foreground', property: 'Active', token: '--nav-item-foreground-active', semantic: '--control-foreground-active', primitive: '--color-afi-azul-profundo-500' },
  { category: 'Foreground', property: 'Selected', token: '--nav-item-foreground-selected', semantic: '--control-foreground-selected', primitive: '--color-afi-azul-profundo-500' },
  { category: 'Foreground', property: 'Icon (idle)', token: '--nav-item-icon-default', semantic: '--control-foreground-default', primitive: '--color-afi-control-800' },
  { category: 'Foreground', property: 'Icon (hover)', token: '--nav-item-icon-hover', semantic: '--control-foreground-hover', primitive: '--color-afi-control-900' },
  { category: 'Foreground', property: 'Icon (selected)', token: '--nav-item-icon-selected', semantic: '--control-foreground-selected', primitive: '--color-afi-azul-profundo-500' },
  { category: 'Foreground', property: 'Focus ring', token: '--border-focus', semantic: '--control-border-focus', primitive: '--border-focus' },
  // Type
  { category: 'Type', property: 'Font (default)', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '14px/1.4 400' },
  { category: 'Type', property: 'Font (active)', token: 'font-weight: 500', semantic: '—', primitive: '500' },
  // Spacing
  { category: 'Spacing', property: 'Padding', token: '--space-xs', semantic: '--space-xs', primitive: '--dimension-2 (8px)' },
  { category: 'Spacing', property: 'Gap', token: '--space-sm', semantic: '--space-sm', primitive: '--dimension-3 (12px)' },
  // Border Radius
  { category: 'Border Radius', property: 'Item radius', token: '--radius-sm', semantic: '--radius-sm', primitive: '6px' },
  // Motion
  { category: 'Motion', property: 'Duration', token: '--duration-fast', semantic: '--duration-fast', primitive: '150ms' },
  { category: 'Motion', property: 'Easing', token: '--easing-standard', semantic: '--easing-standard', primitive: 'cubic-bezier(0.2, 0, 0, 1)' },
];

const BRAND_TOKEN_ROWS: (TokenRow & { category: string })[] = [
  // Background — full brand surface (azul-profundo-500)
  { category: 'Background', property: 'Idle', token: '--nav-item-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-profundo-500' },
  { category: 'Background', property: 'Hover', token: '--nav-item-background-hover', semantic: '--brand-secondary-background-hover', primitive: '--color-afi-azul-profundo-400' },
  { category: 'Background', property: 'Active', token: '--nav-item-background-active', semantic: '--brand-secondary-background-active', primitive: '--color-afi-azul-profundo-500' },
  { category: 'Background', property: 'Selected', token: '--nav-item-background-selected', semantic: '--brand-secondary-background-active', primitive: '--color-afi-azul-profundo-500' },
  { category: 'Background', property: 'Sidebar', token: '--nav-sidebar', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-profundo-500' },
  // Foreground — white text on brand surface
  { category: 'Foreground', property: 'Idle', token: '--nav-item-foreground-default', semantic: '--brand-secondary-foreground-default', primitive: '--color-afi-azul-profundo-0 (#FFF)' },
  { category: 'Foreground', property: 'Hover', token: '--nav-item-foreground-hover', semantic: '--brand-secondary-foreground-hover', primitive: '--color-afi-azul-profundo-25' },
  { category: 'Foreground', property: 'Active', token: '--nav-item-foreground-active', semantic: '--brand-secondary-foreground-active', primitive: '--color-afi-azul-profundo-50' },
  { category: 'Foreground', property: 'Selected', token: '--nav-item-foreground-selected', semantic: '--brand-secondary-foreground-default', primitive: '--color-afi-azul-profundo-0 (#FFF)' },
  { category: 'Foreground', property: 'Icon (idle)', token: '--nav-item-icon-default', semantic: '--brand-secondary-foreground-default', primitive: '--color-afi-azul-profundo-0 (#FFF)' },
  { category: 'Foreground', property: 'Icon (selected)', token: '--nav-item-icon-selected', semantic: '--brand-secondary-foreground-default', primitive: '--color-afi-azul-profundo-0 (#FFF)' },
  { category: 'Foreground', property: 'Focus ring', token: '--border-focus', semantic: '--brand-secondary-border-active', primitive: '--color-afi-azul-profundo-500' },
  // Type
  { category: 'Type', property: 'Font (default)', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '14px/1.4 400' },
  { category: 'Type', property: 'Font (active)', token: 'font-weight: 500', semantic: '—', primitive: '500' },
  // Spacing
  { category: 'Spacing', property: 'Padding', token: '--space-xs', semantic: '--space-xs', primitive: '--dimension-2 (8px)' },
  { category: 'Spacing', property: 'Gap', token: '--space-sm', semantic: '--space-sm', primitive: '--dimension-3 (12px)' },
  // Border Radius
  { category: 'Border Radius', property: 'Item radius', token: '--radius-sm', semantic: '--radius-sm', primitive: '6px' },
  // Motion
  { category: 'Motion', property: 'Duration', token: '--duration-fast', semantic: '--duration-fast', primitive: '150ms' },
  { category: 'Motion', property: 'Easing', token: '--easing-standard', semantic: '--easing-standard', primitive: 'cubic-bezier(0.2, 0, 0, 1)' },
];

const BRAND_NEUTRAL_TOKEN_ROWS: (TokenRow & { category: string })[] = [
  // Background — light profundo tint
  { category: 'Background', property: 'Idle', token: '--nav-item-background-default', semantic: '--brand-secondary-neutral-background-default', primitive: '--color-afi-azul-profundo-50' },
  { category: 'Background', property: 'Hover', token: '--nav-item-background-hover', semantic: '--brand-secondary-neutral-background-hover', primitive: '--color-afi-azul-profundo-100' },
  { category: 'Background', property: 'Active', token: '--nav-item-background-active', semantic: '--brand-secondary-neutral-background-active', primitive: '--color-afi-azul-profundo-200' },
  { category: 'Background', property: 'Selected', token: '--nav-item-background-selected', semantic: '--brand-secondary-neutral-background-active', primitive: '--color-afi-azul-profundo-200' },
  { category: 'Background', property: 'Sidebar', token: '--nav-sidebar', semantic: '--brand-secondary-neutral-background-default', primitive: '--color-afi-azul-profundo-50' },
  // Foreground — dark text on light brand surface
  { category: 'Foreground', property: 'Idle', token: '--nav-item-foreground-default', semantic: '--brand-secondary-neutral-foreground-default', primitive: '--color-afi-azul-900' },
  { category: 'Foreground', property: 'Hover', token: '--nav-item-foreground-hover', semantic: '--brand-secondary-neutral-foreground-hover', primitive: '--color-afi-azul-700' },
  { category: 'Foreground', property: 'Active', token: '--nav-item-foreground-active', semantic: '--brand-secondary-neutral-foreground-active', primitive: '--color-afi-azul-900' },
  { category: 'Foreground', property: 'Selected', token: '--nav-item-foreground-selected', semantic: '--brand-secondary-neutral-foreground-active', primitive: '--color-afi-azul-900' },
  { category: 'Foreground', property: 'Icon (idle)', token: '--nav-item-icon-default', semantic: '--brand-secondary-neutral-foreground-default', primitive: '--color-afi-azul-900' },
  { category: 'Foreground', property: 'Icon (selected)', token: '--nav-item-icon-selected', semantic: '--brand-secondary-neutral-foreground-active', primitive: '--color-afi-azul-900' },
  { category: 'Foreground', property: 'Focus ring', token: '--border-focus', semantic: '--brand-secondary-border-active', primitive: '--color-afi-azul-profundo-500' },
  // Type
  { category: 'Type', property: 'Font (default)', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '14px/1.4 400' },
  { category: 'Type', property: 'Font (active)', token: 'font-weight: 500', semantic: '—', primitive: '500' },
  // Spacing
  { category: 'Spacing', property: 'Padding', token: '--space-xs', semantic: '--space-xs', primitive: '--dimension-2 (8px)' },
  { category: 'Spacing', property: 'Gap', token: '--space-sm', semantic: '--space-sm', primitive: '--dimension-3 (12px)' },
  // Border Radius
  { category: 'Border Radius', property: 'Item radius', token: '--radius-sm', semantic: '--radius-sm', primitive: '6px' },
  // Motion
  { category: 'Motion', property: 'Duration', token: '--duration-fast', semantic: '--duration-fast', primitive: '150ms' },
  { category: 'Motion', property: 'Easing', token: '--easing-standard', semantic: '--easing-standard', primitive: 'cubic-bezier(0.2, 0, 0, 1)' },
];

@Component({
  selector: 'app-nav-item-page',
  standalone: true,
  imports: [
    RouterLink,
    NavItemComponent,
    SelectComponent,
    IconButtonComponent,
    ButtonComponent,
    SegmentedControlComponent,
    TokensTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <!-- Breadcrumb -->
      <nav class="text-body-sm text-neutral-400 mb-space-4" aria-label="Breadcrumb">
        <a routerLink="/componentes" class="hover:text-canvas-fg transition-colors duration-fast">Components</a>
        <span class="mx-1.5 text-neutral-300">/</span>
        <span class="text-canvas-fg">Nav Item</span>
      </nav>

      <!-- Header -->
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">COMPONENTS</p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Nav Item</h1>

      <!-- Context -->
      <p class="max-w-[640px] text-body-md text-neutral-500 mb-space-6">
        A single navigation row used inside sidebars and vertical menus.
        Renders as a native button with icon, label, optional badge, and tooltip
        when the sidebar is collapsed. Supports active, hover, disabled states with
        semantic color tokens for each.
      </p>

      <!-- Use Cases -->
      <section class="mb-space-10">
        <h2 id="use-cases" class="text-section text-canvas-fg mb-space-4">Use Cases</h2>
        <ul class="list-disc pl-space-6 space-y-space-2 text-body-md text-neutral-500 max-w-[640px]">
          <li><span class="font-medium">Sidebar navigation</span> — primary and secondary nav items within a collapsible sidebar.</li>
          <li><span class="font-medium">Active state indicator</span> — marks the current page/section with distinct background and text color.</li>
          <li><span class="font-medium">Notification badges</span> — numeric or text badges for unread counts or alerts.</li>
          <li><span class="font-medium">Collapsed tooltip</span> — when the sidebar is collapsed, shows a tooltip with the full label on hover.</li>
          <li><span class="font-medium">Keyboard navigation</span> — supports arrow keys, Home, End within the sidebar context.</li>
        </ul>
      </section>

      <!-- ─── Controls ─── -->
      <div class="flex flex-wrap items-center gap-space-6 mb-space-8">
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Variant</span>
          <afi-select
            [options]="variantOptions"
            [value]="variant()"
            (valueChange)="variant.set($event + '')"
            size="sm"
            ariaLabel="Variant"
          />
        </div>
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">State</span>
          <afi-select
            [options]="stateOptions"
            [value]="state()"
            (valueChange)="state.set($event + '')"
            size="sm"
            ariaLabel="State"
          />
        </div>
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Badge</span>
          <afi-select
            [options]="badgeOptions"
            [value]="badgeChoice()"
            (valueChange)="badgeChoice.set($event + '')"
            size="sm"
            ariaLabel="Badge"
          />
        </div>
        <!-- Mode toggle -->
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Mode</span>
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

      <!-- ─── Live preview (Figma-style dark card) ─── -->
      <div
        class="flex items-center justify-center rounded-lg border border-neutral-700 overflow-hidden mb-space-8"
        [attr.data-theme]="mode() === 'dark' ? 'dark' : null"
        [style.background]="previewBg()"
        style="padding: 56px 26px;"
      >
        <div class="w-64" [style]="previewTokenOverrides()">
          <afi-nav-item
            label="Dashboard"
            [active]="state() === 'active'"
            [disabled]="state() === 'disabled'"
            [badge]="computedBadge()"
            [sidebarExpanded]="true"
          >
            <svg slot="icon" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </afi-nav-item>
        </div>
      </div>

      <!-- ─── Tokens table (Figma-style) ─── -->
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
          <li>Renders as native <code class="font-mono text-body-sm">&lt;button&gt;</code> — fully keyboard accessible.</li>
          <li>Active item marked with <code class="font-mono text-body-sm">aria-current="page"</code>.</li>
          <li>Collapsed state shows tooltip with label on hover/focus for screen readers.</li>
          <li>Focus ring uses <code class="font-mono text-body-sm">var(--border-focus)</code> at 2px offset.</li>
          <li>Disabled items have <code class="font-mono text-body-sm">opacity: 0.4</code> and <code class="font-mono text-body-sm">pointer-events: none</code>.</li>
          <li>Supports <code class="font-mono text-body-sm">prefers-reduced-motion</code> — transitions disabled.</li>
        </ul>
      </section>

      <!-- ─── Dos & Don'ts ─── -->
      <section class="mb-space-10">
        <h2 id="dos-donts" class="text-section text-canvas-fg mb-space-4">Dos & Don'ts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-6">
          <div class="rounded-lg border border-green-200 bg-green-50/40 p-space-6">
            <p class="text-body-sm font-medium text-green-700 mb-space-3">Do</p>
            <ul class="list-disc pl-space-5 space-y-space-2 text-body-sm text-neutral-600">
              <li>Use one active nav-item at a time within a sidebar.</li>
              <li>Keep labels short (1–3 words).</li>
              <li>Include a leading icon for visual scannability.</li>
              <li>Use badge for notification counts ("99+" max).</li>
            </ul>
          </div>
          <div class="rounded-lg border border-red-200 bg-red-50/40 p-space-6">
            <p class="text-body-sm font-medium text-red-700 mb-space-3">Don't</p>
            <ul class="list-disc pl-space-5 space-y-space-2 text-body-sm text-neutral-600">
              <li>Don't mark multiple items as active simultaneously.</li>
              <li>Don't use for actions (use Button or Menu Item instead).</li>
              <li>Don't use long labels that truncate — shorten or use a tooltip.</li>
              <li>Don't show large badge numbers — cap at 99+.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class NavItemPage {
  readonly state = signal('default');
  readonly badgeChoice = signal('none');
  readonly mode = signal<ThemeMode>('dark');
  readonly variant = signal<string>('neutral');
  readonly tokenCategory = signal('Background');
  readonly tokensCopied = signal(false);

  readonly variantOptions: SelectOption[] = [
    { label: 'Neutral', value: 'neutral' },
    { label: 'Brand', value: 'brand' },
    { label: 'Brand Neutral', value: 'brand-neutral' },
  ];

  readonly stateOptions: SelectOption[] = [
    { label: 'Default', value: 'default' },
    { label: 'Active', value: 'active' },
    { label: 'Disabled', value: 'disabled' },
  ];

  readonly badgeOptions: SelectOption[] = [
    { label: 'None', value: 'none' },
    { label: '3', value: '3' },
    { label: '99+', value: '99+' },
  ];

  readonly tokenCategoryOptions = [
    { value: 'Background', label: 'Background' },
    { value: 'Foreground', label: 'Foreground' },
    { value: 'Type', label: 'Type' },
    { value: 'Spacing', label: 'Spacing' },
    { value: 'Border Radius', label: 'Radius' },
    { value: 'Motion', label: 'Motion' },
  ];

  readonly computedBadge = computed(() => {
    const choice = this.badgeChoice();
    if (choice === 'none') return null;
    const num = Number(choice);
    return isNaN(num) ? choice : num;
  });

  readonly previewBg = computed(() => {
    const v = this.variant();
    if (v === 'brand') return 'var(--brand-secondary-background-default)';
    if (v === 'brand-neutral') return 'var(--brand-secondary-neutral-background-default)';
    return this.mode() === 'dark' ? 'var(--color-afi-control-900)' : 'var(--color-afi-white-25)';
  });

  readonly previewTokenOverrides = computed(() => {
    const v = this.variant();
    if (v === 'brand') {
      return `
        --nav-item-background-default: transparent;
        --nav-item-background-hover: var(--brand-secondary-background-hover);
        --nav-item-background-active: var(--brand-secondary-background-active);
        --nav-item-background-selected: var(--brand-secondary-background-active);
        --nav-item-foreground-default: var(--brand-secondary-foreground-default);
        --nav-item-foreground-hover: var(--brand-secondary-foreground-hover);
        --nav-item-foreground-active: var(--brand-secondary-foreground-active);
        --nav-item-foreground-selected: var(--brand-secondary-foreground-default);
        --nav-item-icon-default: var(--brand-secondary-foreground-default);
        --nav-item-icon-hover: var(--brand-secondary-foreground-hover);
        --nav-item-icon-active: var(--brand-secondary-foreground-active);
        --nav-item-icon-selected: var(--brand-secondary-foreground-default);
      `;
    }
    if (v === 'brand-neutral') {
      return `
        --nav-item-background-default: transparent;
        --nav-item-background-hover: var(--brand-secondary-neutral-background-hover);
        --nav-item-background-active: var(--brand-secondary-neutral-background-active);
        --nav-item-background-selected: var(--brand-secondary-neutral-background-active);
        --nav-item-foreground-default: var(--brand-secondary-neutral-foreground-default);
        --nav-item-foreground-hover: var(--brand-secondary-neutral-foreground-hover);
        --nav-item-foreground-active: var(--brand-secondary-neutral-foreground-active);
        --nav-item-foreground-selected: var(--brand-secondary-neutral-foreground-active);
        --nav-item-icon-default: var(--brand-secondary-neutral-foreground-default);
        --nav-item-icon-hover: var(--brand-secondary-neutral-foreground-hover);
        --nav-item-icon-active: var(--brand-secondary-neutral-foreground-active);
        --nav-item-icon-selected: var(--brand-secondary-neutral-foreground-active);
      `;
    }
    return '';
  });

  readonly filteredTokenRows = computed(() => {
    const cat = this.tokenCategory();
    const v = this.variant();
    const rows = v === 'brand' ? BRAND_TOKEN_ROWS
               : v === 'brand-neutral' ? BRAND_NEUTRAL_TOKEN_ROWS
               : NEUTRAL_TOKEN_ROWS;
    return rows
      .filter(r => r.category === cat)
      .map(({ category, ...rest }) => rest);
  });

  toggleMode(): void {
    this.mode.set(this.mode() === 'light' ? 'dark' : 'light');
  }

  copyTokens(): void {
    const v = this.variant();
    const rows = v === 'brand' ? BRAND_TOKEN_ROWS
               : v === 'brand-neutral' ? BRAND_NEUTRAL_TOKEN_ROWS
               : NEUTRAL_TOKEN_ROWS;
    const text = rows.map(r => `${r.property}: ${r.token}`).join('\n');
    navigator.clipboard.writeText(text);
    this.tokensCopied.set(true);
    setTimeout(() => this.tokensCopied.set(false), 2000);
  }
}
