import type { DialogRoot } from '@base-ui/react/dialog';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import TopLoadingBar from '../../../common/components/TopLoadingBar';
import { useGetExerciseDetails, useUpdateExercise } from '../hooks';
import ExerciseForm from './ExerciseForm';
import { type ExerciseFormData } from './exerciseFormSchema';
import ExerciseFormSkeleton from './ExerciseFormSkeleton';

interface ExerciseUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseId: string;
}

export default function ExerciseUpdateDialog({
  open,
  onOpenChange,
  exerciseId,
}: ExerciseUpdateDialogProps) {
  const { mutateAsync: updateExercise, isPending: isUpdating } = useUpdateExercise();
  const { data: exerciseDetails, isFetching } = useGetExerciseDetails(exerciseId);

  const handleOpenChange = (
    nextOpen: boolean,
    eventDetails: DialogRoot.ChangeEventDetails,
  ) => {
    if (!nextOpen && isUpdating) {
      eventDetails.cancel();
      return;
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = async (values: ExerciseFormData) => {
    await updateExercise({ exerciseId, input: values });
    onOpenChange(false);
  };

  return (
    <>
      <TopLoadingBar open={isFetching} />
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-start">
            <DialogTitle>Update exercise</DialogTitle>
          </DialogHeader>

          {isFetching ? (
            <ExerciseFormSkeleton />
          ) : (
            exerciseDetails && (
              <ExerciseForm
                defaultValues={exerciseDetails}
                submitLabel="Update"
                onSubmit={handleSubmit}
              />
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
