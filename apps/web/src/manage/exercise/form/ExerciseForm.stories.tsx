import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import type { Exercise } from '../../../core/types/exercise';
import { ExerciseFormat } from '../../../core/types/exercise-format';
import { ExerciseSkill } from '../../../core/types/exercise-skill';
import { ExerciseStatus } from '../../../core/types/exercise-status';
import ExerciseForm from './ExerciseForm';

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

const exerciseBase = {
  id: 'exercise-example',
  name: 'Example exercise',
  skill: ExerciseSkill.Communication,
  createdAt: '2024-01-01T00:00:00.000Z',
  status: ExerciseStatus.ACTIVE,
};

const meta = {
  title: 'Manage/Exercise/ExerciseForm',
  component: ExerciseForm,
  decorators: [
    (Story: React.ComponentType) => (
      <Dialog open>
        <DialogContent>
          <Story />
        </DialogContent>
      </Dialog>
    ),
  ],
  beforeEach({ msw }) {
    msw.use(
      http.get('/api/v1/practice/topics', async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return HttpResponse.json(topics);
      }),
    );
  },
} satisfies Meta<typeof ExerciseForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: () => Promise.resolve(),
  },
};

export const Communication: Story = {
  args: {
    exercise: {
      ...exerciseBase,
      format: ExerciseFormat.Communication,
      topics: ['Travel', 'Work'],
      scenario: 'Answer small talk questions.',
      prompts: ['What are you up to this weekend?'],
      validResponses: ['My parents are coming to visit.'],
    } satisfies Exercise,
    onSubmit: () => Promise.resolve(),
  },
};

export const Word: Story = {
  args: {
    exercise: {
      ...exerciseBase,
      skill: ExerciseSkill.Vocabulary,
      format: ExerciseFormat.Word,
      topics: ['Travel'],
      word: 'baggage claim',
      meaning: 'The area where passengers collect checked luggage.',
      sentences: ['We waited at baggage claim.'],
      clues: ['You go here after a flight.'],
    } satisfies Exercise,
    onSubmit: () => Promise.resolve(),
  },
};

export const Sentence: Story = {
  args: {
    exercise: {
      ...exerciseBase,
      skill: ExerciseSkill.Articulation,
      format: ExerciseFormat.Sentence,
      topics: ['Work'],
      scenario: 'Describe a work experience.',
      sentence: 'I learned a lot from working with that team.',
      words: ['experience', 'teamwork'],
    } satisfies Exercise,
    onSubmit: () => Promise.resolve(),
  },
};

export const Paragraph: Story = {
  args: {
    exercise: {
      ...exerciseBase,
      format: ExerciseFormat.Paragraph,
      topics: ['Entertainment'],
      scenario: 'Introduce a local celebration.',
      paragraph: 'The Mid-Autumn Festival is a celebration of family and community.',
      words: ['festival', 'community'],
    } satisfies Exercise,
    onSubmit: () => Promise.resolve(),
  },
};
