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
} from '@angular/core';
import { StatusChipComponent } from '../status-chip';
import type { Estado } from '../status-chip/status-chip.labels';
import type { PageHeaderLevel, PageHeaderDensity } from './page-header.variants';

@Component({
  selector: 'afi-page-header',
  standalone: true,
  imports: [StatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  host: {
    'id': 'page-header',
    'role': 'banner',
    '[class]': 'hostClasses()',
    '[attr.aria-label]': 'computedAriaLabel()',
  },
})
export class PageHeaderComponent implements AfterViewInit, OnDestroy {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly level = input<PageHeaderLevel>('page');
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
      'page-header',
      `page-header--${this.level()}`,
      `page-header--${this.density()}`,
    ];
    if (this.sticky()) {
      parts.push('page-header--sticky');
    }
    if (this.sticky() && this.scrollFade() && this.#isScrolled()) {
      parts.push('page-header--scrolled');
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
