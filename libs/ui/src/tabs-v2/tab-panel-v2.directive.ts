import { Directive, ElementRef, effect, inject, input } from '@angular/core';

import { readMotionMs } from './motion-tokens';

/**
 * Tab panel swap motion — identity v2 (foundations-modern).
 *
 * Plays the `swap-slide-blur` pattern (motion-skill §4.12) on a tab panel every
 * time the tablist's selection changes: the panel fades up from transparent
 * while sliding laterally into place and a soft blur resolves to sharp. The
 * travel direction follows the move — forward through the tabs enters from the
 * trailing edge, backward from the leading edge — so the motion reads as one
 * strip of content sliding under a fixed frame.
 *
 * Usage — bind the tablist's active index on the panel element you already have:
 *
 *   <afi-tabs-v2 [(activeIndex)]="tab">
 *     <afi-tab-v2 label="Resumen" controls="panel-0" />
 *     <afi-tab-v2 label="Cartera" controls="panel-1" />
 *   </afi-tabs-v2>
 *
 *   <div id="panel-0" role="tabpanel" [hidden]="tab() !== 0" [afiTabPanelV2]="tab()">…</div>
 *   <div id="panel-1" role="tabpanel" [hidden]="tab() !== 1" [afiTabPanelV2]="tab()">…</div>
 *
 * Why a directive and not panel ownership inside `afi-tabs-v2`: the v2 list is
 * bar-only by design — panels are the consumer's, wired by each item's
 * `controls` id — so the motion has to travel to wherever the panel lives.
 * Every layout works: one swapping panel, or several kept mounted and toggled
 * with `[hidden]`. Hidden panels animate invisibly, which costs nothing and
 * means a panel is always mid-motion at the moment it is revealed.
 *
 * Why the Web Animations API rather than a CSS class: the panel sits outside
 * this primitive's style scope, so scoped keyframes cannot reach it and piercing
 * encapsulation is banned by clean-code. WAAPI also restarts cleanly on every call — the v1
 * `afi-tabs` equivalent needed four near-identical keyframe blocks toggled by an
 * `animationKey % 2` parity hack to force the browser to replay the animation.
 * The animated properties are still the Tier-1 set (`opacity`, `transform`,
 * `filter`), per component-skill §11.
 *
 * Motion values are read from the `--motion-*` tokens at play time — the same
 * read-tokens-into-JS approach as `text-decode-scramble` (motion-skill §4.10),
 * with no numeric fallbacks. A panel mounted outside a `[data-foundation="modern"]`
 * scope resolves nothing and simply does not animate.
 *
 * The first change detection pass is not a swap, so nothing plays on page load:
 * this is a warm in-session transition, not a cold entrance (motion-skill §4.7).
 * `prefers-reduced-motion: reduce` skips the animation entirely; the panel still
 * changes, instantly.
 */
@Directive({
  selector: '[afiTabPanelV2]',
  standalone: true,
})
export class TabPanelV2Directive {
  /**
   * The tablist's active index. Bind the same signal that drives
   * `afi-tabs-v2` — this directive watches it for changes and derives the
   * travel direction from the delta; it never reads or sets selection itself.
   */
  readonly activeIndex = input.required<number>({ alias: 'afiTabPanelV2' });

  /**
   * Direct DOM access is unavoidable here (clean-code rule 7): the panel is the
   * consumer's element and the animation is driven imperatively by WAAPI.
   */
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private previousIndex: number | null = null;
  private running: Animation | null = null;

  constructor() {
    effect(() => {
      const next = this.activeIndex();
      const previous = this.previousIndex;
      this.previousIndex = next;
      if (previous === null || previous === next) return;
      this.play(next > previous);
    });
  }

  /** @param forward true when moving to a later tab — content enters from the trailing edge. */
  private play(forward: boolean): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = this.host.nativeElement;
    const styles = getComputedStyle(el);
    const duration = readMotionMs(styles.getPropertyValue('--motion-duration-base'));
    const easing = styles.getPropertyValue('--motion-easing-standard').trim();
    // reveal-rise carries every kind of spatial travel in this family, lateral
    // included (motion-skill §4.11) — blur peak is the light tier, the softest.
    const travel = parseFloat(
      styles.getPropertyValue('--motion-reveal-rise-normal'),
    );
    const blur = parseFloat(
      styles.getPropertyValue('--motion-reveal-blur-light'),
    );
    if (
      easing === '' ||
      Number.isNaN(duration) ||
      Number.isNaN(travel) ||
      Number.isNaN(blur)
    ) {
      return;
    }

    const offset = forward ? travel : -travel;
    this.running?.cancel();
    this.running = el.animate(
      [
        {
          opacity: '0',
          filter: `blur(${blur}px)`,
          transform: `translateX(${offset}px)`,
        },
        { opacity: '1', filter: 'blur(0)', transform: 'translateX(0)' },
      ],
      { duration, easing },
    );
  }
}
