import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, HostListener, inject, input, isDevMode, model, OnInit, output, signal, viewChild, viewChildren } from '@angular/core';

import { AFI_UI_COPY } from '../copy';

import { MenuV2Component } from '../menu-v2/menu-v2.component';
import { MenuItemV2Component } from '../menu-v2/menu-item-v2.component';

import type { SearchV2Size, SearchV2Suggestion } from './search-v2.variants';

let nextId = 0;

/** Gap between the field and the anchored preview panel. */
const PANEL_OFFSET = 4;
/** Rows shown before the panel scrolls. */
const SCROLL_THRESHOLD = 8;
/** Approx preview row height (px) — layout math only, for the flip calc. */
const ROW_HEIGHT = 44;

interface PanelCoords {
  readonly top: number;
  readonly left: number;
  readonly width: number;
}

/**
 * Search — identity v2 (foundations-modern).
 *
 * A search field whose typeahead preview reuses the `afi-select-v2` dropdown
 * harness: the matches render in an `afi-menu-v2` panel (role="listbox") of
 * `afi-menu-item-v2` rows (role="option"), anchored with `position: fixed` so it
 * escapes ancestor overflow and flips above when there's no room below.
 * Composed from existing v2 primitives — no bespoke dropdown.
 *
 * Two ways to use it:
 *  - **Filter** — bind `(valueChange)` to a filter signal; leave `suggestions`
 *    empty and no preview renders (the filtered surface is the feedback).
 *  - **Typeahead preview** — feed `[suggestions]` (consumer filters over
 *    `value()`); the panel previews the matches while typing and
 *    `(suggestionPicked)` commits a choice.
 *
 * A11y: the APG editable-combobox pattern — DOM focus stays in the `<input
 * role="combobox" aria-autocomplete="list">`; `aria-activedescendant` tracks the
 * highlighted option. Up/Down move, Enter commits the active option (else emits
 * `searched`), Escape closes, printable keys just type. Consumes only
 * `foundations-modern` tokens.
 */
@Component({
  selector: 'afi-search-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuV2Component, MenuItemV2Component],
  templateUrl: './search-v2.component.html',
  styleUrls: ['./search-v2.component.scss'],
})
export class SearchV2Component implements OnInit {

  /** Optional page-level chrome copy; per-instance inputs still win. */
  private readonly uiCopy = inject(AFI_UI_COPY, { optional: true });
  readonly size = input<SearchV2Size>('md');
  readonly value = model<string>('');
  readonly placeholder = input<string>('Buscar');
  readonly label = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly suggestions = input<readonly SearchV2Suggestion[]>([]);
  readonly emptyMessage = input<string>('Sin coincidencias.');
  /** Accessible name for the clear (×) button. */
  readonly clearLabel = input<string | null>(null);
  readonly clearLabelText = computed(
    () => this.clearLabel() ?? this.uiCopy?.()?.clearSearch ?? 'Borrar búsqueda',
  );

  readonly searched = output<string>();
  readonly cleared = output<void>();
  readonly suggestionPicked = output<SearchV2Suggestion>();

  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');
  private readonly fieldRef = viewChild<ElementRef<HTMLElement>>('field');
  private readonly optionEls = viewChildren('optionEl', { read: ElementRef });

  readonly inputId = `afi-search-v2-${nextId++}`;
  readonly labelId = `${this.inputId}-label`;
  readonly listboxId = `${this.inputId}-listbox`;

  readonly focused = signal(false);
  readonly activeIndex = signal(-1);
  readonly #coords = signal<PanelCoords | null>(null);

  constructor() {
    // Keep the keyboard cursor scrolled into view while arrowing a long list.
    effect(() => {
      const i = this.activeIndex();
      if (!this.isOpen() || i < 0) return;
      this.optionEls()[i]?.nativeElement?.scrollIntoView({ block: 'nearest' });
    });
  }

  readonly hasValue = computed(() => this.value().length > 0);
  readonly hasSuggestions = computed(() => this.suggestions().length > 0);

  /** Preview list opens while focused, once typed, if there are matches. */
  readonly showSuggestions = computed(
    () => this.focused() && this.hasValue() && this.hasSuggestions() && !this.disabled(),
  );
  /** "No matches" panel when the consumer wired suggestions but there are none. */
  readonly showEmpty = computed(
    () => this.focused() && this.hasValue() && !this.hasSuggestions() && !this.disabled(),
  );
  readonly isOpen = computed(() => this.showSuggestions() || this.showEmpty());

