import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  isDevMode,
  OnInit,
  output,
} from '@angular/core';

import type { InputV2Size, InputV2Type } from './input-v2.variants';

let nextId = 0;

/**
 * Form input — identity v2 (foundations-modern).
 *
 * Parallel primitive to `afi-input`; it consumes only `foundations-modern`
 * tokens, so it renders correctly only inside a `[data-foundation="modern"]`
 * scope. Legacy pages keep using `afi-input` untouched.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Input set (node 2383:5318),
 * captured 2026-07-13. The set has no gradient/effect-style layers, so — unlike
 * button-v2 — there is no hand-authored `component-input.scss`; every value
 * resolves to an existing semantic token.
 *
 * Anatomy mirrors Figma: label + field (text/icon prefix + control + icon/text
 * suffix) + help text (recoloured to the error message on error). Icon slots
 * project consumer content sized to `--icon-sm`.
 *
 * The Input owns its own a11y wiring: `<label for>`, `aria-describedby` for the
 * hint/error, `aria-invalid` on error, `aria-required` when required.
 */
@Component({
  selector: 'afi-input-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-v2.component.html',
  styleUrls: ['./input-v2.component.scss'],
})
export class InputV2Component implements OnInit {
  readonly type = input<InputV2Type>('text');
  readonly size = input<InputV2Size>('md');
  readonly value = input<string | null>(null);
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly placeholder = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly autocomplete = input<string | null>(null);
  readonly prefix = input<string | null>(null);
  readonly suffix = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  readonly valueChange = output<string>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  readonly inputId = `afi-input-v2-${nextId++}`;
  readonly hintId = `${this.inputId}-hint`;
  readonly errorId = `${this.inputId}-error`;

  readonly fieldClasses = computed(() => {
    const parts = ['afi-input-v2__field', `afi-input-v2__field--${this.size()}`];
    if (this.error()) parts.push('afi-input-v2__field--error');
    if (this.disabled()) parts.push('afi-input-v2__field--disabled');
    if (this.readonly()) parts.push('afi-input-v2__field--readonly');
    return parts.join(' ');
  });

  readonly describedBy = computed(() => {
    if (this.error()) return this.errorId;
    if (this.hint()) return this.hintId;
    return null;
  });

  ngOnInit(): void {
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-input-v2] Input "${this.inputId}" has neither label nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
