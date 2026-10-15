import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent, SegmentedControlComponent } from '@coherence/ui';
import type { ButtonVariant, ButtonSize } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const ALL_TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'primary',
    label: 'Primary',
    rows: [
      { property: 'Background (idle)', token: '--button-primary-background-default', semantic: '--button-primary-background-default', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Background (hover)', token: '--button-primary-background-hover', semantic: '--button-primary-background-hover', primitive: '--color-afi-azul-profundo-450' },
      { property: 'Background (active)', token: '--button-primary-background-active', semantic: '--button-primary-background-active', primitive: '--color-afi-azul-profundo-700' },
      { property: 'Foreground', token: '--brand-secondary-foreground-default', semantic: '--brand-secondary-foreground-default', primitive: '--color-afi-azul-profundo-0' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
    ],
  },
  {
    value: 'secondary',
    label: 'Secondary',
    rows: [
      { property: 'Background (idle)', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
      { property: 'Background (hover)', token: '--button-neutral-background-hover', semantic: '--button-neutral-background-hover', primitive: '--color-afi-control-100' },
      { property: 'Background (active)', token: '--button-neutral-background-active', semantic: '--button-neutral-background-active', primitive: '--color-afi-control-200' },
      { property: 'Foreground', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
      { property: 'Border', token: '--border-default', semantic: '--border-default', primitive: '--color-afi-control-300' },
      { property: 'Border (hover)', token: '--border-strong', semantic: '--border-strong', primitive: '--color-afi-control-700' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
    ],
  },
  {
    value: 'ghost',
    label: 'Ghost',
    rows: [
      { property: 'Background (idle)', token: 'transparent', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Background (hover)', token: '--button-neutral-background-hover', semantic: '--button-neutral-background-hover', primitive: '--color-afi-control-100' },
      { property: 'Background (active)', token: '--button-neutral-background-active', semantic: '--button-neutral-background-active', primitive: '--color-afi-control-200' },
      { property: 'Foreground', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
    ],
  },
  {
    value: 'danger',
    label: 'Danger',
    rows: [
      { property: 'Background (idle)', token: '--button-danger-background-default', semantic: '--button-danger-background-default', primitive: '--color-error-700' },
      { property: 'Background (hover)', token: '--button-danger-background-hover', semantic: '--button-danger-background-hover', primitive: '--color-error-900' },
      { property: 'Background (active)', token: '--button-danger-background-active', semantic: '--button-danger-background-active', primitive: '--color-error-900' },
      { property: 'Foreground', token: '--button-danger-foreground', semantic: '--button-danger-foreground', primitive: '--color-error-50' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
    ],
  },
  {
    value: 'danger-ghost',
    label: 'Danger ghost',
    rows: [
      { property: 'Background (idle)', token: 'transparent', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Background (hover)', token: '--button-danger-ghost-background-hover', semantic: '--button-danger-ghost-background-hover', primitive: '--color-error-50' },
      { property: 'Background (active)', token: '--button-danger-ghost-background-active', semantic: '--button-danger-ghost-background-active', primitive: '--color-error-200' },
      { property: 'Foreground', token: '--feedback-error-foreground', semantic: '--feedback-error-foreground', primitive: '--color-error-700' },
      { property: 'Border', token: '--feedback-error-foreground', semantic: '--feedback-error-foreground', primitive: '--color-error-700' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
    ],
  },
  {
    value: 'warning-ghost',
    label: 'Warning ghost',
    rows: [
      { property: 'Background (idle)', token: 'transparent', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Background (hover)', token: '--button-warning-ghost-background-hover', semantic: '--button-warning-ghost-background-hover', primitive: '--feedback-warning-background' },
      { property: 'Background (active)', token: '--button-warning-ghost-background-active', semantic: '--button-warning-ghost-background-active', primitive: '--color-warning-100' },
      { property: 'Foreground', token: '--button-warning-ghost-foreground', semantic: '--button-warning-ghost-foreground', primitive: '--color-warning-900' },
      { property: 'Border', token: '--button-warning-ghost-border', semantic: '--button-warning-ghost-border', primitive: '--color-warning-700' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
    ],
  },
];

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
      { property: 'sm height', token: '--control-size-sm', semantic: '--control-size-sm', primitive: '24px' },
      { property: 'md height', token: '--control-size-md', semantic: '--control-size-md', primitive: '28px' },
      { property: 'lg height', token: '--control-size-lg', semantic: '--control-size-lg', primitive: '32px' },
      { property: 'xl height', token: '--control-size-xl', semantic: '--control-size-xl', primitive: '36px' },
      { property: '2xl height', token: '--control-size-2xl', semantic: '--control-size-2xl', primitive: '40px' },
      { property: 'sm padding', token: '--space-xs', semantic: '--space-xs', primitive: '8px' },
      { property: 'md, lg padding', token: '--space-sm', semantic: '--space-sm', primitive: '12px' },
      { property: 'xl, 2xl padding', token: '--space-md', semantic: '--space-md', primitive: '16px' },
      { property: 'Typography (sm, md)', token: '--control-label-font-sm', semantic: '--control-label-font-sm', primitive: '12px / 16px / 400' },
      { property: 'Typography (lg, xl, 2xl)', token: '--control-label-font-lg', semantic: '--control-label-font-lg', primitive: '14px / 14px / 400' },
      { property: 'Letter spacing', token: '--control-label-tracking', semantic: '--control-label-tracking', primitive: '0.5px' },
      { property: 'Hit area', token: '--touch-target-min', semantic: '--touch-target-min', primitive: '44px' },
  ],
};

const VARIANT_OPTIONS = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'danger', label: 'Danger' },
  { value: 'danger-ghost', label: 'Danger ghost' },
  { value: 'warning-ghost', label: 'Warning ghost' },
];

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
  { value: 'xl', label: 'xl' },
  { value: '2xl', label: '2xl' },
];

const STATE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'loading', label: 'Loading' },
];

@Component({
  selector: 'site-button-page',
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.page.html',
  styleUrl: './button.page.scss',
})
export class ButtonPage {
  readonly variant = signal<ButtonVariant>('primary');
  readonly size = signal<ButtonSize>('md');
  readonly state = signal<'default' | 'disabled' | 'loading'>('default');

  readonly variantOptions = VARIANT_OPTIONS;
  readonly sizeOptions = SIZE_OPTIONS;
  readonly stateOptions = STATE_OPTIONS;

  readonly disabled = computed(() => this.state() === 'disabled');
  readonly loading = computed(() => this.state() === 'loading');

  readonly tokenCategories = computed<DocTokenCategory[]>(() => {
    const v = this.variant();
    const match = ALL_TOKEN_CATEGORIES.find(c => c.value === v) as DocTokenCategory;
    return [match, SIZING_CATEGORY];
  });
}
