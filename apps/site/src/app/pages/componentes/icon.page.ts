import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ICON_GLYPHS, ICON_MILESTONES, IconComponent, SegmentedControlComponent } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'Size (default)', token: '--afi-icon-size', semantic: '--afi-icon-size', primitive: '1em' },
      { property: 'sm', token: '--icon-sm', semantic: '--icon-sm', primitive: '16px' },
    ],
  },
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Ink', token: 'currentColor', semantic: 'currentColor', primitive: 'inherited' },
    ],
  },
];

const SIZE_OPTIONS = [
  { value: 'var(--icon-sm)', label: 'sm' },
  { value: 'var(--control-size-sm)', label: 'md' },
  { value: 'var(--control-size-lg)', label: 'lg' },
];

@Component({
  selector: 'site-icon-page',
  standalone: true,
  imports: [RouterLink, IconComponent, SegmentedControlComponent, DocPageShellComponent, DocTokensComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.page.html',
  styleUrl: './icon.page.scss',
})
export class IconPage {
  readonly size = signal('var(--icon-sm)');

  readonly sizeOptions = SIZE_OPTIONS;
  readonly glyphs = Object.keys(ICON_GLYPHS) as Array<keyof typeof ICON_GLYPHS>;
  readonly milestones = Object.keys(ICON_MILESTONES) as Array<keyof typeof ICON_MILESTONES>;
  readonly tokenCategories = TOKEN_CATEGORIES;
}
