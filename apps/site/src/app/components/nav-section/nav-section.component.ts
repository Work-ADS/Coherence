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
  templateUrl: './nav-section.component.html',
  styleUrl: './nav-section.component.scss',
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
