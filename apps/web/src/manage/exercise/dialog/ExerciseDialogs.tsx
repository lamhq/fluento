import CreateExerciseDialog from '../actions/CreateExerciseDialog';
import UpdateExerciseDialog from '../actions/UpdateExerciseDialog';
import { useExerciseDialogs } from './useExerciseDialogs';

export default function ExerciseDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useExerciseDialogs();

  return (
    <>
      <CreateExerciseDialog
        open={open === 'create'}
        onOpenChange={() => {
          setOpen('create');
        }}
      />
      {currentRow && (
        <UpdateExerciseDialog
          exerciseId={currentRow.id}
          open={open === 'update'}
          onOpenChange={() => {
            setOpen('update');
            setTimeout(() => {
              setCurrentRow(null);
            }, 500);
          }}
        />
      )}
    </>
  );
}
