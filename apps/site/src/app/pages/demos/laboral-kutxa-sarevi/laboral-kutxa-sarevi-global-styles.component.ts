import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Carries the `.lk-sarevi` rules, which style elements inside the Sarevi page's
 * own template and inside the DS primitives it renders, so they can't be
 * view-encapsulated. Lives in its own component because the page stylesheet is
 * already near the per-component budget. It is rendered by the Sarevi page, so
 * the CSS loads with that lazy route instead of on every page.
 */
@Component({
  selector: 'site-laboral-kutxa-sarevi-global-styles',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { hidden: '' },
  templateUrl: './laboral-kutxa-sarevi-global-styles.component.html',
  styleUrl: './laboral-kutxa-sarevi-global-styles.component.scss',
})
export class LaboralKutxaSareviGlobalStylesComponent {}
