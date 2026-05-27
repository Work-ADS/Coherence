import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TopBarComponent } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Background', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
      { property: 'Bottom border', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-gris-200' },
      { property: 'Link color', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
      { property: 'Link color (active)', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'Height', token: '--dimension-14', semantic: '--dimension-14', primitive: '56px' },
      { property: 'Padding inline', token: '--space-lg', semantic: '--space-lg', primitive: '24px' },
      { property: 'Gap (links)', token: '--space-md', semantic: '--space-md', primitive: '16px' },
    ],
  },
];

@Component({
  selector: 'site-top-bar-page',
  standalone: true,
  imports: [
    RouterLink,
    TopBarComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-bar.page.html',
  styleUrl: './top-bar.page.scss',
})
export class TopBarPage {
  readonly tokenCategories = TOKEN_CATEGORIES;
}
