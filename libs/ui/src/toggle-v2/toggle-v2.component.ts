import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  isDevMode,
  model,
  OnInit,
} from '@angular/core';

let nextId = 0;

/**
 * Toggle — identity v2 (foundations-modern).
 *
 * Parallel primitive to the legacy `afi-switch`; consumes only
 * `foundations-modern` tokens, so it renders correctly only inside a
 * `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: Toggle set (2568:2478) + documentation (2587:2500).
 *
 * Shape (Documentation "Usage rules"):
 *  - Applies INSTANTLY — the state change lands the moment the user flips it.
 *    If a Save/Confirm step is needed, use a Checkbox in a form instead.
 *  - Fixed size: one track/thumb for every context (no sm/md/lg). Settings rows
 *    read better with a consistent control width, and no compact/large variant
 *    has surfaced.
 *  - Label sits LEFT of the control (settings-row / key→value convention), the
 *    opposite of Checkbox.
 *  - Strictly binary. Mutually-exclusive multi-option choices are Segmented
 *    Control, not a stack of toggles.
 *
 * `checked` is a `model()` so it self-updates on flip and supports `[(checked)]`;
 * consumers can also listen to the implicit `checkedChange` output.
 *
 * A11y: `<button role="switch">` inside the `<label>` so clicking the label text
 * flips the control and the visible label names it. `aria-checked` mirrors the
 * state. The 36×20 track is a dense-desktop touch-target opt-out (settings rows,
 * not touch-first surfaces); `label`/`ariaLabel` supplies the accessible name.
 */
@Component({
  selector: 'afi-toggle-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toggle-v2.component.html',
  styleUrls: ['./toggle-v2.component.scss'],
})
export class ToggleV2Component implements OnInit {
  readonly checked = model<boolean>(false);
  readonly label = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly toggleId = `afi-toggle-v2-${nextId++}`;

  readonly rootClasses = computed(() => {
    const parts = ['afi-toggle-v2'];
    if (this.disabled()) parts.push('afi-toggle-v2--disabled');
    return parts.join(' ');
  });

  readonly trackClasses = computed(() => {
    const parts = ['afi-toggle-v2__track'];
    if (this.checked()) parts.push('afi-toggle-v2__track--on');
    return parts.join(' ');
  });

  ngOnInit(): void {
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-toggle-v2] Toggle "${this.toggleId}" has neither label nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  onToggle(): void {
    if (this.disabled()) return;
    this.checked.set(!this.checked());
  }
}
