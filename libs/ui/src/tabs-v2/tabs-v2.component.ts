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

import { readMotionMs } from './motion-tokens';
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
 * The underline slide is the only motion this list owns. To animate the panel
 * content as well — the lateral slide-and-blur swap ported from v1 `afi-tabs` —
 * put `[afiTabPanelV2]="activeIndex"` on the consumer's panel element
 * (`TabPanelV2Directive`, motion-skill §4.12).
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

  /** The sliding underline, animated imperatively — see `slideIndicator`. */
  readonly indicatorRef = viewChild<ElementRef<HTMLElement>>('indicator');

  /**
   * Where in the run the bar sits at its farthest point past the target, and the
   * share of a hop the overshoot may consume. Both are curve-shape numbers, not
   * brand values — the overshoot DISTANCE is the token. The cap keeps a very
   * short hop from flinging the full distance, which would read as a twitch.
   */
  private static readonly OVERSHOOT_AT = 0.62;
  private static readonly OVERSHOOT_MAX_SHARE = 0.3;

  private readonly baseId = `afi-tabs-v2-${nextId++}`;
  private slide: Animation | null = null;
  private lastIndex: number | null = null;

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

      // Animate only when the SELECTION moved. Geometry also changes on resize
      // and on web-font reflow; bouncing the bar for those would be motion the
      // user did not ask for. The first pass establishes the resting position.
      const from = this.indicatorOffset();
      const settled = this.lastIndex !== null;
      const moved = this.lastIndex !== active;
      this.lastIndex = active;

      this.updateIndicator();

      if (settled && moved) this.slideIndicator(from, this.indicatorOffset());
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

  /**
   * Slide the underline to the newly selected tab, overshooting it by a fixed
   * distance and settling back — `selection-slide` (motion-skill §4.13).
   *
   * Driven by the Web Animations API rather than a CSS transition because the
   * overshoot has to be a CONSTANT number of pixels. A CSS easing is normalised
   * over the travel, so its overshoot is inescapably a percentage of it: the
   * same curve that reads well across a wide tab bar is invisible on a narrow
   * one. Follow-through is a property of the moving object, not of the distance.
   *
   * Motion values come from tokens (`readMotionMs`, and the reveal-rise family
   * for spatial travel per motion-skill §4.11). Nothing animates if they do not
   * resolve, or under `prefers-reduced-motion` — with no CSS transition on
   * `transform`, skipping the animation lands the bar instantly, which is the
   * correct collapsed behaviour.
   */
  private slideIndicator(from: number, to: number): void {
    const el = this.indicatorRef()?.nativeElement;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Re-target mid-flight from where the bar actually IS, not from the last
    // committed position — otherwise a fast second click snaps it back to the
    // previous tab before starting again.
    const running = this.slide?.playState === 'running';
    const start = running
      ? new DOMMatrix(getComputedStyle(el).transform).m41
      : from;

    const travel = to - start;
    if (Math.abs(travel) < 1) return;

    const styles = getComputedStyle(el);
    const duration = readMotionMs(styles.getPropertyValue('--motion-duration-base'));
    const easing = styles.getPropertyValue('--motion-easing-standard').trim();
    const reach = parseFloat(styles.getPropertyValue('--motion-reveal-rise-light'));
    if (easing === '' || Number.isNaN(duration) || Number.isNaN(reach)) return;

    const overshoot =
      Math.sign(travel) *
      Math.min(reach, Math.abs(travel) * TabsV2Component.OVERSHOOT_MAX_SHARE);

    this.slide?.cancel();
    this.slide = el.animate(
      [
        { transform: `translateX(${start}px)`, easing },
        {
          transform: `translateX(${to + overshoot}px)`,
          offset: TabsV2Component.OVERSHOOT_AT,
          easing,
        },
        { transform: `translateX(${to}px)` },
      ],
      { duration },
    );
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
