import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { LogoSize, LogoVariant } from './logo.variants';

/**
 * Coherence logo — the AFI brand mark rendered as inline SVG so its fills
 * resolve against semantic color tokens (and `currentColor`) and adapt to
 * light/dark mode without swapping assets.
 *
 * Variants:
 * - `color` (default): symbol uses `--brand-mark-symbol` (afi-azul-500), wordmark
 *   inherits `currentColor` (flips with mode via body text color).
 * - `monochrome`: both symbol and wordmark inherit `currentColor`. Works on any
 *   surface — set `color` on a wrapper to force a specific tone.
 *
 * Shape:
 * - `showWordmark` (default `true`) toggles the "Afi" letterforms. When `false`,
 *   only the symbol renders and the viewBox tightens to the icon-only crop.
 * - `size` maps to a height token (sm/md/lg/xl → --dim-24/32/48/64).
 * - `href` wraps the SVG in an anchor when set; the anchor owns focus/hover/active.
 *
 * @example
 * ```html
 * <coherence-logo size="md" href="/" />
 * <coherence-logo variant="monochrome" [showWordmark]="false" size="sm" />
 * ```
 */
@Component({
  selector: 'coherence-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  /** Fill scheme — `color` keeps the symbol brand-blue; `monochrome` follows currentColor. */
  readonly variant = input<LogoVariant>('color');

  /** Display size — maps to `--dim-24/32/48/64` via BEM modifier. */
  readonly size = input<LogoSize>('md');

  /** Render the "Afi" wordmark next to the symbol. Toggle off for icon-only use. */
  readonly showWordmark = input<boolean>(true);

  /** When set, the logo is wrapped in an `<a>` and the anchor owns interactive states. */
  readonly href = input<string | null>(null);

  /** BEM class string driven by size + variant + wordmark presence. */
  readonly classes = computed(() => {
    const base = 'coherence-logo';
    const parts = [
      base,
      `${base}--${this.size()}`,
      `${base}--${this.variant()}`,
      this.showWordmark() ? `${base}--mark` : `${base}--icon`,
    ];
    return parts.join(' ');
  });

  /** Symbol fill — `currentColor` for monochrome, otherwise the brand-mark token. */
  readonly symbolFill = computed(() =>
    this.variant() === 'monochrome' ? 'currentColor' : 'var(--brand-mark-symbol)',
  );

  /** SVG viewBox switches between full wordmark crop and icon-only crop. */
  readonly viewBox = computed(() =>
    this.showWordmark() ? '0 0 95 32' : '50 6 45 26',
  );
}
