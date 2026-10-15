import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent, DropdownPanelComponent } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Background', token: '--overlay-dropdown' },
      { property: 'Border', token: '--border-subtle' },
      { property: 'Shadow', token: '--elevation-lg' },
      { property: 'Border radius', token: '--radius-panel' },
      { property: 'Layer', token: '--z-floating' },
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
    ButtonComponent,
    DropdownPanelComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown-panel.page.html',
  styleUrl: './dropdown-panel.page.scss',
})
export class DropdownPanelPage {
  readonly open = signal(false);
  readonly tokenCategories = TOKEN_CATEGORIES;
}
