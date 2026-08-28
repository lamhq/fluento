import { describe, expect, it } from 'vitest';

import { normalizeLearnerResponse } from './utils';

describe('normalizeLearnerResponse', () => {
  it('capitalizes each sentence and ensures a final punctuation mark', () => {
    expect(normalizeLearnerResponse('  hello there. how are you  ')).toBe(
      'Hello there. How are you.',
    );

    expect(normalizeLearnerResponse('i want a coffee. please')).toBe(
      'I want a coffee. Please.',
    );

    expect(normalizeLearnerResponse('it was great. thanks')).toBe(
      'It was great. Thanks.',
    );
  });
});
