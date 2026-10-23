import { MailPlus, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useExerciseDialogs } from '../dialog/useExerciseDialogs';

export default function ExercisesPrimaryButtons() {
  const { setOpen } = useExerciseDialogs();
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          setOpen('create');
        }}
        className="space-x-1"
        aria-label="Create exercise"
      >
        <span>Create</span> <UserPlus size={18} />
      </Button>
      <Button
        variant="outline"
        className="space-x-1"
        disabled
        title="Import flow is not available yet"
        onClick={() => {
          setOpen('import');
        }}
        aria-label="Import exercises (unavailable)"
      >
        <span>Import </span> <MailPlus size={18} />
      </Button>
    </div>
  );
}
