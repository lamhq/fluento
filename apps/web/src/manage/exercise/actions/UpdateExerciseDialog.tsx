import type { DialogRoot } from '@base-ui/react/dialog';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

import TopLoadingBar from '../../../common/components/TopLoadingBar';
import ExerciseForm from '../form/ExerciseForm';
import { type ExerciseFormData } from '../form/exerciseFormSchema';
import ExerciseFormSkeleton from '../form/ExerciseFormSkeleton';
import { useGetExerciseDetails, useUpdateExercise } from '../hooks';

interface UpdateExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseId: string;
}

export default function UpdateExerciseDialog({
  open,
  onOpenChange,
  exerciseId,
}: UpdateExerciseDialogProps) {
  const { mutateAsync: updateExercise, isPending } = useUpdateExercise();
  const { data: exerciseDetails, isFetching } = useGetExerciseDetails(exerciseId);

  const handleSubmit = async (values: ExerciseFormData) => {
    await updateExercise({ exerciseId, data: values });
    onOpenChange(false);
  };

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

  return (
    <>
      <TopLoadingBar open={isFetching} />

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-start">
            <DialogTitle>Update exercise</DialogTitle>
          </DialogHeader>

          {exerciseDetails ? (
            <>
              <ExerciseForm exercise={exerciseDetails} onSubmit={handleSubmit} />
              <DialogFooter>
                <DialogClose
                  render={
                    <Button variant="outline" disabled={isPending}>
                      Close
                    </Button>
                  }
                />
                <Button type="submit" form="exercise-form" disabled={isPending}>
                  {isPending && <Spinner data-icon="inline-start" />}
                  Update
                </Button>
              </DialogFooter>
            </>
          ) : (
            <ExerciseFormSkeleton />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
