import ExerciseFormDialog from './ExerciseFormDialog';
import { useExerciseDialogs } from './useExerciseDialogs';

export default function ExerciseDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useExerciseDialogs();

  return (
    <>
      <ExerciseFormDialog
        key="exercise-create"
        open={open === 'create'}
        onOpenChange={() => {
          setOpen('create');
        }}
      />
      {currentRow && (
        <ExerciseFormDialog
          key={`exercise-update-${currentRow.id}`}
          open={open === 'update'}
          onOpenChange={() => {
            setOpen('update');
            setTimeout(() => {
              setCurrentRow(null);
            }, 500);
          }}
          exercise={currentRow}
        />
      )}
    </>
  );
}
