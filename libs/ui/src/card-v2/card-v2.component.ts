import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Card — identity v2 (foundations-modern).
 *
 * A neutral grouping surface: a bordered, subtly-elevated container that stacks
 * three independently-collapsible sections — Header, Body, Footer — separated by
 * hairline dividers. It groups related content visually; it carries no action of
 * its own.
 *
 * Consumes only `foundations-modern` tokens, so it renders correctly only inside
 * a `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Card (2721:3240). Surface:
 * `background/surface` fill, `borders/default` stroke at `stroke/default`,
 * `radius/xl` corners, `Elevation/1` (→ `--elevation-card`) shadow, `pad/card`
 * padding on all sides and as the inter-section gap. Header holds an H4 heading
 * (`content/primary`) + Body/default supporting text (`content/secondary`) in a
 * row with an optional right-aligned action; a divider closes it. Footer opens
 * with a divider, then a right-aligned action row (gap `gap/control-sm`).
 *
 * API model mirrors the Figma component's own properties: `heading` /
 * `supportingText` are Text properties; `showHeader` / `showFooter` are the
 * Header / Footer booleans (defaults: header on, footer off). The header action
 * and footer buttons are *projected* — the card never re-implements
 * `afi-icon-button` / `afi-button-v2`, it exposes slots for real instances:
 *   • `[slot=header-action]` — icon button in the header row.
 *     TODO(icon-button-v2): this slot is meant for a compact icon button, but
 *     `afi-button-v2` excludes icon-only usage by design rule and no
 *     `afi-icon-button-v2` exists yet. Consumers (and the workbench demo)
 *     currently project a labelled `afi-button-v2`. When `afi-icon-button-v2`
 *     ships, make it the canonical header-action instance here.
 *   • default `<ng-content>`  — the body content (KPI, prose, form, media…)
 *   • `[slot=footer]`         — the footer action buttons
 *
 * A11y: the shell is deliberately non-semantic — no `role`, no `tabindex`, no
 * click output. Per the Figma interaction notes, "Card is a grouping surface,
 * not an interaction… do not assign button semantics to the neutral shell."
 * Interactions live on the projected children, which stay independently
 * focusable. Reading and keyboard order follow the visual order: header, body,
 * footer. The card fills the width its parent gives it and never clips or
 * scrolls its body — content components own their own overflow.
 *
 * The heading renders as styled text (not a semantic heading element) because
 * the card cannot know its document heading level; a `headingLevel` input can be
 * added later if an outline-semantic heading is needed.
 */
@Component({
  selector: 'afi-card-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-v2.component.html',
  styleUrls: ['./card-v2.component.scss'],
  host: { class: 'afi-card-v2' },
})
export class CardV2Component {
  /** H4 heading text in the header row. Empty → the heading node is omitted. */
  readonly heading = input<string>('');

  /** Body/default supporting text under the heading. Empty → omitted. */
  readonly supportingText = input<string>('');

  /** Visibility of the entire header section (text stack, action, divider). */
  readonly showHeader = input<boolean>(true);

  /** Visibility of the entire footer section (divider, action row). */
  readonly showFooter = input<boolean>(false);
}
