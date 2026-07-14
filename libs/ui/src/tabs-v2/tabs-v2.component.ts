import {
  afterNextRender,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  contentChildren,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';

import { TabV2Component } from './tab-v2.component';

let nextId = 0;

/**
 * Tabs — identity v2 (foundations-modern).
 *
 * Underline tab bar that switches between peer views sharing a parent context.
 * Projected `<afi-tab-v2>` children render the triggers; this list owns the
 * container, the shared baseline, the sliding underline indicator, selection
 * state, keyboard navigation, and the ARIA wiring. Panels are the consumer's —
 * associate them via each item's `controls` panel id.
 *
 * Consumes only `foundations-modern` tokens, so it renders correctly only inside
 * a `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Tabs / List (2715:3172) and
 * the Behavior canvas (2715:3219). No new tokens: baseline
 * `borders/default` at `stroke/hairline`, indicator `content/primary` at
 * `stroke/strong`, focus ring `borders/focus` at `stroke/focus`.
 *
 * Behaviour (per the Behavior canvas):
 *  - Exactly one tab is always selected; the first enabled tab is the default.
 *  - Automatic activation: Left/Right arrows and Home/End move focus AND
 *    selection to the adjacent enabled tab, skipping disabled items.
 *  - Roving tabindex: only the selected tab is in the tab order (`tabindex=0`).
 *  - Overflow: a single row that scrolls horizontally — never wraps. Activating a
 *    tab outside the viewport scrolls it smoothly into view.
 *  - The underline Smart-Animates its position (~200 ms ease-out); text and
 *    geometry stay static. Collapsed under `prefers-reduced-motion`.
 *
 * `activeIndex` is a `model()` so it self-updates on interaction and supports
 * `[(activeIndex)]`; consumers can also listen to the implicit `activeIndexChange`.
 */
@Component({
  selector: 'afi-tabs-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs-v2.component.html',
  styleUrls: ['./tabs-v2.component.scss'],
})
export class TabsV2Component implements AfterViewInit {
  /** Controlled + self-updating active tab index. */
  readonly activeIndex = model<number>(0);

  /** Accessible label for the tablist. */
  readonly ariaLabel = input<string | null>(null);

  /** Projected `<afi-tab-v2>` children, in DOM order. */
  readonly tabs = contentChildren(TabV2Component);

  /** The tablist container, measured for indicator positioning. */
  readonly listRef = viewChild<ElementRef<HTMLElement>>('list');

  private readonly baseId = `afi-tabs-v2-${nextId++}`;

  /** Requested index, clamped to the first enabled tab when the target is inert. */
  readonly resolvedIndex = computed(() => {
    const list = this.tabs();
    const requested = this.activeIndex();
    if (list[requested] && !list[requested].disabled()) return requested;
    const firstEnabled = list.findIndex((tab) => !tab.disabled());
    return firstEnabled >= 0 ? firstEnabled : requested;
  });

  /** True when the active tab is disabled — tints the indicator disabled/content. */
  readonly activeDisabled = computed(
    () => this.tabs()[this.resolvedIndex()]?.disabled() ?? false,
  );

  // ─── Sliding underline geometry ───
  readonly indicatorWidth = signal(0);
  readonly indicatorOffset = signal(0);
  readonly indicatorTransform = computed(
    () => `translateX(${this.indicatorOffset()}px)`,
  );

  constructor() {
    // Push parent-owned state (index, selection, id) down to each child, then
    // re-measure the indicator. Selection only changes label colour, never
    // geometry, so measuring synchronously here is correct — and unlike a
    // deferred rAF pass it stays reliable when the tab is backgrounded (rAF
    // callbacks are throttled there). The guard in updateIndicator() no-ops
    // harmlessly on the first run, before the view exists; ngAfterViewInit and
    // afterNextRender cover that initial paint (plus web-font reflow).
    effect(() => {
      const list = this.tabs();
      const active = this.resolvedIndex();
      list.forEach((tab, i) => {
        tab.index.set(i);
        tab.selected.set(i === active);
        tab.tabId.set(`${this.baseId}-tab-${i}`);
      });
      this.updateIndicator();
    });

    // Measure again after the first render settles — fonts and layout are ready,
    // so the initial indicator lands under the correct tab.
    afterNextRender(() => this.updateIndicator());
  }

  ngAfterViewInit(): void {
    this.updateIndicator();
  }

  activate(index: number): void {
    const tab = this.tabs()[index];
    if (!tab || tab.disabled()) return;
    this.activeIndex.set(index);
    this.scrollIntoView(index);
  }

  onKeydown(event: KeyboardEvent): void {
    const list = this.tabs();
    const len = list.length;
    if (len === 0) return;
    const current = this.resolvedIndex();

    const nextEnabled = (dir: 1 | -1): number => {
      let next = current;
      for (let i = 0; i < len; i++) {
        next = (next + dir + len) % len;
        const candidate = list[next];
        if (candidate && !candidate.disabled()) return next;
      }
      return current;
    };

    const firstEnabled = (): number => {
      const idx = list.findIndex((tab) => !tab.disabled());
      return idx >= 0 ? idx : current;
    };

    const lastEnabled = (): number => {
      for (let i = len - 1; i >= 0; i--) {
        const candidate = list[i];
        if (candidate && !candidate.disabled()) return i;
      }
      return current;
    };

    let target: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
        target = nextEnabled(1);
        break;
      case 'ArrowLeft':
        target = nextEnabled(-1);
        break;
      case 'Home':
        target = firstEnabled();
        break;
      case 'End':
        target = lastEnabled();
        break;
      case 'Enter':
      case ' ':
        target = current;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.activate(target);
    list[target]?.focus();
  }

  private updateIndicator(): void {
    const container = this.listRef()?.nativeElement;
    const tab = this.tabs()[this.resolvedIndex()];
    const trigger = tab?.buttonRef()?.nativeElement;
    if (!container || !trigger) return;

    const containerRect = container.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    this.indicatorOffset.set(
      triggerRect.left - containerRect.left + container.scrollLeft,
    );
    this.indicatorWidth.set(triggerRect.width);
  }

  private scrollIntoView(index: number): void {
    this.tabs()
      [index]?.buttonRef()
      ?.nativeElement.scrollIntoView({
        inline: 'nearest',
        block: 'nearest',
      });
  }
}
