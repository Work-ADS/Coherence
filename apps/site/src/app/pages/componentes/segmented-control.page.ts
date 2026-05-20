import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  SegmentedControlComponent,
  SelectComponent,
  IconButtonComponent,
  ButtonComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

type ThemeMode = 'light' | 'dark';
const ALL_LABELS = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

@Component({
  selector: 'app-segmented-control-page',
  standalone: true,
  imports: [
    RouterLink,
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
        <span class="text-canvas-fg">Segmented Control</span>
      </nav>

      <!-- Header -->
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">COMPONENTS</p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Segmented Control</h1>

      <!-- Context -->
      <p class="max-w-[640px] text-body-md text-neutral-500 mb-space-6">
        A pill-style toggle bar for mutually exclusive options. A sliding indicator
        animates to the active selection, providing clear visual feedback. Ideal for
        switching between views or modes within the same context without navigating away.
      </p>

      <!-- Use Cases -->
      <section class="mb-space-10">
        <h2 id="use-cases" class="text-section text-canvas-fg mb-space-4">Use Cases</h2>
        <ul class="list-disc pl-space-6 space-y-space-2 text-body-md text-neutral-500 max-w-[640px]">
          <li><span class="font-medium">View switching</span> — toggle between Preview/Code in a playground.</li>
          <li><span class="font-medium">Time ranges</span> — Day / Week / Month / Year filters.</li>
          <li><span class="font-medium">Mode selection</span> — Grid vs List, Map vs Table.</li>
          <li><span class="font-medium">Doc page navigation</span> — switching between Diseño / Code tabs.</li>
          <li><span class="font-medium">Small option sets (2–5)</span> — where all labels fit without scrolling.</li>
        </ul>
      </section>

      <!-- ─── Controls ─── -->
      <div class="flex flex-wrap items-center gap-space-6 mb-space-8">
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Size</span>
          <afi-select
            [options]="sizeOptions"
            [value]="size()"
            (valueChange)="onSizeChange($event + '')"
            size="sm"
            ariaLabel="Size"
          />
        </div>
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Options count</span>
          <afi-select
            [options]="countOptions"
            [value]="count()"
            (valueChange)="onCountChange($event + '')"
            size="sm"
            ariaLabel="Number of options"
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
        class="flex items-center justify-center rounded-lg border border-border-hairline p-space-12 mb-space-8 transition-colors duration-base"
        [class.bg-white]="mode() === 'light'"
        [class.bg-neutral-950]="mode() === 'dark'"
      >
        <afi-segmented-control
          [options]="demoOptions()"
          [(value)]="selected"
          [size]="$any(size())"
          ariaLabel="Demo segmented control"
        />
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
          <li>Container uses <code class="font-mono text-body-sm">role="radiogroup"</code> with <code class="font-mono text-body-sm">aria-label</code>.</li>
          <li>Each option uses <code class="font-mono text-body-sm">role="radio"</code> with <code class="font-mono text-body-sm">aria-checked</code>.</li>
          <li>Focus ring uses <code class="font-mono text-body-sm">var(--border-focus)</code> meeting WCAG 2.2.</li>
          <li>Disabled options have <code class="font-mono text-body-sm">opacity: 0.5</code> and <code class="font-mono text-body-sm">cursor: not-allowed</code>.</li>
          <li>Respects <code class="font-mono text-body-sm">prefers-reduced-motion</code> — pill transition disabled.</li>
        </ul>
      </section>

      <!-- ─── Dos & Don'ts ─── -->
      <section class="mb-space-10">
        <h2 id="dos-donts" class="text-section text-canvas-fg mb-space-4">Dos & Don'ts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-6">
          <div class="rounded-lg border border-green-200 bg-green-50/40 p-space-6">
            <p class="text-body-sm font-medium text-green-700 mb-space-3">Do</p>
            <ul class="list-disc pl-space-5 space-y-space-2 text-body-sm text-neutral-600">
              <li>Use for 2–5 mutually exclusive options.</li>
              <li>Keep labels short (1–2 words).</li>
              <li>Use when all options should be visible at once.</li>
              <li>Pair with external content that reacts to the selection.</li>
            </ul>
          </div>
          <div class="rounded-lg border border-red-200 bg-red-50/40 p-space-6">
            <p class="text-body-sm font-medium text-red-700 mb-space-3">Don't</p>
            <ul class="list-disc pl-space-5 space-y-space-2 text-body-sm text-neutral-600">
              <li>Don't use for more than 5 options — use tabs or a select instead.</li>
              <li>Don't use when options have their own panel content — use tabs.</li>
              <li>Don't nest segmented controls inside each other.</li>
              <li>Don't truncate labels — if they don't fit, reconsider the pattern.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class SegmentedControlPage {
  readonly selected = signal('daily');
  readonly size = signal<string>('md');
  readonly count = signal<string>('3');
  readonly mode = signal<ThemeMode>('light');
  readonly tokensCopied = signal(false);

  readonly demoOptions = computed(() => {
    const n = parseInt(this.count(), 10);
    return ALL_LABELS.slice(0, n).map(l => ({
      value: l.toLowerCase(),
      label: l,
    }));
  });

  readonly sizeOptions: SelectOption[] = [
    { value: 'sm', label: 'sm' },
    { value: 'md', label: 'md' },
    { value: 'lg', label: 'lg' },
  ];

  readonly countOptions: SelectOption[] = [
    { value: '2', label: '2 options' },
    { value: '3', label: '3 options' },
    { value: '4', label: '4 options' },
    { value: '5', label: '5 options' },
  ];

  toggleMode(): void {
    this.mode.set(this.mode() === 'light' ? 'dark' : 'light');
  }

  onSizeChange(val: string): void {
    this.size.set(val);
  }

  onCountChange(val: string): void {
    this.count.set(val);
    const n = parseInt(val, 10);
    const opts = ALL_LABELS.slice(0, n).map(l => l.toLowerCase());
    if (!opts.includes(this.selected())) {
      this.selected.set(opts[0] ?? 'daily');
    }
  }

  // ─── Token categories (using REAL tokens from semantic.scss, dimensions.scss, etc.) ───
  readonly tokenCategory = signal('background');

  readonly tokenCategoryOptions = [
    { value: 'background', label: 'Background' },
    { value: 'foreground', label: 'Foreground' },
    { value: 'type', label: 'Type' },
    { value: 'spacing', label: 'Spacing' },
    { value: 'radius', label: 'Border Radius' },
    { value: 'elevation', label: 'Elevation' },
  ];

  private readonly tokenMap: Record<string, TokenRow[]> = {
    background: [
      { property: 'Container', token: '--control-background-default', semantic: '--control-background-default', primitive: '--color-afi-control-50' },
      { property: 'Pill (active)', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-white-0' },
    ],
    foreground: [
      { property: 'Active text', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-950' },
      { property: 'Inactive text', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-700' },
      { property: 'Hover text', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-800' },
      { property: 'Focus ring', token: '--border-focus', semantic: '--border-focus', primitive: '--color-afi-azul-500' },
    ],
    type: [
      { property: 'Font (sm)', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '14px/1.4 400' },
      { property: 'Font (sm active)', token: '--type-body-sm-500', semantic: '--type-body-sm-500', primitive: '14px/1.4 500' },
      { property: 'Font (md)', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '16px/1.5 400' },
      { property: 'Font (md active)', token: '--type-body-md-500', semantic: '--type-body-md-500', primitive: '16px/1.5 500' },
    ],
    spacing: [
      { property: 'Container padding', token: '--space-2xs', semantic: '--space-2xs', primitive: '--dimension-1 (4px)' },
      { property: 'Gap between options', token: '--space-2xs', semantic: '--space-2xs', primitive: '--dimension-1 (4px)' },
      { property: 'Option padding-x (sm)', token: '--space-sm', semantic: '--space-sm', primitive: '--dimension-3 (12px)' },
      { property: 'Option padding-x (md/lg)', token: '--space-md', semantic: '--space-md', primitive: '--dimension-4 (16px)' },
      { property: 'Option height (sm)', token: '--dimension-7', semantic: '--dimension-7', primitive: '28px' },
      { property: 'Option height (md)', token: '--dimension-9', semantic: '--dimension-9', primitive: '36px' },
      { property: 'Option height (lg)', token: '--dimension-10', semantic: '--dimension-10', primitive: '40px' },
    ],
    radius: [
      { property: 'Container radius', token: '--radius-lg', semantic: '--radius-lg', primitive: '12px' },
      { property: 'Pill / option radius', token: '--radius-md', semantic: '--radius-md', primitive: '8px' },
    ],
    elevation: [
      { property: 'Pill shadow', token: '--elevation-sm', semantic: '--elevation-sm', primitive: '0 1px 2px rgba(0,0,0,.05)' },
      { property: 'Focus ring', token: '--border-focus', semantic: '--border-focus', primitive: '0 0 0 2px var(--border-focus)' },
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
