import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  isDevMode,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';

import { IconButtonV2Component } from '../icon-button-v2/icon-button-v2.component';
import type { DialogV2CloseReason, DialogV2Size } from './dialog-v2.variants';

let nextId = 0;

/**
 * Dialog — identity v2 (foundations-modern).
 *
 * A blocking, centred modal surface with a fixed three-part shell: Header
 * (title + optional description + close), Body (projected content), Footer
 * (projected, trailing-aligned actions). Consumes only `foundations-modern`
 * tokens, so it renders correctly only inside a `[data-foundation="modern"]`
 * scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Dialog (2736:3707),
 * documented at 2753:4247. Shell: `background/elevated` fill, `radius/xl`
 * corners, `Elevation/5` (→ `--elevation-dialog`) shadow, and `pad/dialog`
 * as both the all-sides padding and the inter-section gap. Header is a row — a
 * text stack (H4 title in `content/primary` + Body/default description in
 * `content/secondary`) that fills, with a trailing close button (`sm`
 * icon-button); Footer is a trailing-aligned action row. Unlike `afi-card-v2`,
 * the sections carry no dividers.
 *
 * Engine: the native `<dialog>` element (adapted from the v1 `afi-modal`),
 * which provides the focus trap, body scroll-lock, top-layer promotion and
 * backdrop for free — no CDK overlay needed. `open` is a controlled input; the
 * component mirrors it to `showModal()` / `close()` and emits `openChange` +
 * `closed` so the consumer stays the single source of truth.
 *
 * The close button is a real `afi-icon-button-v2` (ghost · sm) — the dialog
 * never re-implements button chrome. Body and footer are projected:
 *   • default `<ng-content>` — the body content (form, summary, prose, media…);
 *     it scrolls independently when the dialog hits its viewport height cap
 *     while header + footer stay pinned.
 *   • `[slot=footer]` — the footer action buttons (real `afi-button-v2`
 *     instances), aligned to the trailing edge; the footer hides when empty.
 *     Project each button DIRECTLY with `slot="footer"` (do NOT wrap them in a
 *     single element) — the footer row owns the inter-button gap
 *     (`--gap-dialog-actions`), so a wrapper would swallow that spacing.
 *
 * Sizes are width-only (SM · MD · LG per Figma; XL · XXL extend the scale in
 * code for complex / 2-pane dialogs). This is the base template — richer
 * dialogs compose their content into the body slot without changing the shell.
 *
 * A11y: `role="dialog"` + `aria-modal` come from the native element. The title
 * is wired via `aria-labelledby`; the description via `aria-describedby`. When
 * no `title` is set, pass `ariaLabel`. `closeOnBackdrop` defaults to `false` to
 * protect in-progress form data (the primary complex use case); the Figma
 * pattern note mentions backdrop-close, available by opting in. Focus returns
 * to the trigger element on close, and `prefers-reduced-motion` is respected in
 * the SCSS.
 */
@Component({
  selector: 'afi-dialog-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButtonV2Component],
  templateUrl: './dialog-v2.component.html',
  styleUrls: ['./dialog-v2.component.scss'],
})
export class DialogV2Component implements OnDestroy {
  /** Controlled open state. The consumer owns it; the dialog mirrors it. */
  readonly open = input<boolean>(false);

  /** Width variant — structure is identical across sizes. */
  readonly size = input<DialogV2Size>('sm');

  /** H4 title in the header. Empty/null → the title node is omitted. */
  readonly title = input<string | null>(null);

  /** Body/default description under the title. Empty/null → omitted. */
  readonly description = input<string | null>(null);

  /** Show the trailing close button in the header. */
  readonly showClose = input<boolean>(true);

  /** Close on the Escape key (native `<dialog>` behaviour). */
  readonly closeOnEsc = input<boolean>(true);

  /** Close when the backdrop is clicked. Off by default to protect form data. */
  readonly closeOnBackdrop = input<boolean>(false);

  /**
   * Accessible name when no visible `title` is rendered. REQUIRED in that case:
   * a modal dialog with neither `title` nor `ariaLabel` has no accessible name.
   * Can't be a compile-time `input.required` (it's only needed when `title` is
   * absent), so a dev-mode warning enforces it at runtime — see the effect below.
   */
  readonly ariaLabel = input<string | null>(null);

  readonly openChange = output<boolean>();
  readonly closed = output<DialogV2CloseReason>();

  readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  private readonly id = nextId++;
  readonly titleId = `afi-dialog-v2-title-${this.id}`;
  readonly descriptionId = `afi-dialog-v2-desc-${this.id}`;

  readonly dialogClasses = computed(() =>
    ['afi-dialog-v2', `afi-dialog-v2--${this.size()}`].join(' '),
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

    // Dev-mode a11y guard: an open dialog with no title AND no ariaLabel has no
    // accessible name. Warn (dev only) rather than fail — the contract can't be
    // a compile-time required input since ariaLabel is only needed sans title.
    effect(() => {
      if (isDevMode() && this.open() && !this.title() && !this.ariaLabel()) {
        console.warn(
          '[afi-dialog-v2] Dialog opened with no accessible name: set `title` or `ariaLabel`.',
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
   * disabled we cancel it so the dialog stays up; otherwise we let the native
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
  close(reason: DialogV2CloseReason): void {
    const dialog = this.dialogEl().nativeElement;
    if (dialog.open) {
      this.suppressNativeClose = true;
      dialog.close();
    }
    this.finishClose(reason);
  }

  private finishClose(reason: DialogV2CloseReason): void {
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
