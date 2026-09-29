import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';

import type { PracticeExercise } from '../../api/types';
import SubmitButton from '../../common/components/Button';
import { useErrorHandler } from '../../error';
import { useResetPracticeExercise, useSubmitResponse } from '../hooks';
import { normalizeLearnerResponse } from '../utils';
import ResponseFeedback from './ResponseFeedback';
const formSchema = z.object({
  response: z.string().trim().min(1, 'Please enter a response before submitting.'),
});

type FormValues = z.infer<typeof formSchema>;

interface WordGuessingExerciseProps {
  exercise: PracticeExercise;
}

export default function WordGuessingExercise({
  exercise,
}: WordGuessingExerciseProps) {
  const submitResponse = useSubmitResponse();
  const resetPracticeExercise = useResetPracticeExercise();
  const handleError = useErrorHandler();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { response: '' },
    mode: 'onChange',
  });
  const response = useWatch({ control: form.control, name: 'response' });
  const [feedback, setFeedback] = useState<Awaited<
    ReturnType<typeof submitResponse>
  > | null>(null);
  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setFeedback(
        await submitResponse({
          exerciseId: exercise.id,
          response: normalizeLearnerResponse(values.response),
        }),
      );
    } catch (error) {
      void handleError(error);
    }
  });
  const handleNext = () => {
    form.reset();
    setFeedback(null);
    resetPracticeExercise();
  };
  const isSubmitting = form.formState.isSubmitting;
  const topic = exercise.topics[0] ?? '';

  return (
    <>
      <Card size="sm" className="text-sm mb-4">
        <CardHeader className="border-b" />
        <CardContent className="space-y-4">
          <form id="practice-form" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <div className="mb-4">
                <h2 className="text-lg font-bold">Word Guessing</h2>
                {topic && <p className="text-sm text-gray-600">({topic})</p>}
              </div>
              <div className="mb-4">
                <p className="font-semibold">
                  Guess the word or phrase from its meaning:
                </p>
                <p className="mt-2 italic text-gray-700">{exercise.meaning}</p>
              </div>
              <Controller
                name="response"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="practice-form-response">
                      Your response:
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="practice-form-response"
                        placeholder="Type your response here..."
                        rows={2}
                        className="min-h-fit resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {response.length}/50 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <SubmitButton
            type="submit"
            form="practice-form"
            disabled={!form.formState.isValid}
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : feedback ? 'Retry' : 'Submit'}
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
          validResponses={exercise.validResponses ?? []}
        />
      )}
    </>
  );
}
