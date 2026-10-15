import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  IconButtonComponent,
  SegmentedControlComponent,
  TooltipComponent,
} from '@coherence/ui';
import type { IconButtonVariant, IconButtonSize } from '@coherence/ui';

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
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
    ],
  },
  {
    value: 'ghost',
    label: 'Ghost',
    rows: [
      { property: 'Background (idle)', token: 'transparent', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Background (hover)', token: '--button-neutral-background-hover', semantic: '--button-neutral-background-hover', primitive: '--color-afi-control-100' },
      { property: 'Background (active, expanded)', token: '--button-neutral-background-active', semantic: '--button-neutral-background-active', primitive: '--color-afi-control-200' },
      { property: 'Foreground', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
    ],
  },
  {
    value: 'outline',
    label: 'Outline',
    rows: [
      { property: 'Background (idle)', token: 'transparent', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Background (hover)', token: '--button-neutral-background-hover', semantic: '--button-neutral-background-hover', primitive: '--color-afi-control-100' },
      { property: 'Border', token: '--border-default', semantic: '--border-default', primitive: '--color-afi-control-300' },
      { property: 'Border (hover)', token: '--border-strong', semantic: '--border-strong', primitive: '--color-afi-control-700' },
      { property: 'Foreground', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
    ],
  },
  {
    value: 'destruction',
    label: 'Destruction',
    rows: [
      { property: 'Background (idle)', token: 'transparent', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Background (hover)', token: '--button-danger-ghost-background-hover', semantic: '--button-danger-ghost-background-hover', primitive: '--color-error-50' },
      { property: 'Background (active)', token: '--button-danger-ghost-background-active', semantic: '--button-danger-ghost-background-active', primitive: '--color-error-200' },
      { property: 'Foreground', token: '--feedback-error-foreground', semantic: '--feedback-error-foreground', primitive: '--color-error-700' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
    ],
  },
  {
    value: 'quiet',
    label: 'Quiet',
    rows: [
      { property: 'Background (idle)', token: 'transparent', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Background (hover, active)', token: '--button-neutral-background-active', semantic: '--button-neutral-background-active', primitive: '--color-afi-control-200' },
      { property: 'Foreground (idle)', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-500' },
      { property: 'Foreground (hover)', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
    ],
  },
  {
    value: 'quiet-destruction',
    label: 'Quiet destruction',
    rows: [
      { property: 'Background (idle)', token: 'transparent', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Background (hover, active)', token: '--button-neutral-background-active', semantic: '--button-neutral-background-active', primitive: '--color-afi-control-200' },
      { property: 'Foreground (idle)', token: '--feedback-error-foreground', semantic: '--feedback-error-foreground', primitive: '--color-error-700' },
      { property: 'Foreground (hover)', token: '--button-danger-background-active', semantic: '--button-danger-background-active', primitive: '--color-error-900' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
    ],
  },
];

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
      { property: 'sm', token: '--icon-button-size-sm', semantic: '--icon-button-size-sm', primitive: '24px' },
      { property: 'md', token: '--icon-button-size-md', semantic: '--icon-button-size-md', primitive: '28px' },
      { property: 'lg', token: '--icon-button-size-lg', semantic: '--icon-button-size-lg', primitive: '32px' },
      { property: 'xl', token: '--icon-button-size-xl', semantic: '--icon-button-size-xl', primitive: '36px' },
      { property: '2xl', token: '--icon-button-size-2xl', semantic: '--icon-button-size-2xl', primitive: '40px' },
      { property: 'Icon (sm to lg)', token: '--icon-button-icon-size', semantic: '--icon-button-icon-size', primitive: '16px' },
      { property: 'Icon (xl)', token: '--dimension-4-5', semantic: '--dimension-4-5', primitive: '18px' },
      { property: 'Icon (2xl)', token: '--icon-md', semantic: '--icon-md', primitive: '20px' },
      { property: 'Hit area', token: '--touch-target-min', semantic: '--touch-target-min', primitive: '44px' },
  ],
};

@Component({
  selector: 'app-icon-button-page',
  standalone: true,
  imports: [
    RouterLink,
    IconButtonComponent,
    SegmentedControlComponent,
    TooltipComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-button.page.html',
  styleUrl: './icon-button.page.scss',
})
export class IconButtonPage {
  readonly variant = signal<IconButtonVariant>('ghost');
  readonly size = signal<IconButtonSize>('md');
  readonly disabled = signal(false);

  readonly variantOptions = [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'ghost', label: 'Ghost' },
    { value: 'outline', label: 'Outline' },
    { value: 'destruction', label: 'Destruction' },
    { value: 'quiet', label: 'Quiet' },
    { value: 'quiet-destruction', label: 'Quiet destruction' },
  ];

  readonly sizeOptions = [
    { value: 'sm', label: 'sm' },
    { value: 'md', label: 'md' },
    { value: 'lg', label: 'lg' },
    { value: 'xl', label: 'xl' },
    { value: '2xl', label: '2xl' },
  ];

  /** Reactive: shows only the tokens for the currently selected variant */
  readonly tokenCategories = computed<DocTokenCategory[]>(() => {
    const v = this.variant();
    const match = ALL_TOKEN_CATEGORIES.find(c => c.value === v) as DocTokenCategory;
    return [match];
  });

  toggleDisabled(): void {
    this.disabled.set(!this.disabled());
  }
}
