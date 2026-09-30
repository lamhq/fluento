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
      name: 'Describe your background',
      skill: 'articulation',
      topics: ['Job Interview', 'Software Engineering'],
      references: [],
      type: 'sentence-construction',
      practicedAt: null,
      practiceCount: 0,
      words: ['study', 'computer science', 'university', "bachelor's degree"],
      sentence:
        "I studied computer science at university and had a bachelor's degree.",
    },
  },
};
