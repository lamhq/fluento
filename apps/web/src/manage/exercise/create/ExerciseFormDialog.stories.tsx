import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

import { ExerciseFormat } from '../../../core/types/exercise-format';
import { ExerciseSkill } from '../../../core/types/exercise-skill';
import { ExerciseStatus } from '../../../core/types/exercise-status';
import ExerciseFormDialog from './ExerciseFormDialog';

const topics = [
  {
    id: 'topic-travel',
    name: 'Travel',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'topic-work',
    name: 'Work',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'topic-food',
    name: 'Food',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'topic-education',
    name: 'Education',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'topic-health',
    name: 'Health',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'topic-finance',
    name: 'Finance',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'topic-entertainment',
    name: 'Entertainment',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'topic-sports',
    name: 'Sports',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

const meta = {
  title: 'Manage/Exercise/ExerciseFormDialog',
  component: ExerciseFormDialog,
  beforeEach({ msw }) {
    msw.use(
      http.get('/api/v1/practice/topics', async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return HttpResponse.json(topics);
      }),
    );
  },
} satisfies Meta<typeof ExerciseFormDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => undefined,
  },
};

export const Communication: Story = {
  args: {
    open: true,
    onOpenChange: () => undefined,
    exercise: {
      id: 'exercise-communication',
      name: 'Answer small talk questions',
      createdAt: '2024-01-01T00:00:00.000Z',
      format: ExerciseFormat.Communication,
      skill: ExerciseSkill.COMMUNICATION,
      topics: ['Travel', 'Work'],
      references: [],
      status: ExerciseStatus.ACTIVE,
      scenario: 'Answer small talk questions.',
      prompts: ['What are you up to this weekend?'],
      validResponses: ['My parents are coming to visit.'],
    },
  },
};

export const Word: Story = {
  args: {
    open: true,
    onOpenChange: () => undefined,
    exercise: {
      id: 'exercise-word',
      name: 'Use a vocabulary word',
      createdAt: '2024-01-01T00:00:00.000Z',
      format: ExerciseFormat.Word,
      skill: ExerciseSkill.VOCABULARY,
      topics: ['Travel'],
      references: [],
      status: ExerciseStatus.ACTIVE,
      word: 'baggage claim',
      meaning: 'The area where passengers collect checked luggage.',
      sentences: ['We waited at baggage claim.'],
      clues: ['You go here after a flight.'],
    },
  },
};

export const Sentence: Story = {
  args: {
    open: true,
    onOpenChange: () => undefined,
    exercise: {
      id: 'exercise-sentence',
      name: 'Describe a work experience',
      createdAt: '2024-01-01T00:00:00.000Z',
      format: ExerciseFormat.Sentence,
      skill: ExerciseSkill.ARTICULATION,
      topics: ['Work'],
      references: [],
      status: ExerciseStatus.ACTIVE,
      scenario: 'Describe a work experience.',
      sentence: 'I learned a lot from working with that team.',
      words: ['experience', 'teamwork'],
    },
  },
};

export const Paragraph: Story = {
  args: {
    open: true,
    onOpenChange: () => undefined,
    exercise: {
      id: 'exercise-paragraph',
      name: 'Introduce a local celebration',
      createdAt: '2024-01-01T00:00:00.000Z',
      format: ExerciseFormat.Paragraph,
      skill: ExerciseSkill.ARTICULATION,
      topics: ['Entertainment'],
      references: [],
      status: ExerciseStatus.ACTIVE,
      scenario: 'Introduce a local celebration.',
      paragraph: 'The Mid-Autumn Festival is a celebration of family and community.',
      words: ['festival', 'community'],
    },
  },
};
