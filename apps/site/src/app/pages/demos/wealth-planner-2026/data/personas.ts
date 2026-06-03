import type {
  AscendienteData,
  ClienteData,
  ConyugeData,
  ConyugeStatus,
  HijoData,
} from '../store';

/**
 * AWP user-persona fixtures.
 *
 * The cliente data used in the wealth planner demo is sensitive — real-client
 * seeds are not used. Personas stand in for those scenarios while staying
 * confidential and not provoking AI-data-leak worries.
 *
 * v1 (Brief 2): descriptive only. v2 (Brief 3+4, this iteration): each
 * persona carries a `clienteSnapshot` payload so clicking a card on
 * /clientes can activate that persona as the cliente of record. The
 * descriptive fields drive the card UI; the snapshot drives the store.
 */
export type PersonaProfileSlug = 'acumulador' | 'patrimonio-establecido';

/**
 * Family-member shape used inside snapshots — same as the store types but
 * without ids (the store generates them at activation time).
 */
export type PersonaSnapshotHijo = Omit<HijoData, 'id'>;
export type PersonaSnapshotAscendiente = Omit<AscendienteData, 'id'>;

export interface PersonaClienteSnapshot {
  cliente: ClienteData;
  conyugeStatus: ConyugeStatus;
  conyuge: ConyugeData | null;
  hijos: PersonaSnapshotHijo[];
  ascendientes: PersonaSnapshotAscendiente[];
}

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
  /** Activatable cliente data. Click on /clientes seeds the store with this. */
  clienteSnapshot: PersonaClienteSnapshot;
}

export const AWP_PERSONAS: Persona[] = [
  {
    id: 'marco-fernandez-castro',
    alias: 'Marco Fernández Castro',
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
    clienteSnapshot: {
      cliente: {
        alias: 'Marco Fernández Castro',
        residenciaFiscal: 'Madrid',
        anoNacimiento: 1984,
        gradoDiscapacidad: 'sin',
        tipoActividad: 'activo',
        anoJubilacion: null,
        anosCotizados: 18,
        anoDejoCotizar: null,
        tipoCotizacion: 'regimen-general',
      },
      conyugeStatus: 'yes',
      conyuge: {
        alias: 'Laura Castro',
        residenciaFiscal: 'Madrid',
        anoNacimiento: 1986,
        gradoDiscapacidad: 'sin',
        tipoActividad: 'activo',
        anoJubilacion: null,
        anosCotizados: 16,
        anoDejoCotizar: null,
        tipoCotizacion: 'regimen-general',
      },
      hijos: [
        {
          alias: 'Lucía Fernández',
          anoNacimiento: 2020,
          gradoDiscapacidad: 'sin',
          delCliente: true,
        },
      ],
      ascendientes: [],
    },
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
    clienteSnapshot: {
      cliente: {
        alias: 'Carmen López Martín',
        residenciaFiscal: 'Madrid',
        anoNacimiento: 1962,
        gradoDiscapacidad: 'sin',
        tipoActividad: 'jubilado',
        anoJubilacion: 2022,
        anosCotizados: null,
        anoDejoCotizar: null,
        tipoCotizacion: null,
      },
      conyugeStatus: 'yes',
      conyuge: {
        alias: 'Antonio Ruiz',
        residenciaFiscal: 'Madrid',
        anoNacimiento: 1960,
        gradoDiscapacidad: 'sin',
        tipoActividad: 'jubilado',
        anoJubilacion: 2020,
        anosCotizados: null,
        anoDejoCotizar: null,
        tipoCotizacion: null,
      },
      hijos: [
        {
          alias: 'Pablo López',
          anoNacimiento: 1995,
          gradoDiscapacidad: 'sin',
          delCliente: false,
        },
        {
          alias: 'Sofía López',
          anoNacimiento: 1998,
          gradoDiscapacidad: 'sin',
          delCliente: false,
        },
      ],
      ascendientes: [],
    },
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
