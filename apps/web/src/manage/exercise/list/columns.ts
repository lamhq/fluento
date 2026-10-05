import { createElement } from 'react';

import type { Exercise } from '../../../api/types';
import { createAppColumnHelper } from '../../../common/data-table';
import { formatDate } from '../../../common/utils';
import ExerciseSkillBadge from './cells/ExerciseSkillBadge';
import ExerciseStatusBadge from './cells/ExerciseStatusBadge';
import ExerciseTopics from './cells/ExerciseTopics';
import ExerciseRowActions from './ExerciseRowActions';

const columnHelper = createAppColumnHelper<Exercise>();

export const exerciseColumns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: 'Name',
    enableMultiSort: true,
    cell: (info) =>
      createElement('span', { className: 'font-medium' }, info.getValue()),
  }),
  columnHelper.accessor('skill', {
    header: 'Skill',
    enableSorting: false,
    cell: (info) => createElement(ExerciseSkillBadge, { skill: info.getValue() }),
  }),
  columnHelper.accessor('topics', {
    header: 'Topics',
    enableSorting: false,
    cell: (info) => createElement(ExerciseTopics, { topics: info.getValue() }),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date Created',
    enableSorting: false,
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableMultiSort: true,
    cell: (info) => createElement(ExerciseStatusBadge, { status: info.getValue() }),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => createElement(ExerciseRowActions, { exercise: row.original }),
  }),
]);
