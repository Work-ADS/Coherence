import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChildren,
} from '@angular/core';

import {
  SegmentedControlSize,
  SegmentedControlVariant,
} from './segmented-control.variants';

export interface SegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Segmented Control — a set of mutually exclusive options rendered either as
 * a pill-style toggle bar with a sliding indicator (`variant="pill"`, the
 * default) or as a stack of radio cards (`variant="cards"`).
 *
 * Uses semantic tokens for all visual values. Respects prefers-reduced-motion.
 *
 * Accessibility:
 * - `role="radiogroup"` on the container
 * - `role="radio"` + `aria-checked` on each option
 * - Focus ring via `--border-focus`
 *
 * @example
 * ```html
 * <afi-segmented-control
 *   [options]="[{value: 'a', label: 'A'}, {value: 'b', label: 'B'}]"
 *   [(value)]="selected"
 *   size="sm"
 * />
 * ```
 */
@Component({
  selector: 'afi-segmented-control',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './segmented-control.component.html',
  styleUrl: './segmented-control.component.scss',
})
export class SegmentedControlComponent implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private resizeObserver?: ResizeObserver;

  /** The available options to render. */
  readonly options = input.required<SegmentedOption[]>();

  /** Two-way bound value — the currently selected option's value. */
  readonly value = model.required<string>();

  /** Size variant (sm | md | lg). */
  readonly size = input<SegmentedControlSize>('md');

  /**
   * Visual treatment (pill | cards). `cards` swaps the shared track for one
   * radio card per option — opt in per surface; it is not brand-driven.
   */
  readonly variant = input<SegmentedControlVariant>('pill');

  /** Accessible label for the radiogroup. */
  readonly ariaLabel = input<string>('');

  /** References to option button elements for indicator measurement. */
  readonly optionEls = viewChildren<ElementRef>('optionEl');

  // ─── Indicator state ───
  readonly indicatorWidth = signal(0);
  readonly indicatorHeight = signal(0);
  readonly indicatorOffset = signal(0);
  readonly indicatorTop = signal(0);
  readonly indicatorTransform = computed(
    () => `translate(${this.indicatorOffset()}px, ${this.indicatorTop()}px)`,
  );

  constructor() {
    // Recalculate indicator when value, options, size, or view children change
    effect(() => {
      const _ = this.value();
      const __ = this.options();
      const ___ = this.optionEls();
      const ____ = this.size();
      // Double rAF to ensure layout has settled after size change
      requestAnimationFrame(() =>
        requestAnimationFrame(() => this.updateIndicator()),
      );
    });
  }

  ngAfterViewInit(): void {
    this.updateIndicator();
    this.observeSizeChanges();
  }

  select(option: SegmentedOption): void {
    if (!(option.disabled ?? false)) {
      this.value.set(option.value);
    }
  }

  private updateIndicator(): void {
    const els = this.optionEls();
    const opts = this.options();
    const currentValue = this.value();
    const idx = opts.findIndex(o => o.value === currentValue);
    if (idx < 0 || idx >= els.length) return;

    const el = els[idx]?.nativeElement as HTMLElement | undefined;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    this.indicatorOffset.set(elRect.left - parentRect.left);
    this.indicatorTop.set(elRect.top - parentRect.top);
    this.indicatorWidth.set(elRect.width);
    this.indicatorHeight.set(elRect.height);
  }

  private observeSizeChanges(): void {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => this.updateIndicator());
    });
    this.resizeObserver.observe(this.host.nativeElement);

    const parent = this.host.nativeElement.parentElement;
    if (parent) {
      this.resizeObserver.observe(parent);
    }

    this.destroyRef.onDestroy(() => this.resizeObserver?.disconnect());
  }
}
