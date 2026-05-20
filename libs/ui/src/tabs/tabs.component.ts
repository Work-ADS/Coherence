import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  ElementRef,
  input,
  output,
  signal,
  computed,
  viewChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { TabItemComponent } from './tab-item.component';
import { TabsSize } from './tabs.variants';

let nextId = 0;

/**
 * Tabs — underline-style tab bar with animated sliding underline indicator.
 *
 * Content lives inside `<afi-tab-item>` children and is conditionally
 * rendered into tab panels. Supports lazy rendering via the `lazy` input.
 *
 * Implements WAI-ARIA tablist/tab/tabpanel with full keyboard navigation.
 *
 * @example
 * ```html
 * <afi-tabs [activeIndex]="tab()" (activeChange)="tab.set($event)">
 *   <afi-tab-item label="Ejemplo">
 *     <p>Content for first tab...</p>
 *   </afi-tab-item>
 *   <afi-tab-item label="Decisiones">
 *     <p>Content for second tab...</p>
 *   </afi-tab-item>
 * </afi-tabs>
 * ```
 */
@Component({
  selector: 'afi-tabs',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent implements AfterViewInit {
  /** Controlled active tab index. */
  readonly activeIndex = input<number>(0);

  /** Size variant — affects trigger height and font size. */
  readonly size = input<TabsSize>('md');

  /** Lazy rendering — only mount the active panel's content. */
  readonly lazy = input<boolean>(false);

  /** Accessible label for the tablist. */
  readonly ariaLabel = input<string | null>(null);

  /** Emits the new index when the user activates a tab. */
  readonly activeChange = output<number>();

  /** Projected `<afi-tab-item>` children. */
  readonly tabs = contentChildren(TabItemComponent);

  /** References to trigger button elements for indicator measurement. */
  readonly triggerEls = viewChildren<ElementRef>('tabTrigger');

  private readonly baseId = `afi-tabs-${nextId++}`;
  private readonly internalIndex = signal(0);
  private readonly previousIndex = signal(0);

  /** Direction of the panel transition: 'left' or 'right'. */
  readonly slideDirection = computed(() =>
    this.currentIndex() >= this.previousIndex() ? 'left' : 'right',
  );

  /** Increments on every tab change to trigger CSS animation restart. */
  readonly animationKey = signal(0);

  /** Current active tab index. */
  readonly currentIndex = computed(() => this.internalIndex());

  // ─── Indicator positioning ───
  readonly indicatorWidth = signal(0);
  readonly indicatorOffset = signal(0);
  readonly indicatorTransform = computed(
    () => `translateX(${this.indicatorOffset()}px)`,
  );

  constructor() {
    // Sync controlled input → internal state
    effect(() => {
      const next = this.activeIndex();
      if (this.internalIndex() !== next) this.internalIndex.set(next);
    });

    // Recalculate indicator when index or tabs change
    effect(() => {
      const _ = this.currentIndex();
      const __ = this.tabs();
      requestAnimationFrame(() => this.updateIndicator());
    });
  }

  ngAfterViewInit(): void {
    this.updateIndicator();
  }

  tabId(index: number): string {
    return `${this.baseId}-tab-${index}`;
  }

  panelId(index: number): string {
    return `${this.baseId}-panel-${index}`;
  }

  activate(index: number): void {
    const tab = this.tabs()[index];
    if (tab?.disabled()) return;
    this.previousIndex.set(this.internalIndex());
    this.internalIndex.set(index);
    this.animationKey.update((k) => k + 1);
    this.activeChange.emit(index);
  }

  onKeydown(event: KeyboardEvent): void {
    const allTabs = this.tabs();
    const len = allTabs.length;
    const current = this.currentIndex();

    const findNext = (dir: 1 | -1): number => {
      let next = current;
      for (let i = 0; i < len; i++) {
        next = (next + dir + len) % len;
        const tab = allTabs[next];
        if (tab && !tab.disabled()) return next;
      }
      return current;
    };

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.focusTab(findNext(1));
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.focusTab(findNext(-1));
        break;
      case 'Home':
        event.preventDefault();
        this.focusTab(findNext(1 - len as 1));
        break;
      case 'End':
        event.preventDefault();
        for (let i = len - 1; i >= 0; i--) {
          const t = allTabs[i];
          if (t && !t.disabled()) {
            this.focusTab(i);
            break;
          }
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.activate(current);
        break;
    }
  }

  private updateIndicator(): void {
    const triggers = this.triggerEls();
    const idx = this.currentIndex();
    if (!triggers || idx < 0 || idx >= triggers.length) return;
    const el = triggers[idx]?.nativeElement as HTMLElement | undefined;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    this.indicatorOffset.set(elRect.left - parentRect.left);
    this.indicatorWidth.set(elRect.width);
  }

  private focusTab(index: number): void {
    const el = document.getElementById(this.tabId(index));
    if (el) {
      el.focus();
      this.activate(index);
    }
  }
}
