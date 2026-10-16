import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  TabsComponent,
  TabItemComponent,
  TabPanelComponent,
  SelectComponent,
} from '@coherence/ui';
import type { SelectOption, TabsItem } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';


const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Underline indicator', token: '--brand-secondary-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Active tab text', token: '--foreground-brand-default', semantic: '--foreground-brand-default', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Inactive tab text', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-700' },
      { property: 'Hover tab text', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
      { property: 'Disabled tab text', token: '--foreground-tertiary-disabled', semantic: '--foreground-tertiary-disabled', primitive: '--color-afi-control-400' },
      { property: 'Baseline', token: '--border-subtle', semantic: '--border-subtle', primitive: '--color-afi-control-200' },
      { property: 'Count chip', token: '--surface-subtle', semantic: '--surface-subtle', primitive: 'neutral at rest' },
      { property: 'Count chip (active)', token: '--brand-secondary-neutral-background-default', semantic: '--brand-secondary-neutral-background-default', primitive: '--color-afi-azul-100' },
      { property: 'Focus ring', token: '--border-focus', semantic: '--border-focus', primitive: 'outward ring' },
    ],
  },
  {
    value: 'type',
    label: 'Type',
    rows: [
      { property: 'Tab font', token: '--tab-item-font', semantic: '--type-body-md-500', primitive: '14px / 20px 500' },
      { property: 'Tab font (active)', token: '--tab-item-font-active', semantic: '--type-body-md-600', primitive: '14px / 20px 600' },
      { property: 'Tab font (sm)', token: '--tab-item-font-sm', semantic: '--type-body-sm-500', primitive: '12px / 16px 500' },
      { property: 'Count chip', token: '--tab-count-font', semantic: '--type-body-sm-600', primitive: '12px / 16px 600, tabular figures' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'Gap between tabs', token: '--tab-gap', semantic: '--space-lg', primitive: '24px' },
      { property: 'Tab height (md)', token: '--tab-item-height', semantic: '--tab-height', primitive: 'responsive: 44px below lg, 32px from lg' },
      { property: 'Tab height (sm)', token: '--tab-item-height-sm', semantic: '--dimension-9', primitive: '36px' },
      { property: 'Tab padding-x', token: '--tab-item-padding-x', semantic: '--dimension-0-5', primitive: '2px (the first tab stays flush)' },
      { property: 'Label to icon and count', token: '--tab-item-gap', semantic: '--space-xs', primitive: '8px' },
      { property: 'Count chip', token: '--tab-count-size', semantic: '--dimension-4-5', primitive: '18px' },
    ],
  },
  {
    value: 'motion',
    label: 'Motion',
    rows: [
      { property: 'Underline slide and resize', token: '--duration-base', semantic: '--duration-base var(--easing-standard)', primitive: '200ms' },
      { property: 'Tab text colour', token: '--duration-fast', semantic: '--duration-fast var(--easing-enter)', primitive: '150ms' },
      { property: 'Panel change', token: '--reveal-cascade-duration', semantic: 'afi-reveal-cascade, backwards fill', primitive: '500ms, rise and un-blur; first render does not animate' },
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
    TabPanelComponent,
    SelectComponent,
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
  readonly selection = signal<string>('index');
  readonly fill = signal<string>('off');
  readonly tabValue = signal<string | null>('configuration');

  readonly selectionOptions: SelectOption[] = [
    { value: 'index', label: 'By index' },
    { value: 'value', label: 'By value' },
    { value: 'none', label: 'Value: none selected' },
  ];

  readonly fillOptions: SelectOption[] = [
    { value: 'off', label: 'Content width' },
    { value: 'on', label: 'Full width' },
  ];

  /** The bar-only example: tabs as data, with the panel owned by the page. */
  readonly barItems: TabsItem[] = [
    { value: 'activos', label: 'Activos', icon: 'wallet', count: 12 },
    { value: 'pasivos', label: 'Pasivos', icon: 'receipt', count: 4 },
    { value: 'movimientos', label: 'Movimientos', icon: 'route' },
    { value: 'archivo', label: 'Archivo', disabled: true },
  ];
  readonly barTab = signal<string>('activos');

  /** `[value]` for the main demo: unset keeps the index API. */
  readonly demoValue = computed<string | null | undefined>(() => {
    const mode = this.selection();
    if (mode === 'index') return undefined;
    if (mode === 'none') return null;
    return this.tabValue();
  });

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
    return this.allTabs.slice(0, n).map((t) => ({ ...t, value: t.label.toLowerCase() }));
  });

  readonly tokenCategories = TOKEN_CATEGORIES;


  /** Choosing a tab leaves the "none selected" demo state, as a real page would. */
  onValueChange(value: string): void {
    this.tabValue.set(value);
    if (this.selection() === 'none') this.selection.set('value');
  }

  onCountChange(val: string): void {
    this.count.set(val);
    const n = parseInt(val, 10);
    if (this.activeTab() >= n) {
      this.activeTab.set(0);
    }
  }
}
