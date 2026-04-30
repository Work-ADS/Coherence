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

import { sizeClasses, ModalSize } from './modal.variants';

let nextId = 0;

/**
 * Modal (dialog) primitive.
 *
 * Uses the native `<dialog>` element for built-in focus trap,
 * body scroll lock, and backdrop. No CDK dependency needed.
 */
@Component({
  selector: 'afi-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog
      #dialogEl
      [class]="panelClasses()"
      [attr.aria-labelledby]="title() ? titleId : null"
      [attr.aria-describedby]="description() ? descriptionId : null"
      [attr.aria-label]="!title() ? ariaLabel() : null"
      (close)="onNativeClose()"
      (click)="onBackdropClick($event)"
    >
      <div class="relative bg-surface-elevated rounded-md shadow-lg w-full" (click)="$event.stopPropagation()">
        <!-- Close button -->
        <button
          type="button"
          class="absolute top-space-3 right-space-3 p-space-1 rounded-md text-neutral-400 hover:text-canvas-fg
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          aria-label="Cerrar"
          (click)="close('button')"
        >
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>

        <!-- Header -->
        @if (title()) {
          <div class="px-space-6 pt-space-6 pb-space-4">
            <h2 [id]="titleId" class="text-section text-canvas-fg pr-space-8">{{ title() }}</h2>
            @if (description()) {
              <p [id]="descriptionId" class="mt-space-1 text-body-md text-neutral-600">{{ description() }}</p>
            }
          </div>
        }
        <ng-content select="[slot=header]" />

        <!-- Body -->
        <div class="px-space-6 py-space-4">
          <ng-content />
        </div>

        <!-- Footer -->
        <div class="px-space-6 py-space-4 border-t border-border-hairline flex justify-end gap-space-3">
          <ng-content select="[slot=footer]" />
        </div>
      </div>
    </dialog>
  `,
})
export class ModalComponent implements OnDestroy {
  readonly open = input<boolean>(false);
  readonly size = input<ModalSize>('md');
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

  readonly panelClasses = computed(() => {
    return [
      'p-0 border-none bg-transparent w-full mx-auto',
      'backdrop:bg-black/40',
      sizeClasses[this.size()],
    ].join(' ');
  });

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
    // Native close from Esc key
    this.closed.emit('esc');
  }

  onBackdropClick(event: MouseEvent): void {
    if (!this.closeOnBackdrop()) return;
    // Only fires if click was on the dialog backdrop (not content)
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
