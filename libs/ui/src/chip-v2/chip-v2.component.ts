import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';

import { AFI_UI_COPY } from '../copy';

/**
 * Chip — identity v2 (foundations-modern).
 *
 * Interactive filter / select control: a pill the user toggles to select a
 * filter value, optionally removable. It carries selection + live interaction
 * states — unlike `afi-tag-v2` (passive metadata, no state) and `afi-badge`
 * (non-interactive status). For a single-select group use a segmented control;
 * for a general action use `afi-button-v2`; for navigation use a tab.
 *
 * Consumes only `foundations-modern` tokens, so it renders correctly only
 * inside a `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Chip set (2615:2526) —
 * Selected ×2 × State ×5 (Default / Hover / Focus / Pressed / Disabled) = 10
 * instances. Fixed height-component-xs; no size variants. The five "States"
 * are live CSS states (`:hover`, `:focus-visible`, `:active`, `:disabled`),
 * NOT inputs — only Selected and Disabled are component state.
 *
 * Shape:
 *  - `selected` is a `model()` so it self-toggles on click and supports
 *    `[(selected)]`; consumers can also listen to the implicit `selectedChange`.
 *  - Selection and removal are DIFFERENT actions: clicking the chip body toggles
 *    Selected; clicking Remove emits `removed`. They are two sibling `<button>`s
 *    (a button cannot nest inside a button), wrapped by the visual pill.
 *  - `value` is the applied-filter value. When the chip is Selected AND carries a
 *    value, a third segment renders after the label — a hairline separator, the
 *    value text (`content/tertiary`) and a Clear `×`. Clicking Clear deselects the
 *    chip and emits `cleared`, so the pill resets to the empty "Filter" state; the
 *    consumer clears its own `value` binding in response. This Clear `×` is
 *    intrinsic to the value segment and shows regardless of `removable`; it
 *    replaces the `removable` `×` while a value is displayed.
 *
 * Icon: optional leading icon, decorative, projected through `[slot=iconStart]`
 * and sized by the consumer to `--icon-sm` — the projection + sizing mechanism
 * mirrors `afi-tag-v2`. Unlike tag-v2 (whose icon inherits the label colour),
 * the chip icon is deliberately `content/secondary`: per the Figma spec, AFI
 * distinguishes a decorative icon from the primary label. Projected icons must
 * be `aria-hidden="true"`.
 *
 * A11y: the chip body is a `<button>` with `aria-pressed` mirroring selection.
 * When `removable`, Remove is a separate `<button>` with an accessible name
 * ("Quitar {label}") so screen readers distinguish it from the selection
 * toggle. Disabled chips set `disabled` on both buttons (removed from the tab
 * order) and do not toggle. The compact height-component-xs visual height is the
 * design target; like the other v2 controls it is a dense-desktop touch-target
 * opt-out — a touch-first surface should supply the 44×44 target from its layout.
 */
@Component({
  selector: 'afi-chip-v2',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chip-v2.component.html',
  styleUrls: ['./chip-v2.component.scss'],
})
export class ChipV2Component {

  /** Optional page-level chrome copy; per-instance inputs still win. */
  private readonly uiCopy = inject(AFI_UI_COPY, { optional: true });

  readonly label = input.required<string>();
  readonly selected = model<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly removable = input<boolean>(false);
  /** Applied-filter value; shows a value segment only while the chip is selected. */
  readonly value = input<string | null>(null);
  /** Accessible name override for the chip body; defaults to the visible label. */
  readonly ariaLabel = input<string | null>(null);
  /** Accessible name for the Remove button; `{label}` is appended when null. */
  readonly removeLabel = input<string | null>(null);
  /** Accessible name for the Clear button in the value segment; defaults from `label`. */
  readonly clearLabel = input<string | null>(null);

  /** Emitted when the Remove button is activated. Selection is left untouched. */
  readonly removed = output<void>();
  /** Emitted when the value segment's Clear button deselects the chip. */
  readonly cleared = output<void>();

  /** The value segment (separator + value + clear) renders only when selected with a value. */
  readonly showValue = computed(() => this.selected() && !!this.value());

  readonly rootClasses = computed(() => {
    const parts = ['afi-chip-v2'];
    if (this.selected()) parts.push('afi-chip-v2--selected');
    if (this.disabled()) parts.push('afi-chip-v2--disabled');
    return parts.join(' ');
  });

  /**
   * Verbs prefixed to the chip's label on its two × controls — "Quitar Renta
   * fija", "Borrar Renta fija". Separate from `removeLabel` / `clearLabel`,
   * which replace the WHOLE accessible name: those are per-chip, so translating
   * a page through them means rebuilding the phrase at every call site. These
   * are one word each, set once.
   */
  readonly removeVerb = input<string | null>(null);
  readonly clearVerb = input<string | null>(null);

  readonly removeAccessibleName = computed(
    () =>
      this.removeLabel() ??
      `${this.removeVerb() ?? this.uiCopy?.()?.remove ?? 'Quitar'} ${this.label()}`,
  );

  readonly clearAccessibleName = computed(
    () =>
      this.clearLabel() ??
      `${this.clearVerb() ?? this.uiCopy?.()?.clear ?? 'Borrar'} ${this.label()}`,
  );

  onToggle(): void {
    if (this.disabled()) return;
    // If the body deselects a chip that was showing its applied value, clear the
    // value too (emit `cleared`) — the same contract as the Clear ×. Without
    // this the consumer's `value` binding stays set and the stale value would
    // reappear the next time the chip is selected.
    const wasShowingValue = this.showValue();
    this.selected.update((value) => !value);
    if (wasShowingValue && !this.selected()) {
      this.cleared.emit();
    }
  }

  onRemove(event: MouseEvent): void {
    // Keep the click off the chip body so removal never also toggles selection.
    event.stopPropagation();
    if (this.disabled()) return;
    this.removed.emit();
  }

  onClear(event: MouseEvent): void {
    // Keep the click off the chip body so clearing never re-toggles selection.
    event.stopPropagation();
    if (this.disabled()) return;
    // Deselect so the value segment collapses back to the empty "Filter" chip;
    // the consumer clears its own value binding in response to `cleared`.
    this.selected.set(false);
    this.cleared.emit();
  }
}
