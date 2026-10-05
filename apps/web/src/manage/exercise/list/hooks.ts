import { useApiClient } from '../../../api';
import type { Exercise } from '../../../api/types';
import { type QueryFn, useServerTable } from '../../../common/data-table';
import { exerciseColumns } from './columns';
import { buildExerciseQuery } from './utils';

export function useExercisesTable() {
  const apiClient = useApiClient();
  const queryFn: QueryFn<Exercise> = async ({
    pagination,
    columnFilters,
    sorting,
    signal,
  }) => {
    try {
      const exerciseQuery = buildExerciseQuery({
        pagination,
        columnFilters,
        sorting,
      });

      const result = await apiClient.getExercises(exerciseQuery, signal);
      return [result.total, result.items];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to load exercises.');
    }
  };

  return useServerTable({
    columns: exerciseColumns,
    queryFn,
    queryKeyPrefix: 'exercises',
  });
}
