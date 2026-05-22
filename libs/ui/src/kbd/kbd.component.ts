import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { keyToSpokenName } from './kbd.labels';
import { separatorChars } from './kbd.variants';
import type { KbdSeparator, KbdSize } from './kbd.variants';

/**
 * Keyboard shortcut keycap primitive.
 *
 * Display-only — renders one or more `<kbd>` elements as keycaps.
 * No interaction, no focus, no key-chord registration.
 */
@Component({
  selector: 'afi-kbd',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kbd.component.html',
  styleUrls: ['./kbd.component.scss'],
})
export class KbdComponent {
  readonly keys = input.required<string[]>();
  readonly size = input<KbdSize>('sm');
  readonly separator = input<KbdSeparator>('none');
  readonly ariaLabel = input<string | null>(null);

  protected readonly rootClasses = computed(
    () => `kbd kbd--${this.size()}`,
  );

  protected readonly keyClasses = computed(
    () => `kbd__key kbd__key--${this.size()}`,
  );

  protected readonly separatorChar = computed(
    () => separatorChars[this.separator()],
  );

  protected readonly computedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const spoken = this.keys()
      .map((k) => keyToSpokenName(k))
      .join(' más ');
    return `Atajo de teclado: ${spoken}`;
  });
}
