import {
  afterRenderEffect,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  computed,
  viewChild,
  viewChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { IconComponent } from '../icon';
import type { IconName } from '../icon';
import { TabItemComponent } from './tab-item.component';
import type { TabsItem, TabsSize } from './tabs.variants';

let nextId = 0;

/** One tab as the bar draws it, whether it came from `<afi-tab-item>` or from `items`. */
interface TabEntry {
  value: string;
  label: string;
  icon: IconName | null;
  count: number | string | null;
  disabled: boolean;
}

/**
 * Tabs — underline-style tab bar with animated sliding underline indicator.
 *
 * Content lives inside `<afi-tab-item>` children and is conditionally
 * rendered into tab panels. Supports lazy rendering via the `lazy` input.
 * Selection is by position (`activeIndex`) or by key (`value`); with `items`
 * the component draws the bar only and the consumer owns the panels
 * (see `afi-tab-panel`).
 *
 * Implements WAI-ARIA tablist/tab/tabpanel with roving tabindex and automatic
 * activation: one tab stop, arrows move and select (wrapping), Home and End
 * jump, disabled tabs are skipped.
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
  imports: [NgTemplateOutlet, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent implements AfterViewInit {
  /** Controlled active tab index. Ignored while `value` is bound. */
  readonly activeIndex = input<number>(0);

  /**
   * Controlled active tab by key. A tab-item without its own `value` is keyed by
   * its position as a string. `null` means nothing is selected (keyboard entry is
   * then the first enabled tab). Unset: `activeIndex` decides.
   */
  readonly value = input<string | null | undefined>(undefined);

  /** Initial tab by key when `value` is not bound. Used only if it names an enabled tab. */
  readonly defaultValue = input<string | undefined>(undefined);

  /** Tabs as data: the bar only, no projected panels. Strings or `{ value, label, icon, count, disabled }`. */
  readonly items = input<ReadonlyArray<string | TabsItem> | null>(null);

  /**
   * Prefix for the tab ids in `items` mode (`<prefix>-<value>`), so a consumer-owned
   * `afi-tab-panel` can name itself through `aria-labelledby`.
   */
  readonly idPrefix = input<string | null>(null);

  /** Stretch the tabs to fill the width. */
  readonly fullWidth = input<boolean>(false);

  /** Size variant — affects trigger height and font size. */
  readonly size = input<TabsSize>('md');

  /** Lazy rendering — only mount the active panel's content. */
  readonly lazy = input<boolean>(false);

  /** Accessible label for the tablist. */
  readonly ariaLabel = input<string | null>(null);

  /** Emits the new index when the user activates a tab. */
  readonly activeChange = output<number>();

  /** Emits the new key when the user activates a tab. */
  readonly valueChange = output<string>();

  /** Projected `<afi-tab-item>` children. */
  readonly tabs = contentChildren(TabItemComponent);

  /** References to trigger button elements for indicator measurement. */
  readonly triggerEls = viewChildren<ElementRef>('tabTrigger');

  /** The tablist element, observed so the indicator follows its size. */
  private readonly listEl = viewChild<ElementRef<HTMLElement>>('tablist');

  private readonly baseId = `afi-tabs-${nextId++}`;
  private readonly internalIndex = signal(0);
  private readonly destroyRef = inject(DestroyRef);
  private resizeObserver: ResizeObserver | null = null;
  private seeded = false;
  private keySeen = false;
  private lastKey: string | null = null;
  private defaultApplied = false;

  /** Bumps on every change after the first value (a click or a change from outside); the panel animates when it is above zero. */
  readonly animationKey = signal(0);

  /** False until the first measurement settles, so the indicator does not fly in. */
  readonly indicatorSettled = signal(false);

  /** True when the consumer owns the panels (`items`). */
  readonly barOnly = computed(() => this.items() !== null);

  /** The tabs as the bar draws them. */
  readonly entries = computed<TabEntry[]>(() => {
    const given = this.items();
    if (given) {
      return given.map((t) =>
        typeof t === 'string'
          ? { value: t, label: t, icon: null, count: null, disabled: false }
          : {
              value: t.value,
              label: t.label,
              icon: t.icon ?? null,
              count: t.count ?? null,
              disabled: t.disabled ?? false,
            },
      );
    }
    return this.tabs().map((t, i) => ({
      value: t.value() ?? String(i),
      label: t.label(),
      icon: t.icon(),
      count: t.count() ?? t.badge(),
      disabled: t.disabled(),
    }));
  });

  /**
   * Current active tab index; -1 when nothing is selected. A bound `value`
   * decides on its own (the consumer owns the selection); otherwise the index
   * the user or `activeIndex` last set.
   */
  readonly currentIndex = computed(() => {
    const key = this.value();
    if (key === undefined) return this.internalIndex();
    return key === null ? -1 : this.entries().findIndex((t) => t.value === key);
  });

  /** The one tab that takes keyboard focus: the selected tab, else the first enabled one. */
  readonly entryIndex = computed(() => {
    const list = this.entries();
    const cur = this.currentIndex();
    if (cur >= 0 && list[cur] && !list[cur].disabled) return cur;
    return list.findIndex((t) => !t.disabled);
  });

  // ─── Indicator positioning ───
  readonly indicatorWidth = signal(0);
  readonly indicatorOffset = signal(0);
  readonly indicatorTransform = computed(
    () => `translateX(${this.indicatorOffset()}px)`,
  );

  constructor() {
    // Sync the controlled inputs. This reads inputs only (never the projected tab items, whose
    // inputs are not set yet when an effect first runs).
    effect(() => {
      const key = this.value();
      const index = this.activeIndex();
      if (key !== undefined) {
        // A change from outside animates like a click; the very first value does not.
        if (this.keySeen && key !== this.lastKey) this.animationKey.update((k) => k + 1);
        this.keySeen = true;
        this.lastKey = key;
        return;
      }
      if (this.internalIndex() !== index) {
        this.internalIndex.set(index);
        if (this.seeded) this.animationKey.update((k) => k + 1);
      }
      this.seeded = true;
    });

    // `defaultValue` picks the first selection once the tab list exists.
    afterRenderEffect(() => {
      const wanted = this.defaultValue();
      const list = this.entries();
      if (this.defaultApplied || this.value() !== undefined || wanted === undefined || !list.length) return;
      this.defaultApplied = true;
      const at = list.findIndex((t) => t.value === wanted && !t.disabled);
      if (at >= 0) this.internalIndex.set(at);
    });

    // Recalculate indicator when index or tabs change
    afterRenderEffect(() => {
      const _ = this.currentIndex();
      const __ = this.entries();
      requestAnimationFrame(() => this.updateIndicator());
    });

    // The bar is measured from the trigger boxes, so it must follow whatever resizes them: the
    // window, a webfont arriving, a label or count changing.
    effect(() => {
      const list = this.listEl()?.nativeElement;
      const triggers = this.triggerEls();
      if (typeof ResizeObserver === 'undefined' || !list) return;
      this.resizeObserver?.disconnect();
      this.resizeObserver = new ResizeObserver(() => this.updateIndicator());
      this.resizeObserver.observe(list);
      triggers.forEach((t) => this.resizeObserver?.observe(t.nativeElement as HTMLElement));
    });
    this.destroyRef.onDestroy(() => this.resizeObserver?.disconnect());
  }

  ngAfterViewInit(): void {
    if (typeof requestAnimationFrame === 'undefined') return;
    this.updateIndicator();
    // Settle one frame after the first real measurement, so the bar is placed before its
    // transition switches on.
    requestAnimationFrame(() => {
      this.updateIndicator();
      requestAnimationFrame(() => this.indicatorSettled.set(true));
    });
    document.fonts?.ready.then(() => this.updateIndicator());
  }

  tabId(index: number): string {
    const prefix = this.idPrefix();
    const entry = this.entries()[index];
    return prefix && entry ? `${prefix}-${entry.value}` : `${this.baseId}-tab-${index}`;
  }

  panelId(index: number): string {
    return `${this.baseId}-panel-${index}`;
  }

  activate(index: number): void {
    const entry = this.entries()[index];
    if (!entry || entry.disabled || index === this.currentIndex()) return;
    this.internalIndex.set(index);
    this.animationKey.update((k) => k + 1);
    this.activeChange.emit(index);
    this.valueChange.emit(entry.value);
  }

  onKeydown(event: KeyboardEvent): void {
    const list = this.entries();
    const enabled = list.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0);
    if (!enabled.length) return;
    const key = event.key;
    if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Home' && key !== 'End') return;

    // Start from the tab that has focus (it can differ from the selected one when the consumer
    // owns the selection and has not echoed the change yet).
    const focused = this.triggerEls().findIndex((t) => t.nativeElement === event.target);
    const at = Math.max(0, enabled.indexOf(focused >= 0 ? focused : this.entryIndex()));
    const n = enabled.length;
    const to =
      key === 'Home' ? 0 : key === 'End' ? n - 1 : key === 'ArrowRight' ? (at + 1) % n : (at - 1 + n) % n;
    event.preventDefault();
    const target = enabled[to];
    if (target !== undefined) this.focusTab(target);
  }

  private updateIndicator(): void {
    const triggers = this.triggerEls();
    const idx = this.currentIndex();
    if (!triggers || idx < 0 || idx >= triggers.length) {
      this.indicatorWidth.set(0);
      return;
    }
    const el = triggers[idx]?.nativeElement as HTMLElement | undefined;
    if (!el) return;
    this.indicatorOffset.set(el.offsetLeft);
    this.indicatorWidth.set(el.offsetWidth);
  }

  private focusTab(index: number): void {
    const el = this.triggerEls()[index]?.nativeElement as HTMLElement | undefined;
    if (el) {
      el.focus();
      this.activate(index);
    }
  }
}
