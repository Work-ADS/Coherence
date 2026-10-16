import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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
      { property: 'Section title', token: '--sidebar-foreground', semantic: '--color-afi-control-700', primitive: '--color-afi-control-700' },
      { property: 'Section title (hover)', token: '--sidebar-foreground-hover', semantic: '--color-afi-control-900', primitive: '--color-afi-control-900' },
      { property: 'Hover surface', token: '--sidebar-background-hover', semantic: '--color-afi-control-100', primitive: '--color-afi-control-100' },
      { property: 'Chevron', token: '--sidebar-icon', semantic: '--color-afi-control-700', primitive: '--color-afi-control-700' },
      { property: 'Tree line (opt-in)', token: '--border-subtle', semantic: '--border-subtle', primitive: '--color-afi-control-200' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'Title row height', token: '--sidebar-item-height', semantic: '--dimension-9', primitive: '36px' },
      { property: 'Chevron box', token: '--dimension-5', semantic: '--dimension-5', primitive: '20px, 4px after the label' },
      { property: 'Title type', token: '--type-body-sm-500', semantic: '--type-body-sm-500', primitive: '12px / 16px 500, uppercase' },
      { property: 'Child rows', token: '--nav-item-*', semantic: 'see Nav Item', primitive: '36px rows, 2px apart' },
    ],
  },
];

const CHEVRON_OPTIONS = [
  { value: 'after-label', label: 'After label' },
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
];

const TREE_LINE_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
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
  readonly chevronPosition = signal<'right' | 'left' | 'after-label'>('after-label');
  readonly treeLines = signal<'off' | 'on'>('off');
  readonly showTreeLines = computed(() => this.treeLines() === 'on');
  readonly treeLineOptions = TREE_LINE_OPTIONS;

  readonly chevronOptions = CHEVRON_OPTIONS;
  readonly tokenCategories = TOKEN_CATEGORIES;
}
