import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  effect,
  ElementRef,
  viewChild,
  OnDestroy,
} from '@angular/core';

import { focusField } from '../focus-field';
import { IconComponent } from '../icon';

import type { ModalSize, ModalType } from './modal.variants';

let nextId = 0;

/**
 * Modal (dialog) primitive.
 *
 * Uses the native <dialog> element for built-in focus trap, body scroll
 * lock, and backdrop. No CDK dependency needed.
 *
 * 3-file split (LOCKED 2026-04-16): template + styles live in sibling
 * files. BEM classes + semantic tokens only.
 */
@Component({
  selector: 'afi-modal',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnDestroy {
  readonly open = input<boolean>(false);
  readonly size = input<ModalSize>('md');
  readonly type = input<ModalType>('form');
  readonly title = input<string | null>(null);
  readonly description = input<string | null>(null);
  readonly closeOnEsc = input<boolean>(true);
  /** The × in the header. Turn it off for blocking flows that must end in an action. */
  readonly showClose = input<boolean>(true);
  readonly closeOnBackdrop = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);
  /** Where focus lands on open. Defaults to the first focusable control. Must be inside the modal. */
  readonly initialFocusRef = input<HTMLElement | ElementRef<HTMLElement> | null>(null);
  /** Where focus goes on close. Defaults to the element that had it when the modal opened. */
  readonly returnFocusRef = input<HTMLElement | ElementRef<HTMLElement> | null>(null);

  readonly openChange = output<boolean>();
  readonly closed = output<'esc' | 'backdrop' | 'button'>();

  readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  private readonly id = nextId++;
  readonly titleId = `afi-modal-title-${this.id}`;
  readonly descriptionId = `afi-modal-desc-${this.id}`;

  readonly dialogClasses = computed(() =>
    ['afi-modal__dialog', `afi-modal__dialog--${this.size()}`, `afi-modal__dialog--${this.type()}`].join(' '),
  );

  private triggerElement: Element | null = null;
  /** The parent closed it (open went false); the native close event is then not a user dismissal. */
  private closedByParent = false;

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const dialog = this.dialogEl()?.nativeElement;
      if (!dialog) return;

      if (isOpen && !dialog.open) {
        this.triggerElement = document.activeElement;
        dialog.showModal();
        this.focusInitial(dialog);
      } else if (!isOpen && dialog.open) {
        this.closedByParent = true;
        dialog.close();
      }
    });
  }

  ngOnDestroy(): void {
    const dialog = this.dialogEl()?.nativeElement;
    if (dialog?.open) {
      this.closedByParent = true;
      dialog.close();
    }
  }

  /** Escape: with `closeOnEsc` off the native dialog must not close itself. */
  onCancel(event: Event): void {
    if (!this.closeOnEsc()) event.preventDefault();
  }

  onNativeClose(): void {
    this.returnFocus();
    if (this.closedByParent) {
      // Closed through `open` (including after our own × or backdrop emit): already reported.
      this.closedByParent = false;
      return;
    }
    // Dismissed by the browser (Escape): tell the parent, once.
    this.openChange.emit(false);
    this.closed.emit('esc');
  }

  onBackdropClick(event: MouseEvent): void {
    if (!this.closeOnBackdrop()) return;
    const dialog = this.dialogEl().nativeElement;
    if (event.target === dialog) {
      this.close('backdrop');
    }
  }

  close(reason: 'esc' | 'backdrop' | 'button'): void {
    this.openChange.emit(false);
    this.closed.emit(reason);
  }

  private focusInitial(dialog: HTMLDialogElement): void {
    const target = this.resolve(this.initialFocusRef());
    if (!target || !dialog.contains(target)) return;
    // The canonical jump: scrolled inside the body, ringed in every input modality.
    const body = dialog.querySelector<HTMLElement>('.afi-modal__body');
    const container = body?.contains(target) ? body : dialog;
    if (!focusField(target, { scroll: 'nearest', container })) target.focus();
  }

  private returnFocus(): void {
    const preferred = this.resolve(this.returnFocusRef());
    const back = this.usable(preferred) ? preferred : this.triggerElement instanceof HTMLElement ? this.triggerElement : null;
    if (this.usable(back)) back.focus({ preventScroll: true });
    this.triggerElement = null;
  }

  private resolve(ref: HTMLElement | ElementRef<HTMLElement> | null): HTMLElement | null {
    if (!ref) return null;
    return ref instanceof ElementRef ? ref.nativeElement : ref;
  }

  private usable(el: HTMLElement | null): el is HTMLElement {
    return !!el && el.isConnected && !(el as HTMLButtonElement).disabled && el !== document.body;
  }
}
