import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  SidebarComponent,
  NavSectionComponent,
  NavItemComponent,
  SelectComponent,
  IconButtonComponent,
  LogoComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

type ThemeMode = 'light' | 'dark';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'color',
    label: 'Color',
    rows: [
      { property: 'Sidebar background', token: '--nav-sidebar', semantic: '--control-background-default', primitive: '--color-afi-control-50' },
      { property: 'Border', token: '--border-subtle', semantic: '--border-subtle', primitive: '--color-afi-control-100' },
      { property: 'Pin (active)', token: '--brand-primary-foreground-default', semantic: '--brand-primary-foreground-default', primitive: '--color-afi-azul-profundo-0 (#FFFFFF)' },
      { property: 'Pin (idle)', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-400' },
      { property: 'Section trigger hover', token: '--nav-item-background-hover', semantic: '--control-background-hover', primitive: '--color-afi-control-100' },
      { property: 'Section active text', token: '--nav-item-foreground-selected', semantic: '—', primitive: '--color-afi-azul-profundo-500 (#062D3F)' },
      { property: 'Tree line', token: '--border-subtle', semantic: '--border-subtle', primitive: '--color-afi-control-100' },
      { property: 'Trail marker', token: '--brand-primary-border-default', semantic: '--brand-primary-border-default', primitive: '--color-afi-azul-profundo-500 (#062D3F)' },
    ],
  },
  {
    value: 'spacing',
    label: 'Spacing',
    rows: [
      { property: 'Logo row height', token: '--dimension-12', semantic: '--dimension-12', primitive: '48px' },
      { property: 'Logo row padding', token: '--space-md', semantic: '--space-md', primitive: '--dimension-4 (16px)' },
      { property: 'Content padding', token: '--space-xs', semantic: '--space-xs', primitive: '--dimension-2 (8px)' },
      { property: 'Children indent', token: '--space-md', semantic: '--space-md', primitive: '--dimension-4 (16px)' },
    ],
  },
  {
    value: 'radius',
    label: 'Border Radius',
    rows: [
      { property: 'Pin/toggle buttons', token: '--radius-sm', semantic: '--radius-sm', primitive: '6px' },
      { property: 'Section trigger', token: '--radius-sm', semantic: '--radius-sm', primitive: '6px' },
    ],
  },
  {
    value: 'motion',
    label: 'Motion',
    rows: [
      { property: 'Width transition', token: '--duration-base', semantic: '--duration-base', primitive: '200ms' },
      { property: 'Easing', token: '--easing-standard', semantic: '--easing-standard', primitive: 'cubic-bezier(0.2, 0, 0, 1)' },
      { property: 'Chevron rotation', token: '--duration-fast', semantic: '--duration-fast', primitive: '150ms' },
      { property: 'Expand/collapse', token: '--duration-base', semantic: '--duration-base', primitive: '200ms (grid-template-rows)' },
    ],
  },
];

@Component({
  selector: 'app-sidebar-page',
  standalone: true,
  imports: [
    RouterLink,
    SidebarComponent,
    NavSectionComponent,
    NavItemComponent,
    SelectComponent,
    IconButtonComponent,
    LogoComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.page.html',
  styleUrl: './sidebar.page.scss',
})
export class SidebarPage {
  readonly sidebarMode = signal('static');
  readonly sidebarVariant = signal('neutral');
  readonly activeItem = signal('dashboard');
  readonly mode = signal<ThemeMode>('dark');

  readonly modeOptions: SelectOption[] = [
    { label: 'Static', value: 'static' },
    { label: 'Collapsible', value: 'collapsible' },
    { label: 'Hover-expand', value: 'hover-expand' },
  ];

  readonly variantOptions: SelectOption[] = [
    { label: 'Neutral', value: 'neutral' },
    { label: 'Brand', value: 'brand' },
  ];

  readonly activeOptions: SelectOption[] = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Analytics', value: 'analytics' },
    { label: 'Settings', value: 'settings' },
    { label: 'Documentation', value: 'docs' },
    { label: 'Support', value: 'support' },
  ];

  readonly tokenCategories = TOKEN_CATEGORIES;

  toggleMode(): void {
    this.mode.set(this.mode() === 'light' ? 'dark' : 'light');
  }
}
