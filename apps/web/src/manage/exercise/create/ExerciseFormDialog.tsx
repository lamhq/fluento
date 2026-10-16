import type { DialogRoot } from '@base-ui/react/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

import Controller from '../../../common/components/Controller';
import type { Exercise } from '../../../core/types/exercise';
import {
  ExerciseFormat,
  exerciseFormats,
} from '../../../core/types/exercise-format';
import {
  ExerciseStatus,
  exerciseStatuses,
} from '../../../core/types/exercise-status';
import { useCreateExercise } from '../hooks';
import { type ExerciseFormData, exerciseFormSchema } from './exerciseFormSchema';
import FieldsPerFormat from './FieldsPerFormat';
import LinesFormField from './LinesFormField';
import TopicsSelect from './TopicsSelect';

export interface ExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise?: Exercise;
}

export default function ExerciseFormDialog({
  open,
  onOpenChange,
  exercise,
}: ExerciseDialogProps) {
  const createExercise = useCreateExercise();
  const defaultValues = exercise ?? {
    format: ExerciseFormat.Communication as const,
  };
  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues,
  });

  const selectedFormat = useWatch({
    control: form.control,
    name: 'format',
  });

  const handleOpenChange = (
    nextOpen: boolean,
    eventDetails: DialogRoot.ChangeEventDetails,
  ) => {
    // reset the form when the dialog is closing
    if (!nextOpen) {
      form.reset();
    }

    if (!nextOpen && form.formState.isSubmitting) {
      eventDetails.cancel();
      return;
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = async (values: ExerciseFormData) => {
    await createExercise.mutateAsync(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>
            {exercise ? 'Update exercise' : 'Create Exercise'}
          </DialogTitle>
        </DialogHeader>

        <form
          id="exercise-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3"
          noValidate
        >
          <FieldGroup>
            <Controller
              name="format"
              control={form.control}
              defaultValue={ExerciseFormat.Communication}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="exercise-format">
                    Format
                    <span aria-hidden="true" className="text-destructive">
                      *
                    </span>
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={(format) => {
                      if (format) {
                        form.reset(defaultValues);
                        form.setValue('format', format);
                      }
                    }}
                  >
                    <SelectTrigger
                      id="exercise-format"
                      ref={field.ref}
                      aria-required="true"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select a format" />
                    </SelectTrigger>
                    <SelectContent>
                      {exerciseFormats.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <FieldsPerFormat format={selectedFormat} form={form} />

            <Controller
              name="topics"
              control={form.control}
              defaultValue={[]}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="exercise-topics">
                    Topics
                    <span aria-hidden="true" className="text-destructive">
                      *
                    </span>
                  </FieldLabel>
                  <TopicsSelect
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <LinesFormField
              name="references"
              form={form}
              label="References"
              required={false}
              placeholder="Enter one reference per line."
            />

            <Controller
              name="status"
              control={form.control}
              defaultValue={ExerciseStatus.ACTIVE}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="exercise-status">
                    Status
                    <span aria-hidden="true" className="text-destructive">
                      *
                    </span>
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="exercise-status"
                      ref={field.ref}
                      aria-required="true"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {exerciseStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="exercise-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
            {exercise ? 'Update' : 'Create'}
          </Button>

          <DialogClose
            render={
              <Button variant="outline" disabled={form.formState.isSubmitting}>
                Close
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
