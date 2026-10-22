import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

import type { ExerciseQuery } from '../../api/types';
import { ExerciseFormat } from '../../core/types/exercise-format';
import { ExerciseSkill } from '../../core/types/exercise-skill';
import { ExerciseStatus } from '../../core/types/exercise-status';

export function buildExerciseQuery({
  pagination,
  columnFilters,
  sorting,
}: {
  pagination: PaginationState;
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
}): ExerciseQuery {
  const filters = new Map(
    columnFilters.map(({ id, value }) => [id, value] as const),
  );
  const name = filters.get('name');
  const topics = filters.get('topics');
  const skills = filters.get('skill');
  const formats = filters.get('format');
  const status = filters.get('status');
  const topicValues = Array.isArray(topics)
    ? topics.filter((value): value is string => typeof value === 'string')
    : [];
  const skillValues = Array.isArray(skills) ? skills.filter(isExerciseSkill) : [];
  const formatValues = Array.isArray(formats)
    ? formats.filter(isExerciseFormat)
    : [];
  const statusValues = Array.isArray(status) ? status.filter(isExerciseStatus) : [];

  return {
    ...(typeof name === 'string' && name.length > 0 ? { name } : {}),
    ...(topicValues.length > 0 ? { topics: topicValues } : {}),
    ...(skillValues.length > 0 ? { skills: skillValues } : {}),
    ...(formatValues.length > 0 ? { formats: formatValues } : {}),
    ...(statusValues.length > 0 ? { status: statusValues } : {}),
    ...(sorting.length > 0
      ? {
          sort: sorting.map(({ id, desc }) => `${desc ? '-' : ''}${id}`).join(','),
        }
      : {}),
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
  };
}

function isExerciseSkill(value: unknown): value is ExerciseSkill {
  return (
    value === ExerciseSkill.COMMUNICATION ||
    value === ExerciseSkill.VOCABULARY ||
    value === ExerciseSkill.ARTICULATION
  );
}

function isExerciseFormat(value: unknown): value is ExerciseFormat {
  return (
    value === ExerciseFormat.Communication ||
    value === ExerciseFormat.Word ||
    value === ExerciseFormat.Sentence ||
    value === ExerciseFormat.Paragraph
  );
}

function isExerciseStatus(value: unknown): value is ExerciseStatus {
  return value === ExerciseStatus.ACTIVE || value === ExerciseStatus.ARCHIVED;
}
