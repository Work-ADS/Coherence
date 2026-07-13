import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Menu panel — identity v2 (foundations-modern).
 *
 * The surface that wraps a stack of `afi-menu-item-v2` rows (and optional
 * `afi-menu-divider-v2` separators). Consumes only `foundations-modern` tokens,
 * so it renders correctly only inside a `[data-foundation="modern"]` scope.
 * Legacy pages keep using `afi-menu` untouched.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Menu (node 2405:1935).
 * Anatomy: surface fill · hairline border · xl radius · elevation-2 shadow ·
 * dimension-1 padding · gap-menu-item between rows.
 *
 * Presentational panel only. Overlay behaviour — open/close, anchored
 * positioning, roving arrow-key focus — lands in a later pass; the projected
 * items are native `<button>`s, so Tab already reaches them. The host carries
 * `role="menu"`; pass `ariaLabel` to name the menu for assistive tech.
 */
@Component({
  selector: 'afi-menu-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': 'role()',
    'aria-orientation': 'vertical',
    '[attr.aria-label]': 'ariaLabel()',
  },
  templateUrl: './menu-v2.component.html',
  styleUrls: ['./menu-v2.component.scss'],
})
export class MenuV2Component {
  /**
   * ARIA role the panel carries. `menu` for a context/action menu (rows are
   * `menuitem`); `listbox` when the panel is a Select's dropdown (rows are
   * `option`). The consuming widget owns focus/keyboard semantics.
   */
  readonly role = input<'menu' | 'listbox'>('menu');
  readonly ariaLabel = input<string | null>(null);
}
