import type { Meta, StoryObj } from '@storybook/react-vite';

import CommunicationExercise from './CommunicationExercise';

const meta = {
  component: CommunicationExercise,
} satisfies Meta<typeof CommunicationExercise>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '65f000000000000000000001',
      format: 'communication',
      name: 'Answer small talk questions',
      topics: ['Everyday Conversation'],
      type: 'communication',
      practicedAt: null,
      practiceCount: 0,
      scenario: 'Answer small talk questions',
      prompts: ['What are you up to this weekend?'],
      validResponses: ['My parents are coming to visit. What about you?'],
    },
  },
};
