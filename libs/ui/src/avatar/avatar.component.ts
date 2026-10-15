import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { AVATAR_GROUP } from './avatar.token';
import type { AvatarSize } from './avatar.variants';

/**
 * Avatar: a user photo or an initials fallback.
 *
 * Inside an `afi-avatar-group` it takes the group's size, overlaps its
 * neighbour and hides itself once the group's `max` is passed.
 */
@Component({
  selector: 'afi-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  host: { '[hidden]': 'hidden()' },
})
export class AvatarComponent {
  private readonly group = inject(AVATAR_GROUP, { optional: true });

  readonly src = input<string | null>(null);
  readonly name = input.required<string>();
  /** Own size; inside a group the group's size applies when this is unset. */
  readonly size = input<AvatarSize | null>(null);
  /** Rounded square (card radius) instead of a circle, for organisations. */
  readonly square = input<boolean>(false);
  /** Grey fill instead of the action tint. */
  readonly neutral = input<boolean>(false);

  imgError = false;

  readonly resolvedSize = computed<AvatarSize>(() => this.size() ?? this.group?.size() ?? 'md');

  /** Two initials: first and last name, or the first two letters of a single name. */
  readonly initials = computed(() => {
    const parts = this.name().trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
    }
    const single = parts[0] ?? '';
    return single.length > 0 ? single.slice(0, 2).toUpperCase() : '?';
  });

  protected readonly hidden = computed(() => (this.group ? this.group.isHidden(this) : false));

  readonly hostClasses = computed(() => {
    const parts = ['avatar', `avatar--${this.resolvedSize()}`];
    if (this.square()) parts.push('avatar--square');
    if (this.neutral()) parts.push('avatar--neutral');
    if (this.group) {
      parts.push('avatar--grouped');
      if (this.group.indexOf(this) > 0) parts.push('avatar--stacked');
    }
    return parts.join(' ');
  });
}
