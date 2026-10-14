import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { PracticeAttempt } from '../../core/types/practice-attempt';
import type { PracticeExercise } from '../../core/types/practice-exercise';
import { PracticeType } from '../../core/types/practice-type';
import { getFeedbackIcon, getFeedbackTitle } from '../utils';

export interface ResponseFeedbackProps {
  feedback: PracticeAttempt;
  validResponses: NonNullable<PracticeExercise['validResponses']>;
}

export default function ResponseFeedback({
  feedback,
  validResponses,
}: ResponseFeedbackProps) {
  return (
    <Card size="sm" className="text-sm">
      <CardHeader className="flex justify-between border-b">
        <CardTitle className="flex items-center gap-2">
          <span aria-hidden="true">{getFeedbackIcon(feedback.score)}</span>
          <h3>{getFeedbackTitle(feedback.score)}</h3>
        </CardTitle>
        <span className="tabular-nums">{Math.round(feedback.score)}%</span>
      </CardHeader>

      <CardContent className="space-y-5">
        <p>{feedback.feedback}</p>

        {feedback.practiceType !== PracticeType.JUST_ONE_WORD &&
          feedback.practiceType !== PracticeType.WORD_GUESSING && (
            <section className="space-y-3">
              {feedback.practiceType !== PracticeType.PARAGRAPH_VARIATION && (
                <>
                  {feedback.correctness.fixes.length > 0 && (
                    <div>
                      <h5 className="mb-2">What to improve:</h5>
                      <ul className="list-disc space-y-1 pl-5">
                        {feedback.correctness.fixes.map((fix) => (
                          <li key={fix}>{fix}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feedback.correctness.correctedSentence && (
                    <div>
                      <h5 className="mb-2">Corrected sentence:</h5>
                      <blockquote className="border-l-2 border-primary/60 pl-3 text-foreground/80 italic">
                        &quot;{feedback.correctness.correctedSentence}&quot;
                      </blockquote>
                    </div>
                  )}
                </>
              )}

              {feedback.practiceType === PracticeType.PARAGRAPH_VARIATION &&
                feedback.correctness.sentences.length > 0 && (
                  <div className="space-y-4">
                    {feedback.correctness.sentences.map((sentence, index) => (
                      <div
                        key={`${sentence.sentence}-${index.toString()}`}
                        className="space-y-2"
                      >
                        {sentence.correctedSentence && (
                          <blockquote className="border-l-2 border-primary/60 pl-3 text-foreground/80 italic">
                            &quot;{sentence.correctedSentence}&quot;
                          </blockquote>
                        )}

                        <h5 className="mb-2">Fixes:</h5>
                        {sentence.fixes.length > 0 && (
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
                  <span className="text-foreground/80 italic">{validResponse}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