  readonly panelTop = computed(() => this.#coords()?.top ?? null);
  readonly panelLeft = computed(() => this.#coords()?.left ?? null);
  readonly panelWidth = computed(() => this.#coords()?.width ?? null);

  // 8 preview rows (label + optional description) + gaps + panel padding.
  readonly panelMaxBlockSize = computed(
    () =>
      `calc(${SCROLL_THRESHOLD} * var(--height-component-lg) + ${SCROLL_THRESHOLD - 1} * var(--gap-menu-item) + 2 * var(--dimension-1))`,
  );

  readonly rootClasses = computed(() => `afi-search-v2 afi-search-v2--${this.size()}`);

  readonly fieldClasses = computed(() => {
    const parts = ['afi-search-v2__field', `afi-search-v2__field--${this.size()}`];
    if (this.disabled()) parts.push('afi-search-v2__field--disabled');
    return parts.join(' ');
  });

  readonly activeOptionId = computed(() =>
    this.isOpen() && this.activeIndex() >= 0 ? this.optionId(this.activeIndex()) : null,
  );

  optionId(index: number): string {
    return `${this.inputId}-option-${index}`;
  }

  suggestionKey(_index: number, suggestion: SearchV2Suggestion): string {
    return suggestion.id ?? suggestion.label;
  }

  ngOnInit(): void {
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-search-v2] Search "${this.inputId}" has neither label nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  onInput(event: Event): void {
    this.activeIndex.set(-1);
    this.value.set((event.target as HTMLInputElement).value);
    this.#reposition();
  }

  onFocus(): void {
    this.focused.set(true);
    this.#reposition();
  }

  onBlur(): void {
    // Defer teardown so a suggestion click (fires after blur) still resolves.
    queueMicrotask(() => this.focused.set(false));
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const i = this.activeIndex();
      const list = this.suggestions();
      if (this.showSuggestions() && i >= 0 && i < list.length) {
        const picked = list[i];
        if (picked) {
          this.#pick(picked);
          return;
        }
      }
      this.searched.emit(this.value());
      return;
    }
    if (!this.showSuggestions()) return;
    const len = this.suggestions().length;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.update((i) => (i + 1) % len);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.update((i) => (i <= 0 ? len - 1 : i - 1));
        break;
      case 'Home':
        event.preventDefault();
        this.activeIndex.set(0);
        break;
      case 'End':
        event.preventDefault();
        this.activeIndex.set(len - 1);
        break;
      case 'Escape':
        event.preventDefault();
        this.focused.set(false);
        this.activeIndex.set(-1);
        break;
    }
  }

  onOptionClick(index: number): void {
    const suggestion = this.suggestions()[index];
    if (suggestion) this.#pick(suggestion);
  }

  #pick(suggestion: SearchV2Suggestion): void {
    // Picking fills the field with the choice so the bound filter narrows to it.
    this.value.set(suggestion.label);
    this.suggestionPicked.emit(suggestion);
    this.focused.set(false);
    this.activeIndex.set(-1);
  }

  clear(): void {
    this.value.set('');
    this.cleared.emit();
    this.activeIndex.set(-1);
    this.inputRef()?.nativeElement?.focus();
  }

  #reposition(): void {
    const field = this.fieldRef()?.nativeElement;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    const count = Math.min(this.suggestions().length || 1, SCROLL_THRESHOLD);
    const estPanelHeight = count * ROW_HEIGHT + (count - 1) * 2 + 2 * 4;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const flipUp =
      viewportHeight > 0 &&
      viewportHeight - rect.bottom < estPanelHeight + PANEL_OFFSET &&
      rect.top > estPanelHeight + PANEL_OFFSET;
    const top = flipUp ? rect.top - PANEL_OFFSET - estPanelHeight : rect.bottom + PANEL_OFFSET;
    this.#coords.set({ top: Math.max(top, PANEL_OFFSET), left: rect.left, width: rect.width });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.focused()) return;
    if (!this.#host.nativeElement.contains(event.target as Node)) {
      this.focused.set(false);
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportShift(): void {
    if (this.isOpen()) this.#reposition();
  }
}
