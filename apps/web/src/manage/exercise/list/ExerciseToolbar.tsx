import type {
  Exercise,
  ExerciseFormat,
  ExerciseSkill,
  ExerciseStatus,
} from '../../../api/types';
import DebouncedInput from '../../../common/components/DebouncedInput';
import { ColumnFilter, useTableContext } from '../../../common/data-table';
import TopicFilter from './TopicFilter';

type ExerciseTable = ReturnType<typeof useTableContext<Exercise>>;

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

function getFilterValue<T>(table: ExerciseTable, columnId: string, fallback: T): T {
  const filter = table.state.columnFilters.find((item) => item.id === columnId);
  return filter ? (filter.value as T) : fallback;
}

function setFilterValue(table: ExerciseTable, columnId: string, value: string[]) {
  table.setColumnFilters((filters) => {
    const remaining = filters.filter((filter) => filter.id !== columnId);
    return value.length > 0 ? [...remaining, { id: columnId, value }] : remaining;
  });
}

export default function ExerciseToolbar() {
  const table = useTableContext<Exercise>();

  return (
    <>
      <DebouncedInput
        id="exercise-name-filter"
        aria-label="Filter by exercise name"
        placeholder="Filter by exercise name"
        defaultValue={getFilterValue(table, 'name', '')}
        onChange={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
        className="h-8 w-70 sm:w-50"
      />
      <TopicFilter
        values={getFilterValue(table, 'topics', [])}
        onChange={(values) => {
          table.getColumn('topics')?.setFilterValue(values);
        }}
      />
      <ColumnFilter
        title="Skills"
        values={getFilterValue(table, 'skill', [])}
        onChange={(values) => {
          table.getColumn('skill')?.setFilterValue(values);
        }}
        options={skills}
      />
      <ColumnFilter
        title="Formats"
        values={getFilterValue(table, 'format', [])}
        onChange={(values) => {
          setFilterValue(table, 'format', values);
        }}
        options={formats}
      />
      <ColumnFilter
        title="Status"
        values={getFilterValue(table, 'status', [])}
        onChange={(values) => {
          table.getColumn('status')?.setFilterValue(values);
        }}
        options={statuses}
      />
    </>
  );
}
