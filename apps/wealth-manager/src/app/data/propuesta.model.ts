export type PropuestaState =
  | 'borrador'
  | 'enviado-para-firma'
  | 'ejecutado'
  | 'formalizada'
  | 'cancelada';

export type PropuestaType =
  | 'nueva'
  | 'rebalanceo'
  | 'modificacion-libre'
  | 'reembolso'
  | 'operacional';

export interface PropuestaRow {
  id: string;
  name: string;
  client: string;
  cartera: string;
  state: PropuestaState;
  type: PropuestaType;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}
