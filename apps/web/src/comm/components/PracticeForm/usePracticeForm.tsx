import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { useErrorHandler } from '../../../error';
import type { PracticeExercise, SubmitResponse } from '../../hooks';
import { useResetPracticeExercise, useSubmitResponse } from '../../hooks';

const practiceFormSchema = z.object({
  response: z.string().trim().min(1, 'Please enter a response before submitting.'),
});

type PracticeFormValues = z.infer<typeof practiceFormSchema>;

export function usePracticeForm({ exercise }: { exercise: PracticeExercise }) {
  const prompt = exercise.prompts[0];
  const counterpart = exercise.counterpartRole;
  const submitResponse = useSubmitResponse();
  const form = useForm<PracticeFormValues>({
    resolver: zodResolver(practiceFormSchema),
    defaultValues: {
      response: '',
    },
    mode: 'onChange',
  });
  const response = useWatch({ control: form.control, name: 'response' });
  const [feedback, setFeedback] = useState<SubmitResponse | null>(null);
  const handleError = useErrorHandler();
  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await submitResponse({
        exerciseId: exercise.id,
        response: values.response,
      });
      setFeedback(result);
    } catch (error) {
      void handleError(error);
    }
  });
  const resetPracticeExercises = useResetPracticeExercise();
  const handleNext = () => {
    form.reset();
    setFeedback(null);
    resetPracticeExercises();
  };

  return {
    form,
    handleSubmit,
    prompt,
    counterpart,
    scenario: exercise.scenario,
    learnerRole: exercise.learnerRole,
    response,
    feedback,
    handleNext,
  };
}
