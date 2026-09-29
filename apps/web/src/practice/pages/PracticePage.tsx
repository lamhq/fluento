import type { PracticeExercise } from '../../api/types';
import TopLoadingBar from '../../common/components/TopLoadingBar';
import CommunicationExercise from '../components/CommunicationExercise';
import { ExerciseSkeleton } from '../components/ExerciseSkeleton';
import JustOneWordExercise from '../components/JustOneWordExercise';
import ParagraphVariationExercise from '../components/ParagraphVariationExercise';
import SentenceConstructionExercise from '../components/SentenceConstructionExercise';
import SentenceVariationExercise from '../components/SentenceVariationExercise';
import UsingWordExercise from '../components/UsingWordExercise';
import WordGuessingExercise from '../components/WordGuessingExercise';
import { usePracticeExercise } from '../hooks';

function renderExercise(exercise: PracticeExercise) {
  switch (exercise.type) {
    case 'communication':
      return <CommunicationExercise exercise={exercise} />;
    case 'using-word':
      return <UsingWordExercise exercise={exercise} />;
    case 'just-one-word':
      return <JustOneWordExercise exercise={exercise} />;
    case 'word-guessing':
      return <WordGuessingExercise exercise={exercise} />;
    case 'sentence-construction':
      return <SentenceConstructionExercise exercise={exercise} />;
    case 'sentence-variation':
      return <SentenceVariationExercise exercise={exercise} />;
    case 'paragraph-variation':
      return <ParagraphVariationExercise exercise={exercise} />;
  }
}

export default function PracticePage() {
  const { data: exercise, error, isFetching } = usePracticeExercise();

  if (error) {
    throw error;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TopLoadingBar open={isFetching} />

      {isFetching && !exercise && <ExerciseSkeleton />}

      {!isFetching && !exercise && <div>No exercise available.</div>}

      {exercise && (
        <div className={isFetching ? 'pointer-events-none opacity-50' : undefined}>
          {renderExercise(exercise)}
        </div>
      )}
    </div>
  );
}
