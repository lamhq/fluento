import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { getPageNumbers, useTableContext } from '../utils';

export default function Pagination() {
  const table = useTableContext();
  return (
    <table.Subscribe selector={(state) => ({ pagination: state.pagination })}>
      {({ pagination }) => {
        const currentPage = pagination.pageIndex + 1;
        const pageSize = pagination.pageSize;
        const totalPages = table.getPageCount();
        const canPreviousPage = table.getCanPreviousPage();
        const canNextPage = table.getCanNextPage();
        const onPageChange = (page: number) => {
          table.setPageIndex(page - 1);
        };
        const onPageSizeChange = table.setPageSize;
        const pageNumbers = getPageNumbers(currentPage, totalPages);
        return (
          <div
            className={cn(
              'flex items-center justify-between overflow-clip px-2',
              '@max-2xl/content:flex-col-reverse @max-2xl/content:gap-4',
              'mt-auto',
            )}
            style={{ overflowClipMargin: 1 }}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex w-25 items-center justify-center text-sm font-medium @2xl/content:hidden">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2 @max-2xl/content:flex-row-reverse">
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
                <p className="hidden text-sm font-medium sm:block">Rows per page</p>
              </div>
            </div>

            <div className="flex items-center sm:space-x-6 lg:space-x-8">
              <div className="flex w-25 items-center justify-center text-sm font-medium @max-3xl/content:hidden">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="size-8 p-0 @max-md/content:hidden"
                  onClick={() => {
                    onPageChange(1);
                  }}
                  disabled={!canPreviousPage}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  className="size-8 p-0"
                  onClick={() => {
                    onPageChange(currentPage - 1);
                  }}
                  disabled={!canPreviousPage}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft size={16} />
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

                <Button
                  variant="outline"
                  className="size-8 p-0"
                  onClick={() => {
                    onPageChange(currentPage + 1);
                  }}
                  disabled={!canNextPage}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight size={16} />
                </Button>
                <Button
                  variant="outline"
                  className="size-8 p-0 @max-md/content:hidden"
                  onClick={() => {
                    onPageChange(totalPages);
                  }}
                  disabled={!canNextPage}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        );
      }}
    </table.Subscribe>
  );
}
