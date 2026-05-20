import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  LogoComponent,
  ButtonComponent,
  SelectComponent,
  SegmentedControlComponent,
  IconButtonComponent,
  TabsComponent,
  TabItemComponent,
} from '@coherence/ui';
import type { LogoSize, LogoVariant, SelectOption } from '@coherence/ui';

import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

type ThemeMode = 'light' | 'dark';
type LogoShape = 'wordmark' | 'icon';

@Component({
  selector: 'app-logo-page',
  standalone: true,
  imports: [
    RouterLink,
    LogoComponent,
    ButtonComponent,
    SelectComponent,
    SegmentedControlComponent,
    IconButtonComponent,
    TabsComponent,
    TabItemComponent,
    CodeBlockComponent,
    TokensTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <!-- Breadcrumb -->
      <nav class="text-body-sm text-neutral-400 mb-space-4" aria-label="Migas de pan">
        <a routerLink="/componentes" class="hover:text-canvas-fg transition-colors duration-fast">Components</a>
        <span class="mx-1.5 text-neutral-300">/</span>
        <span class="text-canvas-fg">Logo</span>
      </nav>

      <!-- Header -->
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">COMPONENTS</p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Logo</h1>

      <!-- Context -->
      <p class="max-w-[640px] text-body-md text-neutral-500 mb-space-6">
        The AFI brand mark rendered as inline SVG so colors resolve against semantic tokens
        and adapt to light/dark mode without swapping assets. Built once in code so developers
        can drop it in anywhere without cluttering the codebase with SVG files. The component
        responds to its context through semantic tokens that flip automatically with the theme.
      </p>

      <!-- Use Cases -->
      <section class="mb-space-10">
        <h2 id="use-cases" class="text-section text-canvas-fg mb-space-4">Use Cases</h2>
        <ul class="list-disc pl-space-6 space-y-space-2 text-body-md text-neutral-500 max-w-[640px]">
          <li><span class="font-medium">App shell header</span> — persistent brand presence in the sidebar or top nav.</li>
          <li><span class="font-medium">Login / splash screens</span> — large icon-only mark centered on the page.</li>
          <li><span class="font-medium">Email templates & PDFs</span> — monochrome variant for constrained color contexts.</li>
          <li><span class="font-medium">Favicons & PWA manifest</span> — icon-only at small sizes (sm/md).</li>
          <li><span class="font-medium">Footer / legal</span> — wordmark at sm paired with copyright text.</li>
        </ul>
      </section>

      <!-- ─── Controls ─── -->
      <div class="flex flex-wrap items-center gap-space-6 mb-space-8">
        <!-- Shape toggle -->
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Shape</span>
          <afi-segmented-control
            [options]="shapeOptions"
            [(value)]="shape"
            size="sm"
            ariaLabel="Logo shape"
          />
        </div>

        <!-- Variant toggle -->
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Variant</span>
          <afi-segmented-control
            [options]="variantOptions"
            [(value)]="variant"
            size="sm"
            ariaLabel="Logo variant"
          />
        </div>

        <!-- Mode toggle (icon button with moon/sun) -->
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Mode</span>
          <afi-icon-button
            [ariaLabel]="mode() === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
            variant="outline"
            size="sm"
            (clicked)="toggleMode()"
          >
            @if (mode() === 'light') {
              <!-- Moon -->
              <svg slot="icon" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            } @else {
              <!-- Sun -->
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

        <!-- Size select -->
        <div class="flex flex-col gap-space-1">
          <span class="text-body-sm text-neutral-400">Size</span>
          <afi-select
            [options]="sizeOptions"
            [value]="size()"
            (valueChange)="size.set($event + '')"
            size="sm"
            ariaLabel="Logo size"
          />
        </div>
      </div>

      <!-- ─── Live preview ─── -->
      <div
        class="flex items-center justify-center rounded-lg border border-border-hairline p-space-12 mb-space-8"
        [class.bg-neutral-900]="mode() === 'dark'"
        [class.text-white]="mode() === 'dark'"
        [class.bg-neutral-50]="mode() === 'light'"
        [class.text-neutral-900]="mode() === 'light'"
      >
        <coherence-logo
          [variant]="variant()"
          [size]="$any(size())"
          [showWordmark]="shape() === 'wordmark'"
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
        <afi-tokens-table [rows]="tokenRows()" title="" />
      </section>

      <!-- ─── Accessibility ─── -->
      <section class="mb-space-10">
        <h2 id="accessibility" class="text-section text-canvas-fg mb-space-4">Accessibility</h2>
        <div class="space-y-space-4 text-body-md text-neutral-500 max-w-[640px]">
          <ul class="list-disc pl-space-6 space-y-space-2">
            <li>The logo renders with <code class="font-mono text-body-sm">role="img"</code> and
              <code class="font-mono text-body-sm">aria-label="AFI"</code> so screen readers announce
              it as a single meaningful image.</li>
            <li>The inner SVG is marked <code class="font-mono text-body-sm">aria-hidden="true"</code>
              to prevent assistive tech from traversing individual paths.</li>
            <li>When <code class="font-mono text-body-sm">href</code> is set, the component wraps in an
              <code class="font-mono text-body-sm">&lt;a&gt;</code> element — focus ring uses
              <code class="font-mono text-body-sm">var(--border-focus)</code> and meets WCAG 2.2
              focus-visible requirements.</li>
            <li>Color contrast: in <strong>color</strong> variant the symbol (azul-500) meets 4.5:1 against
              both light and dark canvas backgrounds. In <strong>monochrome</strong>, the logo inherits
              <code class="font-mono text-body-sm">currentColor</code> which is always the page's
              foreground — guaranteed contrast by design.</li>
            <li>Respects <code class="font-mono text-body-sm">prefers-reduced-motion</code> — no animation
              is applied to the logo itself.</li>
          </ul>
        </div>
      </section>

      <!-- ─── Dos & Don'ts ─── -->
      <section class="mb-space-10">
        <h2 id="dos-donts" class="text-section text-canvas-fg mb-space-4">Dos & Don'ts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-6">
          <!-- DO -->
          <div class="rounded-lg border border-green-200 bg-green-50/40 p-space-6">
            <p class="text-body-sm font-medium text-green-700 mb-space-3">✓ Do</p>
            <ul class="list-disc pl-space-5 space-y-space-2 text-body-sm text-neutral-600">
              <li>Use the <code class="font-mono">color</code> variant on light/dark canvas backgrounds.</li>
              <li>Use <code class="font-mono">monochrome</code> when printing or in single-color contexts.</li>
              <li>Keep minimum clear space equal to the symbol height around the mark.</li>
              <li>Let the component inherit <code class="font-mono">currentColor</code> from its parent for monochrome.</li>
              <li>Use the <code class="font-mono">href</code> input when the logo should navigate home.</li>
            </ul>
          </div>
          <!-- DON'T -->
          <div class="rounded-lg border border-red-200 bg-red-50/40 p-space-6">
            <p class="text-body-sm font-medium text-red-700 mb-space-3">✗ Don't</p>
            <ul class="list-disc pl-space-5 space-y-space-2 text-body-sm text-neutral-600">
              <li>Don't stretch or distort — the SVG aspect ratio is locked.</li>
              <li>Don't override the symbol fill with arbitrary colors.</li>
              <li>Don't place the color variant on busy backgrounds where the blue symbol loses contrast.</li>
              <li>Don't use external SVG/PNG files — always use this component.</li>
              <li>Don't add drop shadows or effects to the logo mark.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ─── Code ─── -->
      <section>
        <h2 id="code" class="text-section text-canvas-fg mb-space-4">Code</h2>
        <afi-tabs size="sm" ariaLabel="Code files">
          <afi-tab-item label="HTML">
            <div class="pt-space-4">
              <afi-code-block [code]="htmlSnippet()" language="html" filename="logo.component.html" />
            </div>
          </afi-tab-item>
          <afi-tab-item label="TypeScript">
            <div class="pt-space-4">
              <afi-code-block [code]="tsSnippet()" language="ts" filename="logo.component.ts" />
            </div>
          </afi-tab-item>
          <afi-tab-item label="SCSS">
            <div class="pt-space-4">
              <afi-code-block [code]="cssSnippet()" language="css" filename="logo.component.scss" />
            </div>
          </afi-tab-item>
        </afi-tabs>
      </section>
    </div>
  `,
})
export class LogoPage {
  // ─── State ───
  readonly shape = signal<LogoShape>('wordmark');
  readonly variant = signal<LogoVariant>('color');
  readonly mode = signal<ThemeMode>('light');
  readonly size = signal<string>('md');

  readonly tokensCopied = signal(false);

  // ─── Control options ───
  readonly shapeOptions = [
    { value: 'icon', label: 'Icon only' },
    { value: 'wordmark', label: 'Logo + Wordmark' },
  ];

  readonly variantOptions = [
    { value: 'color', label: 'Brand' },
    { value: 'monochrome', label: 'Monochrome' },
  ];

  readonly sizeOptions: SelectOption[] = [
    { value: 'sm', label: 'sm (24px)' },
    { value: 'md', label: 'md (32px)' },
    { value: 'lg', label: 'lg (48px)' },
    { value: 'xl', label: 'xl (64px)' },
  ];

  toggleMode(): void {
    this.mode.set(this.mode() === 'light' ? 'dark' : 'light');
  }

  // ─── Dynamic tokens table ───
  readonly tokenRows = computed<TokenRow[]>(() => {
    const v = this.variant();
    const s = this.size();
    const sizeToken = { sm: '--dim-24', md: '--dim-32', lg: '--dim-48', xl: '--dim-64' }[s] ?? '--dim-32';
    const sizeValue = { sm: '24px', md: '32px', lg: '48px', xl: '64px' }[s] ?? '32px';

    const rows: TokenRow[] = [
      v === 'color'
        ? { property: 'Symbol fill', token: '--brand-mark-symbol', semantic: '--brand-mark-symbol', primitive: '--color-afi-azul-500' }
        : { property: 'Symbol fill', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-950' },
    ];

    if (this.shape() === 'wordmark') {
      rows.push(
        v === 'color'
          ? { property: 'Wordmark fill', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-950' }
          : { property: 'Wordmark fill', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-950' }
      );
    }

    rows.push(
      { property: 'Height', token: sizeToken, semantic: sizeToken, primitive: sizeValue },
      { property: 'Focus ring', token: '--border-focus', semantic: '--border-focus', primitive: '--color-afi-azul-500' },
      { property: 'Border radius', token: '--radius-xs', semantic: '--radius-xs', primitive: '4px' },
    );

    return rows;
  });

  // ─── Code snippets (actual source) ───
  readonly htmlSnippet = computed(() => `@if (href(); as h) {
  <a [href]="h" [class]="classes()" role="img" aria-label="AFI">
    <svg class="coherence-logo__svg" [attr.viewBox]="viewBox()"
         fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path class="coherence-logo__symbol" [attr.fill]="symbolFill()" d="M64.28..."/>
      @if (showWordmark()) {
        <path class="coherence-logo__wordmark" fill="currentColor" d="M8.59..."/>
      }
    </svg>
  </a>
} @else {
  <span [class]="classes()" role="img" aria-label="AFI">
    <svg class="coherence-logo__svg" [attr.viewBox]="viewBox()"
         fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path class="coherence-logo__symbol" [attr.fill]="symbolFill()" d="M64.28..."/>
      @if (showWordmark()) {
        <path class="coherence-logo__wordmark" fill="currentColor" d="M8.59..."/>
      }
    </svg>
  </span>
}`);

  readonly tsSnippet = computed(() => `import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { LogoSize, LogoVariant } from './logo.variants';

@Component({
  selector: 'coherence-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  readonly variant = input<LogoVariant>('color');
  readonly size = input<LogoSize>('md');
  readonly showWordmark = input<boolean>(true);
  readonly href = input<string | null>(null);

  readonly classes = computed(() => {
    const base = 'coherence-logo';
    return [base, \`\${base}--\${this.size()}\`, \`\${base}--\${this.variant()}\`,
      this.showWordmark() ? \`\${base}--mark\` : \`\${base}--icon\`].join(' ');
  });

  readonly symbolFill = computed(() =>
    this.variant() === 'monochrome' ? 'currentColor' : 'var(--brand-mark-symbol)');

  readonly viewBox = computed(() =>
    this.showWordmark() ? '0 0 95 32' : '50 6 45 26');
}`);

  readonly cssSnippet = computed(() => `.coherence-logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: inherit;

  &--sm { height: var(--dim-24); }
  &--md { height: var(--dim-32); }
  &--lg { height: var(--dim-48); }
  &--xl { height: var(--dim-64); }

  &__svg {
    display: block;
    height: 100%;
    width: auto;
  }

  a#{&} {
    border-radius: var(--radius-xs, 4px);
    outline: none;
    &:focus-visible { box-shadow: 0 0 0 2px var(--border-focus); }
    &:hover { opacity: 0.85; }
    &:active { opacity: 0.7; }
  }
}`);

  copyTokens(): void {
    const text = this.tokenRows()
      .map(r => `${r.property}: ${r.token}`)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      this.tokensCopied.set(true);
      setTimeout(() => this.tokensCopied.set(false), 2000);
    });
  }
}
