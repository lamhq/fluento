import { describe, expect, it } from 'vitest';

import { getErrorInfo } from './utils';

describe('getErrorInfo', () => {
  it('returns only code and message for normal errors', () => {
    const result = getErrorInfo(new Error('Something broke'));

    expect(result).toEqual({
      code: 'UNKNOWN_ERROR',
      message: 'Something went wrong. Please try reloading.',
    });
  });
});
