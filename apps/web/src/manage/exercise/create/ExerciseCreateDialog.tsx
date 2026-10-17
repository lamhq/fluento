import type { DialogRoot } from '@base-ui/react/dialog';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ExerciseFormat } from '../../../core/types/exercise-format';
import { ExerciseStatus } from '../../../core/types/exercise-status';
import { useCreateExercise } from '../hooks';
import ExerciseForm from './ExerciseForm';
import type { ExerciseFormData } from './exerciseFormSchema';

const defaultValues: ExerciseFormData = {
  format: ExerciseFormat.Communication,
  scenario: '',
  prompts: [],
  validResponses: [],
  topics: [],
  status: ExerciseStatus.ACTIVE,
};

interface ExerciseCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExerciseCreateDialog({
  open,
  onOpenChange,
}: ExerciseCreateDialogProps) {
  const { mutateAsync: createExercise, isPending } = useCreateExercise();

  const handleOpenChange = (
    nextOpen: boolean,
    eventDetails: DialogRoot.ChangeEventDetails,
  ) => {
    if (!nextOpen && isPending) {
      eventDetails.cancel();
      return;
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = async (values: ExerciseFormData) => {
    await createExercise(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>Create Exercise</DialogTitle>
        </DialogHeader>
        <ExerciseForm
          defaultValues={defaultValues}
          submitLabel="Create"
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
