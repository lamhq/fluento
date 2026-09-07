import { describe, expect, it } from 'vitest';

import { normalizeLearnerResponse as normalize } from './utils';

describe('normalizeLearnerResponse', () => {
  it('capitalizes each sentence and ensures a final punctuation mark', () => {
    expect(normalize('  hello there. how are you  ')).toBe(
      'Hello there. How are you.',
    );

    expect(normalize('i want a coffee. please!')).toBe('I want a coffee. Please!');

    expect(normalize('can i get a latte?')).toBe('Can I get a latte?');

    expect(normalize('great! thanks')).toBe('Great! Thanks.');

    expect(normalize("what? i can't hear you")).toBe("What? I can't hear you.");
  });
});
