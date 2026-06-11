import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';

import type { CardVariant, CardPadding } from './card.variants';

/**
 * Card primitive.
 *
 * Low-opinion container for grouping related content. Three slots:
 *   • [slot=header]  — top region (auto-collapsed when empty)
 *   • default        — body
 *   • [slot=footer]  — bottom region (auto-collapsed when empty)
 *
 * The host element IS the visual card surface. Surface tint (no border)
 * per Richard 2026-06-10. See card.component.scss for variant + padding
 * mappings to the token system.
 */
@Component({
  selector: 'afi-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  host: {
    '[class]': 'hostClasses()',
    '[attr.role]': "interactive() ? 'button' : null",
    '[attr.tabindex]': "interactive() ? 0 : null",
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class CardComponent {
  readonly variant = input<CardVariant>('default');
  readonly padding = input<CardPadding>('md');
  readonly interactive = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly clicked = output<{ event: MouseEvent | KeyboardEvent }>();

  protected readonly hostClasses = computed(() => {
    const parts = [
      'afi-card',
      `afi-card--${this.variant()}`,
      `afi-card--padding-${this.padding()}`,
    ];
    if (this.interactive()) parts.push('afi-card--interactive');
    return parts.join(' ');
  });

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (!this.interactive()) return;
    this.clicked.emit({ event: event as MouseEvent });
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeydown(event: Event): void {
    if (!this.interactive()) return;
    event.preventDefault();
    this.clicked.emit({ event: event as KeyboardEvent });
  }
}
