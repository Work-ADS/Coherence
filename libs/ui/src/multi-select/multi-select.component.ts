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
  MultiSelectOption,
  MultiSelectShape,
  MultiSelectSize,
  MultiSelectSummary,
  MultiSelectTriggerContext,
  MultiSelectTriggerState,
} from './multi-select.types';

let nextId = 0;

type Row =
  | { kind: 'all'; id: string; label: string; check: 'on' | 'mixed' | 'off'; disabled: false }
  | { kind: 'group'; id: string; label: string; hint: string | null; check: 'on' | 'mixed' | 'off'; disabled: boolean; group: string }
  | { kind: 'option'; id: string; option: MultiSelectOption; disabled: boolean; grouped: boolean }
  | { kind: 'tool-all' | 'tool-clear'; id: string; label: string; disabled: false };

/**
 * MultiSelect: a filter field with checkbox options. Select replaces and
 * closes; this accumulates, stays open while you tick, and says how many are
 * on. The closed control can be replaced with a `#trigger` template (typically
 * an `afi-filter-chip` with `asTrigger`), which receives the state to
 * summarise itself; the panel, rows and keyboard are unchanged.
 *
 * The panel is portalled to the body (or the open `<dialog>`), like Select.
 *
 * ```html
 * <afi-multi-select label="Tipo" [options]="tipos" [value]="tipo" (valueChange)="tipo = $event">
 *   <ng-template #trigger let-s>
 *     <afi-filter-chip asTrigger label="Tipo" [expanded]="s.open" (toggled)="s.toggle()" ... />
 *   </ng-template>
 * </afi-multi-select>
 * ```
 */
