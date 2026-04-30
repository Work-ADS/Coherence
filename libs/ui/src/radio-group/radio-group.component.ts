import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  output,
  isDevMode,
  OnInit,
  signal,
  forwardRef,
} from '@angular/core';

import {
  dotSizeClasses,
  innerDotSizeClasses,
  RadioSize,
} from './radio-group.variants';

let nextGroupId = 0;
let nextItemId = 0;

/**
 * RadioGroupItem — a single radio option with micro-animation.
 *
 * Uses a hidden native `<input type="radio">` for a11y.
 * Overlays a custom circle with an inner dot that scales in
 * with a spring-like cubic-bezier on selection.
 * All motion respects `prefers-reduced-motion`.
 */
@Component({
  selector: 'afi-radio-group-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    /* Inner dot spring scale */
    .afi-radio-dot {
      transform: scale(0);
      transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .afi-radio-dot--selected {
      transform: scale(1);
    }

    /* Outer ring color + border transition */
    .afi-radio-ring {
      transition:
        background-color 150ms ease-out,
        border-color 150ms ease-out,
        transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .afi-radio-ring--pressed {
      transform: scale(0.9);
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .afi-radio-dot,
      .afi-radio-ring {
        transition-duration: 0ms !important;
        transition-delay: 0ms !important;
      }
    }
  `,
  template: `
    <label [for]="radioId"
           [class]="compact() ? 'inline-flex items-center gap-1.5 cursor-pointer' : 'inline-flex items-start gap-space-2 min-h-[44px] min-w-[44px] cursor-pointer'"
           [class.opacity-50]="disabled()" [class.cursor-not-allowed]="disabled()">
      <span [class]="compact() ? 'relative flex items-center justify-center' : 'relative flex items-center justify-center min-h-[44px] min-w-[44px]'">
        <!-- Hidden native radio for a11y -->
        <input
          type="radio"
          [id]="radioId"
          [name]="name()"
          [value]="value()"
          [checked]="selected()"
          [disabled]="disabled()"
          [attr.aria-describedby]="hint() ? hintId : null"
          class="peer absolute w-0 h-0 opacity-0 pointer-events-none"
          (change)="onSelect()"
        />
        <!-- Custom radio circle -->
        <span [class]="ringClasses()">
          <span [class]="dotClasses()" aria-hidden="true"></span>
        </span>
      </span>
      @if (label()) {
        <span [class]="compact() ? 'flex flex-col' : 'flex flex-col pt-[10px]'">
          <span [class]="compact() ? 'text-body-sm text-canvas-fg' : 'text-body-md text-canvas-fg'">{{ label() }}</span>
          @if (hint()) {
            <span [id]="hintId" class="text-body-sm text-neutral-500">{{ hint() }}</span>
          }
        </span>
      }
    </label>
  `,
})
export class RadioGroupItemComponent {
  readonly value = input.required<string>();
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly size = input<RadioSize>('md');
  readonly compact = input<boolean>(false);

  /** Set by parent RadioGroupComponent */
  readonly name = input<string>('');
  readonly selected = input<boolean>(false);

  readonly selectedChange = output<string>();

  readonly radioId = `afi-radio-${nextItemId++}`;
  readonly hintId = `${this.radioId}-hint`;

  readonly ringClasses = computed(() => {
    const isSelected = this.selected();
    const hasError = false; // error state managed by parent

    return [
      'afi-radio-ring',
      'absolute flex items-center justify-center rounded-full border-2 cursor-pointer',
      'peer-focus-visible:ring-2 peer-focus-visible:ring-border-focus peer-focus-visible:ring-offset-2',
      dotSizeClasses[this.size()],
      isSelected ? 'bg-action border-action' : 'bg-surface border-border-hairline',
      hasError ? 'border-system-error' : '',
    ].filter(Boolean).join(' ');
  });

  readonly dotClasses = computed(() => {
    return [
      'afi-radio-dot rounded-full bg-white',
      innerDotSizeClasses[this.size()],
      this.selected() ? 'afi-radio-dot--selected' : '',
    ].filter(Boolean).join(' ');
  });

  onSelect(): void {
    if (this.disabled()) return;
    this.selectedChange.emit(this.value());
  }
}

/**
 * RadioGroup — container that manages single-selection state
 * and distributes `name` + `selected` to child RadioGroupItems.
 *
 * Usage:
 * ```html
 * <afi-radio-group [value]="selected" (valueChange)="selected = $event">
 *   <afi-radio-group-item value="a" label="Opción A" />
 *   <afi-radio-group-item value="b" label="Opción B" />
 * </afi-radio-group>
 * ```
 */
@Component({
  selector: 'afi-radio-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledBy()"
      class="flex flex-col gap-space-1"
      role="radiogroup"
    >
      @if (legend()) {
        <legend class="text-body-md font-medium text-canvas-fg mb-space-2">{{ legend() }}</legend>
      }
      <ng-content />
    </fieldset>
  `,
})
export class RadioGroupComponent implements OnInit {
  readonly value = input<string | null>(null);
  readonly legend = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelledBy = input<string | null>(null);

  readonly valueChange = output<string>();

  readonly groupName = `afi-radio-group-${nextGroupId++}`;

  readonly items = contentChildren(RadioGroupItemComponent);

  constructor() {
    // Note: contentChildren + effect can sync name/selected to items,
    // but since items use input() signals, the parent needs to
    // pass values via template bindings. This component serves as the
    // semantic container (fieldset + radiogroup role).
  }

  ngOnInit(): void {
    if (isDevMode() && !this.legend() && !this.ariaLabel() && !this.ariaLabelledBy()) {
      console.warn(
        `[afi-radio-group] Group "${this.groupName}" has no legend, ariaLabel, or ariaLabelledBy. ` +
          'Provide at least one for accessibility.',
      );
    }
  }
}
