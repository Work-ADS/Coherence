import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Visual treatment of the bar surface. */
export type TopBarVariant = 'solid' | 'glass' | 'on-brand';

/**
 * Top Bar — the page-level horizontal navigation bar pattern.
 *
 * A layout shell with 3 slot zones (start/center/end). Product apps fill
 * the slots with atoms/molecules as needed.
 *
 * `variant`:
 * - `solid` (default) — opaque surface with a hairline bottom border.
 * - `glass` — transparent tint + backdrop blur, no border, so page content
 *   frosts through it as it scrolls under. The host must overlay the content
 *   (e.g. position: sticky/absolute) for the effect to read.
 * - `on-brand` — drawn straight onto a `--canvas-brand` ground: no surface,
 *   no hairline, light ink, and the focus ring and hover wash switch to their
 *   inverse tokens for slotted controls. Place it inside a brand canvas.
 *
 * `shellBand` (opt-in) takes the planner shell's geometry: it fills the shell
 * header band (`--layout-shell-header`, the same height the sidebar brand row
 * uses), insets by the content rail (`--layout-rail-inset`, narrower on a
 * narrow bar) and keeps the hairline under glass. Off, the bar is unchanged.
 *
 * `[slot=exit]` takes ONE control, normally a secondary Button («Salir del
 * asistente»), on the trailing edge behind its own hairline. It is never
 * dropped at narrow widths: in a guided flow it is the only way out.
 */
@Component({
  selector: 'afi-top-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.top-bar-host--shell]': 'shellBand()',
    '[class.top-bar-host--sticky]': "shellBand() && variant() === 'glass'",
  },
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  readonly borderless = input<boolean>(false);
  readonly variant = input<TopBarVariant>('solid');
  /** Planner shell geometry: shell header height, rail inset, hairline kept under glass. */
  readonly shellBand = input<boolean>(false);
  /** Accessible name of the bar when a page has more than one. */
  readonly ariaLabel = input<string | null>(null);
}
