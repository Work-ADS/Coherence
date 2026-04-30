import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  computed,
  DestroyRef,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Site-local collapsible sidebar section.
 * Renders a parent label that expands/collapses child nav items.
 * Auto-expands when the active route matches the section's `routePrefix`.
 */
@Component({
  selector: 'site-nav-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="toggle()"
      [attr.aria-expanded]="isOpen()"
      class="flex items-center w-full px-3 py-1 rounded-sm
             text-sm text-canvas-fg
             hover:bg-surface-muted
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
             transition-colors"
    >
      <svg
        class="w-4 h-4 mr-space-2 shrink-0 transition-transform duration-fast"
        [class.rotate-90]="isOpen()"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path d="M6 4l4 4-4 4" />
      </svg>
      {{ label() }}
    </button>

    @if (isOpen()) {
      <ul class="flex flex-col gap-space-1 pl-space-6 mt-space-1">
        <ng-content />
      </ul>
    }
  `,
})
export class NavSectionComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly label = input.required<string>();
  readonly routePrefix = input.required<string>();

  private readonly currentUrl = signal(this.router.url);
  private readonly manualState = signal<boolean | null>(null);

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        this.currentUrl.set(e.urlAfterRedirects);
        // Reset manual state on navigation so auto-expand takes over
        this.manualState.set(null);
      });
  }

  readonly isOpen = computed(() => {
    const manual = this.manualState();
    if (manual !== null) return manual;
    return this.currentUrl().startsWith(this.routePrefix());
  });

  toggle(): void {
    this.manualState.set(!this.isOpen());
  }
}
