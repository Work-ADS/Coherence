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
  readonly closeOnBackdrop = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

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

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const dialog = this.dialogEl()?.nativeElement;
      if (!dialog) return;

      if (isOpen && !dialog.open) {
        this.triggerElement = document.activeElement;
        dialog.showModal();
      } else if (!isOpen && dialog.open) {
        dialog.close();
      }
    });
  }

  ngOnDestroy(): void {
    const dialog = this.dialogEl()?.nativeElement;
    if (dialog?.open) {
      dialog.close();
    }
  }

  onNativeClose(): void {
    this.returnFocus();
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
