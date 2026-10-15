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

import { FieldLabelComponent } from '../field-label';
import { IconComponent } from '../icon';

import type { SearchShape, SearchSize, SearchSuggestion } from './search.variants';

const MAX_SUGGESTIONS = 10;

let nextId = 0;

/**
 * afi-search — styled search input primitive.
 *
 * Renders an `<input type="search">` with a leading magnifying-glass icon
 * and an optional clear button that appears when the value is non-empty.
 * Submits on `Enter` (emits `searched`); clears on click of the × button.
 *
 * Two modes, chosen with `[typeahead]`:
 *
 * - **Filter mode (default, `typeahead=false`)** — a plain search box that
 *   filters a list/table elsewhere on the page. NO dropdown, NO "no matches"
 *   panel ever: the filtered surface itself is the feedback, so an
 *   "Sin coincidencias" popover next to a table that shows matches would lie.
 *   Wire `(valueChange)` to a filter signal.
 * - **Typeahead mode (`typeahead=true`)** — a combobox with a suggestions
 *   dropdown. Provide `[suggestions]` (consumers own the filtering, typically a
 *   `computed()` over `value()`) and respond to `(suggestionPicked)`. The
 *   empty-results panel renders when the user has typed but the list is empty.
 *
 * Use when the input's purpose is *search* (filter rows, look up items).
 * For freeform text entry, use `<afi-input>` instead.
 */
@Component({
  selector: 'afi-search',
  standalone: true,
  imports: [FieldLabelComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  readonly size = input<SearchSize>('sm');
  /** `pill` is the filter-row shape: fully rounded. */
  readonly shape = input<SearchShape>('rect');
  readonly required = input<boolean>(false);
  /** ⓘ after the label: help text in a tooltip (see `afi-field-help`). */
  readonly help = input<string | null>(null);
  readonly helpLabel = input<string | null>(null);
  readonly value = input<string>('');
  readonly placeholder = input<string>('Buscar');
  readonly label = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  /**
   * Enable the typeahead dropdown. Default `false` = filter mode: a plain
   * search box with no dropdown and no empty-results panel (the filtered
   * surface elsewhere is the feedback). Set `true` for a combobox with a
   * suggestions dropdown — then also provide `[suggestions]`.
   */
  readonly typeahead = input<boolean>(false);

  /** Typeahead suggestions (only used when `typeahead` is `true`). Consumers
   *  own the filtering, typically a `computed()` over `value()`. */
  readonly suggestions = input<readonly SearchSuggestion[]>([]);
  /** Message shown in typeahead mode when the user has typed but suggestions
   *  is empty. */
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
    () =>
      `afi-search afi-search--${this.size()}${this.shape() === 'pill' ? ' afi-search--pill' : ''}`,
  );

  readonly hasValue = computed(() => (this.value() ?? '').length > 0);

  /** Internal focus state — drives whether the suggestions dropdown is
   *  rendered. Cleared on blur (deferred via queueMicrotask so a
   *  suggestion click can resolve before the dropdown tears down). */
  readonly focused = signal<boolean>(false);

  /** Keyboard-driven highlight inside the suggestions list. -1 = no
   *  active row; cleared whenever the input value changes. */
  readonly activeIndex = signal<number>(-1);

  /** At most ten rows are rendered, so `aria-activedescendant` never names a
   *  row that is not in the DOM. Consumers narrow the list; this is the cap. */
  readonly visibleSuggestions = computed(() => this.suggestions().slice(0, MAX_SUGGESTIONS));

  readonly hasSuggestions = computed(() => this.suggestions().length > 0);

  /** Render the dropdown only in typeahead mode, while focused AND at least
   *  one suggestion exists. Consumers can keep `[suggestions]` empty until the
   *  user has typed enough to narrow the list. */
  readonly showSuggestions = computed(
    () =>
      this.typeahead() && this.focused() && this.hasSuggestions() && !this.disabled(),
  );

  /** Render the "no matches" panel only in typeahead mode, when the user has
   *  typed something but suggestions is empty. In filter mode (default) there
   *  is no dropdown at all, so this never fires. Mutually exclusive with
   *  showSuggestions. */
  readonly showEmptyMessage = computed(
    () =>
      this.typeahead() &&
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

  onBlur(event: FocusEvent): void {
    // Rows and the clear button cancel mousedown, so a click on them never moves
    // focus. Closing on a real blur is then immediate and race-free; focus moving
    // to something inside the component keeps the list open.
    const next = event.relatedTarget as Node | null;
    if (next && this.host.nativeElement.contains(next)) return;
    this.focused.set(false);
  }

  onKeydown(event: KeyboardEvent): void {
    // Mid-composition (IME) keys belong to the composition, not to the list.
    if (event.isComposing) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      const active = this.activeIndex();
      const list = this.visibleSuggestions();
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
      this.activeIndex.update((i) => (i + 1) % this.visibleSuggestions().length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const len = this.visibleSuggestions().length;
      this.activeIndex.update((i) => (i <= 0 ? len - 1 : i - 1));
    } else if ((event.key === 'Home' || event.key === 'End') && this.showSuggestions() && this.activeIndex() >= 0) {
      // With a row highlighted, Home and End move the highlight; otherwise they move the caret.
      event.preventDefault();
      this.activeIndex.set(event.key === 'Home' ? 0 : this.visibleSuggestions().length - 1);
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
