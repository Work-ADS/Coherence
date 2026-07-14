import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chip-v2.component.html',
  styleUrls: ['./chip-v2.component.scss'],
})
export class ChipV2Component {
  readonly label = input.required<string>();
  readonly selected = model<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly removable = input<boolean>(false);
  /** Accessible name override for the chip body; defaults to the visible label. */
  readonly ariaLabel = input<string | null>(null);
  /** Accessible name for the Remove button; `{label}` is appended when null. */
  readonly removeLabel = input<string | null>(null);

  /** Emitted when the Remove button is activated. Selection is left untouched. */
  readonly removed = output<void>();

  readonly rootClasses = computed(() => {
    const parts = ['afi-chip-v2'];
    if (this.selected()) parts.push('afi-chip-v2--selected');
    if (this.disabled()) parts.push('afi-chip-v2--disabled');
    return parts.join(' ');
  });

  readonly removeAccessibleName = computed(
    () => this.removeLabel() ?? `Quitar ${this.label()}`,
  );

  onToggle(): void {
    if (this.disabled()) return;
    this.selected.update((value) => !value);
  }

  onRemove(event: MouseEvent): void {
    // Keep the click off the chip body so removal never also toggles selection.
    event.stopPropagation();
    if (this.disabled()) return;
    this.removed.emit();
  }
}
