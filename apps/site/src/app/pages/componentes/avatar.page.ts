import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AvatarComponent, SegmentedControlComponent } from '@coherence/ui';
import type { AvatarSize } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const VISUAL_CATEGORY: DocTokenCategory = {
  value: 'visual',
  label: 'Visual',
  rows: [
    { property: 'Background (fallback)', token: '--surface-quiet', semantic: '--surface-quiet', primitive: '--color-afi-control-100' },
    { property: 'Foreground (initials)', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
    { property: 'Border radius', token: '--radius-full', semantic: '--radius-full', primitive: '999px' },
  ],
};

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'sm', token: '--dimension-6', semantic: '--dimension-6', primitive: '24px' },
    { property: 'md', token: '--dimension-8', semantic: '--dimension-8', primitive: '32px' },
    { property: 'lg', token: '--dimension-10', semantic: '--dimension-10', primitive: '40px' },
    { property: 'Typography', token: '--type-body-sm-500', semantic: '--type-body-sm-500', primitive: '14px / 20px / 500' },
  ],
};

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
];

@Component({
  selector: 'site-avatar-page',
  standalone: true,
  imports: [
    RouterLink,
    AvatarComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar.page.html',
  styleUrl: './avatar.page.scss',
})
export class AvatarPage {
  readonly size = signal<AvatarSize>('md');
  readonly sizeOptions = SIZE_OPTIONS;
  readonly tokenCategories: DocTokenCategory[] = [VISUAL_CATEGORY, SIZING_CATEGORY];
}
