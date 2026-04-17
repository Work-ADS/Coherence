import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
  signal,
  effect,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  inject,
  contentChild,
} from '@angular/core';
import { StatusChipComponent } from '../status-chip';
import type { Estado } from '../status-chip/status-chip.labels';
import {
  densityClasses,
  stickyClasses,
  scrollFadeClasses,
  noScrollFadeClasses,
} from './page-header.variants';
import type { PageHeaderDensity } from './page-header.variants';

@Component({
  selector: 'afi-page-header',
  standalone: true,
  imports: [StatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'id': 'page-header',
    'role': 'banner',
    '[attr.aria-label]': 'computedAriaLabel()',
  },
  styles: `
    :host { display: block; background: var(--surface-elevated, #fff); }
    :host(.scroll-faded) {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border-hairline);
      transition: backdrop-filter var(--duration-fast, 150ms) var(--easing-enter, ease-out),
                  border-color var(--duration-fast, 150ms) var(--easing-enter, ease-out);
    }
    @media (prefers-reduced-motion: reduce) {
      :host(.scroll-faded) { transition-duration: 0.01ms !important; }
    }
  `,
  template: `
    <div [class]="hostClasses()">
      <!-- Row 1: breadcrumb + globalActions -->
      <div class="flex items-center justify-between gap-space-4 min-h-[28px]">
        <div class="flex items-center gap-space-2 text-body-sm text-neutral-500">
          <ng-content select="[slot=breadcrumb]" />
        </div>
        <div class="flex items-center gap-space-2">
          <ng-content select="[slot=globalActions]" />
        </div>
      </div>

      <!-- Row 2: title + estado + meta | primaryAction -->
      <div class="flex items-center justify-between gap-space-4">
        <div class="flex items-center gap-space-3 min-w-0">
          <h1 class="text-title text-canvas-fg truncate">{{ title() }}</h1>
          @if (estado()) {
            <afi-status-chip [estado]="estado()!" size="sm" />
          }
          <div class="flex items-center gap-space-2 text-body-sm text-neutral-500">
            <ng-content select="[slot=meta]" />
          </div>
        </div>
        <div class="flex items-center gap-space-2 shrink-0">
          <ng-content select="[slot=primaryAction]" />
          <ng-content />
        </div>
      </div>

      <!-- Row 3: subtitle -->
      @if (subtitle()) {
        <p class="text-body text-neutral-500 mt-1">{{ subtitle() }}</p>
      }

      <!-- Row 4: filters -->
      <div class="empty:hidden mt-space-2">
        <ng-content select="[slot=filters]" />
      </div>

      <!-- Row 5: tabs -->
      <div class="empty:hidden mt-space-2 -mb-3">
        <ng-content select="[slot=tabs]" />
      </div>
    </div>
  `,
})
export class PageHeaderComponent implements AfterViewInit, OnDestroy {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly estado = input<Estado | null>(null);
  readonly sticky = input(true);
  readonly scrollFade = input(true);
  readonly density = input<PageHeaderDensity>('default');
  readonly ariaLabel = input<string | null>(null);
  readonly stickyChange = output<boolean>();

  readonly #el = inject(ElementRef);
  readonly #isScrolled = signal(false);
  #scrollParent: HTMLElement | Window | null = null;
  #scrollHandler: (() => void) | null = null;

  protected readonly computedAriaLabel = computed(() =>
    this.ariaLabel() ?? 'Encabezado de página',
  );

  protected readonly hostClasses = computed(() => {
    const parts = [
      'px-space-8',
      densityClasses[this.density()],
    ];
    if (this.sticky()) {
      parts.push(stickyClasses);
    }
    if (this.sticky() && this.scrollFade() && this.#isScrolled()) {
      parts.push(scrollFadeClasses);
    } else {
      parts.push(noScrollFadeClasses);
    }
    return parts.join(' ');
  });

  ngAfterViewInit(): void {
    if (!this.sticky() || !this.scrollFade()) return;

    this.#scrollParent = this.#findScrollParent(this.#el.nativeElement as HTMLElement);
    this.#scrollHandler = () => {
      const scrollTop = this.#scrollParent instanceof Window
        ? window.scrollY
        : (this.#scrollParent as HTMLElement).scrollTop;
      const wasScrolled = this.#isScrolled();
      const isNow = scrollTop > 8;
      if (wasScrolled !== isNow) {
        this.#isScrolled.set(isNow);
        this.stickyChange.emit(isNow);
      }
    };
    (this.#scrollParent ?? window).addEventListener('scroll', this.#scrollHandler, { passive: true });
  }

  ngOnDestroy(): void {
    if (this.#scrollHandler && this.#scrollParent) {
      this.#scrollParent.removeEventListener('scroll', this.#scrollHandler);
    }
  }

  #findScrollParent(el: HTMLElement): HTMLElement | Window {
    let parent = el.parentElement;
    while (parent) {
      const overflow = getComputedStyle(parent).overflowY;
      if (overflow === 'auto' || overflow === 'scroll') return parent;
      parent = parent.parentElement;
    }
    return window;
  }
}
