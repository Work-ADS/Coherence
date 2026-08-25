import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  SegmentedControlComponent,
  SelectComponent,
} from '@coherence/ui';
import type { SegmentedControlVariant, SelectOption } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const ALL_LABELS = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

const PILL_TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'background',
    label: 'Background',
    rows: [
      { property: 'Container', token: '--control-background-default', semantic: '--control-background-default', primitive: '--color-afi-control-50' },
      { property: 'Pill (active)', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-white-0' },
    ],
  },
  {
    value: 'foreground',
    label: 'Foreground',
    rows: [
      { property: 'Active text', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-950' },
      { property: 'Inactive text', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-700' },
      { property: 'Hover text', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-800' },
      { property: 'Focus ring', token: '--border-focus', semantic: '--border-focus', primitive: '--color-afi-azul-500' },
    ],
  },
  {
    value: 'type',
    label: 'Type',
    rows: [
      { property: 'Font (sm)', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '14px/1.4 400' },
      { property: 'Font (sm active)', token: '--type-body-sm-500', semantic: '--type-body-sm-500', primitive: '14px/1.4 500' },
      { property: 'Font (md)', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '16px/1.5 400' },
      { property: 'Font (md active)', token: '--type-body-md-500', semantic: '--type-body-md-500', primitive: '16px/1.5 500' },
    ],
  },
  {
    value: 'spacing',
    label: 'Spacing',
    rows: [
      { property: 'Container padding', token: '--space-2xs', semantic: '--space-2xs', primitive: '--dimension-1 (4px)' },
      { property: 'Gap between options', token: '--space-2xs', semantic: '--space-2xs', primitive: '--dimension-1 (4px)' },
      { property: 'Option padding-x (sm)', token: '--space-sm', semantic: '--space-sm', primitive: '--dimension-3 (12px)' },
      { property: 'Option padding-x (md/lg)', token: '--space-md', semantic: '--space-md', primitive: '--dimension-4 (16px)' },
      { property: 'Option height (sm)', token: '--dimension-7', semantic: '--dimension-7', primitive: '28px' },
      { property: 'Option height (md)', token: '--dimension-9', semantic: '--dimension-9', primitive: '36px' },
      { property: 'Option height (lg)', token: '--dimension-10', semantic: '--dimension-10', primitive: '40px' },
    ],
  },
  {
    value: 'radius',
    label: 'Border Radius',
    rows: [
      { property: 'Container radius', token: '--radius-lg', semantic: '--radius-lg', primitive: '12px' },
      { property: 'Pill / option radius', token: '--radius-md', semantic: '--radius-md', primitive: '8px' },
    ],
  },
  {
    value: 'elevation',
    label: 'Elevation',
    rows: [
      { property: 'Pill shadow', token: '--elevation-sm', semantic: '--elevation-sm', primitive: '0 1px 2px rgba(0,0,0,.05)' },
      { property: 'Focus ring', token: '--border-focus', semantic: '--border-focus', primitive: '0 0 0 2px var(--border-focus)' },
    ],
  },
];

/**
 * `variant="cards"` restructures the control into radio cards, so it consumes a
 * different slice of the token set — border and control-foreground roles the
 * pill track never touches. Kept as its own list so the table always describes
 * what is actually on screen.
 */
const CARDS_TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'background',
    label: 'Background',
    rows: [
      { property: 'Track', token: 'transparent', value: 'transparent', note: 'no track in cards' },
      { property: 'Card', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-white-25' },
      { property: 'Radio mark (inner ring)', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-white-25' },
      { property: 'Radio mark (selected)', token: '--control-foreground-selected', semantic: '--control-foreground-selected', primitive: '--color-afi-azul-profundo-700' },
    ],
  },
  {
    value: 'foreground',
    label: 'Foreground',
    rows: [
      { property: 'Card label', token: '--control-foreground-default', semantic: '--control-foreground-default', primitive: '--color-afi-white-900' },
      { property: 'Card label (hover)', token: '--control-foreground-hover', semantic: '--control-foreground-hover', primitive: '--color-afi-white-800' },
      { property: 'Focus ring', token: '--border-focus', semantic: '--border-focus', primitive: '--color-afi-control-500' },
    ],
  },
  {
    value: 'border',
    label: 'Border',
    rows: [
      { property: 'Card border', token: '--border-subtle', semantic: '--border-subtle', primitive: '--color-afi-control-200' },
      { property: 'Card border (hover)', token: '--control-border-hover', semantic: '--control-border-hover', primitive: '--color-afi-control-300' },
      { property: 'Radio mark ring', token: '--control-foreground-selected', semantic: '--control-foreground-selected', primitive: '--color-afi-azul-profundo-700' },
      { property: 'Border width', token: '--border-width-hairline', semantic: '--border-width-hairline', primitive: '--dimension-0-25 (1px)' },
      { property: 'Focus ring width', token: '--border-width-thick', semantic: '--border-width-thick', primitive: '--dimension-0-5 (2px)' },
    ],
  },
  {
    value: 'type',
    label: 'Type',
    rows: [
      { property: 'Card label', token: '--type-body-lg-600', semantic: '--type-body-lg-600', primitive: '18px/1.5 600', note: 'same at sm / md / lg' },
    ],
  },
  {
    value: 'spacing',
    label: 'Spacing',
    rows: [
      { property: 'Gap between cards', token: '--dimension-3', semantic: '--dimension-3', primitive: '12px' },
      { property: 'Gap label to radio', token: '--dimension-4', semantic: '--dimension-4', primitive: '16px' },
      { property: 'Card padding-block', token: '--dimension-4', semantic: '--dimension-4', primitive: '16px' },
      { property: 'Card padding-inline', token: '--dimension-5', semantic: '--dimension-5', primitive: '20px' },
      { property: 'Card min-height', token: '--dimension-18', semantic: '--dimension-18', primitive: '72px' },
      { property: 'Card min-width', token: '--dimension-56', semantic: '--dimension-56', primitive: '224px' },
      { property: 'Radio mark size', token: '--dimension-6', semantic: '--dimension-6', primitive: '24px' },
    ],
  },
  {
    value: 'radius',
    label: 'Border Radius',
    rows: [
      { property: 'Card radius', token: '--dimension-2', semantic: '--dimension-2', primitive: '8px' },
      { property: 'Radio mark radius', token: '--radius-full', semantic: '--radius-full', primitive: '9999px' },
    ],
  },
];


@Component({
  selector: 'app-segmented-control-page',
  standalone: true,
  imports: [
    RouterLink,
    SegmentedControlComponent,
    SelectComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './segmented-control.page.html',
  styleUrl: './segmented-control.page.scss',
})
export class SegmentedControlPage {
  readonly selected = signal('daily');
  readonly size = signal<string>('md');
  readonly count = signal<string>('3');
  readonly variant = signal<SegmentedControlVariant>('pill');

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

  readonly variantOptions: SelectOption[] = [
    { value: 'pill', label: 'pill' },
    { value: 'cards', label: 'cards' },
  ];

  readonly countOptions: SelectOption[] = [
    { value: '2', label: '2 options' },
    { value: '3', label: '3 options' },
    { value: '4', label: '4 options' },
    { value: '5', label: '5 options' },
  ];

  readonly tokenCategories = computed(() =>
    this.variant() === 'cards' ? CARDS_TOKEN_CATEGORIES : PILL_TOKEN_CATEGORIES,
  );

  onVariantChange(val: string): void {
    this.variant.set(val === 'cards' ? 'cards' : 'pill');
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
}
