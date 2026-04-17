import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
  signal,
  effect,
  OnDestroy,
} from '@angular/core';
import type { LoadingOverlayVariant } from './loading-overlay.variants';

@Component({
  selector: 'afi-loading-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-busy]': 'showOverlay()',
  },
  styles: `
    :host { display: block; position: relative; }
    .overlay {
      position: absolute; inset: 0; z-index: 10;
      display: flex; align-items: center; justify-content: center; flex-direction: column;
      background: var(--surface-quiet, hsl(200,8%,97%));
      opacity: 0.85;
      animation: fadeIn var(--duration-fast, 150ms) var(--easing-enter, ease-out) forwards;
    }
    .overlay--transparent { pointer-events: none; }
    .spinner {
      width: 2rem; height: 2rem;
      border: 3px solid var(--color-neutral-200, #e5e5e5);
      border-top-color: var(--action-500, #2d7fb5);
      border-radius: 9999px;
      animation: spin 700ms linear infinite;
    }
    .line-reveal-bar {
      position: absolute; top: 0; left: 0; height: 3px; width: 100%;
      background: var(--action-500, #2d7fb5);
      transform-origin: left;
      animation: lineGrow 400ms var(--easing-enter, ease-out) forwards;
    }
    .line-reveal-content {
      animation: contentReveal 200ms var(--easing-enter, ease-out) 400ms forwards;
      opacity: 0;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 0.85; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes lineGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    @keyframes contentReveal { from { opacity: 0; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) {
      .spinner { animation-duration: 0.01ms !important; }
      .overlay { animation-duration: 0.01ms !important; }
      .line-reveal-bar { animation-duration: 0.01ms !important; }
      .line-reveal-content { animation-duration: 0.01ms !important; animation-delay: 0ms !important; }
    }
  `,
  template: `
    @if (showOverlay()) {
      @if (variant() === 'quiet-spinner') {
        <div class="overlay" [class.overlay--transparent]="!blocking()" role="status" aria-live="polite">
          <div class="spinner" aria-hidden="true"></div>
          @if (message()) {
            <span class="mt-3 text-body-sm text-neutral-600">{{ message() }}</span>
          } @else {
            <span class="sr-only">Cargando\u2026</span>
          }
        </div>
      } @else {
        <div class="line-reveal-bar" aria-hidden="true"></div>
        <div role="status" aria-live="polite">
          <span class="sr-only">Cargando\u2026</span>
        </div>
      }
    }
    @if (variant() === 'line-reveal' && !showOverlay()) {
      <div class="line-reveal-content">
        <ng-content />
      </div>
    } @else {
      <ng-content />
    }
  `,
})
export class LoadingOverlayComponent implements OnDestroy {
  readonly visible = input(false);
  readonly variant = input<LoadingOverlayVariant>('quiet-spinner');
  readonly message = input<string | null>(null);
  readonly blocking = input(true);
  readonly delay = input(300);
  readonly visibleChange = output<boolean>();

  protected readonly showOverlay = signal(false);

  #timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      const delayMs = this.delay();

      if (this.#timer !== null) {
        clearTimeout(this.#timer);
        this.#timer = null;
      }

      if (isVisible) {
        this.#timer = setTimeout(() => {
          this.showOverlay.set(true);
          this.visibleChange.emit(true);
          this.#timer = null;
        }, delayMs);
      } else {
        this.showOverlay.set(false);
        this.visibleChange.emit(false);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.#timer !== null) {
      clearTimeout(this.#timer);
    }
  }
}
