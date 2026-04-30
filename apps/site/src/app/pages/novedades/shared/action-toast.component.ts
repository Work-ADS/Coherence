import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Dark pill toast shown after an action — rename, estado change, plan switch.
 * Visual inspired by the Figma "Return to instance" pattern: undo action on the
 * left, message in the middle, close on the right. Auto-dismiss is owned by
 * the parent (keeps this component stateless).
 */
@Component({
  selector: 'site-action-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: contents;
    }
    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translate(-50%, 12px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
    .toast-pill {
      animation: toast-in 180ms ease-out;
    }
    @media (prefers-reduced-motion: reduce) {
      .toast-pill {
        animation: none;
      }
    }
  `,
  template: `
    @if (visible()) {
      <div class="fixed bottom-space-6 left-1/2 -translate-x-1/2 z-[70] pointer-events-none">
        <div
          role="status"
          aria-live="polite"
          class="toast-pill pointer-events-auto inline-flex items-center gap-space-2 h-10 pl-space-2 pr-space-1 rounded-full bg-neutral-900 text-white shadow-lg"
        >
          <!-- Undo -->
          <button
            type="button"
            (click)="undo.emit()"
            class="inline-flex items-center gap-space-1 h-7 px-space-2 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-colors"
            aria-label="Deshacer"
          >
            <!-- lucide: undo-2 -->
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M9 14 4 9l5-5" />
              <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
            </svg>
            <span class="text-body-sm font-medium">{{ undoLabel() }}</span>
          </button>
          <span class="w-px h-5 bg-white/20" aria-hidden="true"></span>
          <!-- Message -->
          <span class="text-body-sm px-space-1">{{ message() }}</span>
          <span class="w-px h-5 bg-white/20" aria-hidden="true"></span>
          <!-- Dismiss -->
          <button
            type="button"
            (click)="dismissed.emit()"
            class="inline-flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar aviso"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>
    }
  `,
})
export class ActionToastComponent {
  readonly message = input<string>('');
  readonly undoLabel = input<string>('Deshacer');
  readonly visible = input<boolean>(false);

  readonly undo = output<void>();
  readonly dismissed = output<void>();
}
