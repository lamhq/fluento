import type { PracticeExercise } from '../../api/types';
import TopLoadingBar from '../../common/components/TopLoadingBar';
import Communication from '../components/exercise/Communication';
import JustOneWord from '../components/exercise/JustOneWord';
import ParagraphVariation from '../components/exercise/ParagraphVariation';
import SentenceConstruction from '../components/exercise/SentenceConstruction';
import SentenceVariation from '../components/exercise/SentenceVariation';
import UsingWord from '../components/exercise/UsingWord';
import WordGuessing from '../components/exercise/WordGuessing';
import { ExerciseSkeleton } from '../components/ExerciseSkeleton';
import { usePracticeExercise } from '../hooks';

function renderExercise(exercise: PracticeExercise) {
  switch (exercise.type) {
    case 'communication':
      return <Communication exercise={exercise} />;
    case 'using-word':
      return <UsingWord exercise={exercise} />;
    case 'just-one-word':
      return <JustOneWord exercise={exercise} />;
    case 'word-guessing':
      return <WordGuessing exercise={exercise} />;
    case 'sentence-construction':
      return <SentenceConstruction exercise={exercise} />;
    case 'sentence-variation':
      return <SentenceVariation exercise={exercise} />;
    case 'paragraph-variation':
      return <ParagraphVariation exercise={exercise} />;
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
