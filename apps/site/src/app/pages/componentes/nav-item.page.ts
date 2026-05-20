import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  NavItemComponent,
  SelectComponent,
  IconButtonComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

type ThemeMode = 'light' | 'dark';

const NEUTRAL_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'background',
    label: 'Background',
    rows: [
      { property: 'Idle', token: '--nav-item-background-default', semantic: 'transparent', primitive: 'transparent' },
      { property: 'Hover', token: '--nav-item-background-hover', semantic: '--control-background-hover', primitive: '--color-afi-control-100' },
      { property: 'Active', token: '--nav-item-background-active', semantic: '--control-background-active', primitive: '--color-afi-control-100' },
      { property: 'Selected', token: '--nav-item-background-selected', semantic: '--control-background-selected', primitive: '--color-afi-control-100' },
      { property: 'Sidebar', token: '--nav-sidebar', semantic: '--control-background-default', primitive: '--color-afi-control-50' },
    ],
  },
  {
    value: 'foreground',
    label: 'Foreground',
    rows: [
      { property: 'Idle', token: '--nav-item-foreground-default', semantic: '--control-foreground-default', primitive: '--color-afi-control-800' },
      { property: 'Hover', token: '--nav-item-foreground-hover', semantic: '--control-foreground-hover', primitive: '--color-afi-control-900' },
      { property: 'Active', token: '--nav-item-foreground-active', semantic: '--control-foreground-active', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Selected', token: '--nav-item-foreground-selected', semantic: '--control-foreground-selected', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Icon (idle)', token: '--nav-item-icon-default', semantic: '--control-foreground-default', primitive: '--color-afi-control-800' },
      { property: 'Icon (hover)', token: '--nav-item-icon-hover', semantic: '--control-foreground-hover', primitive: '--color-afi-control-900' },
      { property: 'Icon (selected)', token: '--nav-item-icon-selected', semantic: '--control-foreground-selected', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Focus ring', token: '--border-focus', semantic: '--control-border-focus', primitive: '--border-focus' },
    ],
  },
  ...sharedCategories(),
];

const BRAND_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'background',
    label: 'Background',
    rows: [
      { property: 'Idle', token: '--nav-item-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Hover', token: '--nav-item-background-hover', semantic: '--brand-secondary-background-hover', primitive: '--color-afi-azul-profundo-400' },
      { property: 'Active', token: '--nav-item-background-active', semantic: '--brand-secondary-background-active', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Selected', token: '--nav-item-background-selected', semantic: '--brand-secondary-background-active', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Sidebar', token: '--nav-sidebar', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-profundo-500' },
    ],
  },
  {
    value: 'foreground',
    label: 'Foreground',
    rows: [
      { property: 'Idle', token: '--nav-item-foreground-default', semantic: '--brand-secondary-foreground-default', primitive: '--color-afi-azul-profundo-0 (#FFF)' },
      { property: 'Hover', token: '--nav-item-foreground-hover', semantic: '--brand-secondary-foreground-hover', primitive: '--color-afi-azul-profundo-25' },
      { property: 'Active', token: '--nav-item-foreground-active', semantic: '--brand-secondary-foreground-active', primitive: '--color-afi-azul-profundo-50' },
      { property: 'Selected', token: '--nav-item-foreground-selected', semantic: '--brand-secondary-foreground-default', primitive: '--color-afi-azul-profundo-0 (#FFF)' },
      { property: 'Icon (idle)', token: '--nav-item-icon-default', semantic: '--brand-secondary-foreground-default', primitive: '--color-afi-azul-profundo-0 (#FFF)' },
      { property: 'Icon (selected)', token: '--nav-item-icon-selected', semantic: '--brand-secondary-foreground-default', primitive: '--color-afi-azul-profundo-0 (#FFF)' },
      { property: 'Focus ring', token: '--border-focus', semantic: '--brand-secondary-border-active', primitive: '--color-afi-azul-profundo-500' },
    ],
  },
  ...sharedCategories(),
];

const BRAND_NEUTRAL_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'background',
    label: 'Background',
    rows: [
      { property: 'Idle', token: '--nav-item-background-default', semantic: '--brand-secondary-neutral-background-default', primitive: '--color-afi-azul-profundo-50' },
      { property: 'Hover', token: '--nav-item-background-hover', semantic: '--brand-secondary-neutral-background-hover', primitive: '--color-afi-azul-profundo-100' },
      { property: 'Active', token: '--nav-item-background-active', semantic: '--brand-secondary-neutral-background-active', primitive: '--color-afi-azul-profundo-200' },
      { property: 'Selected', token: '--nav-item-background-selected', semantic: '--brand-secondary-neutral-background-active', primitive: '--color-afi-azul-profundo-200' },
      { property: 'Sidebar', token: '--nav-sidebar', semantic: '--brand-secondary-neutral-background-default', primitive: '--color-afi-azul-profundo-50' },
    ],
  },
  {
    value: 'foreground',
    label: 'Foreground',
    rows: [
      { property: 'Idle', token: '--nav-item-foreground-default', semantic: '--brand-secondary-neutral-foreground-default', primitive: '--color-afi-azul-900' },
      { property: 'Hover', token: '--nav-item-foreground-hover', semantic: '--brand-secondary-neutral-foreground-hover', primitive: '--color-afi-azul-700' },
      { property: 'Active', token: '--nav-item-foreground-active', semantic: '--brand-secondary-neutral-foreground-active', primitive: '--color-afi-azul-900' },
      { property: 'Selected', token: '--nav-item-foreground-selected', semantic: '--brand-secondary-neutral-foreground-active', primitive: '--color-afi-azul-900' },
      { property: 'Icon (idle)', token: '--nav-item-icon-default', semantic: '--brand-secondary-neutral-foreground-default', primitive: '--color-afi-azul-900' },
      { property: 'Icon (selected)', token: '--nav-item-icon-selected', semantic: '--brand-secondary-neutral-foreground-active', primitive: '--color-afi-azul-900' },
      { property: 'Focus ring', token: '--border-focus', semantic: '--brand-secondary-border-active', primitive: '--color-afi-azul-profundo-500' },
    ],
  },
  ...sharedCategories(),
];

