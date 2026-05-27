import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DropdownPanelComponent } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Background', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
      { property: 'Border', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-gris-200' },
      { property: 'Shadow', token: '--shadow-lg', semantic: '--shadow-lg', primitive: '0 10px 15px rgba(0,0,0,0.10)' },
      { property: 'Border radius', token: '--radius-lg', semantic: '--radius-lg', primitive: '12px' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'Padding', token: '--space-xs', semantic: '--space-xs', primitive: '8px' },
      { property: 'Min width', token: '--dimension-44', semantic: '--dimension-44', primitive: '176px' },
    ],
  },
];

@Component({
  selector: 'site-dropdown-panel-page',
  standalone: true,
  imports: [
    RouterLink,
    DropdownPanelComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown-panel.page.html',
  styleUrl: './dropdown-panel.page.scss',
})
export class DropdownPanelPage {
  readonly tokenCategories = TOKEN_CATEGORIES;
}
