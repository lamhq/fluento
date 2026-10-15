import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm, type UseFormReturn, useWatch } from 'react-hook-form';

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

import type { Exercise } from '../../../core/types/exercise';
import {
  ExerciseFormat,
  exerciseFormats,
} from '../../../core/types/exercise-format';
import { exerciseStatuses } from '../../../core/types/exercise-status';
import { type ExerciseFormData, exerciseFormSchema } from './exerciseFormSchema';
import LinesFormField from './LinesFormField';
import TextFormField from './TextFormField';
import TopicsSelect from './TopicsSelect';
import { toFormData } from './utils';

/**
 * Component for rendering the appropriate fields based on the exercise format.
 */
function FieldsPerFormat({
  format,
  form,
}: {
  format?: ExerciseFormat;
  form: UseFormReturn<ExerciseFormData>;
}) {
  if (!format) {
    return (
      <p className="text-xs text-muted-foreground">
        Select a format to show the required content fields.
      </p>
    );
  }

  switch (format) {
    case ExerciseFormat.Communication:
      return (
        <>
          <TextFormField
            form={form}
            name="scenario"
            label="Scenario"
            placeholder="Describe the situation for this conversation."
          />
          <LinesFormField
            form={form}
            name="prompts"
            label="Prompts"
            placeholder="Enter one prompt per line."
          />
          <LinesFormField
            form={form}
            name="validResponses"
            label="Valid responses"
            placeholder="Enter one valid response per line."
          />
        </>
      );
    case ExerciseFormat.Word:
      return (
        <>
          <TextFormField
            form={form}
            name="word"
            label="Word or phrase"
            placeholder="Enter the vocabulary item."
          />
          <TextFormField
            form={form}
            name="meaning"
            label="Meaning"
            multiline
            placeholder="Explain the word or phrase."
          />
          <LinesFormField
            form={form}
            name="sentences"
            label="Sentences"
            required={false}
            placeholder="Enter one sentence per line."
          />
          <LinesFormField
            form={form}
            name="clues"
            label="Clues"
            required={false}
            placeholder="Enter one clue per line."
          />
        </>
      );
    case ExerciseFormat.Sentence:
      return (
        <>
          <TextFormField
            form={form}
            name="scenario"
            label="Scenario"
            placeholder="Describe the context for this exercise."
          />
          <TextFormField
            form={form}
            name="sentence"
            label="Sentence"
            placeholder="Enter the source sentence."
          />
          <LinesFormField
            form={form}
            name="words"
            label="Words"
            required={false}
            placeholder="Enter one word or phrase per line."
          />
        </>
      );
    case ExerciseFormat.Paragraph:
      return (
        <>
          <TextFormField
            form={form}
            name="scenario"
            label="Scenario"
            placeholder="Describe the context for this exercise."
          />
          <TextFormField
            form={form}
            name="paragraph"
            label="Paragraph"
            multiline
            placeholder="Enter the source paragraph."
            className="min-h-30"
          />
          <LinesFormField
            form={form}
            name="words"
            label="Words"
            required={false}
            placeholder="Enter one word or phrase per line."
          />
        </>
      );
  }
}

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
  const isUpdate = Boolean(exercise?.id);
  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: toFormData(exercise),
  });

  useEffect(() => {
    if (open) {
      form.reset(toFormData(exercise));
    }
  }, [exercise, form, open]);

  const selectedFormat = useWatch({
    control: form.control,
    name: 'format',
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (form.formState.isDirty && !window.confirm('Discard your changes?')) {
        return;
      }
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        handleOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>
            {isUpdate ? 'Update exercise' : 'Create Exercise'}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(() => undefined)}
          className="h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3"
        >
          <FieldGroup>
            <Controller
              name="format"
              control={form.control}
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
                    onValueChange={field.onChange}
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
            type="button"
            variant="outline"
            onClick={() => {
              handleOpenChange(false);
            }}
          >
            {isUpdate ? 'Close' : 'Cancel'}
          </Button>
          <DialogClose render={<Button variant="outline">Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
