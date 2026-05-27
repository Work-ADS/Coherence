import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  PageHeaderComponent,
  ButtonComponent,
  SegmentedControlComponent,
} from '@coherence/ui';
import type { PageHeaderDensity } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Background', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
      { property: 'Bottom border', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-gris-200' },
      { property: 'Title color', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
      { property: 'Subtitle color', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'Padding (default)', token: '--space-xl', semantic: '--space-xl', primitive: '32px' },
      { property: 'Padding (compact)', token: '--space-md', semantic: '--space-md', primitive: '16px' },
      { property: 'Title typography', token: '--type-title', semantic: '--type-title', primitive: '24px / 32px / 600' },
      { property: 'Subtitle typography', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '16px / 24px / 400' },
    ],
  },
];

const DENSITY_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'compact', label: 'Compact' },
];

@Component({
  selector: 'site-page-header-page',
  standalone: true,
  imports: [
    RouterLink,
    PageHeaderComponent,
    ButtonComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-header.page.html',
  styleUrl: './page-header.page.scss',
})
export class PageHeaderPage {
  readonly density = signal<PageHeaderDensity>('default');

  readonly densityOptions = DENSITY_OPTIONS;
  readonly tokenCategories = TOKEN_CATEGORIES;
}
