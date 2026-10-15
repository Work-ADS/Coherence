import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ICON_MILESTONE_SCALE, ICON_REGISTRY, ICON_STROKE_WIDTH } from './icon.registry';
import type { IconName } from './icon.registry';

/**
 * Decorative outline glyph from the DS icon set. Draws on a 24 grid at stroke
 * 1.75 in currentColor and inherits its size from `--afi-icon-size` (default
 * 1em), so the wrapping control decides size and ink. Always aria-hidden: the
 * control that hosts it carries the accessible name.
 */
@Component({
  selector: 'afi-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  readonly name = input.required<IconName>();

  protected readonly entry = computed(() => ICON_REGISTRY[this.name()] ?? null);
  protected readonly groupTransform = computed(() =>
    this.entry()?.milestone ? `scale(${ICON_MILESTONE_SCALE})` : null,
  );
  /** Milestone geometry is scaled up, so its stroke is divided back down to read at the set's weight. */
  protected readonly strokeWidth = computed(() =>
    this.entry()?.milestone ? ICON_STROKE_WIDTH / ICON_MILESTONE_SCALE : ICON_STROKE_WIDTH,
  );
}
