import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  HostListener,
  inject,
  input,
  isDevMode,
  OnDestroy,
  OnInit,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { FieldLabelComponent } from '../field-label';
import { IconComponent } from '../icon';

import type {
  SelectAlign,
  SelectOption,
  SelectShape,
  SelectSize,
  SelectTriggerContext,
} from './select.types';

let nextId = 0;

/**
 * Select primitive — custom dropdown listbox.
 *
 * Renders a trigger button styled like an input + a dropdown panel matching
 * the afi-menu visual pattern (elevated surface, rounded, soft shadow,
 * fade-in animation). Full keyboard nav, type-ahead, click-outside dismiss,
 * and reduced-motion support.
 *
 * Uses native ARIA listbox pattern for screen readers. BEM + DS tokens —
 * no Tailwind for visual styling, no inline `styles:` block.
 */
@Component({
  selector: 'afi-select',
  standalone: true,
  imports: [FieldLabelComponent, IconComponent, NgTemplateOutlet],
  host: { '[class.afi-select--pill]': "shape() === 'pill'" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit, AfterViewChecked, OnDestroy {
  readonly size = input<SelectSize>('md');
  /** `pill` is the filter-row shape: rounded and sized to its content. */
  readonly shape = input<SelectShape>('rect');
  /** Which trigger edge the open panel lines up with. */
  readonly align = input<SelectAlign>('start');
  /** ⓘ after the label: help text in a tooltip (see `afi-field-help`). */
  readonly help = input<string | null>(null);
  readonly helpLabel = input<string | null>(null);
  readonly options = input<SelectOption[]>([]);
  readonly value = input<string | number | null>(null);
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly placeholder = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);
  readonly searchable = input<boolean>(false);
  readonly searchPlaceholder = input<string>('Buscar…');
  readonly emptyText = input<string>('Sin resultados');

  readonly valueChange = output<string | number | null>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  readonly selectId = `afi-select-${nextId++}`;
  readonly labelId = `${this.selectId}-label`;
  readonly hintId = `${this.selectId}-hint`;
  readonly errorId = `${this.selectId}-error`;
  readonly listboxId = `${this.selectId}-listbox`;

  readonly open = signal(false);
  readonly focusedIndex = signal(-1);
  readonly searchQuery = signal('');

  /**
   * Inline style for the floating panel — recomputed from the trigger's
   * bounding rect every time the panel opens (and on scroll/resize while
   * open). Lets the panel sit outside any clipping ancestor.
   */
  readonly panelStyle = signal<Record<string, string>>({});

  private readonly el = inject(ElementRef);
  readonly triggerEl = viewChild<ElementRef<HTMLButtonElement>>('triggerEl');

  /** Replaces the closed control (typically an `afi-filter-chip` with `asTrigger`); the panel is unchanged. */
  readonly triggerTpl = contentChild<TemplateRef<SelectTriggerContext>>('trigger');
  readonly anchorEl = viewChild<ElementRef<HTMLElement>>('anchorEl');

  /** State for a custom trigger template. */
  readonly triggerContext = computed<SelectTriggerContext>(() => ({
    $implicit: {
      open: this.open(),
      toggle: () => this.toggle(),
      value: this.value(),
      option: this.selectedOption(),
      clear: () => this.valueChange.emit(null),
      listboxId: this.listboxId,
    },
  }));
  readonly searchInputEl = viewChild<ElementRef<HTMLInputElement>>('searchInputEl');

  private typeAheadBuffer = '';
  private typeAheadTimeout: ReturnType<typeof setTimeout> | null = null;

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

  readonly displayOptions = computed(() => {
    const opts = this.flatOptions();
    if (!this.searchable()) return opts;
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return opts;
    return opts.filter((o) => o.label.toLowerCase().includes(q));
  });

  readonly selectedOption = computed(() => {
    const v = this.value();
    return this.flatOptions().find((o) => o.value === v) ?? null;
  });

  readonly triggerClasses = computed(() => {
    const parts = [
      'afi-select__trigger',
      `afi-select__trigger--${this.size()}`,
    ];
    if (this.error()) parts.push('afi-select__trigger--error');
    if (this.open()) parts.push('afi-select__trigger--open');
    if (this.shape() === 'pill') parts.push('afi-select__trigger--pill');
    return parts.join(' ');
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
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-select] Select "${this.selectId}" has neither label nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  /**
   * Portal the panel + backdrop out of the component's local DOM after each
   * render where they exist. Two destinations:
   *
   *   1. When the trigger sits inside an open native `<dialog>` (i.e. an
   *      `afi-modal` opened via `showModal()`), portal to **that dialog**.
   *      The dialog renders in the browser's top-layer, which sits above
   *      every z-indexed element — a panel portaled to `document.body`
   *      would be painted *behind* the dialog backdrop regardless of its
   *      `z-index`. Putting the panel inside the dialog lets it inherit
   *      the same top-layer.
   *
   *   2. Otherwise, portal to `document.body`. Needed because the
   *      demo-shell viewport sizer (and other ancestors) apply CSS
   *      `transform`, which makes `position: fixed` anchor to *that*
   *      element rather than the viewport. Reparenting to body escapes
   *      every such containing block.
   */
  ngAfterViewChecked(): void {
    if (!this.open()) return;
    const host = this.el.nativeElement as HTMLElement;
    const panelEl = host.querySelector('.afi-select__panel') as HTMLElement | null;
    const backdropEl = host.querySelector('.afi-select__backdrop') as HTMLElement | null;
    const dialogAncestor = host.closest('dialog') as HTMLDialogElement | null;
    const target: HTMLElement =
      dialogAncestor && dialogAncestor.open ? dialogAncestor : document.body;
    if (panelEl && panelEl.parentElement !== target) {
      target.appendChild(panelEl);
    }
    if (backdropEl && backdropEl.parentElement !== target) {
      target.appendChild(backdropEl);
    }
  }

  ngOnDestroy(): void {
    // Failsafe: if the component is destroyed while the panel is open,
    // the portaled nodes won't be cleaned up by Angular (they're outside
    // the component's view). Yank them manually whether the portal target
    // is `document.body` or a `<dialog>` ancestor (modal flavor).
    if (this.open()) {
      document
        .querySelectorAll('.afi-select__panel, .afi-select__backdrop')
        .forEach((el) => {
          const parent = el.parentElement;
          if (parent === document.body || parent instanceof HTMLDialogElement) {
            el.remove();
          }
        });
    }
    document.removeEventListener('scroll', this.onAncestorScroll, true);
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
    this.recomputePanelPosition();
    // Capture-phase scroll listener: `@HostListener('window:scroll')` only
    // fires for the document — nested scroll containers (e.g. <main> in the
    // demos page) need this to keep the panel anchored when the trigger
    // moves. The capture flag is required because scroll events don't
    // bubble.
    document.addEventListener('scroll', this.onAncestorScroll, true);
    const opts = this.displayOptions();
    const selectedIdx = opts.findIndex((o) => o.value === this.value());
    this.focusedIndex.set(selectedIdx >= 0 ? selectedIdx : 0);
    this.opened.emit();
    if (this.searchable()) {
      setTimeout(() => this.searchInputEl()?.nativeElement?.focus(), 0);
    }
  }

  /**
   * Re-anchor the panel when any ancestor scrolls. If the scroll happened
   * inside the panel's own listbox (user scrolling through 200 cities),
   * ignore it — only outer-page scrolls move the trigger.
   */
  private readonly onAncestorScroll = (event: Event): void => {
    if (!this.open()) return;
    const target = event.target as Element | null;
    if (target && 'closest' in target && target.closest('.afi-select__panel')) {
      return;
    }
    this.recomputePanelPosition();
  };

  /**
   * Anchor the floating panel to the trigger. Flips upward when there's
   * more room above than below the viewport edge.
   */
  private recomputePanelPosition(): void {
    const trigger = (this.anchorEl() ?? this.triggerEl())?.nativeElement;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const panelMaxH = 288; // mirrors --dimension-72 (max-height of .afi-select__panel)
    const gap = 4; // small visual gap so the panel doesn't kiss the trigger
    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < Math.min(panelMaxH, 160) && spaceAbove > spaceBelow;

    // The panel is never narrower than the trigger and grows to its longest
    // option up to the cap in the stylesheet; `align="end"` pins its right edge.
    const edge =
      this.align() === 'end'
        ? { right: `${document.documentElement.clientWidth - rect.right}px`, left: 'auto' }
        : { left: `${rect.left}px`, right: 'auto' };
    const vertical = openUp
      ? { bottom: `${viewportH - rect.top + gap}px`, top: 'auto' }
      : { top: `${rect.bottom + gap}px`, bottom: 'auto' };
    this.panelStyle.set({ ...edge, ...vertical, 'min-width': `${rect.width}px` });
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onViewportChange(): void {
    if (this.open()) this.recomputePanelPosition();
  }

  close(): void {
    this.open.set(false);
    this.focusedIndex.set(-1);
    if (this.searchable()) {
      this.searchQuery.set('');
    }
    document.removeEventListener('scroll', this.onAncestorScroll, true);
    this.closed.emit();
    const trigger = this.triggerEl()?.nativeElement ?? this.anchorEl()?.nativeElement.querySelector<HTMLElement>('button, [tabindex]');
    trigger?.focus();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    const opts = this.displayOptions();
    const firstEnabled = opts.findIndex((o) => !o.disabled);
    this.focusedIndex.set(firstEnabled);
  }

  onSearchKeydown(event: KeyboardEvent): void {
    const opts = this.displayOptions();
    const enabledIndices = opts
      .map((o, i) => (o.disabled ? -1 : i))
      .filter((i) => i >= 0);
    const idx = this.focusedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (enabledIndices.length) {
          const pos = enabledIndices.indexOf(idx);
          const next =
            pos < 0 || pos >= enabledIndices.length - 1
              ? enabledIndices[0]!
              : enabledIndices[pos + 1]!;
          this.focusedIndex.set(next);
          this.scrollFocusedIntoView();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (enabledIndices.length) {
          const pos = enabledIndices.indexOf(idx);
          const prev =
            pos <= 0
              ? enabledIndices[enabledIndices.length - 1]!
              : enabledIndices[pos - 1]!;
          this.focusedIndex.set(prev);
          this.scrollFocusedIntoView();
        }
        break;
      case 'Home':
        event.preventDefault();
        if (enabledIndices.length) {
          this.focusedIndex.set(enabledIndices[0]!);
          this.scrollFocusedIntoView();
        }
        break;
      case 'End':
        event.preventDefault();
        if (enabledIndices.length) {
          this.focusedIndex.set(enabledIndices[enabledIndices.length - 1]!);
          this.scrollFocusedIntoView();
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (idx >= 0 && idx < opts.length && opts[idx] && !opts[idx]!.disabled) {
          this.selectOption(opts[idx]!);
        } else if (enabledIndices.length === 1) {
          this.selectOption(opts[enabledIndices[0]!]!);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'Tab':
        this.close();
        break;
    }
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
    const enabledIndices = opts
      .map((o, i) => (o.disabled ? -1 : i))
      .filter((i) => i >= 0);
    if (!enabledIndices.length) return;

    const idx = this.focusedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        {
          const pos = enabledIndices.indexOf(idx);
          const next =
            pos < enabledIndices.length - 1
              ? enabledIndices[pos + 1]!
              : enabledIndices[0]!;
          this.focusedIndex.set(next);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        {
          const pos = enabledIndices.indexOf(idx);
          const prev =
            pos > 0
              ? enabledIndices[pos - 1]!
              : enabledIndices[enabledIndices.length - 1]!;
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

  private handleTypeAhead(
    char: string,
    opts: SelectOption[],
    enabledIndices: number[],
  ): void {
    if (this.typeAheadTimeout) {
      clearTimeout(this.typeAheadTimeout);
    }
    this.typeAheadBuffer += char.toLowerCase();
    this.typeAheadTimeout = setTimeout(() => {
      this.typeAheadBuffer = '';
    }, 500);

    const match = enabledIndices.find((i) =>
      opts[i]!.label.toLowerCase().startsWith(this.typeAheadBuffer),
    );
    if (match !== undefined) {
      this.focusedIndex.set(match);
    }
  }

  private scrollFocusedIntoView(): void {
    const idx = this.focusedIndex();
    if (idx < 0) return;
    setTimeout(() => {
      const listbox = this.el.nativeElement.querySelector('[role="listbox"]');
      const item = listbox?.querySelector(`#${this.optionId(idx)}`);
      item?.scrollIntoView({ block: 'nearest' });
    });
  }
}
