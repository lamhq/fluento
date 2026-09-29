import type { Meta, StoryObj } from '@storybook/react-vite';

import SentenceConstruction from './SentenceConstruction';

const meta = {
  title: 'Practice/Articulation/SentenceConstruction',
  component: SentenceConstruction,
} satisfies Meta<typeof SentenceConstruction>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '65f00000000000000000000b',
      format: 'sentence',
      name: 'Talk about your background',
      topics: ['Job Interview', 'Software Engineering'],
      type: 'sentence-construction',
      practicedAt: null,
      practiceCount: 0,
      scenario: 'Talk about your background',
      prompts: ['Describe your educational background using provided words.'],
      words: ['study', 'computer science', 'university', "bachelor's degree"],
      validResponses: [
        "I studied computer science at university and had a bachelor's degree.",
      ],
    },
  },
};
