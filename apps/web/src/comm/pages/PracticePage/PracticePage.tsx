import { Suspense } from 'react';

import PracticeForm from '../../components/PracticeForm';
import { usePracticeExercise } from '../../hooks';
import { LoadingFallback } from './LoadingFallback';

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
      <Suspense fallback={<LoadingFallback />}>
        <FetchExercise />
      </Suspense>
    </div>
  );
}
