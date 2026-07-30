import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, isDevMode, OnDestroy, output, viewChild } from '@angular/core';

import { IconButtonV2Component } from '../icon-button-v2/icon-button-v2.component';
import type { DrawerV2Anchor, DrawerV2CloseReason, DrawerV2Size } from './drawer-v2.variants';

import { AFI_UI_COPY } from '../copy';

let nextId = 0;

/**
 * Drawer — identity v2 (foundations-modern).
 *
 * A blocking, right-anchored, full-viewport-height panel with a fixed three-part
 * shell: Header (title + optional description + close), Body (projected content,
 * scrolls independently), Footer (projected, trailing-aligned actions). Consumes
 * only `foundations-modern` tokens, so it renders correctly only inside a
 * `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Drawer (2769:5408),
 * documented at 2799:519. Shell: `background/elevated` fill, `radius/lg` on the
 * inner (left) corners only — the outer edge sits flush to the viewport —
 * `Elevation/roles/drawer` (→ `--elevation-drawer`) shadow, `pad/drawer` as the
 * section padding, and stroke/default dividers under the header and above the
 * footer. Header is a `navigation/toolbar/height` row — a text stack (H4
 * title in `content/primary` + Body/default description in `content/secondary`)
 * that fills, with a trailing close button (`sm` icon-button); Footer is a
 * trailing-aligned action row.
 *
 * Engine: the native `<dialog>` element (shared with `afi-dialog-v2`), which
 * provides the focus trap, body scroll-lock, top-layer promotion and backdrop
 * for free — no CDK overlay needed. `open` is a controlled input; the component
 * mirrors it to `showModal()` / `close()` and emits `openChange` + `closed` so
 * the consumer stays the single source of truth. The panel slides in from the
 * right on open (`--motion-duration-slow` · `--motion-easing-enter`, per the
 * Figma MOVE_IN transition), with `prefers-reduced-motion` respected in the SCSS.
 *
 * The close button is a real `afi-icon-button-v2` (ghost · sm) — the drawer
 * never re-implements button chrome. Body and footer are projected:
 *   • default `<ng-content>` — the body content (form, summary, prose, media…);
 *     it scrolls independently while header + footer stay pinned.
 *   • `[slot=footer]` — the footer action buttons (real `afi-button-v2`
 *     instances), aligned to the trailing edge; the footer (and its top divider)
 *     hide when empty. Project each button DIRECTLY with `slot="footer"` (do NOT
 *     wrap them in a single element) — the footer row owns the inter-button gap
 *     (`--gap-dialog-actions`), so a wrapper would swallow that spacing.
 *
 * Sizes are width-only (SM · MD · LG per Figma); the panel is always full height.
 * On narrow viewports product code should switch to a full-screen overlay rather
 * than adding a fourth width — the SCSS caps `max-inline-size` at `100%` so a
 * too-wide size degrades gracefully in the meantime.
 *
 * A11y: `role="dialog"` + `aria-modal` come from the native element. The title
 * is wired via `aria-labelledby`; the description via `aria-describedby`. When
 * no `title` is set, pass `ariaLabel`. Per the Figma close triggers (icon
 * button, Cancel button, Escape), `closeOnBackdrop` defaults to `false` to
 * protect in-progress form data; opt in when backdrop-close is appropriate.
 * Focus returns to the trigger element on close.
 */
@Component({
  selector: 'afi-drawer-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButtonV2Component],
  templateUrl: './drawer-v2.component.html',
  styleUrls: ['./drawer-v2.component.scss'],
})
export class DrawerV2Component implements OnDestroy {

  /** Optional page-level chrome copy; per-instance inputs still win. */
  private readonly uiCopy = inject(AFI_UI_COPY, { optional: true });
  /** Controlled open state. The consumer owns it; the drawer mirrors it. */
  readonly open = input<boolean>(false);

  /** Width variant — structure is identical across sizes. */
  readonly size = input<DrawerV2Size>('sm');

  /** Anchored edge. `right` (default) is the standard drawer; `left` is the
   * off-canvas navigation pattern (host `afi-sidebar-v2` as the body). */
  readonly anchor = input<DrawerV2Anchor>('right');

  /** H4 title in the header. Empty/null → the title node is omitted. */
  readonly title = input<string | null>(null);

  /** Body/default description under the title. Empty/null → omitted. */
  readonly description = input<string | null>(null);

