import type { Meta, StoryObj } from '@storybook/react-vite';

import ExerciseFormDialog from './ExerciseFormDialog';

const meta = {
  title: 'Manage/Exercise/ExerciseFormDialog',
  component: ExerciseFormDialog,
} satisfies Meta<typeof ExerciseFormDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => undefined,
  },
};
