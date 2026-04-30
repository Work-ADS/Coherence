import type { PropuestaType } from '../data/propuesta.model';

const TYPE_PREFIX: Record<PropuestaType, string> = {
  'nueva': 'NUE',
  'rebalanceo': 'REB',
  'modificacion-libre': 'MOD',
  'reembolso': 'REM',
  'operacional': 'OPE',
};

let seq = 1;

/**
 * Stub name generator.
 * Real convention: contrato + client initials + year + day + sequential.
 * For the concept demo we use PROP-{PREFIX}-{YYYY}-{MMDD}-{seq}.
 */
export function generatePropuestaName(type: PropuestaType): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const id = `PROP-${TYPE_PREFIX[type]}-${yyyy}-${mm}${dd}-${String(seq++).padStart(3, '0')}`;
  return id;
}

/** Generate a simple UUID-ish id for routing */
export function generatePropuestaId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