  readonly closeLabel = input<string | null>(null);
  readonly closeLabelText = computed(
    () => this.closeLabel() ?? this.uiCopy?.()?.close ?? 'Cerrar',
  );

  /** Show the trailing close button in the header. */
  readonly showClose = input<boolean>(true);

  /** Close on the Escape key (native `<dialog>` behaviour). */
  readonly closeOnEsc = input<boolean>(true);

  /** Close when the backdrop is clicked. Off by default to protect form data. */
  readonly closeOnBackdrop = input<boolean>(false);

  /**
   * Accessible name when no visible `title` is rendered. REQUIRED in that case:
   * a modal drawer with neither `title` nor `ariaLabel` has no accessible name.
   * Can't be a compile-time `input.required` (it's only needed when `title` is
   * absent), so a dev-mode warning enforces it at runtime — see the effect below.
   */
  readonly ariaLabel = input<string | null>(null);

  readonly openChange = output<boolean>();
  readonly closed = output<DrawerV2CloseReason>();

  readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  private readonly id = nextId++;
  readonly titleId = `afi-drawer-v2-title-${this.id}`;
  readonly descriptionId = `afi-drawer-v2-desc-${this.id}`;

  readonly dialogClasses = computed(() =>
    ['afi-drawer-v2', `afi-drawer-v2--${this.size()}`, `afi-drawer-v2--${this.anchor()}`].join(' '),
  );

  readonly hasHeader = computed(
    () => !!this.title() || !!this.description() || this.showClose(),
  );

  private triggerElement: Element | null = null;

  // Set true just before we call the native `close()` ourselves (button /
  // backdrop), so the resulting native `close` event doesn't emit a second,
  // spurious 'esc' close. Reset when that echo arrives.
  private suppressNativeClose = false;

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const dialog = this.dialogEl()?.nativeElement;
      if (!dialog) return;

      if (isOpen && !dialog.open) {
        this.triggerElement = document.activeElement;
        dialog.showModal();
      } else if (!isOpen && dialog.open) {
        this.suppressNativeClose = true;
        dialog.close();
      }
    });

    // Dev-mode a11y guard: an open drawer with no title AND no ariaLabel has no
    // accessible name. Warn (dev only) rather than fail — the contract can't be
    // a compile-time required input since ariaLabel is only needed sans title.
    effect(() => {
      if (isDevMode() && this.open() && !this.title() && !this.ariaLabel()) {
        console.warn(
          '[afi-drawer-v2] Drawer opened with no accessible name: set `title` or `ariaLabel`.',
        );
      }
    });
  }

  ngOnDestroy(): void {
    const dialog = this.dialogEl()?.nativeElement;
    if (dialog?.open) {
      dialog.close();
    }
  }

  /**
   * Fires on the native `cancel` event (Escape key). When Escape close is
   * disabled we cancel it so the drawer stays up; otherwise we let the native
   * `close` follow and report the reason there.
   */
  onCancel(event: Event): void {
    if (!this.closeOnEsc()) {
      event.preventDefault();
    }
  }

  /**
   * Fires on the native `close` event. Reached by the Escape key or by a
   * programmatic close; the button/backdrop paths suppress their own echo.
   */
  onNativeClose(): void {
    if (this.suppressNativeClose) {
      this.suppressNativeClose = false;
      return;
    }
    this.finishClose('esc');
  }

  onBackdropClick(event: MouseEvent): void {
    if (!this.closeOnBackdrop()) return;
    // The native <dialog> is the full-viewport backdrop hit area; the panel
    // stops propagation, so a click landing on the dialog itself is the scrim.
    if (event.target === this.dialogEl().nativeElement) {
      this.close('backdrop');
    }
  }

  /** Close via an explicit control (close button, backdrop). */
  close(reason: DrawerV2CloseReason): void {
    const dialog = this.dialogEl().nativeElement;
    if (dialog.open) {
      this.suppressNativeClose = true;
      dialog.close();
    }
    this.finishClose(reason);
  }

  private finishClose(reason: DrawerV2CloseReason): void {
    this.returnFocus();
    this.openChange.emit(false);
    this.closed.emit(reason);
  }

  private returnFocus(): void {
    if (this.triggerElement instanceof HTMLElement) {
      this.triggerElement.focus();
    }
    this.triggerElement = null;
  }
}
