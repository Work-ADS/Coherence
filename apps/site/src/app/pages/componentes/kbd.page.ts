import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { KbdComponent, SegmentedControlComponent } from '@coherence/ui';
import type { KbdSize, KbdSeparator } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Background', token: '--surface-muted', semantic: '--surface-muted', primitive: '--color-afi-control-100' },
      { property: 'Border', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-gris-200' },
      { property: 'Foreground', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
      { property: 'Border radius', token: '--radius-xs', semantic: '--radius-xs', primitive: '4px' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'sm height', token: '--dimension-5', semantic: '--dimension-5', primitive: '20px' },
      { property: 'md height', token: '--dimension-6', semantic: '--dimension-6', primitive: '24px' },
      { property: 'Typography', token: '--font-family-mono', semantic: '--font-family-mono', primitive: 'ui-monospace' },
    ],
  },
];

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
];

const SEPARATOR_OPTIONS = [
  { value: 'none', label: 'none' },
  { value: 'plus', label: 'plus' },
  { value: 'arrow', label: 'arrow' },
];

@Component({
  selector: 'site-kbd-page',
  standalone: true,
  imports: [
    RouterLink,
    KbdComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kbd.page.html',
  styleUrl: './kbd.page.scss',
})
export class KbdPage {
  readonly size = signal<KbdSize>('sm');
  readonly separator = signal<KbdSeparator>('none');

  readonly sizeOptions = SIZE_OPTIONS;
  readonly separatorOptions = SEPARATOR_OPTIONS;
  readonly keys = ['⌘', 'K'];
  readonly tokenCategories = TOKEN_CATEGORIES;
}
