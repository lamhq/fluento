import { Inbox } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { TableCell, TableRow } from '@/components/ui/table';

interface EmptyRowProps {
  colSpan: number;
  children?: React.ReactNode;
}

export default function EmptyRow({ colSpan, children }: EmptyRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <Empty className="min-h-24 border-0 p-4">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No results found</EmptyTitle>
            <EmptyDescription>{children}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </TableCell>
    </TableRow>
  );
}
