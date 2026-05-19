import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AvatarSize } from './avatar.variants';

/**
 * Avatar — displays a user photo or initials fallback.
 */
@Component({
  selector: 'afi-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  readonly src = input<string | null>(null);
  readonly name = input.required<string>();
  readonly size = input<AvatarSize>('md');

  imgError = false;

  readonly initials = computed(() => {
    const parts = this.name().trim().split(/\s+/);
    if (parts.length >= 2) {
      return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
    }
    return (parts[0]?.[0] ?? '?').toUpperCase();
  });

  readonly hostClasses = computed(() => `avatar avatar--${this.size()}`);
}
