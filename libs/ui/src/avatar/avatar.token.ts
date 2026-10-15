import { InjectionToken, Signal } from '@angular/core';

import type { AvatarSize } from './avatar.variants';

/**
 * What an avatar needs from the group it sits in. A token (not the group
 * class) keeps avatar and group free of an import cycle.
 */
export interface AvatarGroupHost {
  readonly size: Signal<AvatarSize>;
  /** Position of an avatar among the group's avatars, or -1. */
  indexOf(avatar: object): number;
  /** Avatars past `max` are hidden; the group shows a «+N» chip for them. */
  isHidden(avatar: object): boolean;
}

export const AVATAR_GROUP = new InjectionToken<AvatarGroupHost>('AVATAR_GROUP');
