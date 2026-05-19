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

import { MenuComponent } from '@coherence/ui';
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
  imports: [RouterLink, TocComponent, MenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex gap-space-10">
      <!-- Main content column -->
      <div class="flex-1 min-w-0 max-w-[920px] mx-auto px-space-10 py-space-12">
        <!-- Breadcrumb -->
        <nav class="text-body-sm text-neutral-400 mb-space-4" aria-label="Migas de pan">
          <a routerLink="/componentes" class="hover:text-canvas-fg transition-colors duration-fast">Components</a>
          <span class="mx-1.5 text-neutral-300">/</span>
          <span class="text-canvas-fg">{{ title() }}</span>
        </nav>

        <!-- Kicker -->
        <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">{{ kicker() }}</p>

        <!-- Title -->
        <h1 class="text-subtitle text-canvas-fg mb-space-3">{{ title() }}</h1>

        <!-- Subtitle -->
        <p class="max-w-[640px] text-body-md text-neutral-500 mb-space-3">{{ subtitle() }}</p>

        <!-- Author -->
        @if (author()) {
          <p class="text-body-sm text-neutral-400 mb-space-6">Made by · {{ author() }}</p>
        }

        <!-- Actions row -->
        <div class="flex flex-wrap items-center gap-space-3 mb-space-8">
          <div class="relative inline-block">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-space-3 py-space-2 text-body-sm text-canvas-fg
                     border border-border-hairline rounded-md hover:bg-surface-muted transition-colors duration-fast"
              (click)="promptMenuOpen.set(!promptMenuOpen())"
              [attr.aria-expanded]="promptMenuOpen()"
              aria-haspopup="menu"
            >Descargar prompt ▾</button>

            <afi-menu
              [open]="promptMenuOpen()"
              (openChange)="promptMenuOpen.set($event)"
              placement="bottom-start"
              ariaLabel="Descargar prompts"
            >
              <a
                [href]="'https://raw.githubusercontent.com/AfiLabs/coherence/main/docs/build-prompts/' + buildPromptSlug() + '.md'"
                target="_blank"
                rel="noopener"
                role="menuitem"
                class="flex items-center gap-space-2 w-full px-space-3 py-space-2 text-body-sm text-canvas-fg rounded-md
                       hover:bg-surface-muted transition-colors duration-fast"
                (click)="promptMenuOpen.set(false)"
              >Descargar {{ buildPromptSlug() }}.md</a>
              <a
                href="https://raw.githubusercontent.com/AfiLabs/coherence/main/docs/rules/component-skill.md"
                target="_blank"
                rel="noopener"
                role="menuitem"
                class="flex items-center gap-space-2 w-full px-space-3 py-space-2 text-body-sm text-canvas-fg rounded-md
                       hover:bg-surface-muted transition-colors duration-fast"
                (click)="promptMenuOpen.set(false)"
              >Descargar component-skill.md</a>
              <a
                href="https://raw.githubusercontent.com/AfiLabs/coherence/main/docs/rules/accessibility.md"
                target="_blank"
                rel="noopener"
                role="menuitem"
                class="flex items-center gap-space-2 w-full px-space-3 py-space-2 text-body-sm text-canvas-fg rounded-md
                       hover:bg-surface-muted transition-colors duration-fast"
                (click)="promptMenuOpen.set(false)"
              >Descargar accessibility.md</a>
            </afi-menu>
          </div>
        </div>

        <!-- Page-level tabs -->
        <div
          class="flex gap-space-1 border-b border-border-hairline mb-space-10"
          role="tablist"
          aria-label="Secciones de la página"
        >
          @for (tab of tabs; track tab.id) {
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="activeTab() === tab.id"
              class="px-space-4 py-space-3 text-body-sm transition-colors duration-fast -mb-px"
              [class.border-b-2]="activeTab() === tab.id"
              [class.border-action]="activeTab() === tab.id"
              [class.text-canvas-fg]="activeTab() === tab.id"
              [class.font-medium]="activeTab() === tab.id"
              [class.text-neutral-400]="activeTab() !== tab.id"
              [class.hover:text-canvas-fg]="activeTab() !== tab.id"
              (click)="switchTab(tab.id)"
            >{{ tab.label }}</button>
          }
        </div>

        <!-- Tab content -->
        <div #contentArea>
          @switch (activeTab()) {
            @case ('preview') {
              <div class="space-y-space-16">
                <ng-content select="[slot=preview-tab]" />
                <!-- Fallback: render legacy code-tab slot for backwards compat -->
                <ng-content select="[slot=code-tab]" />
              </div>
            }
            @case ('tokens') {
              <div class="space-y-space-16">
                <ng-content select="[slot=tokens-tab]" />
              </div>
            }
            @case ('accessibility') {
              <div class="space-y-space-16">
                <ng-content select="[slot=accessibility-tab]" />
              </div>
            }
            @case ('animation') {
              <div class="space-y-space-16">
                <ng-content select="[slot=animation-tab]" />
              </div>
            }
          }
        </div>
      </div>

      <!-- Right rail: TOC (hidden below lg) -->
      <div class="hidden lg:block w-[200px] shrink-0 pt-space-12">
        <afi-toc
          [containerRef]="contentAreaRef"
          [refreshTrigger]="tocRefresh()"
        />
      </div>
    </div>
  `,
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

  readonly activeTab = signal<DocPageTab>('preview');
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
