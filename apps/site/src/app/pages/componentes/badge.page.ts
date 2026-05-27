import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BadgeComponent, SegmentedControlComponent } from '@coherence/ui';
import type { BadgeIntent, BadgeSize } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const ALL_INTENT_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'neutral',
    label: 'Neutral',
    rows: [
      { property: 'Background', token: '--surface-quiet', semantic: '--surface-quiet', primitive: '--color-afi-control-100' },
      { property: 'Foreground', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
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
      { property: 'Foreground', token: '--feedback-warning-foreground', semantic: '--feedback-warning-foreground', primitive: '--color-warning-700' },
    ],
  },
  {
    value: 'error',
    label: 'Error',
    rows: [
      { property: 'Background', token: '--feedback-error-background', semantic: '--feedback-error-background', primitive: '--color-error-50' },
      { property: 'Foreground', token: '--feedback-error-foreground', semantic: '--feedback-error-foreground', primitive: '--color-error-700' },
    ],
  },
];

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'sm height', token: '--dimension-5', semantic: '--dimension-5', primitive: '20px' },
    { property: 'md height', token: '--dimension-6', semantic: '--dimension-6', primitive: '24px' },
    { property: 'Border radius', token: '--radius-full', semantic: '--radius-full', primitive: '999px' },
    { property: 'Typography', token: '--type-body-sm-500', semantic: '--type-body-sm-500', primitive: '14px / 20px / 500' },
  ],
};

const INTENT_OPTIONS = [
  { value: 'neutral', label: 'Neutral' },
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
  readonly intent = signal<BadgeIntent>('neutral');
  readonly size = signal<BadgeSize>('md');

  readonly intentOptions = INTENT_OPTIONS;
  readonly sizeOptions = SIZE_OPTIONS;

  readonly tokenCategories = computed<DocTokenCategory[]>(() => {
    const i = this.intent();
    const match = ALL_INTENT_CATEGORIES.find(c => c.value === i) as DocTokenCategory;
    return [match, SIZING_CATEGORY];
  });
}
