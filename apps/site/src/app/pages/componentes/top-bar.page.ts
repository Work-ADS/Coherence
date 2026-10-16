import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent, SegmentedControlComponent, TopBarComponent } from '@coherence/ui';
import type { TopBarVariant } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'surface',
    label: 'Surface',
    rows: [
      { property: 'Solid', token: '--surface-default', semantic: '--surface-default', primitive: 'hairline --border-subtle underneath' },
      { property: 'Glass tint', token: '--top-bar-glass-tint', semantic: '--surface-default at 55%', primitive: 'blur --blur-lg' },
      { property: 'On brand', token: '--canvas-brand', semantic: 'none: the bar is drawn on the canvas', primitive: '--color-afi-azul-profundo-500' },
      { property: 'On brand ink', token: '--top-bar-on-brand-foreground', semantic: '--color-afi-control-0', primitive: 'fixed light ink in both themes' },
      { property: 'On brand focus ring', token: '--border-focus-inverse', semantic: '--border-focus-inverse', primitive: '--color-afi-azul-200' },
      { property: 'On brand hover wash', token: '--control-background-hover-inverse', semantic: '--control-background-hover-inverse', primitive: 'white at low opacity' },
    ],
  },
  {
    value: 'geometry',
    label: 'Geometry',
    rows: [
      { property: 'Height (default)', token: '--top-bar-height', semantic: '--dimension-14', primitive: '56px' },
      { property: 'Height (shellBand)', token: '--layout-shell-header', semantic: '--dimension-12', primitive: '48px, the sidebar brand row too' },
      { property: 'Gutter (default)', token: '--space-md', semantic: '--space-md', primitive: '16px' },
      { property: 'Gutter (shellBand)', token: '--layout-rail-inset', semantic: '--dimension-6', primitive: '24px (16px at 40rem and under: --layout-rail-inset-sm)' },
      { property: 'Exit rule', token: '--top-bar-exit-rule-height', semantic: '--dimension-6', primitive: '24px' },
    ],
  },
];

const VARIANT_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'glass', label: 'Glass' },
  { value: 'on-brand', label: 'On brand' },
];
const OFF_ON_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
];

@Component({
  selector: 'site-top-bar-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, SegmentedControlComponent, TopBarComponent, DocPageShellComponent, DocTokensComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-bar.page.html',
  styleUrl: './top-bar.page.scss',
})
export class TopBarPage {
  readonly variant = signal<TopBarVariant>('solid');
  readonly shellBand = signal<'off' | 'on'>('on');
  readonly borderless = signal<'off' | 'on'>('off');
  readonly exit = signal<'off' | 'on'>('off');

  readonly variantOptions = VARIANT_OPTIONS;
  readonly offOnOptions = OFF_ON_OPTIONS;
  readonly tokenCategories = TOKEN_CATEGORIES;

  readonly onBrand = computed(() => this.variant() === 'on-brand');
  readonly rows = Array.from({ length: 12 }, (_, i) => i + 1);
}
