import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { MenuComponent, SegmentedControlComponent } from '@coherence/ui';
import { TocComponent } from '../toc';

export type DocPageTab = 'preview' | 'tokens' | 'accessibility' | 'animation';

/**
 * Shell for every primitive detail page.
 * Renders: breadcrumb → kicker → title → subtitle → author → actions row →
 * 4 page-level tabs (Preview / Tokens / Accessibility / Animation) → right-rail TOC.
 */
@Component({
  selector: 'afi-doc-page-layout',
  standalone: true,
  imports: [RouterLink, TocComponent, MenuComponent, SegmentedControlComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doc-page-layout.component.html',
  styleUrl: './doc-page-layout.component.scss',
})
export class DocPageLayoutComponent implements AfterViewInit {
  readonly kicker = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly author = input<string | null>('AFI design team');
  readonly docsSource = input.required<string>();
  readonly buildPromptSlug = input.required<string>();

  readonly tabs: { id: DocPageTab; label: string }[] = [
    { id: 'preview', label: 'Preview' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'animation', label: 'Animation' },
  ];

  readonly tabOptions = this.tabs.map(t => ({ value: t.id, label: t.label }));

  readonly activeTab = signal<string>('preview');
  readonly promptMenuOpen = signal(false);
  readonly tocRefresh = signal(0);

  @ViewChild('contentArea', { read: ElementRef }) contentAreaRef!: ElementRef;

  ngAfterViewInit(): void {
    setTimeout(() => this.tocRefresh.set(1), 0);
  }

  switchTab(tab: DocPageTab): void {
    this.activeTab.set(tab);
    this.promptMenuOpen.set(false);
    setTimeout(() => this.tocRefresh.update(v => v + 1), 50);
  }
}
