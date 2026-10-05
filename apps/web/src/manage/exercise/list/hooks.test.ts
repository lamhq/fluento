import { describe, expect, it } from 'vitest';

import { buildExerciseQuery } from './utils';

describe('buildExerciseQuery', () => {
  it('maps list filters, ordered sorting, and pagination to API parameters', () => {
    const query = buildExerciseQuery({
      pagination: { pageIndex: 2, pageSize: 20 },
      columnFilters: [
        { id: 'name', value: 'coffee' },
        { id: 'topics', value: ['Travel', 'Work'] },
        { id: 'skill', value: ['communication'] },
        { id: 'format', value: ['word', 'sentence'] },
        { id: 'status', value: ['active', 'archived'] },
      ],
      sorting: [
        { id: 'status', desc: true },
        { id: 'name', desc: false },
      ],
    });

    expect(query).toEqual({
      name: 'coffee',
      topics: ['Travel', 'Work'],
      skills: ['communication'],
      formats: ['word', 'sentence'],
      status: ['active', 'archived'],
      sort: '-status,name',
      limit: 20,
      offset: 40,
    });
  });

  it('omits empty filters and sorting', () => {
    const query = buildExerciseQuery({
      pagination: { pageIndex: 0, pageSize: 10 },
      columnFilters: [
        { id: 'name', value: '' },
        { id: 'topics', value: [] },
        { id: 'skill', value: ['invalid'] },
      ],
      sorting: [],
    });

    expect(query).toEqual({ limit: 10, offset: 0 });
  });
});
