import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  input,
  output,
  signal,
} from '@angular/core';

import { ButtonComponent } from '@coherence/ui';

const POPOVER_WIDTH = 240;
const GAP = 8;

interface PopoverPos {
  top: number;
  left: number;
}

@Component({
  selector: 'site-confirm-action',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-action.component.html',
  styleUrl: './confirm-action.component.scss',
})
export class ConfirmActionComponent implements AfterViewInit, OnDestroy {
  readonly anchor = input.required<HTMLElement>();
  readonly message = input.required<string>();
  readonly confirmLabel = input<string>('Confirmar');
  readonly cancelLabel = input<string>('Cancelar');
  readonly variant = input<'danger' | 'primary'>('danger');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  readonly pos = signal<PopoverPos>({ top: 0, left: 0 });

  @ViewChild('confirmBtn') confirmBtn!: ElementRef<HTMLButtonElement>;

  private resizeListener: (() => void) | null = null;
  private docClickListener: ((e: MouseEvent) => void) | null = null;
  private keyListener: ((e: KeyboardEvent) => void) | null = null;

  ngAfterViewInit(): void {
    this.recompute();
    queueMicrotask(() => this.confirmBtn?.nativeElement?.focus?.());

    this.resizeListener = () => this.recompute();
    window.addEventListener('resize', this.resizeListener);
    window.addEventListener('scroll', this.resizeListener, true);

    this.docClickListener = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      if (target.closest('site-confirm-action')) return;
      if (target === this.anchor() || this.anchor()?.contains(target)) return;
      this.cancelled.emit();
    };
    setTimeout(() => {
      document.addEventListener('click', this.docClickListener!, true);
    }, 0);

    this.keyListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.cancelled.emit();
      }
    };
    document.addEventListener('keydown', this.keyListener);
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      window.removeEventListener('scroll', this.resizeListener, true);
    }
    if (this.docClickListener) {
      document.removeEventListener('click', this.docClickListener, true);
    }
    if (this.keyListener) document.removeEventListener('keydown', this.keyListener);
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  private recompute(): void {
    const el = this.anchor();
    if (!el) return;
    const r = el.getBoundingClientRect();
    const viewportW = window.innerWidth;

    let left = r.right + GAP;
    if (left + POPOVER_WIDTH > viewportW - GAP) {
      left = Math.max(GAP, r.left - POPOVER_WIDTH - GAP);
    }
    let top = r.top;
    const estimatedHeight = 120;
    if (top + estimatedHeight > window.innerHeight - GAP) {
      top = Math.max(GAP, window.innerHeight - estimatedHeight - GAP);
    }

    this.pos.set({ top, left });
  }
}
