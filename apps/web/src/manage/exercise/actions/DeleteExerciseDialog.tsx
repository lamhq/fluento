import { ConfirmDialog } from '../../../common/components/ConfirmDialog';
import type { ExerciseSummary } from '../../../core/types/exercise-summary';
import { useDeleteExercise } from '../hooks';

interface DeleteExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: ExerciseSummary;
}

export default function DeleteExerciseDialog({
  open,
  onOpenChange,
  exercise,
}: DeleteExerciseDialogProps) {
  const { mutateAsync: deleteExercise, isPending } = useDeleteExercise();

  const handleDelete = async () => {
    await deleteExercise(exercise.id);
    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      destructive
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      isLoading={isPending}
      title="Delete exercise?"
      desc={`"${exercise.name}" will be permanently deleted. This action cannot be undone.`}
      confirmText="Delete"
    />
  );
}
