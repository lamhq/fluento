import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import TableSkeleton from '../../../common/components/TableSkeleton';
import TopLoadingBar from '../../../common/components/TopLoadingBar';
import { createAppColumnHelper, useServerTable } from '../../../common/data-table';
import { type ExerciseRow, useExercisesQuery } from '../hooks';

const columnHelper = createAppColumnHelper<ExerciseRow>();

const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor('skill', {
    header: 'Skill',
    cell: (info) => (
      <Badge variant="outline" className="capitalize">
        {info.getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor('format', {
    header: 'Format',
    cell: (info) => (
      <Badge variant="secondary" className="capitalize">
        {info.getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue();
      return (
        <Badge
          variant={status === 'active' ? 'default' : 'secondary'}
          className="capitalize"
        >
          {status}
        </Badge>
      );
    },
  }),
  columnHelper.accessor('topics', {
    header: 'Topics',
    cell: (info) => {
      const topics = info.getValue();
      return (
        <div className="flex flex-wrap gap-1">
          {topics.slice(0, 2).map((topic) => (
            <Badge key={topic} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
          {topics.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{topics.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  }),
]);

export default function ExerciseListPage() {
  const queryFn = useExercisesQuery();
  const { table, isFetching, data } = useServerTable({
    columns,
    queryFn,
    queryKeyPrefix: 'exercises',
  });

  return (
    <div className="space-y-6">
      <TopLoadingBar open={isFetching} />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>
      </div>

      <table.AppTable>
        <table.Container>
          <table.Toolbar />

          {isFetching && !data && <TableSkeleton columnCount={columns.length} />}

          {(!isFetching || data) && (
            <>
              <table.Table
                className={cn({
                  'pointer-events-none opacity-50': isFetching && data,
                })}
              />
              <table.Pagination />
            </>
          )}

          <table.BulkActions />
        </table.Container>
      </table.AppTable>
    </div>
  );
}
