import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { getPageNumbers, useTableContext } from '../utils';

export default function Pagination() {
  const table = useTableContext();
  return (
    <table.Subscribe selector={(state) => ({ pagination: state.pagination })}>
      {({ pagination }) => {
        const currentPage = pagination.pageIndex + 1;
        const pageSize = pagination.pageSize;
        const totalPages = table.getPageCount();
        const totalRows = table.getRowCount();
        const canPreviousPage = table.getCanPreviousPage();
        const canNextPage = table.getCanNextPage();
        const pageNumbers = getPageNumbers(currentPage, totalPages);
        const onPageChange = (page: number) => {
          table.setPageIndex(page - 1);
        };
        const onPageSizeChange = table.setPageSize;
        return (
          <div className="flex items-center justify-between overflow-clip [overflow-clip-margin:1px] max-sm:flex-col max-sm:gap-3">
            <div className="flex items-center gap-2">
              <Select
                value={pageSize}
                onValueChange={(value) => {
                  onPageSizeChange(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-17.5">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={String(pageSize)}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm">
                rows of <strong>{totalRows}</strong>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {/* Previous page button */}
              <Button
                variant="outline"
                className="size-8 p-0"
                onClick={() => {
                  onPageChange(currentPage - 1);
                }}
                hidden={!canPreviousPage}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft size={16} />
              </Button>

              {/* First page button */}
              <Button
                variant="outline"
                className="size-8 p-0"
                onClick={() => {
                  onPageChange(1);
                }}
                hidden={pageNumbers.includes(1)}
              >
                <span className="sr-only">Go to first page</span>1
              </Button>

              {/* Page number buttons */}
              {pageNumbers.map((pageNumber, index) => (
                <div
                  key={`${String(pageNumber)}-${String(index)}`}
                  className="flex items-center"
                >
                  {pageNumber === '...' ? (
                    <span className="px-1 text-sm text-muted-foreground">...</span>
                  ) : (
                    <Button
                      variant={currentPage === pageNumber ? 'default' : 'outline'}
                      className="h-8 min-w-8 px-2"
                      onClick={() => {
                        onPageChange(pageNumber as number);
                      }}
                    >
                      <span className="sr-only">Go to page {pageNumber}</span>
                      {pageNumber}
                    </Button>
                  )}
                </div>
              ))}

              {/* Last page button */}
              <Button
                variant="outline"
                className="size-8 p-0"
                onClick={() => {
                  onPageChange(totalPages);
                }}
                hidden={pageNumbers.includes(totalPages)}
              >
                <span className="sr-only">Go to last page</span>
                {totalPages}
              </Button>

              {/* Next page button */}
              <Button
                variant="outline"
                className="size-8 p-0"
                onClick={() => {
                  onPageChange(currentPage + 1);
                }}
                hidden={!canNextPage}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        );
      }}
    </table.Subscribe>
  );
}
