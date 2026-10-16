import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  IconComponent,
  NavItemComponent,
  NavSectionComponent,
  SegmentedControlComponent,
  SidebarComponent,
} from '@coherence/ui';
import type { SidebarExpandMotion, SidebarMode, SidebarUser, SidebarVariant } from '@coherence/ui';

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
      { property: 'Status dot', token: '--sidebar-dot', semantic: '--color-afi-azul-500', primitive: '--color-afi-azul-500' },
      { property: 'Dot halo', token: '--sidebar-dot-halo', semantic: '--color-afi-azul-100', primitive: '--color-afi-azul-100' },
      { property: 'Dot (inset-dark)', token: '--sidebar-inset-dot', semantic: '--color-afi-azul-400', primitive: '--color-afi-azul-400' },
      { property: 'Dot halo (inset-dark)', token: '--sidebar-inset-dot-halo', semantic: '--color-afi-azul-profundo-450', primitive: '--color-afi-azul-profundo-450' },
    ],
  },
  {
    value: 'geometry',
    label: 'Geometry',
    rows: [
      { property: 'Panel width (floor)', token: '--sidebar-nav-width', semantic: '--dimension-60', primitive: '240px' },
      { property: 'Rail width', token: '--sidebar-rail-width', semantic: '--dimension-18', primitive: '72px' },
      { property: 'Brand band', token: '--sidebar-brand-height', semantic: '--layout-shell-header', primitive: '48px' },
      { property: 'Logotype', token: '--sidebar-logo-height', semantic: '--dimension-8', primitive: '32px (22px beside a product name: --sidebar-wordmark-height)' },
      { property: 'Rail mark', token: '--sidebar-mark-height', semantic: '--dimension-5', primitive: '20px' },
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

const OFF_ON_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
];

const BRAND_OPTIONS = [
  { value: 'logo', label: 'Logo + product' },
  { value: 'slot', label: 'Slot' },
];

const MOTION_OPTIONS = [
  { value: 'instant', label: 'Instant' },
  { value: 'reveal', label: 'Reveal' },
];

const DEMO_USER: SidebarUser = { name: 'María Sanz', role: 'Gestora patrimonial' };

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

  readonly dot = signal<'off' | 'on'>('on');
  readonly reason = signal<'off' | 'on'>('on');
  readonly userRow = signal<'off' | 'on'>('on');
  readonly header = signal<'off' | 'on'>('off');
  readonly brand = signal<'logo' | 'slot'>('logo');
  readonly motion = signal<SidebarExpandMotion>('instant');

  /** Dark panels take the negative logo, light ones the positive. */
  private readonly dark = computed(() => this.variant() === 'inset-dark' || this.variant() === 'secondary-azul');
  readonly logoSrc = computed(() => `assets/logos/${this.dark() ? 'afi_negativo' : 'afi_positivo'}.svg`);
  readonly logoMarkSrc = computed(() => `assets/logos/${this.dark() ? 'afi_icon_negativo' : 'afi_icon_positivo'}.svg`);
  readonly user = computed<SidebarUser | null>(() => (this.userRow() === 'on' ? DEMO_USER : null));

  readonly offOnOptions = OFF_ON_OPTIONS;
  readonly brandOptions = BRAND_OPTIONS;
  readonly motionOptions = MOTION_OPTIONS;
  readonly variantOptions = VARIANT_OPTIONS;
  readonly modeOptions = MODE_OPTIONS;
  readonly tokenCategories = TOKEN_CATEGORIES;
}
