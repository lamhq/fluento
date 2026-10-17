import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { ExerciseSummary } from '../../../core/types/exercise-summary';
import { useExerciseDialogs } from '../create/useExerciseDialogs';

export default function ExerciseRowActions({
  exercise,
}: {
  exercise: ExerciseSummary;
}) {
  const { setOpen, setCurrentRow } = useExerciseDialogs();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="size-8 p-0 data-[state=open]:bg-muted"
            aria-label={`Actions for ${exercise.name}`}
          />
        }
      >
        <MoreHorizontal size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          aria-label="Update"
          onClick={() => {
            setCurrentRow(exercise);
            setOpen('update');
          }}
        >
          <Pencil size={16} />
          Update
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem aria-label="Delete">
          <Trash2 size={16} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