function sharedCategories(): DocTokenCategory[] {
  return [
    {
      value: 'type',
      label: 'Type',
      rows: [
        { property: 'Font (default)', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '14px/1.4 400' },
        { property: 'Font (active)', token: 'font-weight: 500', semantic: '—', primitive: '500' },
      ],
    },
    {
      value: 'spacing',
      label: 'Spacing',
      rows: [
        { property: 'Padding', token: '--space-xs', semantic: '--space-xs', primitive: '--dimension-2 (8px)' },
        { property: 'Gap', token: '--space-sm', semantic: '--space-sm', primitive: '--dimension-3 (12px)' },
      ],
    },
    {
      value: 'radius',
      label: 'Radius',
      rows: [
        { property: 'Item radius', token: '--radius-sm', semantic: '--radius-sm', primitive: '6px' },
      ],
    },
    {
      value: 'motion',
      label: 'Motion',
      rows: [
        { property: 'Duration', token: '--duration-fast', semantic: '--duration-fast', primitive: '150ms' },
        { property: 'Easing', token: '--easing-standard', semantic: '--easing-standard', primitive: 'cubic-bezier(0.2, 0, 0, 1)' },
      ],
    },
  ];
}

@Component({
  selector: 'app-nav-item-page',
  standalone: true,
  imports: [
    RouterLink,
    NavItemComponent,
    SelectComponent,
    IconButtonComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-item.page.html',
  styleUrl: './nav-item.page.scss',
})
export class NavItemPage {
  readonly state = signal('default');
  readonly badgeChoice = signal('none');
  readonly mode = signal<ThemeMode>('dark');
  readonly variant = signal<string>('neutral');

  readonly variantOptions: SelectOption[] = [
    { label: 'Neutral', value: 'neutral' },
    { label: 'Brand', value: 'brand' },
    { label: 'Brand Neutral', value: 'brand-neutral' },
  ];

  readonly stateOptions: SelectOption[] = [
    { label: 'Default', value: 'default' },
    { label: 'Active', value: 'active' },
    { label: 'Disabled', value: 'disabled' },
  ];

  readonly badgeOptions: SelectOption[] = [
    { label: 'None', value: 'none' },
    { label: '3', value: '3' },
    { label: '99+', value: '99+' },
  ];

  readonly computedBadge = computed<string | number | null>(() => {
    const choice = this.badgeChoice();
    if (choice === 'none') return null;
    const num = Number(choice);
    return isNaN(num) ? choice : num;
  });

  readonly previewBg = computed(() => {
    const v = this.variant();
    if (v === 'brand') return 'var(--brand-secondary-background-default)';
    if (v === 'brand-neutral') return 'var(--brand-secondary-neutral-background-default)';
    return this.mode() === 'dark' ? 'var(--color-afi-control-900)' : 'var(--color-afi-white-25)';
  });

  readonly previewTokenOverrides = computed(() => {
    const v = this.variant();
    if (v === 'brand') {
      return `
        --nav-item-background-default: transparent;
        --nav-item-background-hover: var(--brand-secondary-background-hover);
        --nav-item-background-active: var(--brand-secondary-background-active);
        --nav-item-background-selected: var(--brand-secondary-background-active);
        --nav-item-foreground-default: var(--brand-secondary-foreground-default);
        --nav-item-foreground-hover: var(--brand-secondary-foreground-hover);
        --nav-item-foreground-active: var(--brand-secondary-foreground-active);
        --nav-item-foreground-selected: var(--brand-secondary-foreground-default);
        --nav-item-icon-default: var(--brand-secondary-foreground-default);
        --nav-item-icon-hover: var(--brand-secondary-foreground-hover);
        --nav-item-icon-active: var(--brand-secondary-foreground-active);
        --nav-item-icon-selected: var(--brand-secondary-foreground-default);
      `;
    }
    if (v === 'brand-neutral') {
      return `
        --nav-item-background-default: transparent;
        --nav-item-background-hover: var(--brand-secondary-neutral-background-hover);
        --nav-item-background-active: var(--brand-secondary-neutral-background-active);
        --nav-item-background-selected: var(--brand-secondary-neutral-background-active);
        --nav-item-foreground-default: var(--brand-secondary-neutral-foreground-default);
        --nav-item-foreground-hover: var(--brand-secondary-neutral-foreground-hover);
        --nav-item-foreground-active: var(--brand-secondary-neutral-foreground-active);
        --nav-item-foreground-selected: var(--brand-secondary-neutral-foreground-active);
        --nav-item-icon-default: var(--brand-secondary-neutral-foreground-default);
        --nav-item-icon-hover: var(--brand-secondary-neutral-foreground-hover);
        --nav-item-icon-active: var(--brand-secondary-neutral-foreground-active);
        --nav-item-icon-selected: var(--brand-secondary-neutral-foreground-active);
      `;
    }
    return '';
  });

  readonly tokenCategories = computed<DocTokenCategory[]>(() => {
    const v = this.variant();
    if (v === 'brand') return BRAND_CATEGORIES;
    if (v === 'brand-neutral') return BRAND_NEUTRAL_CATEGORIES;
    return NEUTRAL_CATEGORIES;
  });

  toggleMode(): void {
    this.mode.set(this.mode() === 'light' ? 'dark' : 'light');
  }
}
