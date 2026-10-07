import { createExerciseSchema } from './create-exercise.dto';

describe('CreateExerciseDtoSchema', () => {
  const validCommunicationExercise = {
    name: 'Ordering food',
    skill: 'communication',
    format: 'communication',
    status: 'active',
    scenario: 'Order a meal.',
    prompts: ['Ask for a menu.'],
    validResponses: ['May I see the menu?'],
  };
  const commonFields = {
    name: validCommunicationExercise.name,
    status: validCommunicationExercise.status,
  };

  it('trims text values without adding defaults', () => {
    const result = createExerciseSchema.parse({
      ...validCommunicationExercise,
      name: '  Ordering food  ',
      scenario: '  Order a meal.  ',
      prompts: ['  Ask for a menu.  '],
      topics: ['  Restaurant  '],
      references: ['  Guide  '],
      validResponses: ['  May I see the menu?  '],
    });

    expect(result).toEqual(
      expect.objectContaining({
        name: 'Ordering food',
        scenario: 'Order a meal.',
        prompts: ['Ask for a menu.'],
        topics: ['Restaurant'],
        references: ['Guide'],
        validResponses: ['May I see the menu?'],
      }),
    );
  });

  it.each([
    {
      format: 'word',
      skill: 'vocabulary',
      content: {
        word: '  serendipity ',
        meaning: ' Finding something good by chance. ',
        sentences: [' A fortunate discovery. '],
        clues: [' Unexpected luck. '],
      },
      expected: {
        word: 'serendipity',
        meaning: 'Finding something good by chance.',
        sentences: ['A fortunate discovery.'],
        clues: ['Unexpected luck.'],
      },
    },
    {
      format: 'sentence',
      skill: 'articulation',
      content: {
        sentence: ' She sells seashells. ',
        words: [' seashells '],
        scenario: ' At the beach. ',
      },
      expected: {
        sentence: 'She sells seashells.',
        words: ['seashells'],
        scenario: 'At the beach.',
      },
    },
    {
      format: 'paragraph',
      skill: 'articulation',
      content: {
        paragraph: ' Peter Piper picked a peck of pickled peppers. ',
        words: [' pickled peppers '],
        scenario: ' Read aloud. ',
      },
      expected: {
        paragraph: 'Peter Piper picked a peck of pickled peppers.',
        words: ['pickled peppers'],
        scenario: 'Read aloud.',
      },
    },
  ])('trims $format text fields', ({ format, skill, content, expected }) => {
    const result = createExerciseSchema.parse({
      ...commonFields,
      skill,
      format,
      ...content,
    });

    expect(result).toEqual(expect.objectContaining(expected));
  });

  it('accepts empty and whitespace-only strings', () => {
    const result = createExerciseSchema.safeParse({
      ...validCommunicationExercise,
      name: '',
      scenario: '  ',
      prompts: [''],
      topics: ['  '],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(
        expect.objectContaining({
          name: '',
          scenario: '',
          prompts: [''],
          topics: [''],
        }),
      );
    }
  });

  it.each([
    {
      format: 'word',
      skill: 'vocabulary',
      content: {
        word: 'serendipity',
        meaning: 'Finding something good by chance.',
        sentences: ['A fortunate discovery.'],
        clues: ['Unexpected luck.'],
      },
    },
    {
      format: 'sentence',
      skill: 'articulation',
      content: { sentence: 'She sells seashells.', words: ['seashells'] },
    },
    {
      format: 'paragraph',
      skill: 'articulation',
      content: {
        paragraph: 'Peter Piper picked a peck of pickled peppers.',
        words: ['pickled peppers'],
      },
    },
  ])('accepts $format content schema', ({ format, skill, content }) => {
    const result = createExerciseSchema.safeParse({
      ...commonFields,
      skill,
      format,
      ...content,
    });

    expect(result.success).toBe(true);
  });

  it('rejects empty required content arrays', () => {
    const emptyArrayResult = createExerciseSchema.safeParse({
      ...validCommunicationExercise,
      prompts: [],
    });

    expect(emptyArrayResult.success).toBe(false);
    if (!emptyArrayResult.success) {
      expect(emptyArrayResult.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ['prompts'] }),
        ]),
      );
    }
  });

  it('rejects missing required fields', () => {
    const missingFieldResult = createExerciseSchema.safeParse({
      ...validCommunicationExercise,
      prompts: undefined,
    });

    expect(missingFieldResult.success).toBe(false);
    if (!missingFieldResult.success) {
      expect(missingFieldResult.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ['prompts'] }),
        ]),
      );
    }
  });

  it('rejects content fields that do not apply to selected format', () => {
    const result = createExerciseSchema.safeParse({
      ...validCommunicationExercise,
      word: 'unrelated',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'unrecognized_keys',
            keys: ['word'],
          }),
        ]),
      );
    }
  });

  it('rejects incompatible skill and format pairs', () => {
    const result = createExerciseSchema.safeParse({
      ...validCommunicationExercise,
      skill: 'vocabulary',
    });

    expect(result.success).toBe(false);
  });

  it('rejects malformed optional arrays and unknown properties', () => {
    expect(
      createExerciseSchema.safeParse({
        ...validCommunicationExercise,
        topics: null,
      }).success,
    ).toBe(false);

    const result = createExerciseSchema.safeParse({
      ...validCommunicationExercise,
      unexpected: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'unrecognized_keys',
            keys: ['unexpected'],
          }),
        ]),
      );
    }
  });
});
