import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
} from '@angular/core';
import {
  rootBaseClasses,
  keyBaseClasses,
  sizeClasses,
  separatorChars,
} from './kbd.variants';
import type { KbdSize, KbdSeparator } from './kbd.variants';
import { keyToSpokenName } from './kbd.labels';

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
  template: `
    <span
      [class]="rootClasses()"
      [attr.aria-label]="computedAriaLabel()"
      role="group">
      @for (key of keys(); let last = $last; let i = $index; track i) {
        <kbd [class]="keyClasses()">{{ key }}</kbd>
        @if (!last && separator() !== 'none') {
          <span [class]="sepClasses()" aria-hidden="true">{{ separatorChar() }}</span>
        }
      }
    </span>
  `,
})
export class KbdComponent {
  readonly keys = input.required<string[]>();
  readonly size = input<KbdSize>('sm');
  readonly separator = input<KbdSeparator>('none');
  readonly ariaLabel = input<string | null>(null);

  protected readonly rootClasses = computed(() =>
    `${rootBaseClasses} ${sizeClasses[this.size()].root}`,
  );

  protected readonly keyClasses = computed(() =>
    `${keyBaseClasses} ${sizeClasses[this.size()].key}`,
  );

  protected readonly sepClasses = computed(() =>
    `text-neutral-400 ${sizeClasses[this.size()].root}`,
  );

  protected readonly separatorChar = computed(() =>
    separatorChars[this.separator()],
  );

  protected readonly computedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const spoken = this.keys().map(k => keyToSpokenName(k)).join(' más ');
    return `Atajo de teclado: ${spoken}`;
  });
}
