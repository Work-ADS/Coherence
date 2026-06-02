import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  isDevMode,
  OnInit,
  output,
} from '@angular/core';

import type { InputSize, InputType } from './input.variants';

let nextId = 0;

/**
 * Form input primitive.
 *
 * Covers text / textarea / number / email / password via the `type` input.
 * Label, hint, and error are bundled in — the Input owns its a11y wiring.
 * BEM + DS tokens via CSS custom properties; no Tailwind for visual styling.
 */
@Component({
  selector: 'afi-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  readonly type = input<InputType>('text');
  readonly size = input<InputSize>('md');
  readonly value = input<string | number | null>(null);
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly placeholder = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly autocomplete = input<string | null>(null);
  readonly iconStart = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  readonly valueChange = output<string | number | null>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  readonly inputId = `afi-input-${nextId++}`;
  readonly hintId = `${this.inputId}-hint`;
  readonly errorId = `${this.inputId}-error`;

  readonly fieldClasses = computed(() => {
    const parts = [
      'afi-input__field',
      `afi-input__field--${this.size()}`,
    ];
    if (this.type() === 'textarea') parts.push('afi-input__field--textarea');
    if (this.error()) parts.push('afi-input__field--error');
    return parts.join(' ');
  });

  readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this.hint() && !this.error()) ids.push(this.hintId);
    if (this.error()) ids.push(this.errorId);
    return ids.length > 0 ? ids.join(' ') : null;
  });

  ngOnInit(): void {
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-input] Input "${this.inputId}" has neither label nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    let raw = target.value;

    // Numeric input · spinner-from-empty seed.
    //
    // The browser's default is "empty + up-spinner = 1" / "empty + down-spinner = -1".
    // For year inputs (placeholder = 1975, 2010, …) that lands the user on `1`,
    // which is jarring. If the value was empty AND this is NOT a typed/pasted
    // event AND the placeholder parses as a 4+ digit number, seed with the
    // placeholder so the first spinner click lands on a sensible year.
    if (this.type() === 'number' && raw !== '') {
      const wasEmpty =
        this.value() === null || this.value() === '' || this.value() === undefined;
      const isTypedInput =
        event instanceof InputEvent &&
        (event.inputType === 'insertText' ||
          event.inputType === 'insertFromPaste' ||
          event.inputType === 'insertCompositionText');
      const newNum = Number(raw);
      const ph = parseInt(this.placeholder() ?? '', 10);

      if (
        wasEmpty &&
        !isTypedInput &&
        Number.isFinite(newNum) &&
        Math.abs(newNum) <= 9 &&
        Number.isFinite(ph) &&
        ph >= 1000
      ) {
        raw = String(ph);
        (target as HTMLInputElement).value = raw;
      }
    }

    this.valueChange.emit(
      this.type() === 'number' && raw !== '' ? Number(raw) : raw,
    );
  }

  /** Keyboard arrow seed — twin of the spinner-from-empty seed above. */
  onKeydown(event: KeyboardEvent): void {
    if (this.type() !== 'number') return;
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    const v = this.value();
    if (v !== null && v !== '' && v !== undefined) return;

    const ph = parseInt(this.placeholder() ?? '', 10);
    if (!Number.isFinite(ph) || ph < 1000) return;

    event.preventDefault();
    this.valueChange.emit(ph);
  }
}
