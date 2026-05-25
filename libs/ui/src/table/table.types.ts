import type { BadgeIntent } from '../badge';

export type TableCellKind = 'text' | 'badge';

export type TableRowActionVariant = 'default' | 'danger';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
  width?: string;
  hidden?: boolean;
  emphasis?: boolean;
  kind?: TableCellKind;
  badgeIntent?: BadgeIntent;
}

export interface TableRowAction {
  key: string;
  label: string;
  ariaLabel?: string;
  variant?: TableRowActionVariant;
}

export interface TableSortState {
  column: string;
  direction: 'asc' | 'desc';
}
