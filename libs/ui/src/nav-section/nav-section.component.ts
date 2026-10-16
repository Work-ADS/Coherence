import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
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
 */
@Component({
  selector: 'afi-nav-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './nav-section.component.scss',
  templateUrl: './nav-section.component.html',
})
export class NavSectionComponent implements AfterViewInit, OnDestroy {
  readonly label = input.required<string>();
  readonly expanded = input<boolean | null>(null);
  readonly defaultExpanded = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);
  readonly showTreeLines = input<boolean>(true);
  /** Hide the section's own trigger row (use when an external nav-item acts as the parent) */
  readonly hideHeader = input<boolean>(false);
  /** Position of the expand/collapse chevron */
  readonly chevronPosition = input<'left' | 'right'>('right');

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
    const explicit = this.expanded();
    if (explicit !== null) return explicit;

    const internal = this.internalExpanded();
    if (internal !== null) return internal;

    if (this.hasActiveChild()) return true;
    return this.defaultExpanded();
  });

  readonly hoveredChildIndex = signal<number | null>(null);

  /** Index of the active child (persistent trail target) */
  readonly activeChildIndex = computed(() => {
    const items = this.childItems();
    const idx = items.findIndex(item => item.active());
    return idx >= 0 ? idx : null;
  });

  /** Use hovered child if present, otherwise fall back to active child */
  readonly trailTargetIndex = computed(() => {
    return this.hoveredChildIndex() ?? this.activeChildIndex();
  });

  readonly markerY = computed(() => {
    const idx = this.trailTargetIndex();
    if (idx === null) return 0;
    return this.resolveChildY(idx);
  });

  private childListeners: Array<() => void> = [];

  constructor() {
    // Reactively update stub colors based on trail target
    effect(() => {
      const targetIdx = this.trailTargetIndex();
      const container = this.el.nativeElement.querySelector('.nav-section__children');
      if (!container) return;

      const children = Array.from(container.children as HTMLCollectionOf<HTMLElement>).filter(
        el => !el.classList.contains('nav-section__marker')
      );

      children.forEach((child, idx) => {
        if (targetIdx !== null && idx <= targetIdx) {
          child.style.setProperty('--_stub-color', 'var(--brand-primary-border-default)');
        } else {
          child.style.removeProperty('--_stub-color');
        }
      });
    });
  }

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
