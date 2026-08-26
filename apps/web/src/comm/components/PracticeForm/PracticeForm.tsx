import { Controller } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { usePracticeForm } from './usePracticeForm';
import { getFeedbackScoreIcon } from './utils';

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
      <Card size="sm">
        <CardHeader className="border-b">
          <CardTitle className="text-center">{scenario}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            You&apos;re a <strong className="italic">{learnerRole}</strong>{' '}
            {scenario.toLowerCase()}.
          </p>
          <p>
            The <strong className="italic">{counterpart}</strong> said:
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
        <div className="mt-6 rounded-none border bg-muted/30 p-4 shadow-sm">
          <Alert className="border-0 bg-transparent p-0 text-sm">
            <AlertTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <span>{getFeedbackScoreIcon(feedback.score)}</span>
              <span>{Math.round(feedback.score)}%</span>
            </AlertTitle>
            <AlertDescription className="mt-2 text-sm text-foreground/80">
              {feedback.feedback}
            </AlertDescription>
          </Alert>

          <div className="mt-4 space-y-4">
            {feedback.correctness.fixes.length > 0 && (
              <div className="space-y-2 rounded-none border bg-background/60 p-3">
                <p className="text-sm font-semibold text-foreground">
                  Corrected sentence:
                </p>
                <blockquote className="border-l-2 border-primary/60 pl-3 text-sm italic text-foreground/80">
                  &quot;{feedback.correctness.correctedSentence}&quot;
                </blockquote>

                <div className="space-y-2 pt-2">
                  <p className="text-sm font-semibold text-foreground">
                    What to improve:
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/80">
                    {feedback.correctness.fixes.map((fix) => (
                      <li key={fix}>{fix}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {exercise.expectedResponses.length > 0 && (
              <div className="space-y-2 rounded-none border bg-background/60 p-3">
                <p className="text-sm font-semibold text-foreground">You can say:</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/80">
                  {exercise.expectedResponses.map((expectedResponse, index) => (
                    <li key={`alternative-${index.toString()}`}>
                      {expectedResponse.content}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
