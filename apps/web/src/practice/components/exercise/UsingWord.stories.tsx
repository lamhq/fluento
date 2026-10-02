import type { Meta, StoryObj } from '@storybook/react-vite';

import UsingWord from './UsingWord';

const meta = {
  title: 'Practice/Vocabulary/UsingWord',
  component: UsingWord,
} satisfies Meta<typeof UsingWord>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '65f000000000000000000006',
      format: 'word',
      name: 'security',
      skill: 'vocabulary',
      topics: ['Airport', 'Travel'],
      references: [],
      type: 'using-word',
      practiceCount: 0,
      word: 'security',
      meaning:
        'The area where you have to get checked before entering the secure part of an airport (an ninh).',
      clues: [],
      sentences: [
        "At security, they'll check your bags and ask you to remove your shoes.",
      ],
    },
  },
};
