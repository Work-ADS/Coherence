import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

/**
 * Navbar item — identity v2 (foundations-modern).
 *
 * One destination in the horizontal site nav bar. Text-only by design — the
 * states are typographic, no pill or fill. Renders a real `<a>` when `href`
 * is set, otherwise a `<button>`.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → nav item (2974:9905),
 * four states:
 *   • Default  — IBM Plex Sans Medium, `nav-item/size` 13 / 16, `content/tertiary`
 *   • Hover    — Medium, `content/primary`
 *   • Selected — Bold (`display/weight`), `content/primary`
 *   • Disabled — Medium, `disabled/content`
 * Focus is not drawn in the node yet; it follows the DS convention
 * (`borders/focus` ring at `stroke/focus`), same as `afi-nav-item-v2`.
 *
 * The selected state is bold, which is wider than medium — the control
 * reserves the bold width with a hidden duplicate so toggling selection never
 * shifts its neighbours.
 *
 * Consumes only `foundations-modern` tokens, so it renders correctly only
 * inside a `[data-foundation="modern"]` scope.
 */
@Component({
  selector: 'afi-navbar-item-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar-item-v2.component.html',
  styleUrls: ['./navbar-item-v2.component.scss'],
})
export class NavbarItemV2Component {
  /** Visible label. The reserved (bold) width comes from this same text. */
  readonly label = input.required<string>();

  /** Destination URL. Set → renders an `<a>`; unset → renders a `<button>`. */
  readonly href = input<string | null>(null);

  /** Active destination — bold + `content/primary`, `aria-current="page"`. */
  readonly selected = input<boolean>(false);

  /** Inert — no hover, focus, or press. */
  readonly disabled = input<boolean>(false);

  /** Fired when a button item (no `href`) is actuated. Suppressed while disabled. */
  readonly selectedChange = output<{ event: MouseEvent }>();

  readonly classes = computed(() => {
    const parts = ['afi-navbar-item-v2'];
    if (this.selected()) parts.push('afi-navbar-item-v2--selected');
    if (this.disabled()) parts.push('afi-navbar-item-v2--disabled');
    return parts.join(' ');
  });

  onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    if (this.href() === null) {
      this.selectedChange.emit({ event });
    }
  }
}
