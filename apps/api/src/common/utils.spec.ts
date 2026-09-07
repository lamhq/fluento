import { parseSortStr } from './utils';

describe('buildSort', () => {
  const allowedFields = ['createdAt', 'practicedAt'];

  it('throws when allowed fields are missing', () => {
    expect(() => parseSortStr(undefined, undefined)).toThrow();
    expect(() => parseSortStr(undefined, [])).toThrow();
  });

  it('returns the default sort when sort is missing or empty', () => {
    expect(parseSortStr(undefined, allowedFields)).toEqual({ _id: 1 });
    expect(parseSortStr('', allowedFields)).toEqual({ _id: 1 });
    expect(parseSortStr('   ', allowedFields)).toEqual({ _id: 1 });
  });

  it('builds ascending and descending sort fields', () => {
    expect(parseSortStr('-createdAt,practicedAt', allowedFields)).toEqual({
      createdAt: -1,
      practicedAt: 1,
      _id: 1,
    });
  });

  it('throws for invalid sort entries', () => {
    expect(() => parseSortStr('unknown', allowedFields)).toThrow();
    expect(() => parseSortStr('-unknown', allowedFields)).toThrow();
    expect(() => parseSortStr('-', allowedFields)).toThrow();
    expect(() =>
      parseSortStr('createdAt,,practicedAt', allowedFields),
    ).toThrow();
  });
});
