import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  NavSectionComponent,
  NavItemComponent,
  SegmentedControlComponent,
} from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Section label', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
      { property: 'Tree line', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-gris-200' },
      { property: 'Chevron color', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-500' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'Section header height', token: '--control-h-md', semantic: '--control-h-md', primitive: '40px' },
      { property: 'Indent (tree line)', token: '--space-md', semantic: '--space-md', primitive: '16px' },
      { property: 'Typography (label)', token: '--type-body-md-500', semantic: '--type-body-md-500', primitive: '16px / 24px / 500' },
    ],
  },
];

const CHEVRON_OPTIONS = [
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
];

@Component({
  selector: 'site-nav-section-page',
  standalone: true,
  imports: [
    RouterLink,
    NavSectionComponent,
    NavItemComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-section.page.html',
  styleUrl: './nav-section.page.scss',
})
export class NavSectionPage {
  readonly chevronPosition = signal<'right' | 'left'>('right');
  readonly showTreeLines = signal(true);

  readonly chevronOptions = CHEVRON_OPTIONS;
  readonly tokenCategories = TOKEN_CATEGORIES;
}
