import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

import { ButtonComponent } from '@coherence/ui';

export interface ComposerSubmit {
  text: string;
}

interface AnchorPos {
  top: number;
  left: number;
  placement: 'right' | 'left';
}

const COMPOSER_WIDTH = 280;
const GAP = 8;

@Component({
  selector: 'site-comment-composer',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comment-composer.component.html',
  styleUrl: './comment-composer.component.scss',
})
export class CommentComposerComponent implements AfterViewInit, OnDestroy {
  readonly anchor = input.required<HTMLElement>();
  readonly selector = input.required<string>();
  readonly scrollContainer = input<HTMLElement | null>(null);

  readonly submitted = output<ComposerSubmit>();
  readonly cancelled = output<void>();

  readonly text = signal('');
  readonly pos = signal<AnchorPos>({ top: 0, left: 0, placement: 'right' });

  readonly canSubmit = computed(() => this.text().trim().length > 0);

  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;

  private resizeListener: (() => void) | null = null;
  private scrollListener: (() => void) | null = null;

  ngAfterViewInit(): void {
    this.recompute();
    this.textarea?.nativeElement.focus();

    this.resizeListener = () => this.recompute();
    this.scrollListener = () => this.recompute();
    window.addEventListener('resize', this.resizeListener);
    window.addEventListener('scroll', this.scrollListener, true);
  }

  ngOnDestroy(): void {
    if (this.resizeListener) window.removeEventListener('resize', this.resizeListener);
    if (this.scrollListener) window.removeEventListener('scroll', this.scrollListener, true);
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.text.set(value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      this.submit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelled.emit();
    }
  }

  submit(): void {
    const text = this.text().trim();
    if (!text) return;
    this.submitted.emit({ text });
  }

  cancel(): void {
    this.cancelled.emit();
  }

  private recompute(): void {
    const el = this.anchor();
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let placement: 'right' | 'left' = 'right';
    let left = rect.right + GAP;
    if (left + COMPOSER_WIDTH > viewportW - GAP) {
      placement = 'left';
      left = rect.left - COMPOSER_WIDTH - GAP;
      if (left < GAP) {
        left = Math.max(GAP, Math.min(rect.left, viewportW - COMPOSER_WIDTH - GAP));
      }
    }

    let top = rect.top;
    const estimatedHeight = 180;
    if (top + estimatedHeight > viewportH - GAP) {
      top = Math.max(GAP, viewportH - estimatedHeight - GAP);
    }
    if (top < GAP) top = GAP;

    this.pos.set({ top, left, placement });
  }
}
