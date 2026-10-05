import type { Exercise } from '../../../api/types';
import { createAppColumnHelper } from '../../../common/data-table';
import { formatDate } from '../../../common/utils';
import ExerciseFormat from './cells/ExerciseFormat';
import ExerciseSkill from './cells/ExerciseSkill';
import ExerciseStatus from './cells/ExerciseStatus';
import ExerciseTopics from './cells/ExerciseTopics';
import ExerciseRowActions from './ExerciseRowActions';

const columnHelper = createAppColumnHelper<Exercise>();

const dummyFilterFn = () => true; // because we use server-side filtering

export const exerciseColumns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: 'Name',
    enableMultiSort: true,
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    filterFn: dummyFilterFn,
  }),
  columnHelper.accessor('skill', {
    header: 'Skill',
    enableSorting: false,
    cell: ({ getValue }) => <ExerciseSkill skill={getValue()} />,
    filterFn: dummyFilterFn,
  }),
  columnHelper.accessor('topics', {
    header: 'Topics',
    enableSorting: false,
    cell: ({ getValue }) => <ExerciseTopics topics={getValue()} />,
    filterFn: dummyFilterFn,
  }),
  columnHelper.accessor('format', {
    header: 'Format',
    enableSorting: false,
    cell: ({ getValue }) => <ExerciseFormat format={getValue()} />,
    filterFn: dummyFilterFn,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date Created',
    enableMultiSort: true,
    cell: (info) => formatDate(info.getValue()),
    filterFn: dummyFilterFn,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    cell: ({ getValue }) => <ExerciseStatus status={getValue()} />,
    filterFn: dummyFilterFn,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
    cell: ({ row }) => <ExerciseRowActions exercise={row.original} />,
  }),
]);
