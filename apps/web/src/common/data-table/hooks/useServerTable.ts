import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFnOption,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { type SetStateAction, useState } from 'react';

import type { RowData, TableFeatures } from '../types';
import { useAppTable } from '../utils';

export type ServerTableQueryHook<TData extends RowData> = (options: {
  pagination: PaginationState;
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
}) => {
  data: [rowCount: number, data: TData[]] | undefined;
  error: Error | null;
  isFetching: boolean;
};

interface TableOptions<TData extends RowData> {
  columns: ColumnDef<TableFeatures, TData>[];
  useServerQuery: ServerTableQueryHook<TData>;
  globalFilterFn?: FilterFnOption<TableFeatures, TData>;
}

export function useServerTable<TData extends RowData>({
  columns,
  useServerQuery,
  globalFilterFn,
}: TableOptions<TData>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const state = { pagination, columnFilters, globalFilter, sorting };
  const { data, error, isFetching } = useServerQuery(state);
  const [totalCount, items] = data ?? [];

  if (error) throw error;

  const table = useAppTable({
    data: items ?? [],
    state,
    columns,
    rowCount: totalCount,
    globalFilterFn,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: (updater) => {
      setSorting(updater);
      setPagination((previous) => ({ ...previous, pageIndex: 0 }));
    },
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
      setPagination((previous) => ({ ...previous, pageIndex: 0 }));
    },
    onGlobalFilterChange: (updater) => {
      setGlobalFilter(updater as SetStateAction<string>);
      setPagination((previous) => ({ ...previous, pageIndex: 0 }));
    },
    onPaginationChange: setPagination,
  });

  return { table, data: items, isFetching };
}
