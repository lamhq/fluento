import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { Exercise } from '../../../api/types';

const defaultExercise = {
  id: '',
  name: '',
  skill: 'communication',
  format: 'communication',
  topics: [],
  createdAt: '1970-01-01T00:00:00.000Z',
  status: 'active',
} satisfies Exercise;

interface ExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise?: Exercise;
}

export default function ExerciseFormDialog({
  open,
  onOpenChange,
  exercise = defaultExercise,
}: ExerciseDialogProps) {
  const isUpdate = Boolean(exercise.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>
            {isUpdate ? 'Update exercise' : 'Create exercise'}
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? `Update "${exercise.name}" exercise.`
              : 'Create a new exercise.'}
          </DialogDescription>
        </DialogHeader>
        <div className="h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <form id="exercise-form" className="space-y-4 px-0.5" />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
