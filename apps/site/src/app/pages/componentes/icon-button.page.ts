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
      { property: 'Background (idle)', token: '--brand-primary-background-default', semantic: '--brand-primary-background-default', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Background (hover)', token: '--brand-primary-background-hover', semantic: '--brand-primary-background-hover', primitive: '--color-afi-azul-profundo-600' },
      { property: 'Background (active)', token: '--brand-primary-background-active', semantic: '--brand-primary-background-active', primitive: '--color-afi-azul-profundo-700' },
      { property: 'Foreground', token: '--brand-primary-foreground-default', semantic: '--brand-primary-foreground-default', primitive: '--color-afi-azul-profundo-0' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '4px' },
    ],
  },
  {
    value: 'secondary',
    label: 'Secondary',
    rows: [
      { property: 'Background (idle)', token: '--brand-secondary-neutral-background-default', semantic: '--brand-secondary-neutral-background-default', primitive: '--color-afi-azul-profundo-50' },
      { property: 'Background (hover)', token: '--brand-secondary-neutral-background-hover', semantic: '--brand-secondary-neutral-background-hover', primitive: '--color-afi-azul-profundo-100' },
      { property: 'Background (active)', token: '--brand-secondary-neutral-background-active', semantic: '--brand-secondary-neutral-background-active', primitive: '--color-afi-azul-profundo-200' },
      { property: 'Foreground', token: '--brand-secondary-neutral-foreground-default', semantic: '--brand-secondary-neutral-foreground-default', primitive: '--color-afi-azul-900' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '4px' },
    ],
  },
  {
    value: 'ghost',
    label: 'Ghost',
    rows: [
      { property: 'Background (idle)', token: 'transparent', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Background (hover)', token: '--control-background-hover', semantic: '--control-background-hover', primitive: '--color-afi-control-100' },
      { property: 'Background (active)', token: '--control-background-active', semantic: '--control-background-active', primitive: '--color-afi-control-100' },
      { property: 'Foreground (idle)', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-500' },
      { property: 'Foreground (hover)', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '4px' },
    ],
  },
  {
    value: 'outline',
    label: 'Outline',
    rows: [
      { property: 'Background (idle)', token: 'transparent', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Background (hover)', token: '--control-background-default', semantic: '--control-background-default', primitive: '--color-afi-control-50' },
      { property: 'Border', token: '--border-default', semantic: '--border-default', primitive: '--color-afi-gris-300' },
      { property: 'Foreground (idle)', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-500' },
      { property: 'Foreground (hover)', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '4px' },
    ],
  },
  {
    value: 'destruction',
    label: 'Destruction',
    rows: [
      { property: 'Background (idle)', token: 'transparent', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Background (hover)', token: '--feedback-error-background', semantic: '--feedback-error-background', primitive: '--color-error-50' },
      { property: 'Background (active)', token: '--feedback-error-border', semantic: '--feedback-error-border', primitive: '--color-error-300' },
      { property: 'Foreground', token: '--feedback-error-foreground', semantic: '--feedback-error-foreground', primitive: '--color-error-700' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '4px' },
    ],
  },
];

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'sm', token: '32 × 32 px', semantic: '32px', primitive: '32px' },
    { property: 'md', token: '36 × 36 px', semantic: '36px', primitive: '36px' },
    { property: 'lg', token: '40 × 40 px', semantic: '40px', primitive: '40px' },
    { property: 'Icon', token: '16 × 16 px (all sizes)', semantic: '16px', primitive: '16px' },
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
  ];

  readonly sizeOptions = [
    { value: 'sm', label: 'sm' },
    { value: 'md', label: 'md' },
    { value: 'lg', label: 'lg' },
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
