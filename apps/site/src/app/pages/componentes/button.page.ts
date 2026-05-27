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
      { property: 'Background (idle)', token: '--brand-secondary-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-500' },
      { property: 'Background (hover)', token: '--brand-secondary-background-hover', semantic: '--brand-secondary-background-hover', primitive: '--color-afi-azul-600' },
      { property: 'Background (active)', token: '--brand-secondary-background-active', semantic: '--brand-secondary-background-active', primitive: '--color-afi-azul-700' },
      { property: 'Background (disabled)', token: '--brand-secondary-background-disabled', semantic: '--brand-secondary-background-disabled', primitive: '--color-afi-azul-200' },
      { property: 'Foreground', token: '--brand-secondary-foreground-default', semantic: '--brand-secondary-foreground-default', primitive: '--color-afi-azul-0' },
      { property: 'Border radius', token: '--radius-md', semantic: '--radius-md', primitive: '6px' },
    ],
  },
  {
    value: 'secondary',
    label: 'Secondary',
    rows: [
      { property: 'Background (idle)', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
      { property: 'Background (hover)', token: '--surface-subtle', semantic: '--surface-subtle', primitive: '--color-afi-control-50' },
      { property: 'Background (active)', token: '--surface-muted', semantic: '--surface-muted', primitive: '--color-afi-control-100' },
      { property: 'Foreground', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
      { property: 'Border', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-gris-200' },
      { property: 'Border radius', token: '--radius-md', semantic: '--radius-md', primitive: '6px' },
    ],
  },
  {
    value: 'ghost',
    label: 'Ghost',
    rows: [
      { property: 'Background (idle)', token: 'transparent', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Background (hover)', token: '--surface-subtle', semantic: '--surface-subtle', primitive: '--color-afi-control-50' },
      { property: 'Background (active)', token: '--surface-muted', semantic: '--surface-muted', primitive: '--color-afi-control-100' },
      { property: 'Foreground', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
      { property: 'Border radius', token: '--radius-md', semantic: '--radius-md', primitive: '6px' },
    ],
  },
  {
    value: 'danger',
    label: 'Danger',
    rows: [
      { property: 'Background', token: '--feedback-error-foreground', semantic: '--feedback-error-foreground', primitive: '--color-error-700' },
      { property: 'Foreground', token: '--feedback-error-background', semantic: '--feedback-error-background', primitive: '--color-error-50' },
      { property: 'Border radius', token: '--radius-md', semantic: '--radius-md', primitive: '6px' },
    ],
  },
];

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'sm height', token: '--control-h-sm', semantic: '--control-h-sm', primitive: '32px' },
    { property: 'md height', token: '--control-h-md', semantic: '--control-h-md', primitive: '40px' },
    { property: 'lg height', token: '--control-h-lg', semantic: '--control-h-lg', primitive: '48px' },
    { property: 'sm padding', token: '--space-sm', semantic: '--space-sm', primitive: '12px' },
    { property: 'md padding', token: '--space-md', semantic: '--space-md', primitive: '16px' },
    { property: 'lg padding', token: '--space-lg', semantic: '--space-lg', primitive: '24px' },
    { property: 'Typography (sm)', token: '--type-body-sm-500', semantic: '--type-body-sm-500', primitive: '14px / 20px / 500' },
    { property: 'Typography (md, lg)', token: '--type-button', semantic: '--type-button', primitive: '16px / 24px / 500' },
  ],
};

const VARIANT_OPTIONS = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'danger', label: 'Danger' },
];

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
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
