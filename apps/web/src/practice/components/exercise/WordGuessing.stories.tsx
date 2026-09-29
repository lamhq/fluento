import type { Meta, StoryObj } from '@storybook/react-vite';

import WordGuessing from './WordGuessing';

const meta = {
  title: 'Practice/Vocabulary/WordGuessing',
  component: WordGuessing,
} satisfies Meta<typeof WordGuessing>;

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
