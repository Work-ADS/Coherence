import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  inject,
  input,
  output,
  signal,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

import { NavItemComponent } from '../nav-item/nav-item.component';

let nextId = 0;

/**
 * Expandable navigation section with tree-line visual treatment.
 *
 * Renders a parent row (chevron + icon? + label + trailing action slot)
 * and a collapsible children region (usually NavItem instances).
 * Three visual pieces: connecting lines, hover/focus trail, sliding marker.
 */
@Component({
  selector: 'afi-nav-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"block"',
  },
  template: `
    <!-- Parent row -->
    <button
      type="button"
      class="group flex items-center gap-space-2 w-full px-space-4 py-space-2 rounded-md transition-colors duration-fast
             hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action cursor-pointer"
      [class.font-medium]="hasActiveChild()"
      [class.text-canvas-fg]="hasActiveChild()"
      [class.text-neutral-700]="!hasActiveChild()"
      [attr.aria-expanded]="isExpanded()"
      [attr.aria-controls]="childrenId"
      [attr.aria-label]="ariaLabel() ?? 'Sección: ' + label()"
      [disabled]="disabled()"
      (click)="toggle()">
      <!-- Chevron -->
      <svg
        class="w-4 h-4 shrink-0 text-neutral-400 transition-transform duration-fast"
        [class.rotate-90]="isExpanded()"
        viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z" />
      </svg>

      <!-- Icon slot -->
      <ng-content select="[slot=icon]" />

      <!-- Label -->
      <span class="truncate text-body-sm flex-1 text-left">{{ label() }}</span>

      <!-- Trailing action slot -->
      <span
        class="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-fast ml-auto shrink-0"
        (click)="$event.stopPropagation()">
        <ng-content select="[slot=trailingAction]" />
      </span>
    </button>

    <!-- Children region with grid expand/collapse -->
    <div
      [id]="childrenId"
      role="group"
      [attr.aria-label]="label()"
      class="grid transition-[grid-template-rows] duration-200 ease-out"
      [class.grid-rows-\\[1fr\\]]="isExpanded()"
      [class.grid-rows-\\[0fr\\]]="!isExpanded()"
      [style.grid-template-rows]="isExpanded() ? '1fr' : '0fr'">
      <div class="overflow-hidden min-h-0">
        @if (showTreeLines()) {
          <div
            class="nav-section__children relative"
            [attr.data-trail]="hoveredChildIndex() !== null"
            [style.--trail-end-y.px]="markerY()">
            <!-- Vertical guide + marker -->
            <span
              class="nav-section__marker absolute pointer-events-none"
              aria-hidden="true"
              [class.is-visible]="hoveredChildIndex() !== null"
              [style.--marker-y.px]="markerY()">
            </span>
            <ng-content />
          </div>
        } @else {
          <div class="pl-space-4">
            <ng-content />
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Host group for trailing action hover reveal */

    /* Tree-line structural pieces */
    .nav-section__children::before {
      content: '';
      position: absolute;
      left: 12px;
      top: 0;
      bottom: 0;
      width: 1px;
      background: var(--border-hairline, #e5e7eb);
      transition: background 120ms ease-out;
    }

    .nav-section__children[data-trail="true"]::before {
      background: linear-gradient(
        to bottom,
        var(--action-300, #93b4f5) 0,
        var(--action-300, #93b4f5) var(--trail-end-y, 0px),
        var(--border-hairline, #e5e7eb) var(--trail-end-y, 0px),
        var(--border-hairline, #e5e7eb) 100%
      );
    }

    /* Child horizontal stubs — applied via padding on projected content */
    .nav-section__children ::ng-deep > :not(.nav-section__marker) {
      position: relative;
      padding-left: var(--space-8, 32px);
    }
    .nav-section__children ::ng-deep > :not(.nav-section__marker)::before {
      content: '';
      position: absolute;
      left: 12px;
      top: 50%;
      width: 12px;
      height: 1px;
      background: var(--border-hairline, #e5e7eb);
    }

    /* Marker */
    .nav-section__marker {
      left: 11px;
      top: var(--marker-y, 0px);
      width: 2px;
      height: 16px;
      transform: translateY(-50%);
      background: var(--action-500, #3b63c7);
      border-radius: 1px;
      opacity: 0;
      z-index: 1;
      transition: top 200ms ease-out, opacity 120ms ease-out;
    }
    .nav-section__marker.is-visible {
      opacity: 1;
    }

    @media (prefers-reduced-motion: reduce) {
      .nav-section__marker { transition: none; }
      .nav-section__children::before { transition: none; }
      div[role="group"] { transition: none !important; }
      svg { transition: none !important; }
    }
  `],
})
export class NavSectionComponent implements AfterViewInit, OnDestroy {
  readonly label = input.required<string>();
  readonly expanded = input<boolean | null>(null);
  readonly defaultExpanded = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);
  readonly showTreeLines = input<boolean>(true);

  readonly expandedChange = output<boolean>();
  readonly parentClicked = output<{ event: MouseEvent }>();

  private readonly el = inject(ElementRef);
  private readonly internalExpanded = signal<boolean | null>(null);
  private readonly childItems = contentChildren(NavItemComponent, { descendants: true });

  readonly childrenId = `nav-section-${nextId++}`;

  readonly hasActiveChild = computed(() =>
    this.childItems().some(item => item.active())
  );

  readonly isExpanded = computed(() => {
    // Explicit input wins
    const explicit = this.expanded();
    if (explicit !== null) return explicit;

    // Internal state (user toggled)
    const internal = this.internalExpanded();
    if (internal !== null) return internal;

    // Auto-expand if active child, otherwise use defaultExpanded
    if (this.hasActiveChild()) return true;
    return this.defaultExpanded();
  });

  readonly hoveredChildIndex = signal<number | null>(null);

  readonly markerY = computed(() => {
    const idx = this.hoveredChildIndex();
    if (idx === null) return 0;
    return this.resolveChildY(idx);
  });

  private childListeners: Array<() => void> = [];

  ngAfterViewInit(): void {
    this.setupChildHoverTracking();
  }

  ngOnDestroy(): void {
    this.childListeners.forEach(fn => fn());
  }

  toggle(): void {
    const next = !this.isExpanded();
    this.internalExpanded.set(next);
    this.expandedChange.emit(next);
  }

  private setupChildHoverTracking(): void {
    const container = this.el.nativeElement.querySelector('.nav-section__children');
    if (!container) return;

    const children = Array.from(container.children as HTMLCollectionOf<HTMLElement>).filter(
      (el) => !el.classList.contains('nav-section__marker')
    );

    children.forEach((child, idx) => {
      const enter = () => this.hoveredChildIndex.set(idx);
      const leave = () => {
        if (this.hoveredChildIndex() === idx) this.hoveredChildIndex.set(null);
      };
      const focusIn = () => this.hoveredChildIndex.set(idx);
      const focusOut = () => {
        queueMicrotask(() => {
          if (this.hoveredChildIndex() === idx) this.hoveredChildIndex.set(null);
        });
      };

      child.addEventListener('mouseenter', enter);
      child.addEventListener('mouseleave', leave);
      child.addEventListener('focusin', focusIn);
      child.addEventListener('focusout', focusOut);

      this.childListeners.push(
        () => child.removeEventListener('mouseenter', enter),
        () => child.removeEventListener('mouseleave', leave),
        () => child.removeEventListener('focusin', focusIn),
        () => child.removeEventListener('focusout', focusOut),
      );
    });
  }

  private resolveChildY(index: number): number {
    const container = this.el.nativeElement.querySelector('.nav-section__children');
    if (!container) return 0;

    const children = Array.from(container.children as HTMLCollectionOf<HTMLElement>).filter(
      (el) => !el.classList.contains('nav-section__marker')
    );

    const child = children[index];
    if (!child) return 0;

    const containerRect = container.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();
    return childRect.top - containerRect.top + childRect.height / 2;
  }
}
