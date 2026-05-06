import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '@coherence/ui';
import { Article, CATEGORIES } from '../data/mock-articles';
import { CursorMaskDirective } from './cursor-mask.directive';

const placeholderColors: Record<string, string> = {
  estudios: 'bg-action/10',
  informes: 'bg-system-info/10',
  articulos: 'bg-action/5',
  eventos: 'bg-system-success/10',
  media: 'bg-system-warning/10',
};

@Component({
  selector: 'ai-article-card',
  standalone: true,
  imports: [RouterLink, BadgeComponent, CursorMaskDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .ai-folder-card {
      /* Folder-tab chamfer on TOP-LEFT corner */
      clip-path: polygon(
        48px 0,
        100% 0,
        100% 100%,
        0 100%,
        0 48px
      );
    }
    .ai-card-mask::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(
        400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(255, 255, 255, 0.06),
        transparent 40%
      );
      opacity: var(--mask-opacity, 0);
      transition: opacity 300ms ease-out;
      pointer-events: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .ai-card-mask::after {
        transition-duration: 0ms;
      }
    }
  `,
  template: `
    <a
      [routerLink]="['/afi-insights/articulo']"
      [queryParams]="{ slug: article().slug }"
      aiCursorMask
      class="ai-card-mask ai-folder-card relative block border border-border-hairline bg-surface-elevated
             hover:border-neutral-300 transition-colors duration-fast
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
    >
      <!-- Image area with category label centered + article code in bottom-right -->
      <div
        class="relative h-[160px] flex items-center justify-center"
        [class]="placeholderBg()"
      >
        <span class="text-neutral-400 text-body-sm">{{ categoryLabel() }}</span>
        <span class="absolute bottom-space-2 right-space-3 text-[10px] tracking-wider text-neutral-400 font-mono">
          {{ articleCode() }}
        </span>
      </div>
      <div class="p-space-4">
        <div class="flex items-center gap-space-2 mb-space-2 text-[11px] text-neutral-400">
          <afi-badge intent="info" size="sm">{{ categoryLabel() }}</afi-badge>
          <span>{{ formattedDate() }}</span>
          @if (article().readingTimeMinutes > 0) {
            <span aria-hidden="true">·</span>
            <span>{{ article().readingTimeMinutes }} min</span>
          }
        </div>
        <h3 class="text-body-md font-semibold text-canvas-fg leading-snug mb-space-2 line-clamp-2">
          {{ article().title }}
        </h3>
        <p class="text-body-sm text-neutral-500 line-clamp-2 mb-space-3">
          {{ article().excerpt }}
        </p>
        <div class="flex items-center gap-space-3">
          @for (author of article().authors; track author.name) {
            <div class="flex items-center gap-space-1">
              <div class="w-4 h-4 rounded-full bg-neutral-200 flex items-center justify-center text-[8px] text-neutral-500 font-medium">
                {{ author.name[0] }}
              </div>
              <span class="text-[11px] text-neutral-500">{{ author.name }}</span>
            </div>
          }
        </div>
      </div>
    </a>
  `,
})
export class ArticleCardComponent {
  readonly article = input.required<Article>();

  readonly categoryLabel = computed(() => {
    const cat = CATEGORIES.find((c) => c.key === this.article().category);
    return cat?.label ?? this.article().category;
  });

  readonly articleCode = computed(() => {
    const a = this.article();
    const prefix = a.category.slice(0, 3).toUpperCase();
    const year = a.publishedAt.slice(2, 4);
    return `${prefix}-${year}-${a.id.padStart(4, '0')}`;
  });

  readonly placeholderBg = computed(() => {
    return `h-[160px] flex items-center justify-center ${placeholderColors[this.article().category] ?? 'bg-surface-quiet'}`;
  });

  readonly formattedDate = computed(() => {
    const d = new Date(this.article().publishedAt);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  });
}
