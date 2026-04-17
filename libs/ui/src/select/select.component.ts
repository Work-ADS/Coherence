import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  isDevMode,
  OnInit,
  signal,
  ElementRef,
  inject,
  HostListener,
  viewChild,
} from '@angular/core';

import { baseClasses, stateClasses, sizeClasses } from './select.variants';
import type { SelectOption, SelectSize } from './select.types';

let nextId = 0;

/**
 * Select primitive — custom dropdown listbox.
 *
 * Renders a trigger button styled like an input + a dropdown panel
 * matching the afi-menu visual pattern (surface-elevated, rounded-lg,
 * shadow-lg, fade-in animation). Full keyboard nav, type-ahead,
 * click-outside dismiss, and reduced-motion support.
 *
 * Uses native ARIA listbox pattern for screen readers.
 */
@Component({
  selector: 'afi-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .afi-select-panel-enter {
      animation: afi-select-enter 150ms ease-out;
    }

    @keyframes afi-select-enter {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .afi-select-panel-enter {
        animation: none;
      }
    }
  `,
  template: `
    @if (label()) {
      <label [id]="labelId" class="block text-body-sm font-medium text-canvas-fg mb-space-1">
        {{ label() }}
        @if (required()) {
          <span class="text-system-error" aria-hidden="true"> *</span>
        }
      </label>
    }

    <div class="relative">
      <!-- Trigger button -->
      <button
        #triggerEl
        type="button"
        [id]="selectId"
        [class]="triggerClasses()"
        [disabled]="disabled()"
        [attr.aria-expanded]="open()"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-labelledby]="label() ? labelId : null"
        [attr.aria-label]="!label() ? ariaLabel() : null"
        [attr.aria-required]="required() ? 'true' : null"
        [attr.aria-invalid]="error() ? 'true' : null"
        [attr.aria-describedby]="describedBy()"
        [attr.aria-activedescendant]="open() && focusedIndex() >= 0 ? optionId(focusedIndex()) : null"
        (click)="toggle()"
        (keydown)="onTriggerKeydown($event)"
      >
        <span class="flex-1 text-left truncate" [class.text-neutral-400]="!selectedOption()">
          {{ selectedOption()?.label ?? placeholder() ?? '' }}
        </span>
        <!-- Chevron -->
        <svg
          class="h-4 w-4 text-neutral-400 shrink-0 transition-transform duration-fast"
          [class.rotate-180]="open()"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Dropdown panel -->
      @if (open()) {
        <!-- Click-outside backdrop -->
        <div
          class="fixed inset-0 z-40"
          (click)="close()"
          aria-hidden="true">
        </div>

        <ul
          #panelEl
          role="listbox"
          [attr.aria-labelledby]="label() ? labelId : null"
          [attr.aria-label]="!label() ? ariaLabel() : null"
          class="afi-select-panel-enter absolute z-50 top-full left-0 mt-space-1 w-full min-w-[12rem]
                 max-h-[240px] overflow-y-auto py-1
                 bg-surface-elevated border border-border-hairline rounded-lg shadow-lg"
          (keydown)="onPanelKeydown($event)"
        >
          @for (opt of flatOptions(); track opt.value; let i = $index) {
            @if (opt._groupLabel) {
              <li class="px-space-3 py-space-1 text-body-sm font-medium text-neutral-400 select-none" aria-hidden="true">
                {{ opt._groupLabel }}
              </li>
            }
            <li
              [id]="optionId(i)"
              role="option"
              [attr.aria-selected]="opt.value === value()"
              [attr.aria-disabled]="opt.disabled || null"
              class="flex items-center gap-space-2 px-space-3 py-space-2 text-body-sm cursor-pointer
                     transition-colors duration-fast rounded-md mx-1"
              [class.bg-surface-muted]="i === focusedIndex()"
              [class.text-canvas-fg]="!opt.disabled"
              [class.text-neutral-300]="opt.disabled"
              [class.pointer-events-none]="opt.disabled"
              [class.font-medium]="opt.value === value()"
              (click)="selectOption(opt, $event)"
              (mouseenter)="focusedIndex.set(i)"
            >
              <span class="flex-1 truncate">{{ opt.label }}</span>
              @if (opt.value === value()) {
                <svg class="h-4 w-4 text-action shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              }
            </li>
          }
        </ul>
      }
    </div>

    @if (hint() && !error()) {
      <p [id]="hintId" class="mt-space-1 text-body-sm text-neutral-500">{{ hint() }}</p>
    }

    @if (error()) {
      <p [id]="errorId" class="mt-space-1 text-body-sm text-system-error" role="alert">{{ error() }}</p>
    }
  `,
})
export class SelectComponent implements OnInit {
  readonly size = input<SelectSize>('md');
  readonly options = input<SelectOption[]>([]);
  readonly value = input<string | number | null>(null);
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly placeholder = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly valueChange = output<string | number | null>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  readonly selectId = `afi-select-${nextId++}`;
  readonly labelId = `${this.selectId}-label`;
  readonly hintId = `${this.selectId}-hint`;
  readonly errorId = `${this.selectId}-error`;

  readonly open = signal(false);
  readonly focusedIndex = signal(-1);

  private readonly el = inject(ElementRef);
  readonly triggerEl = viewChild<ElementRef<HTMLButtonElement>>('triggerEl');

  /** Type-ahead buffer */
  private typeAheadBuffer = '';
  private typeAheadTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Flat list of options with group labels injected */
  readonly flatOptions = computed(() => {
    const opts = this.options();
    const result: (SelectOption & { _groupLabel?: string })[] = [];
    let lastGroup = '';
    for (const opt of opts) {
      const group = opt.group ?? '';
      if (group && group !== lastGroup) {
        result.push({ ...opt, _groupLabel: group });
        lastGroup = group;
      } else {
        result.push({ ...opt });
      }
    }
    return result;
  });

  readonly selectedOption = computed(() => {
    const v = this.value();
    return this.flatOptions().find(o => o.value === v) ?? null;
  });

  readonly triggerClasses = computed(() => {
    const state = this.error() ? 'error' : 'idle';
    return [
      baseClasses,
      stateClasses[state],
      sizeClasses[this.size()],
      'flex items-center gap-2 cursor-pointer',
    ].filter(Boolean).join(' ');
  });

  readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this.hint() && !this.error()) ids.push(this.hintId);
    if (this.error()) ids.push(this.errorId);
    return ids.length > 0 ? ids.join(' ') : null;
  });

  optionId(index: number): string {
    return `${this.selectId}-opt-${index}`;
  }

  ngOnInit(): void {
    if (isDevMode()) {
      if (!this.label() && !this.ariaLabel()) {
        console.warn(
          `[afi-select] Select "${this.selectId}" has neither label nor ariaLabel. ` +
            'Provide at least one for accessibility.',
        );
      }
    }
  }

  toggle(): void {
    if (this.open()) {
      this.close();
    } else {
      this.openPanel();
    }
  }

  openPanel(): void {
    if (this.disabled()) return;
    this.open.set(true);
    // Set initial focus to selected option or first
    const opts = this.flatOptions();
    const selectedIdx = opts.findIndex(o => o.value === this.value());
    this.focusedIndex.set(selectedIdx >= 0 ? selectedIdx : 0);
    this.opened.emit();
  }

  close(): void {
    this.open.set(false);
    this.focusedIndex.set(-1);
    this.closed.emit();
    // Return focus to trigger
    this.triggerEl()?.nativeElement?.focus();
  }

  selectOption(opt: SelectOption, event?: Event): void {
    if (opt.disabled) return;
    event?.stopPropagation();
    this.valueChange.emit(opt.value);
    this.close();
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.open()) {
          this.openPanel();
        }
        break;
      case 'Escape':
        if (this.open()) {
          event.preventDefault();
          this.close();
        }
        break;
    }
  }

  onPanelKeydown(event: KeyboardEvent): void {
    const opts = this.flatOptions();
    const enabledIndices = opts.map((o, i) => o.disabled ? -1 : i).filter(i => i >= 0);
    if (!enabledIndices.length) return;

    let idx = this.focusedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        {
          const pos = enabledIndices.indexOf(idx);
          const next = pos < enabledIndices.length - 1 ? enabledIndices[pos + 1]! : enabledIndices[0]!;
          this.focusedIndex.set(next);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        {
          const pos = enabledIndices.indexOf(idx);
          const prev = pos > 0 ? enabledIndices[pos - 1]! : enabledIndices[enabledIndices.length - 1]!;
          this.focusedIndex.set(prev);
        }
        break;
      case 'Home':
        event.preventDefault();
        this.focusedIndex.set(enabledIndices[0]!);
        break;
      case 'End':
        event.preventDefault();
        this.focusedIndex.set(enabledIndices[enabledIndices.length - 1]!);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (idx >= 0 && idx < opts.length && opts[idx] && !opts[idx]!.disabled) {
          this.selectOption(opts[idx]!);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'Tab':
        this.close();
        break;
      default:
        // Type-ahead: find option starting with typed chars
        if (event.key.length === 1) {
          this.handleTypeAhead(event.key, opts, enabledIndices);
        }
        break;
    }

    this.scrollFocusedIntoView();
  }

  @HostListener('document:keydown.escape')
  onDocEscape(): void {
    if (this.open()) {
      this.close();
    }
  }

  private handleTypeAhead(char: string, opts: SelectOption[], enabledIndices: number[]): void {
    if (this.typeAheadTimeout) {
      clearTimeout(this.typeAheadTimeout);
    }
    this.typeAheadBuffer += char.toLowerCase();
    this.typeAheadTimeout = setTimeout(() => {
      this.typeAheadBuffer = '';
    }, 500);

    const match = enabledIndices.find(i =>
      opts[i]!.label.toLowerCase().startsWith(this.typeAheadBuffer)
    );
    if (match !== undefined) {
      this.focusedIndex.set(match);
    }
  }

  private scrollFocusedIntoView(): void {
    const idx = this.focusedIndex();
    if (idx < 0) return;
    // Use setTimeout to let Angular render the class change first
    setTimeout(() => {
      const panel = this.el.nativeElement.querySelector('ul[role="listbox"]');
      const item = panel?.querySelector(`#${this.optionId(idx)}`);
      item?.scrollIntoView({ block: 'nearest' });
    });
  }
}
