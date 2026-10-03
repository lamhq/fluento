import type { Meta, StoryObj } from '@storybook/react-vite';

import JustOneWord from './JustOneWord';

const meta = {
  title: 'Practice/Vocabulary/JustOneWord',
  component: JustOneWord,
} satisfies Meta<typeof JustOneWord>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '65f000000000000000000007',
      format: 'word',
      name: 'baggage claim',
      skill: 'vocabulary',
      topics: ['Airport', 'Travel'],
      references: [],
      type: 'just-one-word',
      practiceCount: 0,
      word: 'baggage claim',
      meaning:
        'The area in an airport where passengers collect their checked luggage after a flight (nhận hành lý).',
      sentences: ['After landing, head to baggage claim to pick up your suitcase.'],
      clues: ['luggage', 'carousel', 'claim ticket', 'lost and found', 'pickup'],
    },
  },
};
