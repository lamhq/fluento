import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError } from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';

import type { PracticeExercise } from '../../../api/types';
import SubmitButton from '../../../common/components/Button';
import { useErrorHandler } from '../../../error';
import { useResetPracticeExercise, useSubmitResponse } from '../../hooks';
import { normalizeLearnerResponse } from '../../utils';
import ResponseFeedback from '../ResponseFeedback';

const formSchema = z.object({
  response: z.string().trim().min(1, 'Please enter a response before submitting.'),
});

type FormValues = z.infer<typeof formSchema>;

interface UsingWordProps {
  exercise: PracticeExercise;
}

export default function UsingWord({ exercise }: UsingWordProps) {
  if (exercise.format !== 'word') throw new Error('Invalid exercise format');

  const submitResponse = useSubmitResponse();
  const resetPracticeExercise = useResetPracticeExercise();
  const handleError = useErrorHandler();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { response: '' },
    mode: 'onChange',
  });
  const [feedback, setFeedback] = useState<Awaited<
    ReturnType<typeof submitResponse>
  > | null>(null);
  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setFeedback(
        await submitResponse({
          exerciseId: exercise.id,
          practiceType: exercise.type,
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

  return (
    <>
      <Card size="sm" className="mb-4">
        <CardHeader className="border-b text-center">
          <CardTitle>Using Word</CardTitle>
          {exercise.topics.length > 0 && (
            <CardDescription className="mt-1">
              {exercise.topics.map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="mr-1 text-xs text-muted-foreground"
                >
                  {topic}
                </Badge>
              ))}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form
            id="practice-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            <p className="text-xs tracking-wide text-muted-foreground">
              Write a sentence using the word:
            </p>
            <p className="text-lg text-foreground my-4 text-center">
              &quot;{exercise.word}&quot;
            </p>
            <p className="text-muted-foreground text-xs italic">
              {exercise.meaning}
            </p>
            <Controller
              name="response"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="practice-form-response"
                      type="text"
                      placeholder="Type your response here..."
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      aria-label="Your response"
                    />
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
