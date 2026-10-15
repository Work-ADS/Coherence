import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  forwardRef,
  input,
} from '@angular/core';

import { AvatarComponent } from '../avatar/avatar.component';
import { AVATAR_GROUP } from '../avatar/avatar.token';
import type { AvatarGroupHost } from '../avatar/avatar.token';
import type { AvatarSize } from '../avatar/avatar.variants';

/**
 * AvatarGroup: overlapping avatars with a «+N» chip for the rest. Put
 * `afi-avatar` children inside; they take the group's size.
 *
 * ```html
 * <afi-avatar-group size="sm" [max]="3">
 *   <afi-avatar name="Ana López" />
 *   <afi-avatar name="Carlos Ruiz" />
 * </afi-avatar-group>
 * ```
 */
@Component({
  selector: 'afi-avatar-group',
  standalone: true,
  providers: [{ provide: AVATAR_GROUP, useExisting: forwardRef(() => AvatarGroupComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.scss'],
})
export class AvatarGroupComponent implements AvatarGroupHost {
  readonly size = input<AvatarSize>('md');
  /** Avatars shown before the «+N» chip. */
  readonly max = input<number>(4);
  /** Name for the group, e.g. «Participantes». */
  readonly ariaLabel = input<string | null>(null);

  private readonly avatars = contentChildren(AvatarComponent);

  /** How many avatars are folded into the chip. */
  readonly extra = computed(() => Math.max(0, this.avatars().length - this.max()));

  readonly chipClasses = computed(() => `avatar-group__more avatar-group__more--${this.size()}`);

  indexOf(avatar: object): number {
    return this.avatars().findIndex((a) => a === avatar);
  }

  isHidden(avatar: object): boolean {
    return this.indexOf(avatar) >= this.max();
  }
}
