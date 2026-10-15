import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  isDevMode,
  model,
  OnInit,
  signal,
  viewChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { FieldHelpComponent } from '../field-help';
import { IconComponent } from '../icon';
import type { IconName } from '../icon';

import type { SegmentedControlAppearance, SegmentedControlSize } from './segmented-control.variants';

let nextId = 0;

export interface SegmentedOption {
  value: string;
  /** Visible text. Use an empty string for an icon-only segment (then give `ariaLabel`). */
  label: string;
  /** Glyph from the `afi-icon` set, drawn before the label. */
  icon?: IconName;
  /** Accessible name; required for an icon-only segment. */
  ariaLabel?: string;
  /** Count badge after the label. */
  count?: number;
  /** Small dot after the label (something new in this segment). */
  dot?: boolean;
  /** Quiet figure after the label. */
  meta?: string;
  disabled?: boolean;
}

/**
 * Segmented Control — a set of mutually exclusive options rendered as a
 * pill-style toggle bar with a sliding indicator.
 *
 * Under `[data-brand="unicaja"]` the stylesheet restructures the same markup
 * into radio cards, which is what Unicaja's Sarevi design calls for. That is a
 * brand decision, not a per-surface one, so there is no `variant` input to pass
 * — consumers render one control and the cascade settles the treatment.
 *
 * Uses semantic tokens for all visual values. Respects prefers-reduced-motion.
 *
 * With `label` set the control gains field anatomy (legend, `help`, `hint`,
 * `error`, `required`); without it the markup is the bare control.
 *
 * Accessibility:
 * - `role="radiogroup"` on the container, `role="radio"` + `aria-checked` on each option
 * - Roving tabindex: the checked option is the one tab stop; arrows move AND
 *   select (with wrap), Home and End jump, disabled options are skipped
 * - Focus ring via `--border-focus`
 *
 * @example
 * ```html
 * <afi-segmented-control
 *   [options]="[{value: 'a', label: 'A'}, {value: 'b', label: 'B'}]"
 *   [(value)]="selected"
 *   size="sm"
 * />
 * ```
 */
