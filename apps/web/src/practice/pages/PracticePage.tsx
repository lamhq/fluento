import TopLoadingBar from '../../common/components/TopLoadingBar';
import { useLocalStorageState } from '../../common/hooks';
import type { PracticeExercise } from '../../core/types/practice-exercise';
import type { PracticeExerciseQuery } from '../../core/types/practice-exercise-query';
import { PracticeType } from '../../core/types/practice-type';
import Communication from '../components/exercise/Communication';
import JustOneWord from '../components/exercise/JustOneWord';
import ParagraphVariation from '../components/exercise/ParagraphVariation';
import SentenceConstruction from '../components/exercise/SentenceConstruction';
import SentenceVariation from '../components/exercise/SentenceVariation';
import UsingWord from '../components/exercise/UsingWord';
import WordGuessing from '../components/exercise/WordGuessing';
import ExerciseQueryDialog from '../components/ExerciseQueryDialog';
import { ExerciseSkeleton } from '../components/ExerciseSkeleton';
import { usePracticeExercise } from '../hooks';

function renderExercise(exercise: PracticeExercise) {
  switch (exercise.type) {
    case PracticeType.COMMUNICATION:
      return <Communication exercise={exercise} />;
    case PracticeType.USING_WORD:
      return <UsingWord exercise={exercise} />;
    case PracticeType.JUST_ONE_WORD:
      return <JustOneWord exercise={exercise} />;
    case PracticeType.WORD_GUESSING:
      return <WordGuessing exercise={exercise} />;
    case PracticeType.SENTENCE_CONSTRUCTION:
      return <SentenceConstruction exercise={exercise} />;
    case PracticeType.SENTENCE_VARIATION:
      return <SentenceVariation exercise={exercise} />;
    case PracticeType.PARAGRAPH_VARIATION:
      return <ParagraphVariation exercise={exercise} />;
  }
}

const EXERCISE_QUERY_STORAGE_KEY = 'practice-exercise-query';

export default function PracticePage() {
  const [query, setQuery] = useLocalStorageState<PracticeExerciseQuery>(
    EXERCISE_QUERY_STORAGE_KEY,
    {},
  );
  const { data: exercise, isFetching } = usePracticeExercise(query);

  return (
    <div className="mx-auto max-w-2xl">
      <TopLoadingBar open={isFetching} />

      <div className="mb-4 flex justify-end">
        <ExerciseQueryDialog query={query} onSubmit={setQuery} />
      </div>

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
