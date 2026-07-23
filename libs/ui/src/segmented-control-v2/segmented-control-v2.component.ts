import {
  afterNextRender,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

import { SegmentedControlV2Option } from './segmented-control-v2.variants';

/**
 * Segmented Control — identity v2 (foundations-modern).
 *
 * Parallel primitive to the legacy `afi-segmented-control`; consumes only
 * `foundations-modern` tokens, so it renders correctly only inside a
 * `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Segmented Control set
 * (3005:5944) + documentation (3007:6757). Zero new tokens — every value maps to
 * existing control/*, height/*, pad/*, gap/*, radius/*, content/* and borders/*.
 *
 * Shape (Documentation "Usage rules"):
 *  - Current-view mode switching ONLY — flips a setting or presentation mode of
 *    the current view. Navigating between peer views is Tabs (`afi-tabs-v2`);
 *    the two never overlap for the same job in one area.
 *  - Exactly one segment is always selected — there is no unselected state, so
 *    `value` is required and always resolves to a segment.
 *  - 2–4 concise text segments. No icon-only segments. Segment count comes from
 *    the `options` array, never from separate size/count variants.
 *  - Single fixed size (height/component/sm) — no sm/md/lg. Like `afi-toggle-v2`,
 *    a consistent control height reads better and no compact/large variant has
 *    surfaced. That height is a deliberate dense-desktop touch-target opt-out
 *    (settings / filter rows, not touch-first surfaces): it sits below the 44×44
 *    minimum, and `ariaLabel` supplies the accessible name.
 *  - Numeric labels use tabular figures (AFI rule) — handled in the stylesheet.
 *
 * Motion: a single pill Smart-Animates its position + width to the selected
 * segment (~200 ms, standard easing); the label colour cross-fades. The slide is
 * suppressed on first paint (so the pill lands, it does not grow in) and collapsed
 * under `prefers-reduced-motion`.
 *
 * `value` is a `model()` so it self-updates on selection and supports
 * `[(value)]`; consumers can also listen to the implicit `valueChange` output.
 *
 * A11y: `role="radiogroup"` on the track, `role="radio"` + `aria-checked` on each
 * segment. Roving tabindex keeps only the selected segment in the tab order;
 * Arrow keys (both axes), Home and End move selection and focus across enabled
 * segments, skipping disabled ones. Focus ring is a shadow-pair with a canvas-gap
 * so it stays legible inside the track.
 */
@Component({
  selector: 'afi-segmented-control-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './segmented-control-v2.component.html',
  styleUrls: ['./segmented-control-v2.component.scss'],
})
export class SegmentedControlV2Component implements AfterViewInit {
  /** The segments to render, in order. 2–4 concise text labels. */
  readonly options = input.required<SegmentedControlV2Option[]>();

  /** Controlled + self-updating selected value. */
  readonly value = model.required<string>();

  /** Accessible label for the radiogroup. */
  readonly ariaLabel = input<string | null>(null);

  /** The track container, measured for the sliding pill. */
  readonly trackRef = viewChild<ElementRef<HTMLElement>>('track');

  /** The segment buttons, measured + focused by index. */
  readonly optionEls = viewChildren<ElementRef<HTMLButtonElement>>('optionEl');

  // ─── Sliding pill geometry ───
  readonly indicatorWidth = signal(0);
  readonly indicatorOffset = signal(0);
  readonly indicatorTransform = computed(
    () => `translateX(${this.indicatorOffset()}px)`,
  );

  /** Gates the pill transition — off until the first measure so it never grows in. */
  readonly animate = signal(false);

  /** Index of the selected segment; falls back to the first when the value is stale. */
  readonly selectedIndex = computed(() => {
    const opts = this.options();
    const idx = opts.findIndex((option) => option.value === this.value());
    return idx >= 0 ? idx : 0;
  });

  /** True when the selected segment is disabled — mutes the pill fill. */
  readonly activeDisabled = computed(
    () => this.options()[this.selectedIndex()]?.disabled ?? false,
  );

  constructor() {
    // Re-measure the pill whenever selection, options, or the rendered buttons
    // change. Selection only changes label colour, never geometry, so a
    // synchronous measure here is correct and reliable when the tab is
    // backgrounded (unlike a deferred rAF). The guard in updateIndicator()
    // no-ops harmlessly before the view exists.
    effect(() => {
      this.value();
      this.options();
      this.optionEls();
      this.updateIndicator();
    });

    // Measure once the first render settles — fonts and layout are ready — then
    // enable the slide for subsequent selection changes.
    afterNextRender(() => {
      this.updateIndicator();
      this.animate.set(true);
    });
  }

  ngAfterViewInit(): void {
    this.updateIndicator();
  }

  select(index: number): void {
    const option = this.options()[index];
    if (!option || (option.disabled ?? false)) return;
    this.value.set(option.value);
  }

  onKeydown(event: KeyboardEvent): void {
    const opts = this.options();
    const len = opts.length;
    if (len === 0) return;
    const current = this.selectedIndex();

    const nextEnabled = (dir: 1 | -1): number => {
      let next = current;
      for (let i = 0; i < len; i++) {
        next = (next + dir + len) % len;
        if (!(opts[next]?.disabled ?? false)) return next;
      }
      return current;
    };

    const firstEnabled = (): number => {
      const idx = opts.findIndex((option) => !(option.disabled ?? false));
      return idx >= 0 ? idx : current;
    };

    const lastEnabled = (): number => {
      for (let i = len - 1; i >= 0; i--) {
        if (!(opts[i]?.disabled ?? false)) return i;
      }
      return current;
    };

    let target: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        target = nextEnabled(1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        target = nextEnabled(-1);
        break;
      case 'Home':
        target = firstEnabled();
        break;
      case 'End':
        target = lastEnabled();
        break;
      default:
        return;
    }

    event.preventDefault();
    this.select(target);
    this.optionEls()[target]?.nativeElement.focus();
  }

  private updateIndicator(): void {
    const track = this.trackRef()?.nativeElement;
    const el = this.optionEls()[this.selectedIndex()]?.nativeElement;
    if (!track || !el) return;

    const trackRect = track.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    this.indicatorOffset.set(elRect.left - trackRect.left);
    this.indicatorWidth.set(elRect.width);
  }
}