@Component({
  selector: 'afi-multi-select',
  standalone: true,
  imports: [FieldLabelComponent, IconComponent, NgTemplateOutlet],
  host: { '[class.afi-ms--pill]': "shape() === 'pill'" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent implements OnInit, AfterViewChecked, OnDestroy {
  readonly label = input<string | null>(null);
  readonly help = input<string | null>(null);
  readonly helpLabel = input<string | null>(null);
  readonly required = input<boolean>(false);
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  readonly options = input<readonly MultiSelectOption[]>([]);
  /** Controlled selection. */
  readonly value = input<readonly string[]>([]);
  /** Trigger text with nothing selected. */
  readonly placeholder = input<string>('Todos');
  /** Trigger text when everything is selected; usually the placeholder. */
  readonly allLabel = input<string | null>(null);
  readonly size = input<MultiSelectSize>('md');
  readonly shape = input<MultiSelectShape>('default');
  readonly disabled = input<boolean>(false);
  /** Collection-level select-all row above the list (checked, mixed or unchecked over the enabled options). */
  readonly selectAll = input<boolean>(false);
  /** The «Seleccionar todo» / «Limpiar» rows under the list. Default: on unless `selectAll` is. */
  readonly tools = input<boolean | null>(null);
  readonly selectAllLabel = input<string | null>(null);
  readonly clearLabel = input<string>('Limpiar');
  readonly summary = input<MultiSelectSummary>('count');
  readonly emptyLabel = input<string>('Sin opciones');
  /** Right-aligned text on a group header, keyed by group (e.g. the group total). */
  readonly groupHints = input<Readonly<Record<string, string>>>({});

  readonly valueChange = output<string[]>();

  /** Replaces the closed control; see the class docs. */
  readonly triggerTpl = contentChild<TemplateRef<MultiSelectTriggerContext>>('trigger');

  readonly msId = `afi-ms-${nextId++}`;
  readonly labelId = `${this.msId}-label`;
  readonly hintId = `${this.msId}-hint`;
  readonly errorId = `${this.msId}-error`;
  readonly listboxId = `${this.msId}-list`;

  readonly open = signal(false);
  readonly activeIndex = signal(-1);
  readonly panelStyle = signal<Record<string, string>>({});

  private readonly el = inject(ElementRef);
  readonly triggerEl = viewChild<ElementRef<HTMLElement>>('triggerEl');
  readonly anchorEl = viewChild<ElementRef<HTMLElement>>('anchorEl');

  private readonly picked = computed(() => new Set(this.value()));

  private readonly enabledOptions = computed(() => this.options().filter((o) => !o.disabled));

  readonly count = computed(() => this.options().filter((o) => this.picked().has(o.value)).length);
  readonly total = computed(() => this.options().length);
  readonly allSelected = computed(() => {
    const enabled = this.enabledOptions();
    return enabled.length > 0 && enabled.every((o) => this.picked().has(o.value));
  });
  readonly labels = computed(() =>
    this.options().filter((o) => this.picked().has(o.value)).map((o) => o.label),
  );

  private readonly showTools = computed(() => this.tools() ?? !this.selectAll());

  /** Everything the panel shows, flat: the keyboard walks this list. */
  readonly rows = computed<readonly Row[]>(() => {
    const rows: Row[] = [];
    const opts = this.options();
    if (opts.length > 0 && this.selectAll()) {
      rows.push({
        kind: 'all',
        id: `${this.msId}-all`,
        label: this.selectAllLabel() ?? 'Todos',
        check: this.checkState(this.enabledOptions()),
        disabled: false,
      });
    }
    const groups: string[] = [];
    for (const o of opts) {
      if (o.group && !groups.includes(o.group)) groups.push(o.group);
    }
    const ungrouped = opts.filter((o) => !o.group);
    ungrouped.forEach((o) => rows.push(this.optionRow(o, false)));
    groups.forEach((g, gi) => {
      const members = opts.filter((o) => o.group === g);
      const enabled = members.filter((o) => !o.disabled);
      rows.push({
        kind: 'group',
        id: `${this.msId}-group-${gi}`,
        label: g,
        hint: this.groupHints()[g] ?? null,
        check: this.checkState(enabled),
        disabled: enabled.length === 0,
        group: g,
      });
      members.forEach((o) => rows.push(this.optionRow(o, true)));
    });
    if (opts.length > 0 && this.showTools()) {
      rows.push({ kind: 'tool-all', id: `${this.msId}-tool-all`, label: this.selectAllLabel() ?? 'Seleccionar todo', disabled: false });
      rows.push({ kind: 'tool-clear', id: `${this.msId}-tool-clear`, label: this.clearLabel(), disabled: false });
    }
    return rows;
  });

  /** The text in the closed control. */
  readonly summaryText = computed(() => {
    const count = this.count();
    const total = this.total();
    const all = this.allSelected();
    const placeholder = this.placeholder();
    const allLabel = this.allLabel();
    switch (this.summary()) {
      case 'labels':
        if (all && allLabel) return allLabel;
        return count === 0 ? placeholder : this.labels().join(', ');
      case 'fraction':
        if (count === 0) return placeholder;
        return all && allLabel ? allLabel : `${count} de ${total}`;
      default:
        // The pill keeps its label as resting text (the badge counts); a boxed field already
        // shows its label above, so its trigger says what is picked.
        if (this.shape() === 'pill') return this.label() ?? placeholder;
        if (count === 0) return placeholder;
        return all && allLabel ? allLabel : `${count} seleccionados`;
    }
  });

  /** A count badge next to the label on the pill (count mode, something but not everything on). */
  readonly badge = computed(() =>
    this.summary() === 'count' &&
    this.shape() === 'pill' &&
    this.count() > 0 &&
    !(this.allSelected() && this.allLabel())
      ? this.count()
      : null,
  );

  readonly triggerClasses = computed(() => {
    const parts = ['afi-ms__trigger', `afi-ms__trigger--${this.size()}`];
    if (this.shape() === 'pill') parts.push('afi-ms__trigger--pill');
    if (this.error()) parts.push('afi-ms__trigger--error');
    if (this.count() > 0) parts.push('afi-ms__trigger--active');
    return parts.join(' ');
  });

  readonly describedBy = computed(() => {
    if (this.error()) return this.errorId;
    return this.hint() ? this.hintId : null;
  });

  /** State for a custom trigger template. */
  readonly triggerContext = computed<MultiSelectTriggerContext>(() => {
    const state: MultiSelectTriggerState = {
      open: this.open(),
      toggle: () => this.toggle(),
      selected: this.value(),
      count: this.count(),
      total: this.total(),
      allSelected: this.allSelected(),
      labels: this.labels(),
      clear: () => this.clear(),
      listboxId: this.listboxId,
      activeId: this.open() && this.activeIndex() >= 0 ? this.rowId(this.activeIndex()) : null,
    };
    return { $implicit: state };
  });

  ngOnInit(): void {
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-multi-select] "${this.msId}" has neither label nor ariaLabel. Provide at least one for accessibility.`,
      );
    }
  }

  rowId(index: number): string {
    return this.rows()[index]?.id ?? '';
  }

  isPicked(value: string): boolean {
    return this.picked().has(value);
  }

  toggle(): void {
    if (this.disabled()) return;
    if (this.open()) this.close();
    else this.openPanel();
  }

  openPanel(): void {
    if (this.disabled()) return;
    this.open.set(true);
    this.recomputePanelPosition();
    document.addEventListener('scroll', this.onAncestorScroll, true);
    this.activeIndex.set(this.rows().findIndex((r) => !r.disabled));
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.activeIndex.set(-1);
    document.removeEventListener('scroll', this.onAncestorScroll, true);
    this.focusTrigger();
  }

  clear(): void {
    const next = this.value().filter((v) => this.options().some((o) => o.value === v && o.disabled));
    this.valueChange.emit(next);
  }

  activate(row: Row): void {
    if (row.disabled) return;
    const current = new Set(this.value());
    switch (row.kind) {
      case 'option':
        this.flip(current, [row.option.value]);
        break;
      case 'all':
      case 'tool-all': {
        const enabled = this.enabledOptions().map((o) => o.value);
        if (row.kind === 'all' && enabled.every((v) => current.has(v))) enabled.forEach((v) => current.delete(v));
        else enabled.forEach((v) => current.add(v));
        break;
      }
      case 'group': {
        const members = this.options().filter((o) => o.group === row.group && !o.disabled).map((o) => o.value);
        if (members.every((v) => current.has(v))) members.forEach((v) => current.delete(v));
        else members.forEach((v) => current.add(v));
        break;
      }
      case 'tool-clear':
        this.clear();
        return;
    }
    this.valueChange.emit(this.options().filter((o) => current.has(o.value)).map((o) => o.value));
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const isCustom = !!this.triggerTpl();
    if (!this.open()) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || (!isCustom && (event.key === 'Enter' || event.key === ' '))) {
        event.preventDefault();
        this.openPanel();
      }
      return;
    }
    const rows = this.rows();
    const enabled = rows.map((r, i) => (r.disabled ? -1 : i)).filter((i) => i >= 0);
    const at = enabled.indexOf(this.activeIndex());
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.setActive(enabled[(at + 1) % enabled.length]);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.setActive(enabled[(at <= 0 ? enabled.length : at) - 1]);
        break;
      case 'Home':
        event.preventDefault();
        this.setActive(enabled[0]);
        break;
      case 'End':
        event.preventDefault();
        this.setActive(enabled[enabled.length - 1]);
        break;
      case 'Enter':
      case ' ': {
        const row = rows[this.activeIndex()];
        if (row) {
          event.preventDefault();
          this.activate(row);
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        this.close();
        break;
      case 'Tab':
        this.close();
        break;
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onViewportChange(): void {
    if (this.open()) this.recomputePanelPosition();
  }

  /** Portal the panel and backdrop out of the component (body, or the open dialog), as Select does. */
  ngAfterViewChecked(): void {
    if (!this.open()) return;
    const host = this.el.nativeElement as HTMLElement;
    const panelEl = host.querySelector('.afi-ms__panel') as HTMLElement | null;
    const backdropEl = host.querySelector('.afi-ms__backdrop') as HTMLElement | null;
    const dialog = host.closest('dialog') as HTMLDialogElement | null;
    const target: HTMLElement = dialog && dialog.open ? dialog : document.body;
    if (panelEl && panelEl.parentElement !== target) target.appendChild(panelEl);
    if (backdropEl && backdropEl.parentElement !== target) target.appendChild(backdropEl);
  }

  ngOnDestroy(): void {
    document.removeEventListener('scroll', this.onAncestorScroll, true);
    document.querySelectorAll(`[data-ms="${this.msId}"]`).forEach((el) => el.remove());
  }

  private readonly onAncestorScroll = (event: Event): void => {
    if (!this.open()) return;
    const target = event.target as Element | null;
    if (target && 'closest' in target && target.closest('.afi-ms__panel')) return;
    this.recomputePanelPosition();
  };

  private optionRow(option: MultiSelectOption, grouped: boolean): Row {
    return { kind: 'option', id: `${this.msId}-opt-${option.value}`, option, disabled: option.disabled ?? false, grouped };
  }

  private checkState(members: readonly MultiSelectOption[]): 'on' | 'mixed' | 'off' {
    if (members.length === 0) return 'off';
    const on = members.filter((o) => this.picked().has(o.value)).length;
    if (on === 0) return 'off';
    return on === members.length ? 'on' : 'mixed';
  }

  private flip(current: Set<string>, values: readonly string[]): void {
    for (const v of values) {
      if (current.has(v)) current.delete(v);
      else current.add(v);
    }
  }

  private setActive(index: number | undefined): void {
    if (index === undefined) return;
    this.activeIndex.set(index);
    // Keep the highlighted row in view inside the scrolling list.
    queueMicrotask(() => document.getElementById(this.rowId(index))?.scrollIntoView({ block: 'nearest' }));
  }

  private focusTrigger(): void {
    const el = this.triggerEl()?.nativeElement;
    if (el) {
      el.focus();
      return;
    }
    // A custom trigger: return focus to its first focusable control.
    this.anchorEl()?.nativeElement.querySelector<HTMLElement>('button, [tabindex]')?.focus();
  }

  private recomputePanelPosition(): void {
    const anchor = (this.anchorEl() ?? this.triggerEl())?.nativeElement;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const viewportH = window.innerHeight;
    // 288 and 256 below mirror --dimension-72 (panel max height) and --dimension-64 (panel minimum
    // width) in multi-select.component.scss; keep them in step.
    const panelMaxH = 288;
    const gap = 4;
    const openUp = viewportH - rect.bottom < Math.min(panelMaxH, 160) && rect.top > viewportH - rect.bottom;
    const rightEdge = rect.right + 256 > document.documentElement.clientWidth; // mirrors --dimension-64 (the panel's minimum width)
    const edge = rightEdge
      ? { right: `${document.documentElement.clientWidth - rect.right}px`, left: 'auto' }
      : { left: `${rect.left}px`, right: 'auto' };
    const vertical = openUp
      ? { bottom: `${viewportH - rect.top + gap}px`, top: 'auto' }
      : { top: `${rect.bottom + gap}px`, bottom: 'auto' };
    this.panelStyle.set({ ...edge, ...vertical, '--ms-anchor-width': `${rect.width}px` });
  }
}
