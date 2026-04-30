import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  isDevMode,
  OnInit,
  effect,
  viewChild,
  ElementRef,
} from '@angular/core';

import { boxSizeClasses, CheckboxSize } from './checkbox.variants';

let nextId = 0;

/**
 * Checkbox primitive with Animate UI–style micro-animations.
 *
 * Uses a native `<input type="checkbox">` for maximum a11y.
 * Overlays an SVG checkmark with stroke-dashoffset draw animation
 * and a spring-like scale bounce on state change.
 * Supports `indeterminate` state (horizontal dash).
 * All motion respects `prefers-reduced-motion`.
 */
@Component({
  selector: 'afi-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    /* Checkmark path draw animation */
    .afi-check-path {
      stroke-dasharray: 22;
      stroke-dashoffset: 22;
      transition: stroke-dashoffset 200ms cubic-bezier(0.65, 0, 0.35, 1) 80ms;
    }
    .afi-check-path--visible {
      stroke-dashoffset: 0;
    }

    /* Indeterminate dash draw */
    .afi-dash-path {
      stroke-dasharray: 10;
      stroke-dashoffset: 10;
      transition: stroke-dashoffset 150ms cubic-bezier(0.65, 0, 0.35, 1) 80ms;
    }
    .afi-dash-path--visible {
      stroke-dashoffset: 0;
    }

    /* Spring-like scale bounce on the box */
    .afi-checkbox-box {
      transition:
        background-color 150ms ease-out,
        border-color 150ms ease-out,
        transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .afi-checkbox-box--pressed {
      transform: scale(0.9);
    }

    /* Reduced motion: collapse all transitions */
    @media (prefers-reduced-motion: reduce) {
      .afi-check-path,
      .afi-dash-path,
      .afi-checkbox-box {
        transition-duration: 0ms !important;
        transition-delay: 0ms !important;
      }
    }
  `,
  template: `
    <label [for]="checkboxId"
           [class]="compact() ? 'inline-flex items-center gap-1.5 cursor-pointer' : 'inline-flex items-start gap-space-2 min-h-[44px] min-w-[44px] cursor-pointer'"
           [class.opacity-50]="disabled()" [class.cursor-not-allowed]="disabled()">
      <span [class]="compact() ? 'relative flex items-center justify-center' : 'relative flex items-center justify-center min-h-[44px] min-w-[44px]'">
        <!-- Hidden native input for a11y -->
        <input
          #inputEl
          type="checkbox"
          [id]="checkboxId"
          [checked]="checked()"
          [disabled]="disabled()"
          [attr.aria-required]="required() ? 'true' : null"
          [attr.aria-invalid]="error() ? 'true' : null"
          [attr.aria-describedby]="describedBy()"
          [attr.aria-label]="!label() ? ariaLabel() : null"
          class="peer absolute w-0 h-0 opacity-0 pointer-events-none"
          (change)="onToggle($event)"
        />
        <!-- Custom visual box with animation -->
        <span [class]="boxClasses()">
          <!-- Checkmark SVG (visible when checked, not indeterminate) -->
          <svg
            [class]="svgSizeClass()"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            @if (!indeterminate()) {
              <path
                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="afi-check-path"
                [class.afi-check-path--visible]="checked()"
              />
            } @else {
              <line
                x1="4" y1="8" x2="12" y2="8"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                class="afi-dash-path"
                [class.afi-dash-path--visible]="indeterminate()"
              />
            }
          </svg>
        </span>
      </span>
      @if (label()) {
        <span [class]="compact() ? 'flex flex-col' : 'flex flex-col pt-[10px]'">
          <span [class]="compact() ? 'text-body-sm text-canvas-fg' : 'text-body-md text-canvas-fg'">
            {{ label() }}
            @if (required()) {
              <span class="text-system-error" aria-hidden="true"> *</span>
            }
          </span>
          @if (hint() && !error()) {
            <span [id]="hintId" class="text-body-sm text-neutral-500">{{ hint() }}</span>
          }
          @if (error()) {
            <span [id]="errorId" class="text-body-sm text-system-error" role="alert">{{ error() }}</span>
          }
        </span>
      }
    </label>
  `,
})
export class CheckboxComponent implements OnInit {
  readonly checked = input<boolean>(false);
  readonly indeterminate = input<boolean>(false);
  readonly size = input<CheckboxSize>('md');
  readonly compact = input<boolean>(false);
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly checkedChange = output<boolean>();

  readonly inputEl = viewChild.required<ElementRef<HTMLInputElement>>('inputEl');

  readonly checkboxId = `afi-checkbox-${nextId++}`;
  readonly hintId = `${this.checkboxId}-hint`;
  readonly errorId = `${this.checkboxId}-error`;

  /** SVG icon size matches box size */
  readonly svgSizeClass = computed(() => {
    return this.size() === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  });

  readonly boxClasses = computed(() => {
    const isChecked = this.checked();
    const isIndeterminate = this.indeterminate();
    const active = isChecked || isIndeterminate;
    const errorBorder = this.error() && !active;

    return [
      // Base layout
      'afi-checkbox-box',
      'absolute flex items-center justify-center rounded-sm border-2 cursor-pointer',
      // Focus ring on sibling input focus-visible
      'peer-focus-visible:ring-2 peer-focus-visible:ring-border-focus peer-focus-visible:ring-offset-2',
      // Size
      boxSizeClasses[this.size()],
      // Color states
      active ? 'bg-action border-action' : 'bg-surface border-border-hairline',
      errorBorder ? 'border-system-error' : '',
    ].filter(Boolean).join(' ');
  });

  readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this.hint() && !this.error()) ids.push(this.hintId);
    if (this.error()) ids.push(this.errorId);
    return ids.length > 0 ? ids.join(' ') : null;
  });

  constructor() {
    // Sync indeterminate DOM property via effect
    effect(() => {
      const el = this.inputEl()?.nativeElement;
      if (el) {
        el.indeterminate = this.indeterminate();
      }
    });
  }

  ngOnInit(): void {
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-checkbox] Checkbox "${this.checkboxId}" has neither label nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  onToggle(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checkedChange.emit(target.checked);
  }
}
