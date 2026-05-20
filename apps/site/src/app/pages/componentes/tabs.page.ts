import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  TabsComponent,
  TabItemComponent,
  SelectComponent,
  IconButtonComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

type ThemeMode = 'light' | 'dark';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'background',
    label: 'Background',
    rows: [
      { property: 'Badge background', token: '--brand-primary-background-default', semantic: '--brand-primary-background-default', primitive: '--color-afi-azul-profundo-500' },
    ],
  },
  {
    value: 'foreground',
    label: 'Foreground',
    rows: [
      { property: 'Underline indicator', token: '--brand-primary-background-default', semantic: '--brand-primary-background-default', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Active tab text', token: '--foreground-brand-default', semantic: '--foreground-brand-default', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Inactive tab text', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-700' },
      { property: 'Hover tab text', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-950' },
      { property: 'Border bottom', token: '--border-subtle', semantic: '--border-subtle', primitive: '--color-afi-control-100' },
      { property: 'Focus ring', token: '--border-focus', semantic: '--border-focus', primitive: '--color-afi-azul-500' },
      { property: 'Badge text', token: '--brand-primary-foreground-default', semantic: '--brand-primary-foreground-default', primitive: '--color-afi-azul-profundo-0 (#FFF)' },
    ],
  },
  {
    value: 'type',
    label: 'Type',
    rows: [
      { property: 'Tab font (sm)', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '14px/1.4 400' },
      { property: 'Tab font (sm active)', token: '--type-body-sm-500', semantic: '--type-body-sm-500', primitive: '14px/1.4 500' },
      { property: 'Tab font (md)', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '16px/1.5 400' },
      { property: 'Tab font (md active)', token: '--type-body-md-500', semantic: '--type-body-md-500', primitive: '16px/1.5 500' },
      { property: 'Badge font', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '14px/1.4 400' },
    ],
  },
  {
    value: 'spacing',
    label: 'Spacing',
    rows: [
      { property: 'Gap between tabs', token: '--space-2xs', semantic: '--space-2xs', primitive: '--dimension-1 (4px)' },
      { property: 'Tab trigger gap (icon/badge)', token: '--space-xs', semantic: '--space-xs', primitive: '--dimension-2 (8px)' },
      { property: 'Tab padding-x (sm)', token: '--space-sm', semantic: '--space-sm', primitive: '--dimension-3 (12px)' },
      { property: 'Tab padding-x (md)', token: '--space-md', semantic: '--space-md', primitive: '--dimension-4 (16px)' },
      { property: 'Tab height (sm)', token: '--dimension-9', semantic: '--dimension-9', primitive: '36px' },
      { property: 'Tab height (md)', token: '--dimension-11', semantic: '--dimension-11', primitive: '44px' },
      { property: 'Badge min-width', token: '--dimension-5', semantic: '--dimension-5', primitive: '20px' },
      { property: 'Badge height', token: '--dimension-5', semantic: '--dimension-5', primitive: '20px' },
      { property: 'Badge padding-x', token: '--space-xs', semantic: '--space-xs', primitive: '--dimension-2 (8px)' },
    ],
  },
  {
    value: 'radius',
    label: 'Border Radius',
    rows: [
      { property: 'Underline indicator', token: '--radius-full', semantic: '--radius-full', primitive: '9999px' },
      { property: 'Badge', token: '--radius-full', semantic: '--radius-full', primitive: '9999px' },
      { property: 'Focus ring', token: '--radius-sm', semantic: '--radius-sm', primitive: '4px' },
    ],
  },
  {
    value: 'motion',
    label: 'Motion',
    rows: [
      { property: 'Underline slide (transform)', token: '--duration-base', semantic: '--duration-base var(--easing-standard)', primitive: '250ms cubic-bezier(0.2, 0, 0, 1)' },
      { property: 'Underline resize (width)', token: '--duration-fast', semantic: '--duration-fast var(--easing-standard)', primitive: '150ms cubic-bezier(0.2, 0, 0, 1)' },
      { property: 'Tab text color', token: '--duration-fast', semantic: '--duration-fast ease-out', primitive: '150ms ease-out' },
      { property: 'Panel slide+blur entrance', token: '--duration-base', semantic: '--duration-base var(--easing-standard)', primitive: '250ms cubic-bezier(0.2, 0, 0, 1)' },
      { property: 'Panel blur amount', token: '4px', semantic: '—', primitive: '4px' },
      { property: 'Panel translateX offset', token: '12px', semantic: '—', primitive: '12px' },
    ],
  },
];

@Component({
  selector: 'site-tabs-page',
  standalone: true,
  imports: [
    RouterLink,
    TabsComponent,
    TabItemComponent,
    SelectComponent,
    IconButtonComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs.page.html',
  styleUrl: './tabs.page.scss',
})
export class TabsPage {
  readonly activeTab = signal(0);
  readonly size = signal<string>('md');
  readonly count = signal<string>('3');
  readonly mode = signal<ThemeMode>('light');

  readonly sizeOptions: SelectOption[] = [
    { value: 'sm', label: 'sm' },
    { value: 'md', label: 'md' },
  ];

  readonly countOptions: SelectOption[] = [
    { value: '2', label: '2 tabs' },
    { value: '3', label: '3 tabs' },
    { value: '4', label: '4 tabs' },
    { value: '5', label: '5 tabs' },
  ];

  private readonly allTabs = [
    { label: 'General', badge: null, disabled: false, content: 'General settings and overview information for this resource.' },
    { label: 'Configuration', badge: null, disabled: false, content: 'Advanced configuration options and environment variables.' },
    { label: 'Activity', badge: 3, disabled: false, content: 'Recent activity log showing changes and events.' },
    { label: 'Permissions', badge: null, disabled: false, content: 'User roles, access control, and sharing settings.' },
    { label: 'History', badge: null, disabled: false, content: 'Version history and audit trail for this resource.' },
  ];

  readonly demoTabs = computed(() => {
    const n = parseInt(this.count(), 10);
    return this.allTabs.slice(0, n);
  });

  readonly tokenCategories = TOKEN_CATEGORIES;

  toggleMode(): void {
    this.mode.set(this.mode() === 'light' ? 'dark' : 'light');
  }

  onCountChange(val: string): void {
    this.count.set(val);
    const n = parseInt(val, 10);
    if (this.activeTab() >= n) {
      this.activeTab.set(0);
    }
  }
}
