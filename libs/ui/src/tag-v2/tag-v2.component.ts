import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { TagV2Kind } from './tag-v2.variants';

/**
 * Tag — identity v2 (foundations-modern).
 *
 * Passive metadata pill: communicates classification or system origin. It
 * carries no state and triggers no action — not a Chip (selection / removal),
 * not a Badge (status). Consumes only `foundations-modern` tokens, so it
 * renders correctly only inside a `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: Tag set (2593:2587) — 2 kinds (Category / System) ×
 * icon off/on. Fixed height-component-xs; no size variants (Figma's explicit
 * "Fixed size" decision — Tag is compact passive metadata with no product
 * evidence requiring multiple sizes).
 *
 * Kinds:
 *  - `category` — asset-class / taxonomy labels (Renta fija, Alternativos):
 *    solid neutral fill, primary text, no boundary.
 *  - `system`   — platform-origin metadata (Beta, Imported): surface fill with
 *    a dashed boundary, secondary text.
 *
 * Icon: optional, decorative, projected through `[slot=iconStart]` and sized by the
 * consumer to `--icon-sm` (mirrors afi-button-v2's icon slots). It inherits the
 * label colour via `currentColor`. Projected icons must be `aria-hidden="true"`.
 *
 * A11y: a non-interactive `<span>` whose visible label is the accessible name.
 * No `role` — Tag is static classification, not a live status region, so it must
 * not announce as one.
 */
@Component({
  selector: 'afi-tag-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tag-v2.component.html',
  styleUrls: ['./tag-v2.component.scss'],
})
export class TagV2Component {
  readonly kind = input<TagV2Kind>('category');
  readonly label = input.required<string>();

  readonly classes = computed(() => `afi-tag-v2 afi-tag-v2--${this.kind()}`);
}
