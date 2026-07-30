import { computed, signal, type Signal } from '@angular/core';

/**
 * Shared keyboard-navigation state for the chart primitives.
 *
 * Implements the keyboard map in `docs/rules/data-viz-skill.md`: drill in and
 * out with Enter / Shift+Enter, traverse siblings with the arrow keys, dismiss
 * the tooltip with Esc, and leave the chart with Tab.
 *
 * Two things this deliberately gets right, because the previous implementation
 * got both wrong:
 *
 * 1. **Roving tabindex.** Exactly one element inside a chart is ever in the tab
 *    order — the chart root while you are outside it, the active datum once you
 *    have drilled in. Before this, every mark carried `tabindex="0"`, so Tab
 *    walked all sixty points of a five-series line chart one at a time. Visa's
 *    drill-down model exists precisely to avoid that.
 *
 * 2. **Modifier keys are not swallowed.** VoiceOver on macOS consumes the arrow
 *    keys unless the user holds Control+Shift, which is why that combination is
 *    in the documented map. Arrow handling therefore ignores `ctrlKey` and
 *    `shiftKey` entirely rather than bailing when they are held. Only `altKey`
 *    and `metaKey` are passed through, so browser and OS shortcuts still work.
 *
 * **Deviation from Visa (intentional):** Visa models three levels — chart,
 * group, datum — so Enter stops on a bar group or a line before reaching a
 * datum. Coherence collapses that to two, chart and datum, and reaches other
 * groups with ArrowUp/ArrowDown at the datum level. Every key Visa documents
 * still works; the intermediate stop is gone. Our charts are shallow enough
 * (single-series bar, five-series line ceiling) that the extra level costs a
 * keystroke and buys nothing. Revisit if grouped or stacked bars land.
 *
 * This is hand-rolled rather than built on `cdk/a11y`'s `FocusKeyManager`
 * (clean-code.md rule 7) because that manager is one-dimensional and keyed to a
 * `QueryList`. Chart navigation is a two-axis cursor over signal-backed data.
 */

export type ChartNavLevel = 'chart' | 'datum';

/**
 * The navigable shape of a chart's data.
 *
 * A "group" is whatever the chart's second axis is: a series for line, a row
 * for heatmap, a category for dumbbell. Flat charts report a single group.
 */
export interface ChartNavShape {
  /** Number of groups. Zero means there is nothing to navigate. */
  groupCount: number;
  /** Navigable datum count per group, indexed by group. */
  datumCounts: readonly number[];
  /**
   * Whether ArrowUp/ArrowDown traverses groups. False for one-dimensional
   * charts (bar, dumbbell), matching Visa: neither documents the vertical
   * arrows because neither has a second axis to move along.
   */
  crossGroup: boolean;
}

export interface ChartNavPosition {
  group: number;
  datum: number;
  /**
   * Index into the chart's flat, DOM-order list of marks. Charts render their
   * marks in group-major order so this lines up with `viewChildren`.
   */
  flat: number;
}

export const EMPTY_NAV_SHAPE: ChartNavShape = {
  groupCount: 0,
  datumCounts: [],
  crossGroup: false,
};

function clamp(value: number, max: number): number {
  if (max < 0) return -1;
  return Math.min(Math.max(value, 0), max);
}

export class ChartNavController {
  private readonly shape: Signal<ChartNavShape>;

  /** Whether focus is on the chart root or on a datum inside it. */
  readonly level = signal<ChartNavLevel>('chart');

  /**
   * Tooltip visibility, owned here so Esc can dismiss it and Enter can raise
   * it. The chart binds its tooltip to this rather than tracking its own flag.
   */
  readonly tooltipOpen = signal(false);

  private readonly groupIndex = signal(0);
  private readonly datumIndex = signal(0);

  constructor(shape: Signal<ChartNavShape>) {
    this.shape = shape;
  }

  /**
   * The focused datum, or null when focus is on the chart root or the chart has
   * no data. Clamped against the current shape so a data change that shrinks
   * the chart can never leave the cursor pointing past the end.
   */
  readonly active = computed<ChartNavPosition | null>(() => {
    if (this.level() === 'chart') return null;

    const shape = this.shape();
    if (shape.groupCount === 0) return null;

    const group = clamp(this.groupIndex(), shape.groupCount - 1);
    if (group < 0) return null;

    const datum = clamp(this.datumIndex(), (shape.datumCounts[group] ?? 0) - 1);
    if (datum < 0) return null;

    let flat = 0;
    for (let g = 0; g < group; g++) flat += shape.datumCounts[g] ?? 0;

    return { group, datum, flat: flat + datum };
  });

