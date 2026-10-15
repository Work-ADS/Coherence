import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AvatarComponent, AvatarGroupComponent, SegmentedControlComponent } from '@coherence/ui';
import type { AvatarSize } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const VISUAL_CATEGORY: DocTokenCategory = {
  value: 'visual',
  label: 'Visual',
  rows: [
    { property: 'Background (default)', token: '--brand-secondary-neutral-background-default', semantic: '--brand-secondary-neutral-background-default', primitive: '--color-afi-azul-profundo-50' },
    { property: 'Foreground (default)', token: '--brand-secondary-neutral-foreground-default', semantic: '--brand-secondary-neutral-foreground-default', primitive: '--color-afi-azul-profundo-800' },
    { property: 'Background (neutral)', token: '--surface-subtle', semantic: '--surface-subtle', primitive: '--color-afi-control-50' },
    { property: 'Foreground (neutral)', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
    { property: 'Border radius', token: '--radius-full', semantic: '--radius-full', primitive: '9999px' },
    { property: 'Border radius (square)', token: '--radius-card', semantic: '--radius-card', primitive: '8px' },
    { property: 'Group ring', token: '--canvas-primary', semantic: '--canvas-primary', primitive: '--color-base-white' },
    { property: 'Overflow chip', token: '--surface-subtle', semantic: '--surface-subtle', primitive: '--color-afi-control-50' },
  ],
};

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'xs', token: '--avatar-xs', semantic: '--avatar-xs', primitive: '24px' },
    { property: 'sm', token: '--avatar-sm', semantic: '--avatar-sm', primitive: '32px' },
    { property: 'md', token: '--avatar-md', semantic: '--avatar-md', primitive: '40px' },
    { property: 'lg', token: '--avatar-lg', semantic: '--avatar-lg', primitive: '48px' },
    { property: 'xl', token: '--avatar-xl', semantic: '--avatar-xl', primitive: '64px' },
    { property: 'Initials (xs, sm)', token: '--type-body-sm-600', semantic: '--type-body-sm-600', primitive: '12px / 16px / 600' },
    { property: 'Initials (md)', token: '--type-body-md-600', semantic: '--type-body-md-600', primitive: '14px / 20px / 600' },
    { property: 'Initials (lg, xl)', token: '--type-body-lg-600', semantic: '--type-body-lg-600', primitive: '16px / 24px / 600' },
    { property: 'Group overlap', token: '--space-xs', semantic: '--space-xs', primitive: '8px' },
  ],
};

const SIZE_OPTIONS = [
  { value: 'xs', label: 'xs' },
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
  { value: 'xl', label: 'xl' },
];

@Component({
  selector: 'site-avatar-page',
  standalone: true,
  imports: [
    RouterLink,
    AvatarComponent,
    AvatarGroupComponent,
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
