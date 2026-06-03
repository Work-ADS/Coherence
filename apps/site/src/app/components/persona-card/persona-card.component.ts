import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { BadgeComponent, CardComponent } from '@coherence/ui';

import {
  personaInitials,
  type Persona,
} from '../../pages/demos/wealth-planner-2026/data/personas';

/**
 * site-persona-card — site-local widget rendering a single Persona.
 *
 * Wraps <afi-card> (memory rule: reuse primitives over bespoke). Two modes:
 *  - default: descriptive only (overview personas tab)
 *  - interactive: clickable as a cliente picker — emits (activate) with
 *    the persona id when activated. /clientes page consumes this.
 *
 * Avatar falls back to initials (first letter of first word + first letter
 * of last word in `alias`) — no image asset pipeline in v1.
 */
@Component({
  selector: 'site-persona-card',
  standalone: true,
  imports: [BadgeComponent, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './persona-card.component.html',
  styleUrls: ['./persona-card.component.scss'],
})
export class PersonaCardComponent {
  readonly persona = input.required<Persona>();
  readonly interactive = input<boolean>(false);

  readonly activate = output<string>();

  readonly initials = computed<string>(() => personaInitials(this.persona().alias));

  readonly ariaLabel = computed<string>(() => {
    const p = this.persona();
    const verb = this.interactive() ? 'Activar persona' : 'Persona';
    return `${verb} ${p.alias}, ${p.profileLabel}`;
  });

  onCardClick(): void {
    if (!this.interactive()) return;
    this.activate.emit(this.persona().id);
  }
}
