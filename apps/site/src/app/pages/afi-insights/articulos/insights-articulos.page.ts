import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TabsComponent, TabComponent, ButtonComponent } from '@coherence/ui';
import { InsightsHeaderComponent } from '../shared/insights-header.component';
import { InsightsFooterComponent } from '../shared/insights-footer.component';
import { ArticleCardComponent } from '../shared/article-card.component';
import { MOCK_ARTICLES, CATEGORIES } from '../data/mock-articles';

@Component({
  selector: 'ai-insights-articulos',
  standalone: true,
  imports: [
    TabsComponent,
    TabComponent,
    ButtonComponent,
    InsightsHeaderComponent,
    InsightsFooterComponent,
    ArticleCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-canvas">
      <ai-insights-header />

      <main class="flex-1">
        <!-- Compact typographic hero (no photo, no blur) -->
        <section class="max-w-[1200px] mx-auto px-space-6 pt-space-16 pb-space-8">
          <h1 class="text-display font-serif text-canvas-fg tracking-tight mb-space-2">
            Articulos
          </h1>
          <p class="text-body-lg text-neutral-500 max-w-[560px]">
            Perspectivas, opiniones y reflexiones de lideres del sector financiero.
          </p>
        </section>

        <!-- Filter tabs -->
        <section class="max-w-[1200px] mx-auto px-space-6">
          <afi-tabs
            [activeIndex]="activeTab()"
            (activeChange)="activeTab.set($event)"
            ariaLabel="Filtrar por categoria"
          >
            <afi-tab label="Todos" />
            @for (cat of categories; track cat.key) {
              <afi-tab [label]="cat.label" />
            }
          </afi-tabs>
        </section>

        <!-- Article grid -->
        <section class="max-w-[1200px] mx-auto px-space-6 py-space-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-6">
            @for (article of visibleArticles(); track article.id) {
              <ai-article-card [article]="article" />
            }
          </div>

          @if (hasMore()) {
            <div class="flex justify-center mt-space-10">
              <afi-button
                variant="secondary"
                (clicked)="loadMore()"
              >Cargar mas</afi-button>
            </div>
          }

          @if (filteredArticles().length === 0) {
            <p class="text-body-md text-neutral-400 text-center py-space-16">
              No hay articulos en esta categoria.
            </p>
          }
        </section>
      </main>

      <ai-insights-footer />
    </div>
  `,
})
export class InsightsArticulosPage {
  readonly categories = CATEGORIES;
  readonly activeTab = signal(0);
  readonly visibleCount = signal(6);

  readonly filteredArticles = computed(() => {
    const idx = this.activeTab();
    if (idx === 0) return MOCK_ARTICLES;
    const cat = CATEGORIES[idx - 1];
    if (!cat) return MOCK_ARTICLES;
    return MOCK_ARTICLES.filter((a) => a.category === cat.key);
  });

  readonly visibleArticles = computed(() => {
    return this.filteredArticles().slice(0, this.visibleCount());
  });

  readonly hasMore = computed(() => {
    return this.filteredArticles().length > this.visibleCount();
  });

  loadMore(): void {
    this.visibleCount.update((n) => n + 6);
  }
}
