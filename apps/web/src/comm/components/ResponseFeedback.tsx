import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { PracticeExercise, SubmitResponse } from '../types';
import { getFeedbackIcon, getFeedbackTitle } from './PracticeForm/utils';

export interface ResponseFeedbackProps {
  feedback: SubmitResponse;
  expectedResponses: PracticeExercise['expectedResponses'];
}

export default function ResponseFeedback({
  feedback,
  expectedResponses,
}: ResponseFeedbackProps) {
  return (
    <Card size="sm" className="text-sm">
      <CardHeader className="border-b flex justify-between">
        <CardTitle className="flex items-center gap-2">
          <span aria-hidden="true">{getFeedbackIcon(feedback.score)}</span>
          <h3>{getFeedbackTitle(feedback.score)}</h3>
        </CardTitle>
        <span className="tabular-nums">{Math.round(feedback.score)}%</span>
      </CardHeader>

      <CardContent className="space-y-5">
        <p>{feedback.feedback}</p>

        {feedback.correctness.correctedSentence && (
          <section aria-labelledby="practice-feedback-corrected-sentence">
            <h4 id="practice-feedback-corrected-sentence" className="mb-2">
              Corrected sentence:
            </h4>
            <blockquote className="border-l-2 border-primary/60 pl-3 italic text-foreground/80">
              &quot;{feedback.correctness.correctedSentence}&quot;
            </blockquote>
          </section>
        )}

        {feedback.correctness.fixes.length > 0 && (
          <section aria-labelledby="practice-feedback-improvements">
            <h4 id="practice-feedback-improvements" className="mb-2">
              What to improve:
            </h4>
            <ul className="list-disc space-y-1 pl-5">
              {feedback.correctness.fixes.map((fix) => (
                <li key={fix}>{fix}</li>
              ))}
            </ul>
          </section>
        )}

        {expectedResponses.length > 0 && (
          <section aria-labelledby="practice-feedback-alternatives">
            <h4 id="practice-feedback-alternatives" className="mb-2">
              You can say:
            </h4>
            <ul className="list-disc space-y-1 pl-5">
              {expectedResponses.map((expectedResponse, index) => (
                <li key={`alternative-${index.toString()}`}>
                  <span className="italic text-foreground/80">
                    {expectedResponse.content}
                  </span>{' '}
                  <small>({expectedResponse.style})</small>
                </li>
              ))}
            </ul>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
