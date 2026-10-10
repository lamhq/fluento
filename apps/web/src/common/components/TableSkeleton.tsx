import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
}

export default function TableSkeleton({
  columnCount = 6,
  rowCount = 5,
}: TableSkeletonProps) {
  const columns = Array.from({ length: columnCount });
  const rows = Array.from({ length: rowCount });

  return (
    <div className="overflow-hidden border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((_, columnIndex) => (
              <TableHead key={columnIndex} className="bg-background">
                <Skeleton className="h-4 w-16" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((_, columnIndex) => (
                <TableCell key={columnIndex} className="bg-background">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
