import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  TabsComponent,
  TabItemComponent,
  SegmentedControlComponent,
  SelectComponent,
  IconButtonComponent,
  ButtonComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

type ThemeMode = 'light' | 'dark';

@Component({
  selector: 'site-tabs-page',
  standalone: true,
  imports: [
    RouterLink,
    TabsComponent,
    TabItemComponent,
    SegmentedControlComponent,
    SelectComponent,
    IconButtonComponent,
    ButtonComponent,
    TokensTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <!-- Breadcrumb -->
      <nav class="text-body-sm text-neutral-400 mb-space-4" aria-label="Migas de pan">
        <a routerLink="/componentes" class="hover:text-canvas-fg transition-colors duration-fast">Components</a>
        <span class="mx-1.5 text-neutral-300">/</span>
        <span class="text-canvas-fg">Tabs</span>
      </nav>

      <!-- Header -->
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">COMPONENTS</p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Tabs</h1>

      <!-- Context -->
      <p class="max-w-[640px] text-body-md text-neutral-500 mb-space-6">
        Underline-style horizontal tabs with a sliding indicator and animated
        slide+blur panel transitions. Implements the WAI-ARIA tablist/tab/tabpanel
        pattern with full keyboard navigation. Content lives inside each tab item
        and is conditionally rendered into panels.
      </p>

      <!-- Use Cases -->
      <section class="mb-space-10">
        <h2 id="use-cases" class="text-section text-canvas-fg mb-space-4">Use Cases</h2>
        <ul class="list-disc pl-space-6 space-y-space-2 text-body-md text-neutral-500 max-w-[640px]">
          <li><span class="font-medium">Content sections</span> — organize related content (General, Settings, Activity).</li>
          <li><span class="font-medium">Code viewers</span> — switch between HTML / TypeScript / SCSS files.</li>
          <li><span class="font-medium">Data views</span> — table vs chart alternate views of the same dataset.</li>
          <li><span class="font-medium">Configuration panels</span> — group settings into logical sections.</li>
          <li><span class="font-medium">Detail pages</span> — overview, history, permissions on a resource.</li>
        </ul>
      </section>

      <!-- ─── Controls ─── -->
      <div class="flex flex-wrap items-center gap-space-6 mb-space-8">
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Size</span>
          <afi-select
            [options]="sizeOptions"
            [value]="size()"
            (valueChange)="size.set($event + '')"
            size="sm"
            ariaLabel="Size"
          />
        </div>
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Tabs count</span>
          <afi-select
            [options]="countOptions"
            [value]="count()"
            (valueChange)="onCountChange($event + '')"
            size="sm"
            ariaLabel="Number of tabs"
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

      <!-- ─── Live preview ─── -->
      <div
        class="rounded-lg border border-border-hairline p-space-8 mb-space-8 transition-colors duration-base"
        [class.bg-white]="mode() === 'light'"
        [class.bg-neutral-950]="mode() === 'dark'"
        [class.text-neutral-900]="mode() === 'light'"
        [class.text-white]="mode() === 'dark'"
      >
        <afi-tabs
          [activeIndex]="activeTab()"
          [size]="$any(size())"
          ariaLabel="Demo tabs"
          (activeChange)="activeTab.set($event)"
        >
          @for (tab of demoTabs(); track $index) {
            <afi-tab-item [label]="tab.label" [badge]="tab.badge" [disabled]="tab.disabled">
              <div class="p-space-6 text-body-md opacity-70">
                {{ tab.content }}
              </div>
            </afi-tab-item>
          }
        </afi-tabs>
      </div>

      <!-- ─── Tokens consumidos ─── -->
      <section class="mb-space-10">
        <div class="flex items-center justify-between mb-space-4">
          <h2 id="tokens" class="text-section text-canvas-fg">Tokens consumidos</h2>
          <afi-button
            variant="secondary"
            size="sm"
            [ariaLabel]="tokensCopied() ? 'Copiado' : 'Copiar tokens'"
            (clicked)="copyTokens()"
          >
            {{ tokensCopied() ? 'Copiado' : 'Copy' }}
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
          <li>Container uses <code class="font-mono text-body-sm">role="tablist"</code> with <code class="font-mono text-body-sm">aria-label</code>.</li>
          <li>Each trigger uses <code class="font-mono text-body-sm">role="tab"</code>, <code class="font-mono text-body-sm">aria-selected</code>, and <code class="font-mono text-body-sm">aria-controls</code>.</li>
          <li>Panels use <code class="font-mono text-body-sm">role="tabpanel"</code> with <code class="font-mono text-body-sm">aria-labelledby</code>.</li>
          <li>Roving tabindex — only the active tab has <code class="font-mono text-body-sm">tabindex="0"</code>.</li>
          <li>Arrow keys navigate between tabs, Home/End jump to first/last.</li>
          <li>Disabled tabs are skipped during keyboard navigation.</li>
          <li>Focus ring uses <code class="font-mono text-body-sm">var(--border-focus)</code> with inset box-shadow.</li>
          <li>Respects <code class="font-mono text-body-sm">prefers-reduced-motion</code> — all transitions and animations disabled.</li>
        </ul>
      </section>

      <!-- ─── Dos & Don'ts ─── -->
      <section class="mb-space-10">
        <h2 id="dos-donts" class="text-section text-canvas-fg mb-space-4">Dos & Don'ts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-6">
          <div class="rounded-lg border border-green-200 bg-green-50/40 p-space-6">
            <p class="text-body-sm font-medium text-green-700 mb-space-3">Do</p>
            <ul class="list-disc pl-space-5 space-y-space-2 text-body-sm text-neutral-600">
              <li>Use 2–5 tabs with short, descriptive labels.</li>
              <li>Put content inside <code class="font-mono">afi-tab-item</code> for proper panel semantics.</li>
              <li>Provide an <code class="font-mono">ariaLabel</code> on the tabs container.</li>
              <li>Use <code class="font-mono">lazy</code> for tabs with heavy content.</li>
              <li>Use badges sparingly to indicate counts or status.</li>
            </ul>
          </div>
          <div class="rounded-lg border border-red-200 bg-red-50/40 p-space-6">
            <p class="text-body-sm font-medium text-red-700 mb-space-3">Don't</p>
            <ul class="list-disc pl-space-5 space-y-space-2 text-body-sm text-neutral-600">
              <li>Don't use tabs for primary app navigation — use the sidebar.</li>
              <li>Don't use for sequential steps (wizards) — use a stepper.</li>
              <li>Don't exceed 6 tabs — consider a menu or filter pattern instead.</li>
              <li>Don't use tabs when options have no panel content — use segmented control.</li>
              <li>Don't truncate labels — shorten them or reduce the tab count.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class TabsPage {
  readonly activeTab = signal(0);
  readonly size = signal<string>('md');
  readonly count = signal<string>('3');
  readonly mode = signal<ThemeMode>('light');
  readonly tokensCopied = signal(false);

  readonly sizeOptions: SelectOption[] = [
    { value: 'sm', label: 'sm' },
    { value: 'md', label: 'md' },
  ];

  readonly countOptions: SelectOption[] = [
    { value: '2', label: '2 tabs' },
    { value: '3', label: '3 tabs' },
    { value: '4', label: '4 tabs' },
    { value: '5', label: '5 tabs' },
  ];

  private readonly allTabs = [
    { label: 'General', badge: null, disabled: false, content: 'General settings and overview information for this resource.' },
    { label: 'Configuration', badge: null, disabled: false, content: 'Advanced configuration options and environment variables.' },
    { label: 'Activity', badge: 3, disabled: false, content: 'Recent activity log showing changes and events.' },
    { label: 'Permissions', badge: null, disabled: false, content: 'User roles, access control, and sharing settings.' },
    { label: 'History', badge: null, disabled: false, content: 'Version history and audit trail for this resource.' },
  ];

  readonly demoTabs = computed(() => {
    const n = parseInt(this.count(), 10);
    return this.allTabs.slice(0, n);
  });

  toggleMode(): void {
    this.mode.set(this.mode() === 'light' ? 'dark' : 'light');
  }

  onCountChange(val: string): void {
    this.count.set(val);
    const n = parseInt(val, 10);
    if (this.activeTab() >= n) {
      this.activeTab.set(0);
    }
  }

  // ─── Token categories (real tokens from semantic.scss, dimensions.scss, etc.) ───
  readonly tokenCategory = signal('background');

  readonly tokenCategoryOptions = [
    { value: 'background', label: 'Background' },
    { value: 'foreground', label: 'Foreground' },
    { value: 'type', label: 'Type' },
    { value: 'spacing', label: 'Spacing' },
    { value: 'radius', label: 'Border Radius' },
    { value: 'motion', label: 'Motion' },
  ];

  private readonly tokenMap: Record<string, TokenRow[]> = {
    background: [
      { property: 'Badge background', token: '--brand-primary-background-default', semantic: '--brand-primary-background-default', primitive: '--color-afi-azul-profundo-500' },
    ],
    foreground: [
      { property: 'Underline indicator', token: '--brand-primary-background-default', semantic: '--brand-primary-background-default', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Active tab text', token: '--foreground-brand-default', semantic: '--foreground-brand-default', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Inactive tab text', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-700' },
      { property: 'Hover tab text', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-950' },
      { property: 'Border bottom', token: '--border-subtle', semantic: '--border-subtle', primitive: '--color-afi-control-100' },
      { property: 'Focus ring', token: '--border-focus', semantic: '--border-focus', primitive: '--color-afi-azul-500' },
      { property: 'Badge text', token: '--brand-primary-foreground-default', semantic: '--brand-primary-foreground-default', primitive: '--color-afi-azul-profundo-0 (#FFF)' },
    ],
    type: [
      { property: 'Tab font (sm)', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '14px/1.4 400' },
      { property: 'Tab font (sm active)', token: '--type-body-sm-500', semantic: '--type-body-sm-500', primitive: '14px/1.4 500' },
      { property: 'Tab font (md)', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '16px/1.5 400' },
      { property: 'Tab font (md active)', token: '--type-body-md-500', semantic: '--type-body-md-500', primitive: '16px/1.5 500' },
      { property: 'Badge font', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '14px/1.4 400' },
    ],
    spacing: [
      { property: 'Gap between tabs', token: '--space-2xs', semantic: '--space-2xs', primitive: '--dimension-1 (4px)' },
      { property: 'Tab trigger gap (icon/badge)', token: '--space-xs', semantic: '--space-xs', primitive: '--dimension-2 (8px)' },
      { property: 'Tab padding-x (sm)', token: '--space-sm', semantic: '--space-sm', primitive: '--dimension-3 (12px)' },
      { property: 'Tab padding-x (md)', token: '--space-md', semantic: '--space-md', primitive: '--dimension-4 (16px)' },
      { property: 'Tab height (sm)', token: '--dimension-9', semantic: '--dimension-9', primitive: '36px' },
      { property: 'Tab height (md)', token: '--dimension-11', semantic: '--dimension-11', primitive: '44px' },
      { property: 'Badge min-width', token: '--dimension-5', semantic: '--dimension-5', primitive: '20px' },
      { property: 'Badge height', token: '--dimension-5', semantic: '--dimension-5', primitive: '20px' },
      { property: 'Badge padding-x', token: '--space-xs', semantic: '--space-xs', primitive: '--dimension-2 (8px)' },
    ],
    radius: [
      { property: 'Underline indicator', token: '--radius-full', semantic: '--radius-full', primitive: '9999px' },
      { property: 'Badge', token: '--radius-full', semantic: '--radius-full', primitive: '9999px' },
      { property: 'Focus ring', token: '--radius-sm', semantic: '--radius-sm', primitive: '4px' },
    ],
    motion: [
      { property: 'Underline slide (transform)', token: '--duration-base', semantic: '--duration-base var(--easing-standard)', primitive: '250ms cubic-bezier(0.2, 0, 0, 1)' },
      { property: 'Underline resize (width)', token: '--duration-fast', semantic: '--duration-fast var(--easing-standard)', primitive: '150ms cubic-bezier(0.2, 0, 0, 1)' },
      { property: 'Tab text color', token: '--duration-fast', semantic: '--duration-fast ease-out', primitive: '150ms ease-out' },
      { property: 'Panel slide+blur entrance', token: '--duration-base', semantic: '--duration-base var(--easing-standard)', primitive: '250ms cubic-bezier(0.2, 0, 0, 1)' },
      { property: 'Panel blur amount', token: '4px', semantic: '—', primitive: '4px' },
      { property: 'Panel translateX offset', token: '12px', semantic: '—', primitive: '12px' },
    ],
  };

  readonly filteredTokenRows = computed(() =>
    this.tokenMap[this.tokenCategory()] ?? [],
  );

  copyTokens(): void {
    const text = this.filteredTokenRows()
      .map(r => `${r.property}: ${r.token}`)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      this.tokensCopied.set(true);
      setTimeout(() => this.tokensCopied.set(false), 2000);
    });
  }
}
