import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  PageHeaderComponent,
  SegmentedControlComponent,
  TabsComponent,
  TabItemComponent,
} from '@coherence/ui';
import type { PageHeaderLevel } from '@coherence/ui';

import { DocPageShellComponent } from '../../../../components/doc-page-shell';
import { TokensTableComponent, type TokenRow } from '../../../../components/tokens-table';

type ContentType = 'none' | 'graph' | 'table';

const TOKEN_ROWS: (TokenRow & { category: string })[] = [
  // Background
  { category: 'Background', property: 'Canvas', token: '--canvas-primary', semantic: '--canvas-primary', primitive: '--color-afi-white-25' },
  { category: 'Background', property: 'Surface (quiet)', token: '--surface-quiet', semantic: '--surface-quiet', primitive: '--color-afi-control-50' },
  // Foreground
  { category: 'Foreground', property: 'Title', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
  { category: 'Foreground', property: 'Subtitle', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-500' },
  { category: 'Foreground', property: 'Breadcrumb', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-500' },
  // Type
  { category: 'Type', property: 'Title (page)', token: '--type-title', semantic: '--type-title', primitive: '500 32px/40px Roboto Serif' },
  { category: 'Type', property: 'Title (section)', token: '--type-subtitle', semantic: '--type-subtitle', primitive: '500 24px/32px Roboto Serif' },
  { category: 'Type', property: 'Title (subsection)', token: '--type-section', semantic: '--type-section', primitive: '500 20px/24px Roboto Serif' },
  { category: 'Type', property: 'Subtitle (page)', token: '--type-body', semantic: '--type-body', primitive: '400 16px/24px Roboto Serif' },
  { category: 'Type', property: 'Subtitle (section)', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '400 14px/20px Roboto Serif' },
  { category: 'Type', property: 'Subtitle (subsection)', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '400 12px/16px Roboto Serif' },
  { category: 'Type', property: 'Breadcrumb', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '400 12px/16px Roboto Serif' },
  // Spacing
  { category: 'Spacing', property: 'Padding inline', token: '--space-lg', semantic: '--space-lg', primitive: '--dimension-6 (24px)' },
  { category: 'Spacing', property: 'Padding block', token: '--space-sm', semantic: '--space-sm', primitive: '--dimension-3 (12px)' },
  { category: 'Spacing', property: 'Slot gap', token: '--space-md', semantic: '--space-md', primitive: '--dimension-4 (16px)' },
  { category: 'Spacing', property: 'Title/subtitle gap', token: '--space-xs', semantic: '--space-xs', primitive: '--dimension-2 (8px)' },
  // Border
  { category: 'Border', property: 'Scroll border', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-control-200' },
  // Motion
  { category: 'Motion', property: 'Scroll transition', token: '--duration-fast', semantic: '--duration-fast', primitive: '150ms' },
  { category: 'Motion', property: 'Easing', token: '--easing-enter', semantic: '--easing-enter', primitive: 'ease-out' },
];

@Component({
  selector: 'site-cabecera-de-pagina-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    SegmentedControlComponent,
    TabsComponent,
    TabItemComponent,
    DocPageShellComponent,
    TokensTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cabecera-de-pagina.page.html',
  styleUrl: './cabecera-de-pagina.page.scss',
})
export class CabeceraDePaginaPage {
  readonly level = signal<PageHeaderLevel>('page');
  readonly showActions = signal(true);
  readonly showCards = signal(true);
  readonly showFilters = signal(true);
  readonly showTabs = signal(true);
  readonly showTabActions = signal(false);
  readonly contentType = signal<ContentType>('graph');

  readonly tokenRows = TOKEN_ROWS;

  readonly levelOptions = [
    { value: 'page', label: 'Page' },
    { value: 'section', label: 'Section' },
    { value: 'subsection', label: 'Subsection' },
  ];

  readonly contentOptions = [
    { value: 'none', label: 'None' },
    { value: 'graph', label: 'Graph' },
    { value: 'table', label: 'Table' },
  ];

  onLevelChange(value: string): void {
    this.level.set(value as PageHeaderLevel);
  }

  onContentChange(value: string): void {
    this.contentType.set(value as ContentType);
  }

  toggleActions(): void {
    this.showActions.set(!this.showActions());
  }

  toggleCards(): void {
    this.showCards.set(!this.showCards());
  }

  toggleFilters(): void {
    this.showFilters.set(!this.showFilters());
  }

  toggleTabs(): void {
    this.showTabs.set(!this.showTabs());
  }

  toggleTabActions(): void {
    this.showTabActions.set(!this.showTabActions());
  }
}
