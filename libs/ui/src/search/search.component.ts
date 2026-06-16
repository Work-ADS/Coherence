import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  isDevMode,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';

import type { SearchSize, SearchSuggestion } from './search.variants';

let nextId = 0;

/**
 * afi-search — styled search input primitive.
 *
 * Renders an `<input type="search">` with a leading magnifying-glass icon
 * and an optional clear button that appears when the value is non-empty.
 * Submits on `Enter` (emits `searched`); clears on click of the × button.
 *
 * Optional `[suggestions]` enables a typeahead dropdown rendered while
 * the input is focused and the consumer has provided at least one
 * suggestion. Consumers own the filtering (typically via a `computed()`
 * over the current `value()`) and respond to `(suggestionPicked)` to
 * commit. The empty-results panel renders automatically when the user
 * has typed something but the suggestions list is empty.
 *
 * Use when the input's purpose is *search* (filter rows, look up items).
 * For freeform text entry, use `<afi-input>` instead.
 */
@Component({
  selector: 'afi-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  readonly size = input<SearchSize>('sm');
  readonly value = input<string>('');
  readonly placeholder = input<string>('Buscar');
  readonly label = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  /** Optional typeahead suggestions. When empty (default), no dropdown
   *  renders — primitive behaves exactly like the original search input. */
  readonly suggestions = input<readonly SearchSuggestion[]>([]);
  /** Message shown when the user has typed but suggestions is empty. */
  readonly emptyMessage = input<string>('Sin coincidencias.');

  readonly valueChange = output<string>();
  readonly searched = output<string>();
  readonly cleared = output<void>();
  readonly suggestionPicked = output<SearchSuggestion>();

  readonly inputId = `afi-search-${nextId++}`;
  readonly labelId = `${this.inputId}-label`;
  readonly suggestionsId = `${this.inputId}-suggestions`;

  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');
  private readonly host = inject(ElementRef);

  readonly rootClasses = computed(
    () => `afi-search afi-search--${this.size()}`,
  );

  readonly hasValue = computed(() => (this.value() ?? '').length > 0);

  /** Internal focus state — drives whether the suggestions dropdown is
   *  rendered. Cleared on blur (deferred via queueMicrotask so a
   *  suggestion click can resolve before the dropdown tears down). */
  readonly focused = signal<boolean>(false);

  /** Keyboard-driven highlight inside the suggestions list. -1 = no
   *  active row; cleared whenever the input value changes. */
  readonly activeIndex = signal<number>(-1);

  readonly hasSuggestions = computed(() => this.suggestions().length > 0);

  /** Render the dropdown only while focused AND at least one suggestion
   *  exists. Consumers can keep `[suggestions]` empty until the user
   *  has typed enough to narrow the list. */
  readonly showSuggestions = computed(
    () => this.focused() && this.hasSuggestions() && !this.disabled(),
  );

  /** Render the "no matches" panel when the user has typed something
   *  but suggestions is empty. Mutually exclusive with showSuggestions. */
  readonly showEmptyMessage = computed(
    () =>
      this.focused() &&
      this.hasValue() &&
      !this.hasSuggestions() &&
      !this.disabled(),
  );

  readonly comboboxExpanded = computed(
    () => this.showSuggestions() || this.showEmptyMessage(),
  );

  ngOnInit(): void {
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-search] Search "${this.inputId}" has neither label nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.activeIndex.set(-1);
    this.valueChange.emit(target.value);
  }

  onFocus(): void {
    this.focused.set(true);
  }

  onBlur(): void {
    // queueMicrotask defers the dropdown teardown so a suggestion click
    // (whose handler fires after blur) still resolves. The per-row
    // mousedown-preventDefault is the primary mechanism — this is the
    // keyboard/tab-away fallback.
    queueMicrotask(() => this.focused.set(false));
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const active = this.activeIndex();
      const list = this.suggestions();
      if (this.showSuggestions() && active >= 0 && active < list.length) {
        const picked = list[active];
        if (picked) {
          this.onPick(picked);
          return;
        }
      }
      const target = event.target as HTMLInputElement;
      this.searched.emit(target.value);
      return;
    }
    if (!this.hasSuggestions()) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.update((i) => (i + 1) % this.suggestions().length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const len = this.suggestions().length;
      this.activeIndex.update((i) => (i <= 0 ? len - 1 : i - 1));
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.focused.set(false);
      this.activeIndex.set(-1);
    }
  }

  onPick(suggestion: SearchSuggestion): void {
    this.suggestionPicked.emit(suggestion);
    this.focused.set(false);
    this.activeIndex.set(-1);
  }

  clear(): void {
    this.valueChange.emit('');
    this.cleared.emit();
    this.activeIndex.set(-1);
    this.inputEl()?.nativeElement?.focus();
  }

  suggestionKey(_index: number, suggestion: SearchSuggestion): string {
    return suggestion.id ?? suggestion.label;
  }
}
