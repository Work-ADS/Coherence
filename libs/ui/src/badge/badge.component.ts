import { ChangeDetectionStrategy, Component, computed, input, isDevMode, OnInit } from '@angular/core';

import { IconComponent } from '../icon';
import type { IconName } from '../icon';

import type { BadgeIntent, BadgeSize, BadgeTone, BadgeVariant } from './badge.variants';

/**
 * Badge: a small label for counts, categories and metadata. For workflow
 * states use `afi-status-chip`.
 *
 * A badge is static text: it is not a live region (a table of badges must not
 * announce itself). Only the bare `dot` form carries a role, `img`, because it
 * has no text of its own and so needs `ariaLabel`.
 *
 * - `tone` sets the colour meaning; `intent` is the old name for it.
 * - `indicator` draws a leading dot inside the pill, in the badge's ink.
 * - `dot` renders a bare status dot instead of the pill.
 */
@Component({
  selector: 'afi-badge',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent implements OnInit {
  readonly tone = input<BadgeTone | null>(null);
  /** @deprecated Use `tone`. */
  readonly intent = input<BadgeIntent>('neutral');
  readonly variant = input<BadgeVariant>('soft');
  readonly size = input<BadgeSize>('md');
  /** A bare status dot instead of the pill. Needs `ariaLabel`. */
  readonly dot = input(false);
  /** A leading dot inside the pill. */
  readonly indicator = input(false);
  /** Glyph from the `afi-icon` set, before the label. */
  readonly icon = input<IconName | null>(null);
  readonly ariaLabel = input<string | null>(null);

  ngOnInit(): void {
    if (isDevMode() && this.dot() && !this.ariaLabel()) {
      console.warn(
        '[afi-badge] A bare dot has no text, so it needs an ariaLabel. Provide one for accessibility.',
      );
    }
  }

  protected readonly resolvedTone = computed<BadgeTone>(() => this.tone() ?? this.intent());

  protected readonly classes = computed(() => {
    const parts = ['afi-badge', `afi-badge--${this.resolvedTone()}`, `afi-badge--${this.size()}`];
    if (this.variant() !== 'soft') parts.push(`afi-badge--${this.variant()}`);
    return parts.join(' ');
  });

  protected readonly dotClasses = computed(
    () => `afi-badge afi-badge--dot afi-badge--${this.resolvedTone()}`,
  );
}
