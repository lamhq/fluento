import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { PracticeAttempt, PracticeExercise } from '../../api/types';
import { getFeedbackIcon, getFeedbackTitle } from '../utils';

export interface ResponseFeedbackProps {
  feedback: PracticeAttempt;
  validResponses: NonNullable<PracticeExercise['validResponses']>;
}

export default function ResponseFeedback({
  feedback,
  validResponses,
}: ResponseFeedbackProps) {
  const correctness = feedback.correctness;

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

        {correctness && (
          <section className="space-y-3">
            {correctness.fixes && correctness.fixes.length > 0 && (
              <div>
                <h5 className="mb-2">What to improve:</h5>
                <ul className="list-disc space-y-1 pl-5">
                  {correctness.fixes.map((fix) => (
                    <li key={fix}>{fix}</li>
                  ))}
                </ul>
              </div>
            )}

            {correctness.correctedSentence && (
              <div>
                <h5 className="mb-2">Corrected sentence:</h5>
                <blockquote className="border-l-2 border-primary/60 pl-3 italic text-foreground/80">
                  &quot;{correctness.correctedSentence}&quot;
                </blockquote>
              </div>
            )}

            {correctness.sentences && correctness.sentences.length > 0 && (
              <div className="space-y-4">
                {correctness.sentences.map((sentence, index) => (
                  <div
                    key={`${sentence.sentence}-${index.toString()}`}
                    className="space-y-2"
                  >
                    {sentence.correctedSentence && (
                      <blockquote className="border-l-2 border-primary/60 pl-3 italic text-foreground/80">
                        &quot;{sentence.correctedSentence}&quot;
                      </blockquote>
                    )}

                    <h5 className="mb-2">Fixes:</h5>
                    {sentence.fixes && sentence.fixes.length > 0 && (
                      <ul className="list-disc space-y-1 pl-5">
                        {sentence.fixes.map((fix) => (
                          <li key={fix}>{fix}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {validResponses.length > 0 && (
          <section aria-labelledby="practice-feedback-alternatives">
            <h4 id="practice-feedback-alternatives" className="mb-2">
              You can say:
            </h4>
            <ul className="list-disc space-y-1 pl-5">
              {validResponses.map((validResponse, index) => (
                <li key={`alternative-${index.toString()}`}>
                  <span className="italic text-foreground/80">{validResponse}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
