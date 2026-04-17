import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
  output,
  signal,
  computed,
} from '@angular/core';

import { TabComponent } from './tab.component';
import { tabSizeClasses, TabsSize } from './tabs.variants';

let nextId = 0;

/**
 * Tabs primitive.
 *
 * Implements ARIA tablist/tab/tabpanel pattern with keyboard navigation.
 * No CDK dependency — manual arrow/Home/End handling.
 */
@Component({
  selector: 'afi-tabs',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="tablist"
      [attr.aria-label]="ariaLabel()"
      class="flex border-b border-border-hairline"
      (keydown)="onKeydown($event)"
    >
      @for (tab of tabs(); track $index) {
        <button
          type="button"
          role="tab"
          [id]="tabId($index)"
          [attr.aria-selected]="$index === activeIndex()"
          [attr.aria-controls]="panelId($index)"
          [tabindex]="$index === activeIndex() ? 0 : -1"
          [disabled]="tab.disabled()"
          [class]="tabClasses($index)"
          (click)="activate($index)"
        >
          {{ tab.label() }}
          @if (tab.badge() !== null) {
            <span class="ml-space-1 inline-flex items-center justify-center rounded-full bg-action text-white text-body-sm px-1.5 min-w-[20px] h-5">
              {{ tab.badge() }}
            </span>
          }
        </button>
      }
    </div>
    @for (tab of tabs(); track $index) {
      <div
        role="tabpanel"
        [id]="panelId($index)"
        [attr.aria-labelledby]="tabId($index)"
        [hidden]="lazy() ? undefined : $index !== activeIndex()"
      >
        @if (!lazy() || $index === activeIndex()) {
          <ng-content />
        }
      </div>
    }
  `,
})
export class TabsComponent {
  readonly activeIndex = input<number>(0);
  readonly size = input<TabsSize>('md');
  readonly lazy = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly activeChange = output<number>();

  readonly tabs = contentChildren(TabComponent);

  private readonly baseId = `afi-tabs-${nextId++}`;
  private readonly internalIndex = signal(0);

  tabId(index: number): string {
    return `${this.baseId}-tab-${index}`;
  }

  panelId(index: number): string {
    return `${this.baseId}-panel-${index}`;
  }

  tabClasses(index: number): string {
    const active = index === this.activeIndex();
    return [
      'inline-flex items-center gap-space-1 border-b-2 -mb-px',
      'transition-colors duration-fast ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-inset',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      tabSizeClasses[this.size()],
      active
        ? 'border-action text-action font-medium'
        : 'border-transparent text-neutral-500 hover:text-canvas-fg hover:bg-surface-100',
    ].join(' ');
  }

  activate(index: number): void {
    const tab = this.tabs()[index];
    if (tab?.disabled()) return;
    this.internalIndex.set(index);
    this.activeChange.emit(index);
  }

  onKeydown(event: KeyboardEvent): void {
    const allTabs = this.tabs();
    const len = allTabs.length;
    let current = this.activeIndex();

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
        this.focusTab(findNext(1 - len as 1)); // find first non-disabled from start
        break;
      case 'End':
        event.preventDefault();
        // find last non-disabled
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

  private focusTab(index: number): void {
    const el = document.getElementById(this.tabId(index));
    if (el) {
      el.focus();
      this.activate(index);
    }
  }
}
