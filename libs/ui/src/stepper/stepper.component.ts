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
  StepperState,
} from './stepper.variants';

/**
 * Horizontal (or vertical) step indicator. Per-item state derives from
 * `current` (1-based) so consumers only have to push one signal.
 *
 * Visual states (LOCKED 2026-06-03):
 * - `done`     — filled action-coloured circle with check glyph; label
 *                muted; the connector entering this step renders in
 *                action-500 so completed segments read as a single trail.
 * - `current`  — filled action-coloured circle with the step number;
 *                label gains the body-md-500 weight; focus ring visible.
 * - `todo`     — outlined hairline circle with the step number in
 *                tertiary; label muted; button is `disabled` so the
 *                gestor can't jump ahead.
 *
 * Clicking a `done` step (or pressing Enter / Space when focused) emits
 * `stepClicked` with both the key and the 1-based index. Consumers decide
 * whether to navigate. `current` and `todo` are not interactive.
 *
 * A11y: a stepper is a header that says where you are, not navigation, so
 * the root is a labelled list (no landmark) and each step a list item; the
 * current item carries `aria-current="step"`. The marker is hidden from
 * assistive tech and the state is spoken by a visually hidden suffix
 * («, completado» / «, pendiente»; none on the current step). Only `done`
 * steps are buttons; `current` and `todo` are plain text. Reduced motion
 * collapses transitions per `docs/rules/component-skill.md` §11.
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
  /** 1-based index of the current step. Out-of-range values clamp at render time. */
  readonly current = input.required<number>();
  readonly orientation = input<StepperOrientation>('horizontal');
  /**
   * Per-item layout. `inline` (default) keeps badge + label on one line;
   * `stacked` centers the badge above the label per step. The BC datos
   * page uses `stacked` to match the official Sarevi Figma.
   */
  readonly layout = input<StepperLayout>('inline');
  readonly ariaLabel = input<string>('Pasos del flujo');

  readonly stepClicked = output<{ key: string; index: number }>();

  readonly rootClasses = computed(() =>
    `afi-stepper afi-stepper--${this.orientation()} afi-stepper--${this.layout()}`,
  );

  /** Per-item state. `index` is 1-based to match the user-facing labels. */
  stateFor(index: number): StepperState {
    const cur = this.current();
    if (index < cur) return 'done';
    if (index === cur) return 'current';
    return 'todo';
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
    return state === 'done';
  }

  /** Hidden text that speaks the state after the label. The current step has none. */
  spokenState(state: StepperState): string | null {
    if (state === 'done') return ', completado';
    if (state === 'todo') return ', pendiente';
    return null;
  }

  onClick(step: StepperItem, index: number, state: StepperState): void {
    if (state !== 'done') return;
    this.stepClicked.emit({ key: step.key, index });
  }
}
