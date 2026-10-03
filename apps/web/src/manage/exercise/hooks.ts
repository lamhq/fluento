import { useApiClient } from '../../api';
import type { ExerciseQuery } from '../../api/types';
import type { QueryFn } from '../../common/data-table';
import type { RowData } from '../../common/data-table/types';

export interface ExerciseRow extends RowData {
  id: string;
  name: string;
  skill: 'communication' | 'vocabulary' | 'articulation';
  format: 'communication' | 'word' | 'sentence' | 'paragraph';
  status: 'active' | 'archived';
  topics: string[];
}

export function useExercisesQuery(): QueryFn<ExerciseRow> {
  const apiClient = useApiClient();
  return async ({ pagination }) => {
    try {
      const exerciseQuery: ExerciseQuery = {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
      };

      const result = await apiClient.getExercises(exerciseQuery);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to load exercises.');
    }
  };
}
