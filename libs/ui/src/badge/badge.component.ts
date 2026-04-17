import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
} from '@angular/core';
import {
  baseClasses,
  sizeClasses,
  intentClasses,
  dotIntentClasses,
} from './badge.variants';
import type { BadgeIntent, BadgeSize } from './badge.variants';

@Component({
  selector: 'afi-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (dot()) {
      <span
        [class]="dotClasses()"
        role="status"
        [attr.aria-label]="ariaLabel()"
      ></span>
    } @else {
      <span [class]="classes()" role="status">
        @if (icon()) {
          <span class="inline-flex shrink-0" aria-hidden="true">{{ icon() }}</span>
        }
        <ng-content />
      </span>
    }
  `,
})
export class BadgeComponent {
  readonly intent = input<BadgeIntent>('neutral');
  readonly size = input<BadgeSize>('md');
  readonly dot = input(false);
  readonly icon = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  protected readonly classes = computed(() =>
    [
      baseClasses,
      sizeClasses[this.size()],
      intentClasses[this.intent()],
    ].join(' '),
  );

  protected readonly dotClasses = computed(() =>
    ['inline-block w-2 h-2 rounded-full', dotIntentClasses[this.intent()]].join(' '),
  );
}
