import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { PracticeAttempt, PracticeExercise } from '../../api/types';
import { getFeedbackIcon, getFeedbackTitle } from '../utils';

function Score({ label, score }: { label: string; score: number }) {
  return (
    <span className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
      <span>{label}</span>
      <span className="tabular-nums">{Math.round(score)}%</span>
    </span>
  );
}

export interface ResponseFeedbackProps {
  feedback: PracticeAttempt;
  validResponses: NonNullable<PracticeExercise['validResponses']>;
}

export default function ResponseFeedback({
  feedback,
  validResponses,
}: ResponseFeedbackProps) {
  const correctness = feedback.correctness;
  const appropriateness = feedback.appropriateness;

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
            <div>
              <Score label="Score" score={correctness.score} />
            </div>
            <p>{correctness.feedback}</p>

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
                <h5 className="mb-2">Corrected response:</h5>
                <blockquote className="border-l-2 border-primary/60 pl-3 italic text-foreground/80">
                  &quot;{correctness.correctedSentence}&quot;
                </blockquote>
              </div>
            )}

            {correctness.sentences && correctness.sentences.length > 0 && (
              <div className="space-y-4">
                <h5>Sentence details:</h5>
                {correctness.sentences.map((sentence, index) => (
                  <div
                    key={`${sentence.sentence}-${index.toString()}`}
                    className="space-y-2"
                  >
                    <p className="italic text-foreground/80">
                      &quot;{sentence.sentence}&quot;
                    </p>
                    <Score label="Score" score={sentence.score} />
                    <p>{sentence.feedback}</p>
                    {sentence.fixes && sentence.fixes.length > 0 && (
                      <ul className="list-disc space-y-1 pl-5">
                        {sentence.fixes.map((fix) => (
                          <li key={fix}>{fix}</li>
                        ))}
                      </ul>
                    )}
                    {sentence.correctedSentence && (
                      <p>
                        Correction:{' '}
                        <span className="italic text-foreground/80">
                          &quot;{sentence.correctedSentence}&quot;
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {appropriateness && (
          <section className="space-y-3">
            <div>
              <Score label="Score" score={appropriateness.score} />
            </div>
            <p>{appropriateness.feedback}</p>
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
