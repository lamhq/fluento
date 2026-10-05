import type { ColumnFiltersState } from '@tanstack/react-table';

import type {
  Exercise,
  ExerciseFormat,
  ExerciseSkill,
  ExerciseStatus,
} from '../../../api/types';
import DebouncedInput from '../../../common/components/DebouncedInput';
import { ColumnFilter, useTableContext } from '../../../common/data-table';
import TopicFilter from './TopicFilter';

const skills: { label: string; value: ExerciseSkill }[] = [
  { label: 'Communication', value: 'communication' },
  { label: 'Vocabulary', value: 'vocabulary' },
  { label: 'Articulation', value: 'articulation' },
];

const formats: { label: string; value: ExerciseFormat }[] = [
  { label: 'Communication', value: 'communication' },
  { label: 'Word', value: 'word' },
  { label: 'Sentence', value: 'sentence' },
  { label: 'Paragraph', value: 'paragraph' },
];

const statuses: { label: string; value: ExerciseStatus }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
];

function getFilterValue<T>(
  columnFilters: ColumnFiltersState,
  columnId: string,
  fallback: T,
): T {
  const filter = columnFilters.find((item) => item.id === columnId);
  return filter ? (filter.value as T) : fallback;
}

export default function ExerciseToolbar() {
  const table = useTableContext<Exercise>();

  return (
    <table.Subscribe
      selector={(state) => ({
        columnFilters: state.columnFilters,
      })}
    >
      {({ columnFilters }) => (
        <>
          <DebouncedInput
            id="exercise-name-filter"
            aria-label="Filter by exercise name"
            placeholder="Filter by exercise name"
            defaultValue={getFilterValue(columnFilters, 'name', '')}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="h-8 w-70 sm:w-50"
          />
          <TopicFilter
            values={getFilterValue(columnFilters, 'topics', [])}
            onChange={(values) => {
              table.getColumn('topics')?.setFilterValue(values);
            }}
          />
          <ColumnFilter
            title="Skills"
            values={getFilterValue(columnFilters, 'skill', [])}
            onChange={(values) => {
              table.getColumn('skill')?.setFilterValue(values);
            }}
            options={skills}
          />
          <ColumnFilter
            title="Formats"
            values={getFilterValue(columnFilters, 'format', [])}
            onChange={(values) => {
              table.getColumn('format')?.setFilterValue(values);
            }}
            options={formats}
          />
          <ColumnFilter
            title="Status"
            values={getFilterValue(columnFilters, 'status', [])}
            onChange={(values) => {
              table.getColumn('status')?.setFilterValue(values);
            }}
            options={statuses}
          />
        </>
      )}
    </table.Subscribe>
  );
}
