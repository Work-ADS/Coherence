import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  isDevMode,
  OnInit,
} from '@angular/core';

import {
  baseClasses,
  stateClasses,
  sizeClasses,
  InputSize,
  InputType,
} from './input.variants';

let nextId = 0;

/**
 * Form input primitive.
 *
 * Covers text / textarea / number / email / password via the `type` input.
 * Label, hint, and error are bundled in — the Input owns its a11y wiring.
 * All styling uses token-backed Tailwind classes (no hex/rgba/px).
 */
@Component({
  selector: 'afi-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label()) {
      <label [for]="inputId" class="block text-body-sm font-medium text-canvas-fg mb-space-1">
        {{ label() }}
        @if (required()) {
          <span class="text-system-error" aria-hidden="true"> *</span>
        }
      </label>
    }

    @if (type() === 'textarea') {
      <textarea
        [id]="inputId"
        [class]="classes()"
        [placeholder]="placeholder() ?? ''"
        [disabled]="disabled()"
        [readOnly]="readonly()"
        [attr.aria-required]="required() ? 'true' : null"
        [attr.aria-invalid]="error() ? 'true' : null"
        [attr.aria-describedby]="describedBy()"
        [attr.aria-label]="ariaLabel()"
        [value]="value() ?? ''"
        rows="4"
        (input)="onInput($event)"
        (focus)="focused.emit($event)"
        (blur)="blurred.emit($event)"
      ></textarea>
    } @else {
      <input
        [id]="inputId"
        [type]="type()"
        [class]="classes()"
        [placeholder]="placeholder() ?? ''"
        [disabled]="disabled()"
        [readOnly]="readonly()"
        [attr.aria-required]="required() ? 'true' : null"
        [attr.aria-invalid]="error() ? 'true' : null"
        [attr.aria-describedby]="describedBy()"
        [attr.aria-label]="ariaLabel()"
        [attr.autocomplete]="autocomplete()"
        [value]="value() ?? ''"
        (input)="onInput($event)"
        (focus)="focused.emit($event)"
        (blur)="blurred.emit($event)"
      />
    }

    @if (hint() && !error()) {
      <p [id]="hintId" class="mt-space-1 text-body-sm text-neutral-500">{{ hint() }}</p>
    }

    @if (error()) {
      <p [id]="errorId" class="mt-space-1 text-body-sm text-system-error" role="alert">{{ error() }}</p>
    }
  `,
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

  readonly classes = computed(() => {
    const state = this.error() ? 'error' : 'idle';
    return [
      baseClasses,
      stateClasses[state],
      this.type() !== 'textarea' ? sizeClasses[this.size()] : 'px-4 py-space-2 text-body-md',
    ]
      .filter(Boolean)
      .join(' ');
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
    const raw = target.value;
    this.valueChange.emit(this.type() === 'number' && raw !== '' ? Number(raw) : raw);
  }
}
