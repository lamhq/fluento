import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';

import SubmitButton from '../../../common/components/Button';
import type { PracticeExercise } from '../../hooks';
import ResponseFeedback from '../ResponseFeedback';
import { usePracticeForm } from './usePracticeForm';

export interface PracticeFormProps {
  exercise: PracticeExercise;
}

export default function PracticeForm({ exercise }: PracticeFormProps) {
  const {
    prompt,
    counterpart,
    scenario,
    learnerRole,
    form,
    response,
    feedback,
    handleSubmit,
    handleNext,
  } = usePracticeForm({ exercise });
  const isSubmitting = form.formState.isSubmitting;
  const submitButtonLabel = isSubmitting
    ? 'Processing...'
    : feedback
      ? 'Retry'
      : 'Submit';

  return (
    <>
      <Card size="sm" className="text-sm mb-4">
        <CardHeader className="border-b">
          <CardTitle>
            <h3 className="text-center font-bold">{scenario}</h3>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p>
            You&apos;re a <strong>{learnerRole}</strong> {scenario.toLowerCase()}.
          </p>

          <p>
            The <strong>{counterpart}</strong> said:
          </p>

          <blockquote className="my-4 italic font-bold text-center text-lg">
            {prompt}
          </blockquote>

          <form id="practice-form" onSubmit={handleSubmit} noValidate>
            <Controller
              name="response"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="practice-form-response">
                    Response in a polite manner:
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="practice-form-response"
                      placeholder="Type your response here..."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {response.length}/32 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </form>
        </CardContent>

        <CardFooter className="flex justify-center gap-2">
          <SubmitButton
            type="submit"
            form="practice-form"
            disabled={!form.formState.isValid}
            isLoading={isSubmitting}
          >
            {submitButtonLabel}
          </SubmitButton>

          {feedback && (
            <Button type="button" variant="outline" onClick={handleNext}>
              Next
            </Button>
          )}
        </CardFooter>
      </Card>

      {feedback && (
        <ResponseFeedback
          feedback={feedback}
          expectedResponses={exercise.expectedResponses}
        />
      )}
    </>
  );
}
