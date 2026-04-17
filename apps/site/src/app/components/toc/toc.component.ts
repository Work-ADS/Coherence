import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Right-rail "On this page" table of contents with IntersectionObserver scroll-spy.
 * Scans a container for H2/H3 elements, renders nested links, highlights active heading.
 */
@Component({
  selector: 'afi-toc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      role="complementary"
      aria-label="Índice de la página"
      class="sticky top-space-12"
    >
      <p class="text-body-sm font-medium text-canvas-fg mb-space-3">{{ title() }}</p>
      <nav>
        <ul class="space-y-space-1">
          @for (entry of entries(); track entry.id) {
            <li [class.pl-space-4]="entry.level === 3">
              <a
                [href]="'#' + entry.id"
                class="block text-body-sm py-space-1 transition-colors duration-fast
                       border-l-2 pl-space-3 -ml-px"
                [class.border-action]="activeId() === entry.id"
                [class.text-action-700]="activeId() === entry.id"
                [class.font-medium]="activeId() === entry.id"
                [class.border-transparent]="activeId() !== entry.id"
                [class.text-neutral-400]="activeId() !== entry.id"
                [class.hover:text-canvas-fg]="activeId() !== entry.id"
                (click)="onLinkClick($event, entry.id)"
              >{{ entry.text }}</a>
            </li>
          }
        </ul>
      </nav>
    </aside>
  `,
})
export class TocComponent implements AfterViewInit, OnDestroy {
  readonly containerRef = input.required<ElementRef>();
  readonly title = input<string>('En esta página');

  /** Manually trigger a re-scan (e.g., on tab switch). Increment to force refresh. */
  readonly refreshTrigger = input<number>(0);

  readonly entries = signal<TocEntry[]>([]);
  readonly activeId = signal<string>('');

  #observer: IntersectionObserver | null = null;
  #reducedMotion = false;
  readonly #destroyRef = inject(DestroyRef);

  constructor() {
    // Re-scan whenever refreshTrigger changes (e.g., on tab switch)
    effect(() => {
      const _ = this.refreshTrigger();
      // Skip the initial value (0) — ngAfterViewInit handles that
      if (_ > 0) {
        this.scan();
      }
    });
  }

  ngAfterViewInit(): void {
    this.#reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    this.scan();
  }

  ngOnDestroy(): void {
    this.#observer?.disconnect();
  }

  /** Scan the container for H2/H3 headings and set up IntersectionObserver. */
  scan(): void {
    this.#observer?.disconnect();

    const container = this.containerRef()?.nativeElement;
    if (!container) return;

    const headings = container.querySelectorAll('h2[id], h3[id]') as NodeListOf<HTMLElement>;
    const newEntries: TocEntry[] = [];

    headings.forEach((h: HTMLElement) => {
      newEntries.push({
        id: h.id,
        text: h.textContent?.trim() ?? '',
        level: h.tagName === 'H2' ? 2 : 3,
      });
    });

    this.entries.set(newEntries);

    if (newEntries.length === 0) return;

    this.#observer = new IntersectionObserver(
      (observerEntries) => {
        for (const entry of observerEntries) {
          if (entry.isIntersecting) {
            this.activeId.set((entry.target as HTMLElement).id);
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );

    headings.forEach((h: HTMLElement) => this.#observer!.observe(h));
  }

  onLinkClick(event: Event, id: string): void {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    if (this.#reducedMotion) {
      el.scrollIntoView();
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    this.activeId.set(id);
  }
}
