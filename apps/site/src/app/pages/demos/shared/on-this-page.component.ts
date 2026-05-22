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
  templateUrl: './on-this-page.component.html',
  styleUrl: './on-this-page.component.scss',
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