@Component({
  selector: 'afi-segmented-control',
  standalone: true,
  imports: [NgTemplateOutlet, IconComponent, FieldHelpComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './segmented-control.component.html',
  styleUrl: './segmented-control.component.scss',
})
export class SegmentedControlComponent implements AfterViewInit, OnInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private resizeObserver?: ResizeObserver;

  /** The available options to render. */
  readonly options = input.required<SegmentedOption[]>();

  /** Two-way bound value — the currently selected option's value. */
  readonly value = model.required<string>();

  /** Size variant (sm | md | lg). */
  readonly size = input<SegmentedControlSize>('md');

  /** Accessible label for the radiogroup (when there is no visible `label`). */
  readonly ariaLabel = input<string>('');

  /** `raised` (default) is a lifted white thumb; `solid` fills the thumb with the action colour. */
  readonly appearance = input<SegmentedControlAppearance>('raised');

  /** Stretch to the container; segments share the width equally. */
  readonly fullWidth = input<boolean>(false);

  /** Whole control disabled: the selection stays legible, nothing emits. */
  readonly disabled = input<boolean>(false);

  // ─── Field anatomy (opt-in: set `label`) ───
  readonly label = input<string | null>(null);
  readonly help = input<string | null>(null);
  readonly helpLabel = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly required = input<boolean>(false);

  readonly segId = `afi-seg-${nextId++}`;
  readonly legendId = `${this.segId}-legend`;
  readonly hintId = `${this.segId}-hint`;
  readonly errorId = `${this.segId}-error`;

  /** Hint and error render only with field anatomy (`label`), so only then are they referenced. */
  readonly describedBy = computed(() => {
    if (!this.label()) return null;
    if (this.error()) return this.errorId;
    return this.hint() ? this.hintId : null;
  });

  /** References to option button elements for indicator measurement. */
  readonly optionEls = viewChildren<ElementRef>('optionEl');

  // ─── Indicator state ───
  readonly indicatorWidth = signal(0);
  readonly indicatorHeight = signal(0);
  readonly indicatorOffset = signal(0);
  readonly indicatorTop = signal(0);
  /** False until the first measurement: the thumb must not slide in from nowhere on first paint. */
  readonly measured = signal(false);
  readonly indicatorTransform = computed(
    () => `translate(${this.indicatorOffset()}px, ${this.indicatorTop()}px)`,
  );

  constructor() {
    // Recalculate indicator when value, options, size, or view children change
    effect(() => {
      const _ = this.value();
      const __ = this.options();
      const ___ = this.optionEls();
      const ____ = this.size();
      // Double rAF to ensure layout has settled after size change
      requestAnimationFrame(() =>
        requestAnimationFrame(() => this.updateIndicator()),
      );
    });
  }

  ngOnInit(): void {
    if (!isDevMode()) return;
    for (const option of this.options()) {
      if (option.icon && !option.label && !option.ariaLabel) {
        console.warn(
          `[afi-segmented-control] Icon-only option "${option.value}" has no ariaLabel. ` +
            'Provide an ariaLabel on the option for accessibility.',
        );
      }
    }
  }

  ngAfterViewInit(): void {
    this.updateIndicator();
    this.observeSizeChanges();
    // Web fonts change label widths after first paint; measure again once they are in.
    document.fonts?.ready.then(() => this.updateIndicator());
  }

  select(option: SegmentedOption): void {
    if (this.disabled() || (option.disabled ?? false)) return;
    this.value.set(option.value);
  }

  /** The checked option is the one tab stop; with no match the first enabled one is. */
  tabIndexFor(option: SegmentedOption): number {
    const opts = this.options();
    const checked = opts.some((o) => o.value === this.value());
    if (checked) return option.value === this.value() ? 0 : -1;
    const firstEnabled = opts.find((o) => !(o.disabled ?? false));
    return option === firstEnabled ? 0 : -1;
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const opts = this.options();
    const enabled = opts.map((o, i) => ((o.disabled ?? false) ? -1 : i)).filter((i) => i >= 0);
    if (enabled.length === 0) return;
    const current = opts.findIndex((o) => o.value === this.value());
    const at = enabled.indexOf(current);
    let next: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = enabled[(at + 1) % enabled.length] ?? null;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = enabled[(at <= 0 ? enabled.length : at) - 1] ?? null;
        break;
      case 'Home':
        next = enabled[0] ?? null;
        break;
      case 'End':
        next = enabled[enabled.length - 1] ?? null;
        break;
      default:
        return;
    }
    event.preventDefault();
    if (next === null) return;
    const option = opts[next];
    if (!option) return;
    this.value.set(option.value);
    // Focus follows the selection; the host reads the rendered button, so go through the view children.
    this.optionEls()[next]?.nativeElement.focus();
  }

  private updateIndicator(): void {
    const els = this.optionEls();
    const opts = this.options();
    const currentValue = this.value();
    const idx = opts.findIndex(o => o.value === currentValue);
    if (idx < 0 || idx >= els.length) return;

    const el = els[idx]?.nativeElement as HTMLElement | undefined;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    this.indicatorOffset.set(elRect.left - parentRect.left);
    this.indicatorTop.set(elRect.top - parentRect.top);
    this.indicatorWidth.set(elRect.width);
    this.indicatorHeight.set(elRect.height);
    this.measured.set(true);
  }

  private observeSizeChanges(): void {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => this.updateIndicator());
    });
    this.resizeObserver.observe(this.host.nativeElement);

    const parent = this.host.nativeElement.parentElement;
    if (parent) {
      this.resizeObserver.observe(parent);
    }

    this.destroyRef.onDestroy(() => this.resizeObserver?.disconnect());
  }
}
