import type { SortDirection } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ColumnHeaderProps {
  sortable: boolean;
  sortDirection: false | SortDirection;
  onAsc: () => void;
  onDesc: () => void;
  onReset: () => void;
  children?: React.ReactNode;
  className?: string;
}

export default function ColumnHeader({
  sortable,
  sortDirection,
  onAsc,
  onDesc,
  onReset,
  children,
  className,
}: ColumnHeaderProps) {
  if (!sortable) {
    return <div className={cn(className)}>{children}</div>;
  }

  const isAsc = sortDirection === 'asc';
  const isDesc = sortDirection === 'desc';
  const isUnsorted = !sortDirection;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="xs"
              className="h-8 data-[state=open]:bg-accent"
            />
          }
        >
          <span>{children}</span>
          <span className="sr-only">
            {isUnsorted
              ? 'Not sorted'
              : `Sorted ${isAsc ? 'ascending' : 'descending'}`}
          </span>
          {isDesc && <ArrowDown size={16} className="ms-2" />}
          {isAsc && <ArrowUp size={16} className="ms-2" />}
          {isUnsorted && <ChevronsUpDown size={16} className="ms-2" />}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onAsc}>
            <ArrowUp size={14} className="text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDesc}>
            <ArrowDown size={14} className="text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>

          {!isUnsorted && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onReset}>
                <RefreshCcw size={14} className="text-muted-foreground/70" />
                Reset
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
