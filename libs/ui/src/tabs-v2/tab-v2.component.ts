import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

import { TabsV2Component } from './tabs-v2.component';

/**
 * Tab item — identity v2 (foundations-modern).
 *
 * One selectable destination inside `<afi-tabs-v2>`. Unlike the v1 `afi-tab-item`
 * (a passive config holder whose panel content the parent stamps), this v2 item
 * renders its own `role="tab"` button so it can host an optional projected
 * leading icon directly — the same `[slot=iconStart]` mechanism as the other v2
 * primitives. Panels are the consumer's responsibility; wire them with the
 * optional `controls` panel id.
 *
 * Consumes only `foundations-modern` tokens, so it renders correctly only inside
 * a `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Tabs / Item (2627:2533) —
 * 2 selection states × 4 interaction states. Only Selected and Disabled are
 * component state; Default / Hover / Focus are live CSS states. The Content row
 * is: optional leading icon (`icon/sm`) → label (`button` text style) → optional
 * count (`caption` text style, supplementary). Horizontal padding
 * `pad/control-lg`, content gap `gap/control-md`, fixed `navigation/tab/height`.
 *
 * The sliding underline indicator and the shared baseline live on the parent
 * list, not here — the item only carries its label colour (`content/secondary`
 * unselected, `content/primary` selected, `content/disabled` disabled) and hover
 * fill. `selected`, `index`, and `tabId` are driven by the parent through public
 * signals; consumers never set them.
 *
 * A11y: the count is folded into the accessible name as "Documentos (3)" so it
 * is announced with the label rather than as a separate node. Disabled items
 * carry `aria-disabled` (not the native `disabled` attribute) and are skipped by
 * the parent's arrow-key rotation. The dense `navigation/tab/height` is a
 * deliberate desktop touch-target opt-out — a touch-first surface supplies the
 * 44×44 target from its own layout.
 */
@Component({
  selector: 'afi-tab-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab-v2.component.html',
  styleUrls: ['./tab-v2.component.scss'],
})
export class TabV2Component {
  /** Visible label. Must be one or two words — long labels break the scan rhythm. */
  readonly label = input.required<string>();

  /** Optional supplementary count (quantity, not status). Folded into the name. */
  readonly count = input<number | null>(null);

  /** Inert — no hover, focus, press, or selection; skipped by arrow-key rotation. */
  readonly disabled = input<boolean>(false);

  /** Optional id of the panel this tab controls, for `aria-controls`. */
  readonly controls = input<string | null>(null);

  /** Parent-assigned position within the list. Not set by consumers. */
  readonly index = signal(0);

  /** Parent-assigned selection flag. Not set by consumers. */
  readonly selected = signal(false);

  /** Parent-assigned stable id for the tab element. Not set by consumers. */
  readonly tabId = signal('');

  /** The rendered trigger, exposed so the parent can measure + focus it. */
  readonly buttonRef = viewChild<ElementRef<HTMLButtonElement>>('btn');

  private readonly tabs = inject<TabsV2Component>(
    forwardRef(() => TabsV2Component),
  );

  /** Label with the count folded in, e.g. "Documentos (3)". */
  readonly accessibleName = computed(() => {
    const count = this.count();
    return count === null ? this.label() : `${this.label()} (${count})`;
  });

  onClick(): void {
    if (this.disabled()) return;
    this.tabs.activate(this.index());
  }

  focus(): void {
    this.buttonRef()?.nativeElement.focus();
  }
}
