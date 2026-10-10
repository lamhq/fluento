import {
  Table as TanstackTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import type { RowData } from '../types';
import { useTableContext } from '../utils';
import ColumnHeader from './ColumnHeader';
import EmptyRow from './EmptyRow';

interface TableProps {
  className?: string;
  emptyMessage?: React.ReactNode;
}

export default function Table({
  className,
  emptyMessage = 'There are no rows to display for the current filters.',
}: TableProps) {
  const table = useTableContext<RowData>();
  return (
    <table.Subscribe
      selector={(state) => ({
        columnVisibility: state.columnVisibility,
        pagination: state.pagination,
        columnFilters: state.columnFilters,
        globalFilter: state.globalFilter as string,
        sorting: state.sorting,
        rowSelection: state.rowSelection,
      })}
    >
      {() => {
        const rows = table.getRowModel().rows;
        return (
          <div className={cn('overflow-hidden border', className)}>
            <TanstackTable>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="group/row">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        rowSpan={header.rowSpan}
                        className={cn(
                          'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                          { 'px-0': header.column.getCanSort() },
                          header.column.columnDef.meta?.className,
                          header.column.columnDef.meta?.thClassName,
                        )}
                      >
                        {header.isPlaceholder ? null : (
                          <ColumnHeader
                            sortable={header.column.getCanSort()}
                            sortDirection={header.column.getIsSorted()}
                            onAsc={() => {
                              header.column.toggleSorting(false, true);
                            }}
                            onDesc={() => {
                              header.column.toggleSorting(true, true);
                            }}
                            onReset={() => {
                              header.column.clearSorting();
                            }}
                          >
                            <table.FlexRender header={header} />
                          </ColumnHeader>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {rows.length === 0 ? (
                  <EmptyRow colSpan={table.getVisibleLeafColumns().length}>
                    {emptyMessage}
                  </EmptyRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id} className="group/row">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                            cell.column.columnDef.meta?.className,
                            cell.column.columnDef.meta?.tdClassName,
                          )}
                        >
                          <table.FlexRender cell={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </TanstackTable>
          </div>
        );
      }}
    </table.Subscribe>
  );
}
