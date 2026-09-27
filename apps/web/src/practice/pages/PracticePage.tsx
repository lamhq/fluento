import { Suspense } from 'react';

import { ExerciseSkeleton } from '../components/ExerciseSkeleton';
import PracticeForm from '../components/PracticeForm';
import { usePracticeExercise } from '../hooks';

function FetchExercise() {
  const exercise = usePracticeExercise();
  if (!exercise) {
    return <div className="max-w-2xl mx-auto">No exercise available.</div>;
  }

  return <PracticeForm exercise={exercise} />;
}

export default function PracticePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Suspense fallback={<ExerciseSkeleton />}>
        <FetchExercise />
      </Suspense>
    </div>
  );
}
