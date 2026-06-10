import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  model,
  output,
  signal,
  ElementRef,
  AfterViewInit,
  AfterContentInit,
  OnDestroy,
  inject,
  isDevMode,
  viewChild,
} from '@angular/core';
import { StatusChipComponent } from '../status-chip';
import type { Estado } from '../status-chip/status-chip.labels';
import type { PageHeaderLevel, PageHeaderDensity } from './page-header.variants';

let nextId = 0;

@Component({
  selector: 'afi-page-header',
  standalone: true,
  imports: [StatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  host: {
    'role': 'banner',
    '[id]': 'computedId()',
    '[class]': 'hostClasses()',
    '[attr.aria-label]': 'computedAriaLabel()',
    '[attr.data-collapsible]': 'collapsible() || null',
    '[attr.data-expanded]': 'collapsible() ? expanded() : null',
  },
})
export class PageHeaderComponent implements AfterViewInit, AfterContentInit, OnDestroy {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly level = input<PageHeaderLevel>('page');
  readonly estado = input<Estado | null>(null);
  readonly sticky = input(true);
  readonly scrollFade = input(true);
  readonly density = input<PageHeaderDensity>('default');
  readonly ariaLabel = input<string | null>(null);
  readonly maxInlineActions = input<number>(3);

  /**
   * Collapsible behaviour — title row becomes a button, body hides when
   * collapsed. Ported from <afi-section> so the scaffold can host
   * collapsible form groups (Cónyuge / Hijos / Ascendientes patterns).
   */
  readonly collapsible = input<boolean>(false);
  readonly expanded = model<boolean>(true);

  /** Right-aligned count chip (e.g. "3 hijos"). Null hides it. */
  readonly count = input<string | number | null>(null);

  /** Renders a success-coloured check icon next to the title. */
  readonly complete = input<boolean>(false);

  readonly stickyChange = output<boolean>();
  readonly toggled = output<boolean>();

  readonly bodyId = `afi-page-header-${nextId++}-body`;

  readonly #el = inject(ElementRef);
  readonly #isScrolled = signal(false);
  protected readonly actionsWrapper = viewChild<ElementRef<HTMLElement>>('actionsWrapper');
  #scrollParent: HTMLElement | Window | null = null;
  #scrollHandler: (() => void) | null = null;
  #warnedActions = false;

  protected readonly computedId = computed(() =>
    this.level() === 'page' ? 'page-header' : null,
  );

  protected readonly computedAriaLabel = computed(() => {
    const custom = this.ariaLabel();
    if (custom) return custom;
    switch (this.level()) {
      case 'section': return 'Encabezado de sección';
      case 'subsection': return 'Encabezado de subsección';
      default: return 'Encabezado de página';
    }
  });

  protected readonly hostClasses = computed(() => {
    const parts = [
      'page-header',
      `page-header--${this.level()}`,
      `page-header--${this.density()}`,
    ];
    // Sticky / scroll-fade only apply to the page-level chrome; nested levels never stick.
    if (this.sticky() && this.level() === 'page') {
      parts.push('page-header--sticky');
    }
    if (this.sticky() && this.scrollFade() && this.#isScrolled() && this.level() === 'page') {
      parts.push('page-header--scrolled');
    }
    return parts.join(' ');
  });

  ngAfterViewInit(): void {
    if (!this.sticky() || !this.scrollFade() || this.level() !== 'page') return;

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

  ngAfterContentInit(): void {
    // Default IA rule: max 3 actions before overflowing into an afi-menu.
    // We only warn — consumers wire the overflow themselves via [slot=actions].
    if (!isDevMode() || this.#warnedActions) return;
    queueMicrotask(() => {
      const wrapper = this.actionsWrapper()?.nativeElement;
      if (!wrapper) return;
      const count = wrapper.children.length;
      const max = this.maxInlineActions();
      if (count > max && !this.#warnedActions) {
        this.#warnedActions = true;
        console.warn(
          `[afi-page-header] level="${this.level()}" projects ${count} actions; default IA rule is max ${max} before wrapping the overflow into an "afi-menu". Pass [maxInlineActions]="${count}" to silence this warning if intentional.`,
        );
      }
    });
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

  protected readonly hasCount = computed(() => {
    const c = this.count();
    return c !== null && c !== undefined && c !== '';
  });

  protected onToggle(): void {
    if (!this.collapsible()) return;
    const next = !this.expanded();
    this.expanded.set(next);
    this.toggled.emit(next);
  }
}
