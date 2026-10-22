import type { ColumnFiltersState } from '@tanstack/react-table';

import DebouncedInput from '../../../common/components/DebouncedInput';
import { ColumnFilter, useTableContext } from '../../../common/data-table';
import type { Exercise } from '../../../core/types/exercise';
import { exerciseFormats } from '../../../core/types/exercise-format';
import { exerciseSkills } from '../../../core/types/exercise-skill';
import { exerciseStatuses } from '../../../core/types/exercise-status';
import TopicFilter from './TopicFilter';

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
            options={exerciseSkills}
          />
          <ColumnFilter
            title="Formats"
            values={getFilterValue(columnFilters, 'format', [])}
            onChange={(values) => {
              table.getColumn('format')?.setFilterValue(values);
            }}
            options={exerciseFormats}
          />
          <ColumnFilter
            title="Status"
            values={getFilterValue(columnFilters, 'status', [])}
            onChange={(values) => {
              table.getColumn('status')?.setFilterValue(values);
            }}
            options={exerciseStatuses}
          />
        </>
      )}
    </table.Subscribe>
  );
}
