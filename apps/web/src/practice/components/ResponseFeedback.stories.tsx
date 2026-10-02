import type { Meta, StoryObj } from '@storybook/react-vite';

import ResponseFeedback from './ResponseFeedback';

const meta = {
  title: 'Practice/ResponseFeedback',
  component: ResponseFeedback,
} satisfies Meta<typeof ResponseFeedback>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Communication: Story = {
  args: {
    feedback: {
      id: 'attempt-4',
      exerciseId: 'exercise-4',
      practiceType: 'communication',
      response: 'My parents are coming to visit. What about you?',
      score: 64,
      feedback: 'The response is relevant but could sound more natural.',
      correctness: {
        score: 68,
        feedback: 'The response is understandable with a minor issue.',
        fixes: ['Use a more natural phrase for asking about the listener.'],
        correctedSentence: 'My parents are coming to visit. How about you?',
      },
      appropriateness: {
        score: 60,
        feedback: 'The response fits the situation overall.',
        clarity: {
          score: 75,
          feedback: 'The meaning is clear.',
        },
        politeness: {
          score: 55,
          feedback: 'The response is friendly.',
        },
        tone: {
          score: 50,
          feedback: 'The tone could be more conversational.',
        },
      },
    },
    validResponses: [
      'Nothing much, just chilling at home. How about you?',
      'Just got back from a trip. And you?',
    ],
  },
};

export const JustOneWord: Story = {
  args: {
    feedback: {
      id: 'attempt-1',
      exerciseId: 'exercise-1',
      practiceType: 'just-one-word',
      response: 'customs',
      score: 100,
      feedback: 'You have the correct answer.',
    },
    validResponses: [],
  },
};

export const WordGuessing: Story = {
  args: {
    feedback: {
      id: 'attempt-2',
      exerciseId: 'exercise-2',
      practiceType: 'word-guessing',
      response: 'customs',
      score: 100,
      feedback: 'You have the correct answer.',
    },
    validResponses: [],
  },
};

export const UsingWord: Story = {
  args: {
    feedback: {
      id: 'attempt-3',
      exerciseId: 'exercise-3',
      practiceType: 'using-word',
      response: "At customs, they'll check my passport.",
      score: 92,
      feedback: 'The target word is used naturally and correctly.',
      correctness: {
        score: 94,
        feedback: 'The sentence is grammatically correct.',
        fixes: ['Use a more natural phrase for asking about the listener.'],
        correctedSentence: "At customs, they'll check my passport.",
      },
      appropriateness: {
        score: 90,
        feedback: 'The target word fits the context accurately.',
      },
    },
    validResponses: [
      'At customs, they will check my passport.',
      'You have to go through customs before entering the country.',
    ],
  },
};

export const SentenceConstruction: Story = {
  args: {
    feedback: {
      id: 'attempt-5',
      exerciseId: 'exercise-5',
      practiceType: 'sentence-construction',
      response:
        "I studied computer science at university and had a bachelor's degree.",
      score: 92,
      feedback: 'The sentence uses all required words clearly.',
      correctness: {
        score: 88,
        feedback:
          'The sentence is understandable but the degree phrasing can be improved.',
        fixes: [
          "Use 'earned a bachelor's degree' instead of 'had a bachelor's degree'.",
        ],
        correctedSentence:
          "I studied computer science at university and earned a bachelor's degree.",
      },
      appropriateness: {
        score: 96,
        feedback: 'All required words are used appropriately.',
      },
    },
    validResponses: [],
  },
};

export const SentenceVariation: Story = {
  args: {
    feedback: {
      id: 'attempt-6',
      exerciseId: 'exercise-6',
      practiceType: 'sentence-variation',
      response: "I earned a bachelor's degree in computer science from university.",
      score: 93,
      feedback: 'The sentence preserves the original meaning naturally.',
      correctness: {
        score: 95,
        feedback: 'The sentence is grammatically correct.',
        fixes: [
          "Use 'earned a bachelor's degree' instead of 'had a bachelor's degree'.",
        ],
        correctedSentence:
          "I earned a bachelor's degree in computer science from university.",
      },
      appropriateness: {
        score: 91,
        feedback: 'The original meaning is preserved accurately.',
      },
    },
    validResponses: [],
  },
};

export const ParagraphVariation: Story = {
  args: {
    feedback: {
      id: 'attempt-7',
      exerciseId: 'exercise-7',
      practiceType: 'paragraph-variation',
      response:
        'The festival is an important Vietnamese tradition. Families gather to enjoy food, lanterns, and the full moon.',
      score: 91,
      feedback:
        'The paragraph preserves the original meaning clearly. But there are some minor grammatical issues.',
      correctness: {
        score: 90,
        feedback: 'The rewritten paragraph is grammatically correct.',
        sentences: [
          {
            sentence: 'The festival is important Vietnamese tradition.',
            score: 90,
            feedback: '',
            fixes: ['Add "an" before "important Vietnamese tradition".'],
            correctedSentence: 'The festival is an important Vietnamese tradition.',
          },
          {
            sentence: 'Families gather to enjoy food, lantern, and the full moon.',
            score: 90,
            feedback: '',
            fixes: ['Add "s" to "lantern" to make it plural.'],
            correctedSentence:
              'Families gather to enjoy food, lanterns, and the full moon.',
          },
        ],
      },
      appropriateness: {
        score: 92,
        feedback: 'The paragraph keeps the original meaning.',
      },
    },
    validResponses: [],
  },
};
