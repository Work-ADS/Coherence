import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import type { ButtonV2Size, ButtonV2Variant } from './button-v2.variants';

import { AFI_UI_COPY } from '../copy';

/**
 * Action button — identity v2 (foundations-modern).
 *
 * Parallel primitive to `afi-button`; it consumes only `foundations-modern`
 * tokens, so it renders correctly only inside a `[data-foundation="modern"]`
 * scope. Legacy pages keep using `afi-button` untouched.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Button set (node 2383:5319),
 * frozen 2026-07-13. Raised/pressed surfaces come from Figma effect styles
 * mirrored in `libs/tokens/foundations-modern/component-button.scss`.
 *
 * Icon-only usage is out of scope by design rule ("Icon-only actions → Icon
 * Button component") — always provide a visible label. Icons project through
 * `[slot=iconStart]` / `[slot=iconEnd]`; the consumer sizes the projected SVG
 * (typically to `--icon-sm`, or `--icon-xs` at size `xs`) and it inherits the
 * label colour via `currentColor`. The `.btn-v2__icon` wrapper only positions
 * the slot and carries the press nudge — it does not size its content, so an
 * unsized SVG collapses. (Same contract afi-tag-v2 documents.)
 */
@Component({
  selector: 'afi-button-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button-v2.component.html',
  styleUrls: ['./button-v2.component.scss'],
})
export class ButtonV2Component {

  /** Optional page-level chrome copy; per-instance inputs still win. */
  private readonly uiCopy = inject(AFI_UI_COPY, { optional: true });

  readonly variant = input<ButtonV2Variant>('primary');
  readonly size = input<ButtonV2Size>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);

  readonly loadingLabel = input<string | null>(null);
  readonly loadingLabelText = computed(
    () => this.loadingLabel() ?? this.uiCopy?.()?.loading ?? 'Cargando\u2026',
  );
  readonly fullWidth = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  /** Menu-trigger support: reflected as `aria-expanded` when non-null. */
  readonly ariaExpanded = input<boolean | null>(null);

  /** Menu-trigger support: reflected as `aria-haspopup` (e.g. `'menu'`). */
  readonly ariaHasPopup = input<string | null>(null);

  /** Disclosure-trigger support: reflected as `aria-controls` when non-null. */
  readonly ariaControls = input<string | null>(null);

  readonly clicked = output<{ event: MouseEvent }>();

  readonly classes = computed(() => {
    const parts = ['btn-v2', `btn-v2--${this.variant()}`, `btn-v2--${this.size()}`];
    if (this.fullWidth()) parts.push('btn-v2--full');
    if (this.loading()) parts.push('btn-v2--loading');
    return parts.join(' ');
  });

  onClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      return;
    }

    this.clicked.emit({ event });
  }
}
