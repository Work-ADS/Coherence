/**
 * AWP user-persona fixtures.
 *
 * The cliente data used in the wealth planner demo is sensitive — real-client
 * seeds are not used. Personas stand in for those scenarios while staying
 * confidential and not provoking AI-data-leak worries. v1 ships two; more
 * land as the product grows.
 *
 * Shape is intentionally DESCRIPTIVE only — no ClienteData snapshot, no
 * "Activar" plumbing. The Activar follow-up brief
 * (2026-XX-XX-awp-persona-activate.md) extends this with an optional
 * `clienteSnapshot` payload and the corresponding UI affordance.
 */
export type PersonaProfileSlug = 'acumulador' | 'patrimonio-establecido';

export interface Persona {
  id: string;
  alias: string;
  age: number;
  profileSlug: PersonaProfileSlug;
  profileLabel: string;
  /** 3-5 short chips that summarize the scenario at a glance. */
  keyAttributes: string[];
  /** 1-2 sentence backstory. Drives the persona card's body copy. */
  summary: string;
}

export const AWP_PERSONAS: Persona[] = [
  {
    id: 'maria-fernandez-castro',
    alias: 'María Fernández Castro',
    age: 42,
    profileSlug: 'acumulador',
    profileLabel: 'Acumulador',
    keyAttributes: [
      'Ingresos > 100 k €/año',
      'Primer inmueble de alquiler',
      'Familia con hijo pequeño',
    ],
    summary:
      'Empieza a construir patrimonio por dos vías: inversión financiera de toda la vida y un primer ladrillo que va a alquilar. Su planificación equilibra dos motores recién encendidos.',
  },
  {
    id: 'carmen-lopez-martin',
    alias: 'Carmen López Martín',
    age: 64,
    profileSlug: 'patrimonio-establecido',
    profileLabel: 'Patrimonio establecido',
    keyAttributes: [
      'Jubilada',
      'Múltiples activos',
      '2 hijos adultos',
    ],
    summary:
      'Lleva décadas acumulando patrimonio. Ahora pivota: cómo desinvertir con cabeza, asegurar el legado a sus hijos y mantener el nivel de vida durante un retiro largo.',
  },
];

/** Initials derived from alias — first letter of first word + first letter of last word. */
export function personaInitials(alias: string): string {
  const parts = alias.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase() || '?';
}
