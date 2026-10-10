import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { getPageNumbers, useTableContext } from '../utils';

export default function TablePagination() {
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

            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                {/* Previous page button */}
                <PaginationItem>
                  <PaginationPrevious
                    text=""
                    className="size-8 p-0"
                    onClick={() => {
                      onPageChange(currentPage - 1);
                    }}
                    hidden={!canPreviousPage}
                  />
                </PaginationItem>

                {/* First page button */}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => {
                      onPageChange(1);
                    }}
                    hidden={pageNumbers.includes(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>

                {/* Page number buttons */}
                {pageNumbers.map((pageNumber, index) => (
                  <PaginationItem key={`${String(pageNumber)}-${String(index)}`}>
                    {pageNumber === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={pageNumber === currentPage}
                        onClick={() => {
                          onPageChange(pageNumber as number);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                {/* Last page button */}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => {
                      onPageChange(totalPages);
                    }}
                    hidden={pageNumbers.includes(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>

                {/* Next page button */}
                <PaginationItem>
                  <PaginationNext
                    text=""
                    className="size-8 p-0"
                    onClick={() => {
                      onPageChange(currentPage + 1);
                    }}
                    hidden={!canNextPage}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        );
      }}
    </table.Subscribe>
  );
}
