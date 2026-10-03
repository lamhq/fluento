import type { features } from './features';

export type TableFeatures = typeof features;

export interface RowData {
  id: string;
}

export interface ColumnMeta {
  className?: string;
  thClassName?: string;
  tdClassName?: string;
}
