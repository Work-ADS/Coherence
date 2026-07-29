import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BadgeV2Tone } from './badge-v2.variants';

/**
 * Badge — identity v2 (foundations-modern).
 *
 * Non-interactive status pill: communicates the current state of an object
 * (Draft, Active, Pending, Overdue, In review) through a tone-coloured fill +
 * label. It carries no action and no selection — unlike `afi-chip-v2`
 * (interactive filter/select) — and unlike `afi-tag-v2` (passive
 * classification metadata), it encodes *state*. For a passive category label
 * use Tag; for a selectable filter use Chip; for an action use `afi-button-v2`.
 *
 * One documented exception, and it belongs to the **neutral** tone only: a
 * **count** attached to a label (`afi-tab-v2`'s supplementary quantity). A count
 * is neither state nor category, but the neutral tone is the one tone that
 * asserts nothing semantically — surface fill, hairline boundary, secondary
 * text — which makes it the house treatment for a discrete value riding
 * alongside a label. Do not reach for a *semantic* tone to carry a quantity:
 * `success`/`warning`/`critical`/`info` mean something, and a number does not.
 *
 * Consumes only `foundations-modern` tokens, so it renders correctly only
 * inside a `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Badge set (2635:2686) —
 * 5 tones × 1 state, fixed `height/badge`, no size variants. Radius-lg,
 * `Label Small` text. Only the Neutral tone carries a boundary (surface fill +
 * hairline border); the four semantic tones are borderless tinted fills.
 *
 * Tones (public name → semantic token family):
 *  - `neutral`  → surface + border + content/secondary
 *  - `success`  → success/*
 *  - `warning`  → warning/*
 *  - `critical` → error/*   (severe-red palette role surfaced as "Critical")
 *  - `info`     → info/*
 *
 * Dot: optional two-tone status dot before the label — a subtle halo ring
 * (tone `-300`, reusing the tone's `*-border` role) around a solid indicator
 * core (`badge-dot-*` token, the tone's `-500`; neutral uses `-700`). It is a
 * *redundant* visual cue — the tone label always carries the meaning
 * independently of colour — so it is `aria-hidden`.
 *
 * A11y: a non-interactive `<span>` whose visible label is the accessible name.
 * No `role` — the badge is static state rendered on load, not a live status
 * region, so it must not announce as one. Every foreground/background pair
 * meets WCAG AA 4.5:1 for small text (warning uses warning/900 to clear the
 * bar; see the token contrast audit).
 */
@Component({
  selector: 'afi-badge-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge-v2.component.html',
  styleUrls: ['./badge-v2.component.scss'],
})
export class BadgeV2Component {
  readonly tone = input<BadgeV2Tone>('neutral');
  readonly label = input.required<string>();
  readonly dot = input<boolean>(false);

  readonly classes = computed(() => `afi-badge-v2 afi-badge-v2--${this.tone()}`);
}
