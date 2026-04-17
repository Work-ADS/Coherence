export type Estado =
  | 'borrador'
  | 'pendiente'
  | 'aprobada'
  | 'rechazada'
  | 'ejecutada'
  | 'cancelada'
  | 'en-revision'
  | 'archivada';

export const estadoLabels: Record<Estado, string> = {
  'borrador': 'Borrador',
  'pendiente': 'Pendiente',
  'aprobada': 'Aprobada',
  'rechazada': 'Rechazada',
  'ejecutada': 'Ejecutada',
  'cancelada': 'Cancelada',
  'en-revision': 'En revisión',
  'archivada': 'Archivada',
};
