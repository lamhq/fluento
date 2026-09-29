import type { Meta, StoryObj } from '@storybook/react-vite';

import WordGuessingExercise from './WordGuessingExercise';

const meta = {
  component: WordGuessingExercise,
} satisfies Meta<typeof WordGuessingExercise>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '65f000000000000000000006',
      format: 'word',
      name: 'security',
      topics: ['Airport', 'Travel'],
      type: 'word-guessing',
      practicedAt: null,
      practiceCount: 0,
      word: 'security',
      meaning:
        'The area where you have to get checked before entering the secure part of an airport (an ninh).',
      sentences: [
        "At security, they'll check your bags and ask you to remove your shoes.",
      ],
    },
  },
};
