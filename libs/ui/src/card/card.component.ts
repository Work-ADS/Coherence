import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import { variantClasses, paddingClasses, CardVariant, CardPadding } from './card.variants';

/**
 * Card primitive.
 *
 * Low-opinion container for grouping related content.
 * Three slots: header, default (body), footer.
 * All styling uses token-backed Tailwind classes.
 */
@Component({
  selector: 'afi-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="containerClasses()"
      [attr.role]="interactive() ? 'button' : null"
      [attr.tabindex]="interactive() ? 0 : null"
      [attr.aria-label]="ariaLabel()"
      (click)="onClick($event)"
      (keydown.enter)="onKeydown($event)"
      (keydown.space)="onKeydown($event)"
    >
      <div class="border-b border-border-hairline px-space-4 py-space-3">
        <ng-content select="[slot=header]" />
      </div>
      <div [class]="bodyClasses()">
        <ng-content />
      </div>
      <div class="border-t border-border-hairline px-space-4 py-space-3">
        <ng-content select="[slot=footer]" />
      </div>
    </div>
  `,
})
export class CardComponent {
  readonly variant = input<CardVariant>('default');
  readonly padding = input<CardPadding>('md');
  readonly interactive = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly clicked = output<{ event: MouseEvent | KeyboardEvent }>();

  readonly containerClasses = computed(() => {
    return [
      'rounded-md overflow-hidden',
      variantClasses[this.variant()],
      this.interactive()
        ? 'cursor-pointer hover:shadow-md transition-shadow duration-fast ease-out ' +
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2'
        : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  readonly bodyClasses = computed(() => paddingClasses[this.padding()]);

  onClick(event: MouseEvent): void {
    if (!this.interactive()) return;
    this.clicked.emit({ event });
  }

  onKeydown(event: Event): void {
    if (!this.interactive()) return;
    (event as KeyboardEvent).preventDefault();
    this.clicked.emit({ event: event as unknown as MouseEvent });
  }
}
