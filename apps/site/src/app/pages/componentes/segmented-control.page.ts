import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  SegmentedControlComponent,
  SelectComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const ALL_LABELS = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

const TOKEN_CATEGORIES: DocTokenCategory[] = [
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

  readonly tokenCategories = TOKEN_CATEGORIES;


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
