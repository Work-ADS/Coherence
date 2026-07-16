import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import type { IconButtonV2Size, IconButtonV2Variant } from './icon-button-v2.variants';

/**
 * Icon Button — identity v2 (foundations-modern).
 *
 * A square, icon-only interactive button: the icon-only sibling of
 * `afi-button-v2`, which excludes icon-only usage by design rule. Consumes only
 * `foundations-modern` tokens, so it renders correctly only inside a
 * `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Icon Button (2818:5969),
 * documented at 2806:5380. It shares the Button set's raised/pressed chrome —
 * the same `--button-sheen`, `--button-raised-*` and `--button-pressed-*`
 * effect-style tokens (`libs/tokens/foundations-modern/component-button.scss`)
 * — differing only in being a fixed square with a centered icon and no label.
 *
 * Variants: Primary | Secondary | Ghost | Destructive (same recipe as the
 * button). Sizes (box / icon, in --height-component-* / --icon-* tokens): SM
 * (sm box, sm icon) · MD (md box, md icon) · LG (lg box, md icon).
 *
 * The icon is projected via the default `<ng-content>` — following the v2 house
 * pattern (chip-v2 / button-v2), the component owns the box and the icon colour
 * (via `currentColor`) while the consumer supplies an SVG sized to the icon
 * token. The `__icon` wrapper carries a sized box (`--icon-sm` / `--icon-md`)
 * so a `width/height:100%` SVG fits exactly.
 *
 * A11y: `ariaLabel` is REQUIRED — an icon-only button has no visible text, so a
 * label describing the action is mandatory for assistive tech (Figma usage
 * rule). `ariaExpanded` / `ariaHasPopup` are provided for menu-trigger usage
 * (e.g. the table's overflow "⋯" control). Focus uses the shared v2 button
 * focus ring (`--borders-focus` outline), never the UA default. Consumers
 * should pair the button with a tooltip for sighted users.
 *
 * Focus treatment note: matches `afi-button-v2` (a token-bound `outline`), not
 * the Figma doc's shadow-pair ring, so the two button primitives stay visually
 * consistent. Revisit if the shadow-pair becomes the house focus standard.
 */
@Component({
  selector: 'afi-icon-button-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-button-v2.component.html',
  styleUrls: ['./icon-button-v2.component.scss'],
})
export class IconButtonV2Component {
  readonly variant = input<IconButtonV2Variant>('primary');
  readonly size = input<IconButtonV2Size>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input<boolean>(false);

  /** REQUIRED — describes the action for assistive tech (no visible label). */
  readonly ariaLabel = input.required<string>();

  /** Menu-trigger support: reflected as `aria-expanded` when non-null. */
  readonly ariaExpanded = input<boolean | null>(null);

  /** Menu-trigger support: reflected as `aria-haspopup` (e.g. `'menu'`). */
  readonly ariaHasPopup = input<string | null>(null);

  readonly clicked = output<{ event: MouseEvent }>();

  readonly classes = computed(() =>
    [
      'afi-icon-button-v2',
      `afi-icon-button-v2--${this.variant()}`,
      `afi-icon-button-v2--${this.size()}`,
    ].join(' '),
  );

  onClick(event: MouseEvent): void {
    if (this.disabled()) {
      return;
    }

    this.clicked.emit({ event });
  }
}
