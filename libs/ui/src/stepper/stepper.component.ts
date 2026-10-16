import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import type {
  StepperItem,
  StepperLayout,
  StepperOrientation,
  StepperSize,
  StepperState,
} from './stepper.variants';

/**
 * Step indicator: numbered markers, optionally joined by connectors. Per-item
 * state derives from `current` (1-based) or `currentIndex` (0-based) so
 * consumers push one signal; an item's own `state` overrides it.
 *
 * Visual states:
 * - `done`    — filled action-coloured marker with a check; label secondary;
 *               the connector after it is inked so completed segments read as
 *               one trail.
 * - `current` — a ring (surface fill, thick action-coloured border, brand
 *               number); label 600 in primary ink.
 * - `todo`    — subtle fill with a hairline and the number in tertiary.
 *
 * Layouts: `inline` (marker beside label, with connectors), `stacked` (marker
 * above label, used by the BC datos page), `plain` (beside label, no
 * connectors, left-aligned, wraps). `size="compact"` shrinks the markers.
 *
 * Clicking a `done` step emits `stepClicked` with its key and 1-based index
 * unless `interactive` is false. `current` and `todo` are never interactive.
 *
 * A11y: a stepper is a header that says where you are, not navigation, so
 * the root is a labelled list (no landmark) and each step a list item; the
 * current item carries `aria-current="step"`. The marker is hidden from
 * assistive tech and the state is spoken by a visually hidden suffix
 * («, completado» / «, pendiente»; none on the current step). Only `done`
 * steps are buttons (when interactive); `current` and `todo` are plain text.
 * Keys must be unique within `steps`. Reduced motion collapses transitions per
 * `docs/rules/component-skill.md` §11.
 */
@Component({
  selector: 'afi-stepper',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
  readonly steps = input.required<StepperItem[]>();
  /** 1-based index of the current step. Give this or `currentIndex`. */
  readonly current = input<number | null>(null);
  /** 0-based index of the current step (the zip's convention). Wins over `current`. */
  readonly currentIndex = input<number | null>(null);
  /** `md` markers or `compact`, the smaller ones for flows embedded in a page. */
  readonly size = input<StepperSize>('md');
  /**
   * Whether done steps are buttons. Unset (true) they are, and `stepClicked`
   * fires. Turn it off for a header that only states where you are.
   */
  readonly interactive = input<boolean>(true);
  readonly orientation = input<StepperOrientation>('horizontal');
  /**
   * Per-item layout. `inline` (default) keeps badge + label on one line;
   * `stacked` centers the badge above the label per step. The BC datos
   * page uses `stacked` to match the official Sarevi Figma.
   */
  readonly layout = input<StepperLayout>('inline');
  readonly ariaLabel = input<string>('Pasos del flujo');

  readonly stepClicked = output<{ key: string; index: number }>();

  readonly rootClasses = computed(
    () =>
      `afi-stepper afi-stepper--${this.orientation()} afi-stepper--${this.layout()}` +
      (this.size() === 'compact' ? ' afi-stepper--compact' : ''),
  );

  /** The current step, 1-based, whichever input the consumer used. */
  private readonly currentOneBased = computed(() => {
    const zero = this.currentIndex();
    if (zero !== null) return zero + 1;
    return this.current() ?? 0;
  });

  /** Per-item state. `index` is 1-based to match the user-facing labels. */
  stateFor(index: number, step?: StepperItem): StepperState {
    if (step?.state) return step.state;
    const cur = this.currentOneBased();
    if (index < cur) return 'done';
    if (index === cur) return 'current';
    return 'todo';
  }

  /** Stable key of a step: its own, else its position. */
  keyOf(step: StepperItem, index: number): string {
    return step.key ?? String(index);
  }

  itemClasses(state: StepperState): string {
    return `afi-stepper__item afi-stepper__item--${state}`;
  }

  /**
   * The connector AFTER a step renders in the action colour iff that step
   * is `done` — i.e. the gestor has completed it. Connectors between
   * todo / current segments stay in the muted hairline tint.
   */
  connectorClasses(precedingState: StepperState): string {
    const filled = precedingState === 'done';
    return `afi-stepper__connector afi-stepper__connector--${filled ? 'filled' : 'muted'}`;
  }

  /** A "done" step is the only interactive one; the others are plain text, not buttons. */
  isInteractive(state: StepperState): boolean {
    return this.interactive() && state === 'done';
  }

  /** Hidden text that speaks the state after the label. The current step has none. */
  spokenState(state: StepperState): string | null {
    if (state === 'done') return ', completado';
    if (state === 'todo') return ', pendiente';
    return null;
  }

  onClick(step: StepperItem, index: number, state: StepperState): void {
    if (!this.isInteractive(state)) return;
    this.stepClicked.emit({ key: this.keyOf(step, index), index });
  }
}
