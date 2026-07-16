import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { TooltipComponent } from '../tooltip';
import { SidebarV2Component } from '../sidebar-v2/sidebar-v2.component';

/**
 * Nav item — identity v2 (foundations-modern).
 *
 * One navigation destination inside an `<afi-nav-section-v2>`. Renders a real
 * `<a>` when `href` is set, otherwise a `<button>` — the semantics follow the
 * action, never a `<div role>`. Anatomy: leading icon (`icon/md`, projected via
 * `[slot=icon]`) + single-line label (`Body/small`, truncated with ellipsis).
 *
 * Consumes only `foundations-modern` tokens, so it renders correctly only inside
 * a `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Sidebar / Item (2746:4975) —
 * 5 states × 2 layouts. Selected, Disabled are component state; Default, Hover,
 * Focus are live CSS states. Per the annotations the Selected state is
 * deliberately NEUTRAL: `background/selected` fill + `content/primary` label, no
 * brand fill, accent bar, or bold. Focus is a `borders/focus` ring at
 * `stroke/focus`.
 *
 * The collapsed rail is owned by the parent `<afi-sidebar-v2>`; the item reads
 * `collapsed` from it. When collapsed the label is hidden, the icon centers, the
 * full label becomes the control's accessible name, and an `afi-tooltip` reveals
 * it on hover AND keyboard focus.
 *
 * A11y: the row is `navigation/sidebar/item-height` (40) tall — below the 44pt
 * touch target. This is a deliberate dense-desktop opt-out (WCAG 2.5.5 AAA): the
 * sidebar is a persistent desktop chrome surface, and every collapsed row still
 * carries an explicit `aria-label`. A touch-first host supplies its own 44pt
 * target from the mobile overlay layout (out of scope for this build).
 */
@Component({
  selector: 'afi-nav-item-v2',
  standalone: true,
  imports: [NgTemplateOutlet, TooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-item-v2.component.html',
  styleUrls: ['./nav-item-v2.component.scss'],
  host: { class: 'afi-nav-item-v2-host' },
})
export class NavItemV2Component {
  /** Visible label. Truncates with ellipsis; full text shows in the tooltip. */
  readonly label = input.required<string>();

  /** Destination URL. Set → renders an `<a>`; unset → renders a `<button>`. */
  readonly href = input<string | null>(null);

  /** Active destination — paints the neutral selected fill + `aria-current="page"`. */
  readonly selected = input<boolean>(false);

  /** Inert — no hover, focus, press; skipped by the sidebar's arrow-key rotation. */
  readonly disabled = input<boolean>(false);

  /** Fired when a button item (no `href`) is actuated. Suppressed while disabled. */
  readonly selectedChange = output<{ event: MouseEvent }>();

  /** Parent-assigned position within the sidebar's flattened item list. */
  readonly index = signal(0);

  /** The rendered control, exposed so the sidebar can move focus with arrows. */
  readonly controlRef = viewChild<ElementRef<HTMLElement>>('ctrl');

  private readonly sidebar = inject<SidebarV2Component>(
    forwardRef(() => SidebarV2Component),
  );

  /** True when the parent sidebar is in its collapsed icon-rail layout. */
  readonly collapsed = computed(() => this.sidebar.collapsed());

  readonly classes = computed(() => {
    const parts = ['afi-nav-item-v2'];
    if (this.selected()) parts.push('afi-nav-item-v2--selected');
    if (this.disabled()) parts.push('afi-nav-item-v2--disabled');
    if (this.collapsed()) parts.push('afi-nav-item-v2--collapsed');
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

  focus(): void {
    this.controlRef()?.nativeElement.focus();
  }
}
