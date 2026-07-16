import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Logo — identity v2 (foundations-modern).
 *
 * The Afi mark remade in code as inline SVG, traced from the Figma Logos node
 * so it can render at token-bound sizes instead of scaling a fixed asset. Two
 * shapes, mirroring the Figma component's `full` property:
 * - `full` (default): the "Afi" letterforms + the infinity mark.
 * - icon-only (`[full]="false"`): the infinity mark alone, for collapsed rails
 *   and compact chrome.
 *
 * Monochrome by design — the identity v2 direction drops the brand blue and
 * starts from black and white. Every path fills with `currentColor`, so the
 * logo renders `content/primary` (near-black) on light surfaces and flips to
 * `content/inverse` (white) when a parent sets that color. No color variants,
 * no per-brand fills.
 *
 * Consumes only `foundations-modern` tokens, so it renders correctly only
 * inside a `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Logos (2720:10147). The
 * drawing is `icon/md` tall (wordmark ~66 wide, mark ~35 wide, both from the
 * viewBox aspect) with `dimension-1` block padding — much smaller than the v1
 * `coherence-logo` sizes, which is why this is a separate v2 primitive rather
 * than a restyle.
 */
@Component({
  selector: 'afi-logo-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logo-v2.component.html',
  styleUrls: ['./logo-v2.component.scss'],
  host: { class: 'afi-logo-v2' },
})
export class LogoV2Component {
  /** Render the "Afi" letterforms next to the mark. `false` → mark only. */
  readonly full = input<boolean>(true);

  /** SVG viewBox switches between the full-lockup crop and the mark-only crop. */
  readonly viewBox = computed(() =>
    this.full() ? '0 0 65.8649 20.2882' : '0 0 34.6047 20.0479',
  );
}
