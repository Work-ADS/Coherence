import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';

import type { CardElevation, CardPadding, CardVariant } from './card.variants';

/**
 * Card primitive.
 *
 * Low-opinion container for grouping related content. Three slots:
 *   • [slot=header]  — top region (auto-collapsed when empty)
 *   • default        — body
 *   • [slot=footer]  — bottom region (auto-collapsed when empty)
 *
 * `eyebrow` and `title` draw a standard header; `[slot=actions]` sits at its
 * right edge. Body padding: the zip's default (24) is `padding="lg"`, its
 * `tight` (16) is `padding="md"`.
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
  /** A hairline border and the section radius (a card standing on its own). */
  readonly bordered = input<boolean>(false);
  readonly elevation = input<CardElevation>('default');
  readonly eyebrow = input<string | null>(null);
  readonly title = input<string | null>(null);
  readonly interactive = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly clicked = output<{ event: MouseEvent | KeyboardEvent }>();

  protected readonly titled = computed(() => !!this.eyebrow() || !!this.title());

  protected readonly hostClasses = computed(() => {
    const parts = [
      'afi-card',
      `afi-card--${this.variant()}`,
      `afi-card--padding-${this.padding()}`,
    ];
    if (this.bordered()) parts.push('afi-card--bordered');
    if (this.elevation() === 'on-brand') parts.push('afi-card--on-brand');
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
