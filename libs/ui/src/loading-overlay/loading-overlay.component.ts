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
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss',
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
