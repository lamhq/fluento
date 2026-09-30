import type { Meta, StoryObj } from '@storybook/react-vite';

import SentenceVariation from './SentenceVariation';

const meta = {
  title: 'Practice/Articulation/SentenceVariation',
  component: SentenceVariation,
} satisfies Meta<typeof SentenceVariation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '65f00000000000000000000c',
      format: 'sentence',
      name: 'Describe work experiences',
      skill: 'articulation',
      topics: ['Job Interview', 'Software Engineering'],
      references: [],
      type: 'sentence-variation',
      practicedAt: null,
      practiceCount: 0,
      words: [
        'over / more than',
        '10 years',
        'software',
        'tech lead',
        'manage',
        'coding',
      ],
      sentence:
        "I have over 10 years of experience in software development. For the past 6 years, I've worked as a tech lead, managing development teams, and doing hands-on coding.",
    },
  },
};
