import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import type { DrawerSize } from './drawer.variants';
import { sizeClasses } from './drawer.variants';

/**
 * Non-blocking right-edge panel.
 *
 * NOT a modal — no overlay, no focus trap, page stays interactive.
 * Click-outside closes by default. Arrow nav for row-detail pattern.
 */
@Component({
  selector: 'afi-drawer',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"contents"',
  },
  template: `
    @if (open()) {
      <!-- Click-outside listener -->
      @if (closeOnOutsideClick()) {
        <div
          class="fixed inset-0 z-40"
          (click)="onOutsideClick()"
          aria-hidden="true"></div>
      }

      <aside
        #panel
        [class]="panelClasses()"
        role="region"
        [attr.aria-label]="!title() ? ariaLabel() : null"
        [attr.aria-labelledby]="title() ? titleId : null"
        (keydown)="onKeydown($event)"
      >
        <!-- Header -->
        <header class="flex items-center justify-between gap-space-2 px-space-4 py-space-3 border-b border-border-hairline shrink-0">
          <div class="flex items-center gap-space-2 min-w-0">
            <ng-content select="[slot=header]">
              @if (title()) {
                <h2 [id]="titleId" class="text-body-md-600 truncate">{{ title() }}</h2>
              }
            </ng-content>
          </div>

          <div class="flex items-center gap-space-1 shrink-0">
            @if (position()) {
              <div class="flex items-center gap-space-1">
                <button
                  type="button"
                  class="p-1 rounded hover:bg-surface-100 transition-colors duration-fast disabled:opacity-40"
                  aria-label="Fila anterior"
                  [disabled]="position()!.current <= 1"
                  (click)="onNavigate('prev')">
                  <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                  </svg>
                </button>
                <span class="text-body-sm text-neutral-500 tabular-nums" aria-live="polite">
                  {{ position()!.current }} de {{ position()!.total }}
                </span>
                <button
                  type="button"
                  class="p-1 rounded hover:bg-surface-100 transition-colors duration-fast disabled:opacity-40"
                  aria-label="Fila siguiente"
                  [disabled]="position()!.current >= position()!.total"
                  (click)="onNavigate('next')">
                  <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            }

            <button
              type="button"
              class="p-1 rounded hover:bg-surface-100 transition-colors duration-fast"
              aria-label="Cerrar"
              (click)="onClose('button')">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </header>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto px-space-4 py-space-4">
          <ng-content />
        </div>

        <!-- Footer -->
        <ng-content select="[slot=footer]" />
      </aside>
    }
  `,
  styles: [`
    :host { display: contents; }

    @keyframes drawer-slide-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .animate-drawer {
        animation: none !important;
        opacity: 1;
      }
    }
  `],
})
export class DrawerComponent {
  readonly open = input<boolean>(false);
  readonly size = input<DrawerSize>('md');
  readonly title = input<string | null>(null);
  readonly position = input<{ current: number; total: number } | null>(null);
  readonly closeOnEsc = input<boolean>(true);
  readonly closeOnOutsideClick = input<boolean>(true);
  readonly ariaLabel = input<string | null>(null);

  readonly openChange = output<boolean>();
  readonly closed = output<'esc' | 'outside' | 'button'>();
  readonly navigated = output<'prev' | 'next'>();

  readonly titleId = 'afi-drawer-title-' + Math.random().toString(36).slice(2, 9);

  readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  private readonly isVisible = signal(false);

  readonly panelClasses = computed(() => {
    const sz = sizeClasses[this.size()];
    return [
      'fixed top-0 right-0 h-full z-50',
      sz,
      'max-w-[calc(100vw-48px)]',
      'bg-surface border-l border-border-hairline shadow-elevation-high',
      'flex flex-col',
      'animate-drawer',
    ].join(' ');
  });

  constructor() {
    // Focus first interactive element on open
    effect(() => {
      if (this.open()) {
        this.isVisible.set(true);
        // Wait for render
        queueMicrotask(() => {
          const el = this.panel()?.nativeElement;
          if (!el) return;
          const focusable = el.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          focusable?.focus();
        });
      } else {
        this.isVisible.set(false);
      }
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.closeOnEsc()) {
      this.onClose('esc');
      return;
    }
    if (this.position()) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.onNavigate('prev');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.onNavigate('next');
      }
    }
  }

  onClose(reason: 'esc' | 'outside' | 'button'): void {
    this.openChange.emit(false);
    this.closed.emit(reason);
  }

  onOutsideClick(): void {
    this.onClose('outside');
  }

  onNavigate(direction: 'prev' | 'next'): void {
    const pos = this.position();
    if (!pos) return;
    if (direction === 'prev' && pos.current <= 1) return;
    if (direction === 'next' && pos.current >= pos.total) return;
    this.navigated.emit(direction);
  }
}
