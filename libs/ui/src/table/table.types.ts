export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
  width?: string;
  hidden?: boolean;
}

export interface TableSortState {
  column: string;
  direction: 'asc' | 'desc';
}
