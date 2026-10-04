export interface OffsetPaginationParams {
  offset?: number;
  limit?: number;
}

export interface OffsetPaginationResult<TData> {
  items: TData[];
  total: number;
  offset: number;
  limit: number;
}

export type CursorPaginationParams =
  | {
      after: string;
      before?: never;
      limit?: number;
    }
  | {
      before: string;
      after?: never;
      limit?: number;
    }
  | {
      after?: never;
      before?: never;
      limit?: number;
    };

export interface CursorPaginationResult<TData> {
  items: TData[];
  nextCursor: string | null;
  previousCursor: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
}
