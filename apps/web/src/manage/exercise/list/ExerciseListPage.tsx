import { cn } from '@/lib/utils';

import { Header } from '../../../common/components/MainLayout';
import TableSkeleton from '../../../common/components/TableSkeleton';
import TopLoadingBar from '../../../common/components/TopLoadingBar';
import ExerciseDialogs from '../dialog/ExerciseDialogs';
import { ExerciseProvider } from '../dialog/ExerciseProvider';
import { exerciseColumns } from './columns';
import ExercisesPrimaryButtons from './ExercisesPrimaryButtons';
import ExerciseToolbar from './ExerciseToolbar';
import { useExercisesTable } from './hooks';

export default function ExerciseListPage() {
  const { table, isFetching, data } = useExercisesTable();

  return (
    <ExerciseProvider>
      <TopLoadingBar open={isFetching} />

      <Header title="Exercise List" description="Manage your exercises here.">
        <ExercisesPrimaryButtons />
      </Header>

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

      <ExerciseDialogs />
    </ExerciseProvider>
  );
}
