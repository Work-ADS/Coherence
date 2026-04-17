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
  trackSizeClasses,
  thumbSizeClasses,
  thumbTranslateClasses,
  SwitchSize,
} from './switch.variants';

let nextId = 0;

/**
 * Switch primitive.
 *
 * Uses `<button role="switch">` for correct SR announcement.
 * Thumb slides with 150ms transition; respects `prefers-reduced-motion`.
 */
@Component({
  selector: 'afi-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="inline-flex items-center gap-space-2 min-h-[44px] cursor-pointer"
           [class.opacity-50]="disabled()" [class.cursor-not-allowed]="disabled()">
      <button
        type="button"
        role="switch"
        [id]="switchId"
        [attr.aria-checked]="checked()"
        [attr.aria-label]="!label() ? ariaLabel() : null"
        [attr.aria-describedby]="describedBy()"
        [disabled]="disabled()"
        [class]="trackClasses()"
        (click)="onToggle()"
        (keydown.space)="onToggle(); $event.preventDefault()"
      >
        <span [class]="thumbClasses()" aria-hidden="true"></span>
      </button>
      @if (label()) {
        <span class="flex flex-col">
          <span class="text-body-md text-canvas-fg">{{ label() }}</span>
          @if (hint()) {
            <span [id]="hintId" class="text-body-sm text-neutral-500">{{ hint() }}</span>
          }
        </span>
      }
    </label>
  `,
})
export class SwitchComponent implements OnInit {
  readonly checked = input<boolean>(false);
  readonly size = input<SwitchSize>('md');
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly checkedChange = output<boolean>();

  readonly switchId = `afi-switch-${nextId++}`;
  readonly hintId = `${this.switchId}-hint`;

  readonly describedBy = computed(() => {
    return this.hint() ? this.hintId : null;
  });

  readonly trackClasses = computed(() => {
    const on = this.checked();
    return [
      'relative inline-flex items-center rounded-full',
      'transition-colors duration-150 ease-out motion-reduce:duration-[0ms]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed',
      trackSizeClasses[this.size()],
      on ? 'bg-action' : 'bg-neutral-300',
    ].join(' ');
  });

  readonly thumbClasses = computed(() => {
    const on = this.checked();
    const sz = this.size();
    return [
      'inline-block rounded-full bg-white shadow-sm',
      'transform transition-transform duration-150 ease-out motion-reduce:duration-[0ms]',
      thumbSizeClasses[sz],
      on ? thumbTranslateClasses[sz] : 'translate-x-0.5',
    ].join(' ');
  });

  ngOnInit(): void {
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-switch] Switch "${this.switchId}" has neither label nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  onToggle(): void {
    if (this.disabled()) return;
    this.checkedChange.emit(!this.checked());
  }
}
