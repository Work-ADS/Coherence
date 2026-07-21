import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  isDevMode,
  model,
  OnInit,
} from '@angular/core';

let nextGroupId = 0;

/**
 * Radio group — identity v2 (foundations-modern).
 *
 * Container that owns single-selection for a set of projected `<afi-radio-v2>`
 * children. It is the single source of truth: it holds the group `value`,
 * assigns the shared `name`, and each child reads its selected state back from
 * this group (pull, not push) — so there is no imperative state sync to keep
 * aligned. Consumes only `foundations-modern` tokens, so it renders correctly
 * only inside a `[data-foundation="modern"]` scope.
 *
 * Keyboard: because every child radio is a real `<input type="radio">` sharing
 * this group's `name`, the browser's native radio-group behaviour supplies the
 * whole keyboard contract — Arrow Up/Left and Down/Right move focus AND selection
 * to the adjacent enabled radio (wrapping, skipping disabled ones), roving
 * tabindex keeps a single stop in the tab order, and Space selects. This matches
 * the spec's keyboard requirement natively; a hand-rolled keydown handler would
 * double-fire against the platform and is deliberately omitted (accessibility.md
 * §1 "semantic HTML first — the browser owns keyboard semantics").
 *
 * A11y: renders a `<fieldset role="radiogroup">`; provide a `legend` (visible) or
 * `ariaLabel` (invisible) to name the group.
 *
 * `value` is a `model()` so it self-updates on selection and supports
 * `[(value)]`; consumers can also listen to the implicit `valueChange`.
 */
@Component({
  selector: 'afi-radio-group-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-group-v2.component.html',
  styleUrls: ['./radio-group-v2.component.scss'],
})
export class RadioGroupV2Component implements OnInit {
  /** Controlled + self-updating selected value; `null` means nothing selected. */
  readonly value = model<string | null>(null);

  /** Shared radio-group name. Falls back to a generated one when unset. */
  readonly name = input<string | null>(null);

  /** Visible group label rendered as the fieldset legend. */
  readonly legend = input<string | null>(null);

  /** Invisible group label, used when there is no visible legend. */
  readonly ariaLabel = input<string | null>(null);

  /** Disables every radio in the group. */
  readonly disabled = input<boolean>(false);

  /** `vertical` (default) stacks options; `horizontal` lays them in a wrapping row. */
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');

  private readonly generatedName = `afi-radio-group-v2-${nextGroupId++}`;

  readonly resolvedName = computed(() => this.name() ?? this.generatedName);

  readonly rootClasses = computed(() => {
    const parts = ['afi-radio-group-v2'];
    if (this.orientation() === 'horizontal') {
      parts.push('afi-radio-group-v2--horizontal');
    }
    return parts.join(' ');
  });

  ngOnInit(): void {
    if (isDevMode() && !this.legend() && !this.ariaLabel()) {
      console.warn(
        `[afi-radio-group-v2] Group "${this.generatedName}" has neither legend nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  /** Called by a child radio when the user picks it. */
  select(value: string): void {
    if (this.disabled()) return;
    this.value.set(value);
  }
}
