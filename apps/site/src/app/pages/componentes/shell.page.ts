import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SegmentedControlComponent } from '@coherence/ui';
import type { ShellType } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Background (workspace)', token: '--surface-quiet', semantic: '--surface-quiet', primitive: '--color-afi-control-100' },
      { property: 'Background (docs)', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
      { property: 'Content surface', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
      { property: 'Divider', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-gris-200' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'Sidebar width', token: '--dimension-sidebar', semantic: '--dimension-sidebar', primitive: '256px' },
      { property: 'Right rail width', token: '--dimension-rail', semantic: '--dimension-rail', primitive: '320px' },
      { property: 'Content max-width', token: '--content-doc', semantic: '--content-doc', primitive: '960px' },
    ],
  },
];

const TYPE_OPTIONS = [
  { value: 'workspace', label: 'Workspace' },
  { value: 'docs', label: 'Docs' },
  { value: 'auth', label: 'Auth' },
  { value: 'focus', label: 'Focus' },
  { value: 'canvas', label: 'Canvas' },
];

@Component({
  selector: 'site-shell-page',
  standalone: true,
  imports: [
    RouterLink,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.page.html',
  styleUrl: './shell.page.scss',
})
export class ShellPage {
  readonly type = signal<ShellType>('workspace');

  readonly typeOptions = TYPE_OPTIONS;
  readonly tokenCategories = TOKEN_CATEGORIES;
}
