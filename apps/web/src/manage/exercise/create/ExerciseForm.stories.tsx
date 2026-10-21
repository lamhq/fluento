import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import { ExerciseFormat } from '../../../core/types/exercise-format';
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
    defaultValues: {
      format: ExerciseFormat.Communication,
      scenario: '',
      prompts: [],
      validResponses: [],
      topics: [],
      status: ExerciseStatus.ACTIVE,
    },
    onSubmit: () => Promise.resolve(),
  },
};

export const Communication: Story = {
  args: {
    defaultValues: {
      format: ExerciseFormat.Communication,
      topics: ['Travel', 'Work'],
      status: ExerciseStatus.ACTIVE,
      scenario: 'Answer small talk questions.',
      prompts: ['What are you up to this weekend?'],
      validResponses: ['My parents are coming to visit.'],
    },
    onSubmit: () => Promise.resolve(),
  },
};

export const Word: Story = {
  args: {
    defaultValues: {
      format: ExerciseFormat.Word,
      topics: ['Travel'],
      status: ExerciseStatus.ACTIVE,
      word: 'baggage claim',
      meaning: 'The area where passengers collect checked luggage.',
      sentences: ['We waited at baggage claim.'],
      clues: ['You go here after a flight.'],
    },
    onSubmit: () => Promise.resolve(),
  },
};

export const Sentence: Story = {
  args: {
    defaultValues: {
      format: ExerciseFormat.Sentence,
      topics: ['Work'],
      status: ExerciseStatus.ACTIVE,
      scenario: 'Describe a work experience.',
      sentence: 'I learned a lot from working with that team.',
      words: ['experience', 'teamwork'],
    },
    onSubmit: () => Promise.resolve(),
  },
};

export const Paragraph: Story = {
  args: {
    defaultValues: {
      format: ExerciseFormat.Paragraph,
      topics: ['Entertainment'],
      status: ExerciseStatus.ACTIVE,
      scenario: 'Introduce a local celebration.',
      paragraph: 'The Mid-Autumn Festival is a celebration of family and community.',
      words: ['festival', 'community'],
    },
    onSubmit: () => Promise.resolve(),
  },
};
