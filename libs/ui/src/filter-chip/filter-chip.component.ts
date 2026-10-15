import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { FloatingPanel, onOverlayEscape } from '../floating-panel';
import { IconComponent } from '../icon';

import type {
  FilterChipAppearance,
  FilterChipMode,
  FilterChipOption,
  FilterChipSize,
} from './filter-chip.variants';

/**
 * afi-filter-chip — pill-shaped filter control.
 *
 * Two behavior modes (`[mode]`):
 *
 * - `toggle` (default) — single pill that toggles on/off via `[selected]`
 *   / `(selectedChange)`. Drop a row of these when the filter set is
 *   small (≤ 5 values). Supports an optional leading icon slot, count
 *   badge, and dismiss "×" button.
 *
 * - `dropdown` — one pill labeled by `[label]` that opens a panel of
 *   multi-select checkbox rows defined by `[options]`. Selection set is
 *   bound via `[selectedValues]` / `(selectedValuesChange)`. The pill
 *   surfaces the active count and a clear button when any values are
 *   selected. Use when the filter set is larger or several filter axes
 *   share one row (the Patrimonio convention).
 *
 * For a single-select group, use `<afi-segmented-control>` instead —
 * filter chips are multi-select by design.
 */
@Component({
  selector: 'afi-filter-chip',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-chip.component.html',
  styleUrls: ['./filter-chip.component.scss'],
})
export class FilterChipComponent implements OnDestroy {
  // ── Shared inputs ───────────────────────────────────────────────────
  readonly label = input.required<string>();
  readonly size = input<FilterChipSize>('md');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);
  readonly mode = input<FilterChipMode>('toggle');

  // ── Toggle-mode inputs/outputs ─────────────────────────────────────
  readonly selected = input<boolean>(false);
  /** The value this filter applied (shown after a divider while `selected`; the owner holds it). */
  readonly value = input<string | null>(null);
  readonly appearance = input<FilterChipAppearance>('default');
  /** Trailing × that removes the chip (`removed`); selection is left alone. */
  readonly removable = input<boolean>(false);
  /** Menu-trigger mode: the body opens a panel owned by the consumer (a Select or MultiSelect `trigger`). */
  readonly asTrigger = input<boolean>(false);
  /** Panel open state, for `asTrigger`. */
  readonly expanded = input<boolean>(false);
  /** Trigger mode: id of the panel's listbox (`aria-controls`). */
  readonly controls = input<string | null>(null);
  /** Trigger mode: id of the highlighted row while the panel is open (`aria-activedescendant`). */
  readonly activeId = input<string | null>(null);
  readonly count = input<number | null>(null);
  readonly dismissable = input<boolean>(false);
  readonly selectedChange = output<boolean>();
  /** @deprecated Use `removed`. */
  readonly dismissed = output<void>();
  readonly removed = output<void>();
  /** The × beside an applied value: clears it. */
  readonly cleared = output<void>();
  /** Trigger mode: the body was pressed (open or close the panel). */
  readonly toggled = output<void>();
  /** Trigger mode: the leading ⊗ cleared this one filter. Never opens the panel. */
  readonly reset = output<void>();

  // ── Dropdown-mode inputs/outputs ───────────────────────────────────
  /** Options shown inside the dropdown panel. Ignored in toggle mode. */
  readonly options = input<readonly FilterChipOption[]>([]);
  /** Set of currently-selected option values. Ignored in toggle mode. */
  readonly selectedValues = input<ReadonlySet<string>>(new Set());
  /** Optional "Todos" / "Select all" row inside the dropdown panel. */
  readonly showSelectAll = input<boolean>(true);
  readonly selectAllLabel = input<string>('Todos');
  /** ARIA label for the dropdown panel itself. */
  readonly dropdownAriaLabel = input<string>('Filtrar opciones');
  /** Optional textual summary shown next to the label when the dropdown
   *  is active (e.g. "Inmuebles + 2"). When null/empty the trigger falls
   *  back to the numeric count. Mirrors the Patrimonio convention. */
  readonly selectionLabel = input<string | null>(null);
  readonly selectedValuesChange = output<ReadonlySet<string>>();

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly panelEl = viewChild<ElementRef<HTMLElement>>('panelEl');
  private readonly floating = new FloatingPanel();
  private disposeEscape: (() => void) | null = null;

  constructor() {
    // The built-in dropdown renders in the template; the floating panel portals
    // it under the chip, and closes it on an outside press or Escape.
    effect(() => {
      const panel = this.panelEl()?.nativeElement;
      if (panel) {
        this.floating.attach(panel, this.host.nativeElement, {
          side: 'bottom',
          align: 'start',
          onOutside: () => this.closeMenu(),
        });
        this.disposeEscape ??= onOverlayEscape(() => this.closeMenu());
      } else {
        this.release();
      }
    });
  }

  ngOnDestroy(): void {
    this.release();
  }

  private release(): void {
    this.floating.detach();
    this.disposeEscape?.();
    this.disposeEscape = null;
  }

  // ── Dropdown panel state ───────────────────────────────────────────
  readonly menuOpen = signal<boolean>(false);

  readonly selectedCount = computed<number>(() => this.selectedValues().size);
  readonly hasSelection = computed<boolean>(() => this.selectedCount() > 0);

  /** Trigger summary — Patrimonio shows a short textual label next to
   *  the chip name when the dropdown has a selection. We surface that
   *  via `[selectionLabel]`; when omitted we fall back to the count. */
  readonly triggerSummary = computed<string>(() => {
    const label = this.selectionLabel();
    if (label !== null && label.trim().length > 0) return label.trim();
    return String(this.selectedCount());
  });

  readonly isDropdown = computed<boolean>(() => this.mode() === 'dropdown');

  /** The body opens something (the built-in menu, or a panel the consumer owns). */
  readonly isTrigger = computed<boolean>(() => this.isDropdown() || this.asTrigger());

  readonly isOpen = computed<boolean>(() =>
    this.isDropdown() ? this.menuOpen() : this.asTrigger() && this.expanded(),
  );

  /** The text shown after the divider while a value is applied. */
  readonly appliedText = computed<string | null>(() => {
    if (this.isDropdown()) return this.hasSelection() ? this.triggerSummary() : null;
    const v = this.value();
    return this.selected() && v !== null && v.length > 0 ? v : null;
  });

  /** Leading ⊗ (trigger modes): clears that one filter without opening the panel. */
  readonly showReset = computed<boolean>(
    () => this.isTrigger() && this.triggerActive() && !this.disabled(),
  );

  /** × beside an applied value in toggle mode: clears it. */
  readonly showClear = computed<boolean>(
    () => !this.isTrigger() && this.appliedText() !== null && !this.disabled(),
  );

  /** Trailing remove ×; replaced by the clear × while a value shows. */
  readonly showRemove = computed<boolean>(
    () =>
      !this.isTrigger() &&
      (this.removable() || this.dismissable()) &&
      !this.showClear() &&
      !this.disabled(),
  );

  /** Trigger pill is "active" when any value is selected (dropdown mode)
   *  OR the chip itself is selected (toggle mode). Drives the
   *  highlighted styling on the trigger. */
  readonly triggerActive = computed<boolean>(() =>
    this.isDropdown() ? this.hasSelection() : this.selected(),
  );

  readonly hasCount = computed<boolean>(() => this.count() !== null);

  readonly classes = computed<string>(() => {
    const parts = [
      'afi-chip',
      `afi-chip--${this.size()}`,
      `afi-chip--${this.appearance()}`,
      this.isDropdown() ? 'afi-chip--mode-dropdown' : 'afi-chip--mode-toggle',
    ];
    if (this.triggerActive()) parts.push('afi-chip--selected');
    if (this.disabled()) parts.push('afi-chip--disabled');
    if (this.isOpen()) parts.push('afi-chip--open');
    return parts.join(' ');
  });

  /** True when every option is selected OR no options are selected
   *  (the "all" semantic = no active filter). */
  readonly isAllSelected = computed<boolean>(() => {
    const opts = this.options();
    if (opts.length === 0) return false;
    const sel = this.selectedValues();
    return sel.size === 0 || opts.every((o) => sel.has(o.value));
  });

  // ── Body click: toggles, or opens the panel in trigger modes ───────
  onToggle(): void {
    if (this.disabled()) return;
    if (this.isDropdown()) {
      this.menuOpen.update((v) => !v);
      return;
    }
    if (this.asTrigger()) {
      this.toggled.emit();
      return;
    }
    this.selectedChange.emit(!this.selected());
  }

  onRemove(): void {
    if (this.disabled()) return;
    this.removed.emit();
    this.dismissed.emit();
  }

  /** The × beside an applied value. */
  onClearValue(): void {
    if (this.disabled()) return;
    this.cleared.emit();
  }

  /** The leading ⊗: clears this filter only; it never reaches the body. */
  onReset(): void {
    if (this.disabled()) return;
    if (this.isDropdown()) {
      this.selectedValuesChange.emit(new Set());
      return;
    }
    this.reset.emit();
  }

  toggleOption(value: string, event?: Event): void {
    if (this.disabled()) return;
    event?.stopPropagation();
    const next = new Set(this.selectedValues());
    if (next.has(value)) next.delete(value);
    else next.add(value);
    this.selectedValuesChange.emit(next);
  }

  toggleSelectAll(event?: Event): void {
    if (this.disabled()) return;
    event?.stopPropagation();
    if (this.isAllSelected()) {
      // "Todos" semantics: clear selection = show all rows downstream.
      this.selectedValuesChange.emit(new Set());
    } else {
      const all = this.options().map((o) => o.value);
      this.selectedValuesChange.emit(new Set(all));
    }
  }

  isOptionSelected(value: string): boolean {
    return this.selectedValues().has(value);
  }

  closeMenu(): void {
    if (this.menuOpen()) this.menuOpen.set(false);
  }
}
