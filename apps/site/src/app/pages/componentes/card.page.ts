import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardComponent, SegmentedControlComponent } from '@coherence/ui';
import type { CardVariant, CardPadding } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const VISUAL_CATEGORY: DocTokenCategory = {
  value: 'visual',
  label: 'Visual',
  rows: [
    { property: 'Background (default)', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
    { property: 'Background (elevated)', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
    { property: 'Background (quiet)', token: '--surface-quiet', semantic: '--surface-quiet', primitive: '--color-afi-control-100' },
    { property: 'Border', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-gris-200' },
    { property: 'Shadow (elevated)', token: '--shadow-md', semantic: '--shadow-md', primitive: '0 4px 6px rgba(0,0,0,0.06)' },
    { property: 'Border radius', token: '--radius-lg', semantic: '--radius-lg', primitive: '12px' },
  ],
};

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'Padding (sm)', token: '--space-md', semantic: '--space-md', primitive: '16px' },
    { property: 'Padding (md)', token: '--space-lg', semantic: '--space-lg', primitive: '24px' },
    { property: 'Padding (lg)', token: '--space-xl', semantic: '--space-xl', primitive: '32px' },
  ],
};

const VARIANT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'elevated', label: 'Elevated' },
  { value: 'quiet', label: 'Quiet' },
];

const PADDING_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
];

@Component({
  selector: 'site-card-page',
  standalone: true,
  imports: [
    RouterLink,
    CardComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.page.html',
  styleUrl: './card.page.scss',
})
export class CardPage {
  readonly variant = signal<CardVariant>('default');
  readonly padding = signal<CardPadding>('md');

  readonly variantOptions = VARIANT_OPTIONS;
  readonly paddingOptions = PADDING_OPTIONS;

  readonly tokenCategories: DocTokenCategory[] = [VISUAL_CATEGORY, SIZING_CATEGORY];
}
