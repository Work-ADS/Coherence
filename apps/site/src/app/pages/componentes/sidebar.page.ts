import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  IconComponent,
  NavItemComponent,
  NavSectionComponent,
  SegmentedControlComponent,
  SidebarComponent,
} from '@coherence/ui';
import type { SidebarMode, SidebarVariant } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'surface',
    label: 'Surface',
    rows: [
      { property: 'Panel', token: '--sidebar-background', semantic: 'transparent (inset-dark: --sidebar-inset-background)', primitive: '--color-afi-azul-profundo-500 (inset-dark)' },
      { property: 'Border', token: '--sidebar-border', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Radius', token: '--sidebar-radius', semantic: '--radius-none (inset-dark: --radius-lg)', primitive: '0' },
      { property: 'Row hover', token: '--sidebar-background-hover', semantic: '--nav-item-background-hover', primitive: 'same fill as a nav item' },
      { property: 'Row selected', token: '--sidebar-background-selected', semantic: '--nav-item-background-selected', primitive: 'same fill as a nav item' },
      { property: 'Divider', token: '--sidebar-divider', semantic: '--border-subtle', primitive: 'rail rules' },
    ],
  },
  {
    value: 'ink',
    label: 'Ink',
    rows: [
      { property: 'Label', token: '--sidebar-foreground', semantic: '--color-afi-control-700', primitive: '--color-afi-control-700' },
      { property: 'Label (hover)', token: '--sidebar-foreground-hover', semantic: '--nav-item-foreground-hover', primitive: 'same ink as a nav item' },
      { property: 'Label (selected)', token: '--sidebar-foreground-selected', semantic: '--nav-item-foreground-selected', primitive: 'same ink as a nav item' },
      { property: 'Icon', token: '--sidebar-icon', semantic: '--color-afi-control-700', primitive: '--color-afi-control-700' },
      { property: 'Disabled', token: '--sidebar-foreground-disabled', semantic: '--disabled-foreground', primitive: '--color-afi-azul-profundo-300 (inset-dark)' },
      { property: 'Brand', token: '--sidebar-brand-foreground', semantic: '--color-afi-control-900', primitive: '--color-afi-control-900' },
    ],
  },
  {
    value: 'geometry',
    label: 'Geometry',
    rows: [
      { property: 'Panel width (floor)', token: '--sidebar-nav-width', semantic: '--dimension-60', primitive: '240px' },
      { property: 'Rail width', token: '--sidebar-rail-width', semantic: '--dimension-18', primitive: '72px' },
      { property: 'Brand band', token: '--sidebar-brand-height', semantic: '--layout-shell-header', primitive: '48px' },
      { property: 'Row height', token: '--sidebar-item-height', semantic: '--dimension-9', primitive: '36px' },
      { property: 'Group gap', token: '--sidebar-group-gap', semantic: '--space-md', primitive: '16px (52px between pages)' },
      { property: 'Inline padding', token: '--sidebar-padding-x', semantic: '--space-sm', primitive: '12px' },
      { property: 'Scroll thumb', token: '--sidebar-scrollbar-thumb', semantic: '--color-afi-control-300 (dark: control-600)', primitive: 'thin, transparent track' },
    ],
  },
];

const VARIANT_OPTIONS = [
  { value: 'flush-light', label: 'Flush light' },
  { value: 'inset-dark', label: 'Inset dark' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'secondary-azul', label: 'Secondary azul' },
];

const MODE_OPTIONS = [
  { value: 'collapsible', label: 'Collapsible' },
  { value: 'static', label: 'Static' },
  { value: 'hover-expand', label: 'Hover expand' },
];

@Component({
  selector: 'site-sidebar-page',
  standalone: true,
  imports: [
    RouterLink,
    IconComponent,
    NavItemComponent,
    NavSectionComponent,
    SegmentedControlComponent,
    SidebarComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.page.html',
  styleUrl: './sidebar.page.scss',
})
export class SidebarPage {
  readonly variant = signal<SidebarVariant>('flush-light');
  readonly mode = signal<SidebarMode>('collapsible');

  readonly variantOptions = VARIANT_OPTIONS;
  readonly modeOptions = MODE_OPTIONS;
  readonly tokenCategories = TOKEN_CATEGORIES;
}
