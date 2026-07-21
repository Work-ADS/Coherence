import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  isDevMode,
  model,
  OnInit,
} from '@angular/core';

import { RadioGroupV2Component } from '../radio-group-v2/radio-group-v2.component';

let nextId = 0;

/**
 * Radio — identity v2 (foundations-modern).
 *
 * Single-select sibling of `afi-checkbox-v2`: the same filled-brand treatment
 * with an inverse mark, one fixed size, an inside stroke on every state, one
 * outside focus ring — but circular, and with an inner dot instead of a check.
 * Consumes only `foundations-modern` tokens, so it renders correctly only inside
 * a `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: Radio set (2956:5911) — Selected (False/True) × State
 * (Default/Hover/Focus/Pressed/Disabled). Fixed 16×16 ring; label sits RIGHT of
 * the control (the control-label convention it shares with Checkbox). Unlike the
 * checkbox — whose empty box stays `background/canvas` — the radio's empty ring
 * fill shifts per state through `control/background/*` (verified per-variant in
 * Figma); the selected ring is the brand fill.
 *
 * Shape: like Checkbox, Radio is a FORM control — the value is staged, not
 * applied instantly (use it where a Save/Confirm step gathers the value). Radios
 * belong to a group: drop them inside `<afi-radio-group-v2>` and the group owns
 * the single-selection `value`, the shared `name`, and the accessible grouping.
 * A radio may also stand alone (its own `name` + two-way `[(selected)]`), but the
 * grouped form is the intended one.
 *
 * A11y: a real (visually-hidden) `<input type="radio">` inside the `<label>`, so
 * clicking the label text selects the option and the browser owns keyboard, focus
 * roving, and screen-reader semantics. When the radios share a `name` (the group
 * assigns one), native radio-group behaviour supplies arrow-key navigation
 * (move + select, wrapping, skipping disabled), roving tabindex, and Space to
 * select — exactly the spec's keyboard contract, without a hand-rolled handler
 * that would double-fire against the platform. The 16×16 ring in a
 * `height-component-md` row is a dense-desktop touch-target opt-out (form rows,
 * not touch-first surfaces); the whole label row is the hit area, and
 * `label`/`ariaLabel` supplies the accessible name.
 */
@Component({
  selector: 'afi-radio-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-v2.component.html',
  styleUrls: ['./radio-v2.component.scss'],
})
export class RadioV2Component implements OnInit {
  /** The value this radio contributes to its group's selection. */
  readonly value = input.required<string>();

  /** Standalone selection (two-way). Ignored when inside a group — the group wins. */
  readonly selected = model<boolean>(false);

  readonly disabled = input<boolean>(false);
  readonly label = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  /** Standalone group name. Ignored when inside a group — the group assigns one. */
  readonly name = input<string | null>(null);

  private readonly group = inject<RadioGroupV2Component | null>(
    forwardRef(() => RadioGroupV2Component),
    { optional: true },
  );

  readonly radioId = `afi-radio-v2-${nextId++}`;

  /** Group wins over the standalone name so native radio grouping stays intact. */
  readonly resolvedName = computed(
    () => this.group?.resolvedName() ?? this.name() ?? this.radioId,
  );

  /** Checked from the group's `value`, or the standalone model when ungrouped. */
  readonly resolvedChecked = computed(() =>
    this.group ? this.group.value() === this.value() : this.selected(),
  );

  readonly resolvedDisabled = computed(
    () => this.disabled() || (this.group?.disabled() ?? false),
  );

  readonly rootClasses = computed(() => {
    const parts = ['afi-radio-v2'];
    if (this.resolvedDisabled()) parts.push('afi-radio-v2--disabled');
    return parts.join(' ');
  });

  readonly ringClasses = computed(() => {
    const parts = ['afi-radio-v2__ring'];
    if (this.resolvedChecked()) parts.push('afi-radio-v2__ring--selected');
    return parts.join(' ');
  });

  ngOnInit(): void {
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-radio-v2] Radio "${this.radioId}" has neither label nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  onSelect(event: Event): void {
    if (this.resolvedDisabled()) return;
    if (this.group) {
      this.group.select(this.value());
    } else {
      this.selected.set((event.target as HTMLInputElement).checked);
    }
  }
}
