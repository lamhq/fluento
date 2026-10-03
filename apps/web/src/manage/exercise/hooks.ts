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

  return async (query) => {
    try {
      const exerciseQuery: ExerciseQuery = {
        limit: query.pagination.pageSize,
        offset: query.pagination.pageIndex * query.pagination.pageSize,
      };

      const [total, items] = await apiClient.getExercises(exerciseQuery);

      return [
        total,
        items.map((item) => ({
          id: item.id,
          name: item.name,
          skill: item.skill,
          format: item.format,
          status: item.status,
          topics: item.topics,
        })),
      ];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to load exercises.');
    }
  };
}
