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
import type { ExerciseFormData } from '../form/exerciseFormSchema';
import { useCreateExercise } from '../hooks';

interface CreateExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateExerciseDialog({
  open,
  onOpenChange,
}: CreateExerciseDialogProps) {
  const { mutateAsync: createExercise, isPending } = useCreateExercise();

  const handleSubmit = async (values: ExerciseFormData) => {
    await createExercise(values);
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
      <TopLoadingBar open={isPending} />

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-start">
            <DialogTitle>Create Exercise</DialogTitle>
          </DialogHeader>
          <ExerciseForm onSubmit={handleSubmit} />
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
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
