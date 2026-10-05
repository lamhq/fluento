import { ListTodo } from 'lucide-react';
import { Link } from 'react-router';

import type { PracticeExercise } from '../../api/types';
import TopLoadingBar from '../../common/components/TopLoadingBar';
import { MANAGE_EXERCISE_LIST_ROUTE } from '../../routes';
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
      <div className="mb-4 flex justify-end gap-2">
        <Link
          to={MANAGE_EXERCISE_LIST_ROUTE}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ListTodo aria-hidden="true" className="size-4" />
          Manage exercises
        </Link>
      </div>

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