  /**
   * Tab order for the chart root: in when focus is outside the data, out once a
   * datum holds it. Also in when there is no data, so the chart never drops out
   * of the tab order entirely.
   */
  readonly rootTabIndex = computed(() => (this.active() === null ? 0 : -1));

  isActive(group: number, datum: number): boolean {
    const active = this.active();
    return active !== null && active.group === group && active.datum === datum;
  }

  /** Tab order for one mark. Only the active datum is ever reachable by Tab. */
  markTabIndex(group: number, datum: number): number {
    return this.isActive(group, datum) ? 0 : -1;
  }

  /**
   * Handle a keydown from the chart root or a mark.
   *
   * Returns true when the key was consumed, so the caller can
   * `preventDefault()`. Returns false for anything unhandled — including the
   * arrow keys while focus is on the chart root, so the page still scrolls when
   * the user has not drilled in.
   */
  handleKey(event: KeyboardEvent): boolean {
    // Let OS and browser shortcuts through untouched. Control and Shift are
    // deliberately absent: VoiceOver needs Control+Shift held with the arrows.
    if (event.altKey || event.metaKey) return false;

    const shape = this.shape();
    if (shape.groupCount === 0) return false;

    switch (event.key) {
      case 'Enter':
        return event.shiftKey ? this.drillUp() : this.drillDown();
      case 'ArrowRight':
        return this.moveDatum(1);
      case 'ArrowLeft':
        return this.moveDatum(-1);
      case 'ArrowDown':
        return this.moveGroup(1, shape);
      case 'ArrowUp':
        return this.moveGroup(-1, shape);
      case 'Escape':
        return this.dismissTooltip();
      default:
        return false;
    }
  }

  /** Drill from the chart root onto the first datum, raising the tooltip. */
  private drillDown(): boolean {
    if (this.level() === 'datum') {
      // Already on a datum — Enter re-raises the tooltip for it.
      this.tooltipOpen.set(true);
      return true;
    }

    // A series can be present but empty (every point null, or filtered out).
    // Land on the first group that actually has something to focus.
    const shape = this.shape();
    const first = shape.datumCounts.findIndex((count) => count > 0);
    if (first < 0) return false;

    this.groupIndex.set(first);
    this.datumIndex.set(0);
    this.level.set('datum');
    this.tooltipOpen.set(true);
    return true;
  }

  /** Drill back out to the chart root, dropping the tooltip. */
  private drillUp(): boolean {
    if (this.level() === 'chart') return false;
    this.level.set('chart');
    this.tooltipOpen.set(false);
    return true;
  }

  /**
   * Move along the current group. Clamps at both ends rather than wrapping —
   * silently jumping from the last datum back to the first is disorienting when
   * the only feedback is a screen reader.
   */
  private moveDatum(delta: 1 | -1): boolean {
    const active = this.active();
    if (active === null) return false;

    const count = this.shape().datumCounts[active.group] ?? 0;
    const next = clamp(active.datum + delta, count - 1);
    if (next === active.datum) return true;

    this.datumIndex.set(next);
    return true;
  }

  /**
   * Move across groups, holding the position along the group so the user tracks
   * the same x-position between series or the same column between rows.
   */
  private moveGroup(delta: 1 | -1, shape: ChartNavShape): boolean {
    if (!shape.crossGroup) return false;

    const active = this.active();
    if (active === null) return false;

    // Step over empty groups rather than landing on one and losing focus.
    let next = active.group;
    for (let i = active.group + delta; i >= 0 && i < shape.groupCount; i += delta) {
      if ((shape.datumCounts[i] ?? 0) > 0) {
        next = i;
        break;
      }
    }
    if (next === active.group) return true;

    this.groupIndex.set(next);
    this.datumIndex.set(
      clamp(active.datum, (shape.datumCounts[next] ?? 0) - 1),
    );
    return true;
  }

  private dismissTooltip(): boolean {
    if (!this.tooltipOpen()) return false;
    this.tooltipOpen.set(false);
    return true;
  }

  /** Send focus back to the chart root. Call when the data changes wholesale. */
  reset(): void {
    this.level.set('chart');
    this.tooltipOpen.set(false);
    this.groupIndex.set(0);
    this.datumIndex.set(0);
  }
}
