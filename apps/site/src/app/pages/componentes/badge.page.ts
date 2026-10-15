import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BadgeComponent, SegmentedControlComponent } from '@coherence/ui';
import type { BadgeSize, BadgeTone, BadgeVariant } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const ALL_INTENT_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'neutral',
    label: 'Neutral',
    rows: [
      { property: 'Background', token: '--surface-subtle', semantic: '--surface-subtle', primitive: '--color-afi-control-50' },
      { property: 'Foreground', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
    ],
  },
  {
    value: 'brand',
    label: 'Brand',
    rows: [
      { property: 'Background', token: '--brand-secondary-neutral-background-default', semantic: '--brand-secondary-neutral-background-default', primitive: '--color-afi-azul-profundo-50' },
      { property: 'Foreground', token: '--brand-secondary-neutral-foreground-default', semantic: '--brand-secondary-neutral-foreground-default', primitive: '--color-afi-azul-profundo-800' },
      { property: 'Background (solid)', token: '--brand-secondary-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-profundo-500' },
    ],
  },
  {
    value: 'info',
    label: 'Info',
    rows: [
      { property: 'Background', token: '--feedback-info-background', semantic: '--feedback-info-background', primitive: '--color-info-50' },
      { property: 'Foreground', token: '--feedback-info-foreground', semantic: '--feedback-info-foreground', primitive: '--color-info-700' },
    ],
  },
  {
    value: 'success',
    label: 'Success',
    rows: [
      { property: 'Background', token: '--feedback-success-background', semantic: '--feedback-success-background', primitive: '--color-success-50' },
      { property: 'Foreground', token: '--feedback-success-foreground', semantic: '--feedback-success-foreground', primitive: '--color-success-700' },
    ],
  },
  {
    value: 'warning',
    label: 'Warning',
    rows: [
      { property: 'Background', token: '--feedback-warning-background', semantic: '--feedback-warning-background', primitive: '--color-warning-50' },
      { property: 'Foreground (text)', token: '--feedback-warning-text', semantic: '--feedback-warning-text', primitive: '--color-warning-900' },
      { property: 'Indicator dot', token: '--feedback-warning-indicator', semantic: '--feedback-warning-indicator', primitive: '--color-warning-500' },
    ],
  },
  {
    value: 'error',
    label: 'Error',
    rows: [
      { property: 'Background', token: '--feedback-error-background', semantic: '--feedback-error-background', primitive: '--color-error-50' },
      { property: 'Foreground', token: '--feedback-error-foreground', semantic: '--feedback-error-foreground', primitive: '--color-error-700' },
      { property: 'Background (solid)', token: '--button-danger-background-default', semantic: '--button-danger-background-default', primitive: '--color-error-700' },
    ],
  },
];

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
      { property: 'sm height', token: '--dimension-4', semantic: '--dimension-4', primitive: '16px' },
      { property: 'md height', token: '--dimension-5', semantic: '--dimension-5', primitive: '20px' },
      { property: 'Inline padding (md)', token: '--space-xs', semantic: '--space-xs', primitive: '8px' },
      { property: 'Border radius', token: '--radius-pill', semantic: '--radius-pill', primitive: '9999px' },
      { property: 'Typography (md)', token: '--type-body-sm-600', semantic: '--type-body-sm-600', primitive: '12px / 16px / 600' },
      { property: 'Typography (sm)', token: '--type-body-sm-500', semantic: '--type-body-sm-500', primitive: '12px / 16px / 500' },
      { property: 'Icon', token: '--icon-xs', semantic: '--icon-xs', primitive: '12px' },
  ],
};

const VARIANT_OPTIONS = [
  { value: 'soft', label: 'Soft' },
  { value: 'solid', label: 'Solid' },
  { value: 'outline', label: 'Outline' },
];

const INTENT_OPTIONS = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'brand', label: 'Brand' },
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
];

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
];

@Component({
  selector: 'site-badge-page',
  standalone: true,
  imports: [
    RouterLink,
    BadgeComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.page.html',
  styleUrl: './badge.page.scss',
})
export class BadgePage {
  readonly intent = signal<BadgeTone>('neutral');
  readonly variant = signal<BadgeVariant>('soft');
  readonly size = signal<BadgeSize>('md');

  readonly intentOptions = INTENT_OPTIONS;
  readonly variantOptions = VARIANT_OPTIONS;
  readonly sizeOptions = SIZE_OPTIONS;

  readonly tokenCategories = computed<DocTokenCategory[]>(() => {
    const i = this.intent();
    const match = ALL_INTENT_CATEGORIES.find(c => c.value === i) as DocTokenCategory;
    return [match, SIZING_CATEGORY];
  });
}
