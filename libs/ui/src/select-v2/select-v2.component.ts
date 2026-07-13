import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  isDevMode,
  model,
  OnInit,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

import { MenuV2Component } from '../menu-v2/menu-v2.component';
import { MenuItemV2Component } from '../menu-v2/menu-item-v2.component';

import type { SelectV2Option, SelectV2Size } from './select-v2.variants';

let nextId = 0;

/** Rows shown before the panel scrolls (Documentation rule 4: never scroll < 8). */
const SCROLL_THRESHOLD = 8;
/** Gap between the trigger and the anchored panel. */
const PANEL_OFFSET = 4;
/** Design row heights per size (px) — layout math only, mirrors --height-component-*. */
const ROW_HEIGHT: Record<SelectV2Size, number> = { sm: 28, md: 32, lg: 40 };

interface PanelCoords {
  readonly top: number;
  readonly left: number;
  readonly width: number;
}

/**
 * Select — identity v2 (foundations-modern).
 *
 * Parallel primitive to the legacy `afi-select`; consumes only
 * `foundations-modern` tokens, so it renders correctly only inside a
 * `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: Select set (2406:2129) + documentation (2410:2101).
 * The trigger reuses input-v2's field chrome on a `<button role="combobox">`
 * plus a chevron that flips when open. The dropdown is an `afi-menu-v2` panel
 * (role="listbox") of `afi-menu-item-v2` rows (role="option") — the Menu panel
 * reused verbatim per documentation rule 1.
 *
 * Behaviour (Documentation "Usage rules"):
 *  - Single-select (rule 5): one selected value; multi-select is a different
 *    pattern.
 *  - Open reuses Focus tokens + chevron 180° (rule 6).
 *  - Panel width matches the trigger (rule 7), anchored with `position: fixed`
 *    so it escapes ancestor overflow; it flips above when there's no room below
 *    and closes on scroll/resize (matches legacy afi-menu, and the Linear/Notion
 *    "menu closes when the page moves" UX).
 *  - Caps at 8 rows then scrolls (rule 4). A search row beyond 8 items is a
 *    future Command-Palette pattern, not built here.
 *
 * A11y: the APG "select-only combobox" pattern — DOM focus stays on the trigger;
 * `aria-activedescendant` tracks the highlighted option. Keyboard: Up/Down/Home/
 * End move the cursor, Enter/Space select, Escape closes (refocus trigger), Tab
 * closes, and printable keys type-ahead to a matching label.
 */
@Component({
  selector: 'afi-select-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuV2Component, MenuItemV2Component],
  templateUrl: './select-v2.component.html',
  styleUrls: ['./select-v2.component.scss'],
})
export class SelectV2Component implements OnInit {
  readonly size = input<SelectV2Size>('md');
  readonly options = input<readonly SelectV2Option[]>([]);
  readonly value = model<string | null>(null);
  readonly placeholder = input<string>('Seleccione…');
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly opened = output<void>();
  readonly closed = output<void>();

  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  // Signal queries can't live on ES-#private fields (NG1053) — use the TS keyword.
  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  // `read: ElementRef` — #optionEl sits on a component, so the default read would
  // return the MenuItemV2Component instance, not its host element.
  private readonly optionEls = viewChildren('optionEl', { read: ElementRef });

  readonly triggerId = `afi-select-v2-${nextId++}`;
  readonly listboxId = `${this.triggerId}-listbox`;
  readonly hintId = `${this.triggerId}-hint`;
  readonly errorId = `${this.triggerId}-error`;

  readonly open = signal(false);
  readonly activeIndex = signal(-1);
  readonly #coords = signal<PanelCoords | null>(null);

