import type { Meta, StoryObj } from '@storybook/react-vite';

import JustOneWordExercise from './JustOneWordExercise';

const meta = {
  component: JustOneWordExercise,
} satisfies Meta<typeof JustOneWordExercise>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '65f000000000000000000007',
      format: 'word',
      name: 'baggage claim',
      topics: ['Airport', 'Travel'],
      type: 'just-one-word',
      practicedAt: null,
      practiceCount: 0,
      word: 'baggage claim',
      meaning:
        'The area in an airport where passengers collect their checked luggage after a flight (nhận hành lý).',
      sentences: ['After landing, head to baggage claim to pick up your suitcase.'],
      clues: ['luggage', 'carousel', 'claim ticket', 'lost and found', 'pickup'],
    },
  },
};
