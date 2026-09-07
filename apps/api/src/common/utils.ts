/**
 * Parses a comma-separated sort string into a MongoDB sort object.
 *
 * Fields may be prefixed with `-` to sort in descending order. Every field
 * must be included in `allowedFields`; `_id: 1` is appended as a stable
 * tiebreaker. A missing or blank sort string returns `{ _id: 1 }`.
 *
 * @throws {Error} If `allowedFields` is missing or empty, or if the sort
 * string contains an invalid or disallowed field.
 */
export function parseSortStr(
  sort?: string,
  allowedFields?: string[],
): Record<string, 1 | -1> {
  if (!allowedFields || allowedFields.length === 0) {
    throw new Error('allowedFields must contain at least one field');
  }

  if (!sort || sort.trim().length === 0) {
    return { _id: 1 };
  }

  const allowedFieldSet = new Set(allowedFields);
  const sortEntries = sort.split(',');
  const sortOrder: Record<string, 1 | -1> = {};

  for (const entry of sortEntries) {
    const isDescending = entry.startsWith('-');
    const field = isDescending ? entry.slice(1) : entry;

    if (!field || !allowedFieldSet.has(field)) {
      throw new Error(`Invalid sort field: ${field || entry}`);
    }

    sortOrder[field] = isDescending ? -1 : 1;
  }

  return { ...sortOrder, _id: 1 };
}
