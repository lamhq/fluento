import { keepPreviousData, useQuery } from '@tanstack/react-query';
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

interface QueryOptions {
  pagination: PaginationState;
  columnFilters: ColumnFiltersState;
  globalFilter?: string;
  sorting: SortingState;
}

export type QueryFn<TData extends RowData> = (
  query: QueryOptions,
) => Promise<[rowCount: number, data: TData[]]>;

interface TableOptions<TData extends RowData> {
  columns: ColumnDef<TableFeatures, TData>[];
  queryFn: QueryFn<TData>;
  queryKeyPrefix: string;
  globalFilterFn?: FilterFnOption<TableFeatures, TData>;
}

export function useServerTable<TData extends RowData>({
  columns,
  queryFn: fetchData,
  queryKeyPrefix,
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
  const {
    data: [totalCount, items] = [0, []],
    error,
    isFetching,
  } = useQuery({
    queryKey: [queryKeyPrefix, pagination, globalFilter, columnFilters, sorting],
    queryFn: () => fetchData(state),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  if (error) throw error;

  const table = useAppTable({
    data: items,
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

  return { table, data: items, isFetching, pagination };
}
