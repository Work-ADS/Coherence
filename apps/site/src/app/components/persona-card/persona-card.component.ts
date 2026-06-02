import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BadgeComponent, CardComponent } from '@coherence/ui';

import {
  personaInitials,
  type Persona,
} from '../../pages/demos/wealth-planner-2026/data/personas';

/**
 * site-persona-card — site-local widget rendering a single Persona.
 *
 * Wraps <afi-card> (memory rule: reuse primitives over bespoke). v1 is
 * descriptive only: no Activar action, no clienteData snapshot. The
 * follow-up brief 2026-XX-XX-awp-persona-activate.md adds the Activar
 * affordance + payload.
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

  readonly initials = computed<string>(() => personaInitials(this.persona().alias));

  readonly ariaLabel = computed<string>(
    () => `Persona ${this.persona().alias}, ${this.persona().profileLabel}`,
  );
}
