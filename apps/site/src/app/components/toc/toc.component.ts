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
  templateUrl: './toc.component.html',
  styleUrl: './toc.component.scss',
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
      // Every rootMargin component needs an explicit unit — a bare 0 makes the
      // constructor throw, which silently killed scroll-spy on every page.
      // Percent throughout, so no raw pixel value is needed here.
      { rootMargin: '-20% 0% -70% 0%' },
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
