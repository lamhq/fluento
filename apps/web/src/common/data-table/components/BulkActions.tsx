import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { useTableContext } from '../utils';

interface BulkActionsProps {
  children?: React.ReactNode;
}

export default function BulkActions({
  children,
}: BulkActionsProps): React.ReactNode | null {
  const table = useTableContext();
  return (
    <table.Subscribe selector={(state) => ({ rowSelection: state.rowSelection })}>
      {() => {
        const selectedCount = table.getFilteredSelectedRowModel().rows.length;
        if (selectedCount === 0) return null;

        return (
          <div
            role="toolbar"
            aria-label={`Bulk actions for ${selectedCount.toString()} item(s)`}
            aria-describedby="bulk-actions-description"
            tabIndex={-1}
            className={cn(
              'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl',
              'transition-all delay-100 duration-300 ease-out hover:scale-105',
              'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
            )}
          >
            <div
              className={cn(
                'p-2 shadow-xl',
                'rounded-xl border',
                'bg-background/95 backdrop-blur-lg supports-backdrop-filter:bg-background/60',
                'flex items-center gap-x-2',
              )}
            >
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        table.resetRowSelection();
                      }}
                      className="size-6 rounded-full"
                      aria-label="Clear selection"
                      title="Clear selection (Escape)"
                    />
                  }
                >
                  <X />
                  <span className="sr-only">Clear selection</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear selection</p>
                </TooltipContent>
              </Tooltip>

              <Separator
                className="h-4 data-vertical:self-auto"
                orientation="vertical"
                aria-hidden="true"
              />

              <div
                className="flex items-center gap-x-1 text-sm"
                id="bulk-actions-description"
              >
                <Badge
                  variant="default"
                  className="min-w-8 rounded-lg"
                  aria-label={`${selectedCount.toString()} selected`}
                >
                  {selectedCount}
                </Badge>{' '}
                <span className="hidden sm:inline">
                  item{selectedCount > 1 ? 's' : ''}
                </span>
                selected
              </div>

              <Separator
                className="h-4 data-vertical:self-auto"
                orientation="vertical"
                aria-hidden="true"
              />

              {children}
            </div>
          </div>
        );
      }}
    </table.Subscribe>
  );
}
