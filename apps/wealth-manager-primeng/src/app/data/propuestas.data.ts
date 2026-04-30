export type ProposalStatus =
  | 'pendiente'
  | 'borrador'
  | 'enviado'
  | 'firmado'
  | 'ejecutado'
  | 'cancelado'
  | 'excluida';

export type ProposalType =
  | 'nueva'
  | 'rebalanceo'
  | 'modificacion-libre'
  | 'reembolso'
  | 'operativa-manual';

export interface Proposal {
  id: string;
  name: string;
  type: ProposalType;
  status: ProposalStatus;
  fechaValoracion: string;
  totalCompras: string;
  totalVentas: string;
}

export const PROPOSAL_TYPE_LABEL: Record<ProposalType, string> = {
  'nueva': 'Nueva',
  'rebalanceo': 'Rebalanceo de carteras modelizadas',
  'modificacion-libre': 'Modificación de cartera / aportación adicional',
  'reembolso': 'Reembolso',
  'operativa-manual': 'Operativa manual',
};

/** Maps to the --status-{semantic}-{bg/fg/dot} tokens in libs/tokens/semantic/status.json. */
export type StatusSemantic = 'in-review' | 'approved' | 'rejected' | 'pending' | 'draft';

export interface StatusVisual {
  label: string;
  filled: number;
  total: number;
  semantic: StatusSemantic;
  icon?: string;
}

export const STATUS_VISUAL: Record<ProposalStatus, StatusVisual> = {
  pendiente:  { label: 'Pendiente', filled: 1, total: 5, semantic: 'in-review' },
  borrador:   { label: 'Borrador',  filled: 2, total: 5, semantic: 'in-review' },
  enviado:    { label: 'Enviado',   filled: 3, total: 5, semantic: 'in-review' },
  firmado:    { label: 'Firmado',   filled: 4, total: 5, semantic: 'in-review' },
  ejecutado:  { label: 'Ejecutado', filled: 5, total: 5, semantic: 'approved' },
  cancelado:  { label: 'Cancelado', filled: 0, total: 5, semantic: 'rejected' },
  excluida:   { label: 'Excluida',  filled: 0, total: 5, semantic: 'pending', icon: 'pi-info-circle' },
};

export const PROPOSALS: Proposal[] = [
  { id: '1',  name: 'Expansión a Mercados Emergentes',          type: 'nueva',              status: 'pendiente', fechaValoracion: '15/11/2025 · 09:00', totalCompras: '99.999.999.999 €', totalVentas: '99.999.999.999 €' },
  { id: '2',  name: 'Plataforma de Salud Mental Online',        type: 'rebalanceo',         status: 'cancelado', fechaValoracion: '16/11/2025 · 10:15', totalCompras: '99.999.999.999 €', totalVentas: '99.999.999.999 €' },
  { id: '3',  name: 'Ciberseguridad Avanzada para Fintech',     type: 'modificacion-libre', status: 'excluida',  fechaValoracion: '17/11/2025 · 11:30', totalCompras: '99.999.999.999 €', totalVentas: '99.999.999.999 €' },
  { id: '4',  name: 'Desarrollo de IA para PyMEs',              type: 'nueva',              status: 'borrador',  fechaValoracion: '18/11/2025 · 12:45', totalCompras: '99.999.999.999 €', totalVentas: '99.999.999.999 €' },
  { id: '5',  name: 'Soluciones de Energía Solar Residencial',  type: 'rebalanceo',         status: 'enviado',   fechaValoracion: '19/11/2025 · 14:00', totalCompras: '99.999.999.999 €', totalVentas: '99.999.999.999 €' },
  { id: '6',  name: 'Optimización Logística con Blockchain',    type: 'reembolso',          status: 'firmado',   fechaValoracion: '20/11/2025 · 15:15', totalCompras: '99.999.999.999 €', totalVentas: '99.999.999.999 €' },
  { id: '7',  name: 'Agricultura Vertical Urbana',              type: 'nueva',              status: 'ejecutado', fechaValoracion: '21/11/2025 · 16:30', totalCompras: '99.999.999.999 €', totalVentas: '99.999.999.999 €' },
  { id: '8',  name: 'Inversión en Crecimiento Verde',           type: 'operativa-manual',   status: 'pendiente', fechaValoracion: '22/11/2025 · 17:45', totalCompras: '99.999.999.999 €', totalVentas: '99.999.999.999 €' },
  { id: '9',  name: 'Movilidad Eléctrica Compartida',           type: 'nueva',              status: 'pendiente', fechaValoracion: '23/11/2025 · 18:30', totalCompras: '99.999.999.999 €', totalVentas: '99.999.999.999 €' },
  { id: '10', name: 'Automatización Robótica en Industria',     type: 'rebalanceo',         status: 'pendiente', fechaValoracion: '24/11/2025 · 19:00', totalCompras: '99.999.999.999 €', totalVentas: '99.999.999.999 €' },
];

export interface ProposalTypeOption {
  type: ProposalType;
  title: string;
  description: string;
  icon: string;
}

export const PROPOSAL_TYPE_OPTIONS: ProposalTypeOption[] = [
  {
    type: 'nueva',
    title: 'Nueva',
    description: 'Crear una propuesta desde cero para un cliente.',
    icon: 'pi-plus-circle',
  },
  {
    type: 'rebalanceo',
    title: 'Rebalanceo de carteras modelizadas',
    description: 'Ajustar carteras a un modelo objetivo predefinido.',
    icon: 'pi-sync',
  },
  {
    type: 'modificacion-libre',
    title: 'Modificación de cartera / aportación adicional',
    description: 'Modificar posiciones o añadir aportaciones puntuales.',
    icon: 'pi-pencil',
  },
  {
    type: 'reembolso',
    title: 'Reembolso',
    description: 'Generar una orden de reembolso para el cliente.',
    icon: 'pi-arrow-circle-down',
  },
  {
    type: 'operativa-manual',
    title: 'Operativa manual',
    description: 'Operativa libre fuera de los flujos predefinidos.',
    icon: 'pi-wrench',
  },
];