  #typeBuffer = '';
  #typeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Keep the keyboard cursor scrolled into view while arrowing a long list.
    effect(() => {
      const i = this.activeIndex();
      if (!this.open() || i < 0) return;
      const el = this.optionEls()[i]?.nativeElement;
      el?.scrollIntoView({ block: 'nearest' });
    });
  }

  readonly selectedOption = computed(
    () => this.options().find((o) => o.value === this.value()) ?? null,
  );
  readonly hasValue = computed(() => this.selectedOption() !== null);
  readonly displayText = computed(() => this.selectedOption()?.label ?? this.placeholder());

  readonly panelTop = computed(() => this.#coords()?.top ?? null);
  readonly panelLeft = computed(() => this.#coords()?.left ?? null);
  readonly panelWidth = computed(() => this.#coords()?.width ?? null);

  readonly panelMaxBlockSize = computed(() => {
    const rowVar = {
      sm: '--height-component-sm',
      md: '--height-component-md',
      lg: '--height-component-lg',
    }[this.size()];
    // 8 rows + inter-row gaps + the panel's own top/bottom padding.
    return `calc(${SCROLL_THRESHOLD} * var(${rowVar}) + ${SCROLL_THRESHOLD - 1} * var(--gap-menu-item) + 2 * var(--dimension-1))`;
  });

  readonly triggerClasses = computed(() => {
    const parts = ['afi-select-v2__trigger', `afi-select-v2__trigger--${this.size()}`];
    if (!this.hasValue()) parts.push('afi-select-v2__trigger--placeholder');
    if (this.open()) parts.push('afi-select-v2__trigger--open');
    if (this.error()) parts.push('afi-select-v2__trigger--error');
    if (this.disabled()) parts.push('afi-select-v2__trigger--disabled');
    return parts.join(' ');
  });

  readonly describedBy = computed(() => {
    if (this.error()) return this.errorId;
    if (this.hint()) return this.hintId;
    return null;
  });

  readonly activeOptionId = computed(() =>
    this.open() && this.activeIndex() >= 0 ? this.optionId(this.activeIndex()) : null,
  );

  optionId(index: number): string {
    return `${this.triggerId}-option-${index}`;
  }

  ngOnInit(): void {
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-select-v2] Select "${this.triggerId}" has neither label nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  onTriggerClick(): void {
    if (this.disabled()) return;
    this.open() ? this.close() : this.openPanel();
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    if (!this.open()) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        this.openPanel();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.#moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.#moveActive(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.#setActive(this.#firstEnabled());
        break;
      case 'End':
        event.preventDefault();
        this.#setActive(this.#lastEnabled());
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.#selectActive();
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'Tab':
        this.close({ refocus: false });
        break;
      default:
        if (event.key.length === 1 && /\S/.test(event.key)) {
          this.#typeahead(event.key);
        }
    }
  }

  onOptionClick(index: number): void {
    const option = this.options()[index];
    if (!option || option.disabled) return;
    this.value.set(option.value);
    this.close();
  }

  openPanel(): void {
    if (this.disabled() || this.open()) return;
    const selected = this.options().findIndex((o) => o.value === this.value());
    this.activeIndex.set(selected >= 0 ? selected : this.#firstEnabled());
    this.#reposition();
    this.open.set(true);
    this.opened.emit();
  }

  close(opts: { refocus?: boolean } = {}): void {
    if (!this.open()) return;
    this.open.set(false);
    this.activeIndex.set(-1);
    this.#coords.set(null);
    this.closed.emit();
    if (opts.refocus !== false) {
      this.triggerRef()?.nativeElement.focus();
    }
  }

  #selectActive(): void {
    const i = this.activeIndex();
    if (i >= 0) this.onOptionClick(i);
  }

  #moveActive(direction: 1 | -1): void {
    const next = this.#nextEnabled(this.activeIndex(), direction);
    if (next >= 0) this.#setActive(next);
  }

  #setActive(index: number): void {
    if (index >= 0) this.activeIndex.set(index);
  }

  #firstEnabled(): number {
    return this.options().findIndex((o) => !o.disabled);
  }

  #lastEnabled(): number {
    const opts = this.options();
    for (let i = opts.length - 1; i >= 0; i--) {
      if (!opts[i]?.disabled) return i;
    }
    return -1;
  }

  #nextEnabled(from: number, direction: 1 | -1): number {
    const opts = this.options();
    for (let i = from + direction; i >= 0 && i < opts.length; i += direction) {
      if (!opts[i]?.disabled) return i;
    }
    return -1;
  }

  #typeahead(char: string): void {
    this.#typeBuffer += char.toLowerCase();
    if (this.#typeTimer) clearTimeout(this.#typeTimer);
    this.#typeTimer = setTimeout(() => (this.#typeBuffer = ''), 500);

    const match = this.options().findIndex(
      (o) => !o.disabled && o.label.toLowerCase().startsWith(this.#typeBuffer),
    );
    if (match >= 0) this.#setActive(match);
  }

  #reposition(): void {
    const trigger = this.triggerRef()?.nativeElement;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();

    const count = Math.min(this.options().length, SCROLL_THRESHOLD);
    const estPanelHeight = count * ROW_HEIGHT[this.size()] + (count - 1) * 2 + 2 * 4;

    // Open downward by default; flip up only when the viewport is measurable,
    // there isn't room below, and there genuinely is room above.
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const flipUp =
      viewportHeight > 0 &&
      viewportHeight - rect.bottom < estPanelHeight + PANEL_OFFSET &&
      rect.top > estPanelHeight + PANEL_OFFSET;

    const top = flipUp
      ? rect.top - PANEL_OFFSET - estPanelHeight
      : rect.bottom + PANEL_OFFSET;

    this.#coords.set({ top: Math.max(top, PANEL_OFFSET), left: rect.left, width: rect.width });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    if (!this.#host.nativeElement.contains(event.target as Node)) {
      this.close({ refocus: false });
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportShift(): void {
    if (this.open()) this.close({ refocus: false });
  }
}
