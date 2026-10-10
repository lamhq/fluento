import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import TableSkeleton from '../../../common/components/TableSkeleton';
import TopLoadingBar from '../../../common/components/TopLoadingBar';
import { exerciseColumns } from './columns';
import ExerciseToolbar from './ExerciseToolbar';
import { useExercisesTable } from './hooks';

export default function ExerciseListPage() {
  const { table, isFetching, data } = useExercisesTable();

  return (
    <div className="space-y-4 sm:space-y-6">
      <TopLoadingBar open={isFetching} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          My Exercises
        </h1>
        <div className="flex gap-2">
          <Button
            disabled
            title="Create flow is not available yet"
            aria-label="Create exercise (unavailable)"
          >
            Create
          </Button>
          <Button
            variant="outline"
            disabled
            title="Import flow is not available yet"
            aria-label="Import exercises (unavailable)"
          >
            Import
          </Button>
        </div>
      </div>

      <table.AppTable>
        <table.Container>
          <table.Toolbar>
            <ExerciseToolbar />
          </table.Toolbar>

          {isFetching && !data && (
            <TableSkeleton columnCount={exerciseColumns.length} />
          )}

          {(!isFetching || data) && (
            <>
              <table.Table
                emptyMessage="No exercises match the current filters."
                className={cn({
                  'pointer-events-none opacity-50': isFetching && data,
                })}
              />
              <table.Pagination />
            </>
          )}
        </table.Container>
      </table.AppTable>
    </div>
  );
}
