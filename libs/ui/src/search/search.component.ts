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
  viewChild,
} from '@angular/core';

import type { SearchSize } from './search.variants';

let nextId = 0;

/**
 * afi-search — styled search input primitive.
 *
 * Renders an `<input type="search">` with a leading magnifying-glass icon
 * and an optional clear button that appears when the value is non-empty.
 * Submits on `Enter` (emits `searched`); clears on click of the × button.
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
  readonly size = input<SearchSize>('md');
  readonly value = input<string>('');
  readonly placeholder = input<string>('Buscar');
  readonly label = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly valueChange = output<string>();
  readonly searched = output<string>();
  readonly cleared = output<void>();

  readonly inputId = `afi-search-${nextId++}`;
  readonly labelId = `${this.inputId}-label`;

  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');
  private readonly host = inject(ElementRef);

  readonly rootClasses = computed(
    () => `afi-search afi-search--${this.size()}`,
  );

  readonly hasValue = computed(() => (this.value() ?? '').length > 0);

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
    this.valueChange.emit(target.value);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      this.searched.emit(target.value);
    }
  }

  clear(): void {
    this.valueChange.emit('');
    this.cleared.emit();
    this.inputEl()?.nativeElement?.focus();
  }
}
