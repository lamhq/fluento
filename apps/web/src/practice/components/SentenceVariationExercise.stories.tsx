import type { Meta, StoryObj } from '@storybook/react-vite';

import SentenceVariationExercise from './SentenceVariationExercise';

const meta = {
  component: SentenceVariationExercise,
} satisfies Meta<typeof SentenceVariationExercise>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '65f00000000000000000000c',
      format: 'sentence',
      name: 'Describe work experiences',
      topics: ['Job Interview', 'Software Engineering'],
      type: 'sentence-variation',
      practicedAt: null,
      practiceCount: 0,
      scenario: 'Describe work experiences',
      prompts: [
        'Describe your work experience to the interviewer using provided words.',
      ],
      words: [
        'over / more than',
        '10 years',
        'software',
        'tech lead',
        'manage',
        'coding',
      ],
      validResponses: [
        "I have over 10 years of experience in software development. For the past 6 years, I've worked as a tech lead, managing development teams, and doing hands-on coding.",
      ],
    },
  },
};
