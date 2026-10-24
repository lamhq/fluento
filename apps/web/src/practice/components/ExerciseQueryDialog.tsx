import { SlidersHorizontalIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

import Controller from '../../common/components/Controller';
import type { PracticeExerciseQuery } from '../../core/types/practice-exercise-query';
import TopicsSelect from '../../manage/exercise/form/TopicsSelect';

interface ExerciseQueryDialogProps {
  query: PracticeExerciseQuery;
  onSubmit: (query: PracticeExerciseQuery) => void;
}

export default function ExerciseQueryDialog({
  query,
  onSubmit,
}: ExerciseQueryDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<PracticeExerciseQuery>({ defaultValues: query });

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      form.reset(query);
    }
    setOpen(nextOpen);
  };

  const handleSubmit = (values: PracticeExerciseQuery) => {
    onSubmit(values);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        aria-label="Filter exercises"
        onClick={() => {
          handleOpenChange(true);
        }}
      >
        <SlidersHorizontalIcon />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-start">
            <DialogTitle>Filter exercises</DialogTitle>
          </DialogHeader>

          <form
            id="exercise-query-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            noValidate
          >
            <FieldGroup>
              <Controller
                name="topics"
                control={form.control}
                defaultValue={[]}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Topics</FieldLabel>
                    <TopicsSelect
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" form="exercise-query-form">
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
