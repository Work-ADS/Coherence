import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  isDevMode,
  OnInit,
  output,
} from '@angular/core';

import type { SwitchSize } from './switch.variants';

let nextId = 0;

/**
 * Switch primitive.
 *
 * Uses `<button role="switch">` for correct SR announcement.
 * Thumb slides with a transition that respects `prefers-reduced-motion`.
 */
@Component({
  selector: 'afi-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent implements OnInit {
  readonly checked = input<boolean>(false);
  readonly size = input<SwitchSize>('md');
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly checkedChange = output<boolean>();

  readonly switchId = `afi-switch-${nextId++}`;
  readonly hintId = `${this.switchId}-hint`;

  readonly describedBy = computed(() => (this.hint() ? this.hintId : null));

  readonly rootClasses = computed(() => {
    const parts = ['afi-switch', `afi-switch--${this.size()}`];
    if (this.disabled()) parts.push('afi-switch--disabled');
    return parts.join(' ');
  });

  readonly trackClasses = computed(() => {
    const parts = ['afi-switch__track', `afi-switch__track--${this.size()}`];
    if (this.checked()) parts.push('afi-switch__track--on');
    return parts.join(' ');
  });

  readonly thumbClasses = computed(() => {
    const parts = ['afi-switch__thumb', `afi-switch__thumb--${this.size()}`];
    if (this.checked()) parts.push('afi-switch__thumb--on');
    return parts.join(' ');
  });

  ngOnInit(): void {
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-switch] Switch "${this.switchId}" has neither label nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  onToggle(): void {
    if (this.disabled()) return;
    this.checkedChange.emit(!this.checked());
  }
}
