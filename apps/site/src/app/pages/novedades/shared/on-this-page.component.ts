import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

export type TocItem = {
  /** Anchor id matching the corresponding `id` attribute in the page content. */
  id: string;
  label: string;
  /** Indentation level — 0 for top-level, 1 for nested. */
  level?: 0 | 1;
};

/**
 * On this page — sticky right-rail TOC for documentation pages.
 *
 * Listens for scroll on the nearest scrollable ancestor (typically the
 * page's `<main>`), tracks which anchored section is currently in view,
 * and highlights the matching item. Click smooth-scrolls to the anchor.
 *
 * Inspired by shadcn/ui docs — always visible at xl+ widths, hidden on
 * narrower screens to keep the case-study reading column unobstructed.
 */
@Component({
  selector: 'site-on-this-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"contents"',
  },
  template: `
    <nav
      class="sticky top-space-8 self-start hidden xl:block w-[220px] shrink-0"
      aria-label="En esta página"
    >
      <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
        En esta página
      </p>
      <ul class="flex flex-col gap-space-1 border-l border-border-hairline">
        @for (s of sections(); track s.id) {
          <li>
            <a
              [href]="'#' + s.id"
              (click)="onClick($event, s.id)"
              class="block py-space-1 text-body-sm transition-colors -ml-px border-l-2 hover:text-canvas-fg"
              [class.pl-space-3]="(s.level ?? 0) === 0"
              [class.pl-space-6]="(s.level ?? 0) === 1"
              [class.text-action-700]="activeId() === s.id"
              [class.font-medium]="activeId() === s.id"
              [class.border-action-700]="activeId() === s.id"
              [class.text-neutral-500]="activeId() !== s.id"
              [class.border-transparent]="activeId() !== s.id"
            >
              {{ s.label }}
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export class OnThisPageComponent implements AfterViewInit {
  readonly sections = input.required<TocItem[]>();

  readonly activeId = signal<string>('');

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    const scroller = this.findScrollContainer();
    if (!scroller) return;

    fromEvent(scroller, 'scroll')
      .pipe(
        throttleTime(80, undefined, { leading: true, trailing: true }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateActive(scroller));

    queueMicrotask(() => this.updateActive(scroller));
  }

  private findScrollContainer(): HTMLElement | null {
    let el: HTMLElement | null = this.host.nativeElement.parentElement;
    while (el) {
      const overflowY = getComputedStyle(el).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') return el;
      el = el.parentElement;
    }
    return document.scrollingElement as HTMLElement | null;
  }

  private updateActive(scroller: Element): void {
    const top = scroller.getBoundingClientRect().top;
    const threshold = top + 120;
    let current = '';
    for (const s of this.sections()) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= threshold) current = s.id;
      else break;
    }
    if (current) {
      this.activeId.set(current);
      return;
    }
    const first = this.sections()[0];
    if (first) this.activeId.set(first.id);
  }

  onClick(e: Event, id: string): void {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.activeId.set(id);
    history.replaceState(null, '', `#${id}`);
  }
}
