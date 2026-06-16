import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import type {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-chip.component.html',
  styleUrls: ['./filter-chip.component.scss'],
})
export class FilterChipComponent {
  // ── Shared inputs ───────────────────────────────────────────────────
  readonly label = input.required<string>();
  readonly size = input<FilterChipSize>('md');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);
  readonly mode = input<FilterChipMode>('toggle');

  // ── Toggle-mode inputs/outputs ─────────────────────────────────────
  readonly selected = input<boolean>(false);
  readonly count = input<number | null>(null);
  readonly dismissable = input<boolean>(false);
  readonly selectedChange = output<boolean>();
  readonly dismissed = output<void>();

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
      this.isDropdown() ? 'afi-chip--mode-dropdown' : 'afi-chip--mode-toggle',
    ];
    if (this.triggerActive()) parts.push('afi-chip--selected');
    if (this.disabled()) parts.push('afi-chip--disabled');
    if (this.menuOpen()) parts.push('afi-chip--open');
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

  // ── Trigger handler — same click target for both modes ─────────────
  onToggle(): void {
    if (this.disabled()) return;
    if (this.isDropdown()) {
      this.menuOpen.update((v) => !v);
      return;
    }
    this.selectedChange.emit(!this.selected());
  }

  // ── Toggle-mode handlers ───────────────────────────────────────────
  onDismiss(event: Event): void {
    if (this.disabled()) return;
    event.stopPropagation();
    this.dismissed.emit();
  }

  // ── Dropdown-mode handlers ─────────────────────────────────────────
  onClear(event: Event): void {
    if (this.disabled()) return;
    event.stopPropagation();
    this.selectedValuesChange.emit(new Set());
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen()) return;
    const target = event.target as Node | null;
    if (target && this.host.nativeElement.contains(target)) return;
    this.closeMenu();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
