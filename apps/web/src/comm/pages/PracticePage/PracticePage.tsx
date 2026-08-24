import { Suspense } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

import { usePracticePage } from './usePracticePage';

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  );
}

function FetchExercise() {
  const { exercise } = usePracticePage();

  if (!exercise) {
    return <div className="max-w-2xl mx-auto">No exercise available.</div>;
  }

  const prompt = exercise.prompts[0];
  const counterpart = exercise.counterpartRole;

  return (
    <>
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-center">{exercise.scenario}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Scenario prompt */}
          <p>
            You&apos;re a <strong className="italic">{exercise.learnerRole}</strong>{' '}
            {exercise.scenario.toLowerCase()}.
          </p>
          <p>
            The <strong className="italic">{counterpart}</strong> said:
          </p>
          <blockquote className="my-4 italic font-bold text-center text-lg">
            {prompt}
          </blockquote>

          <Separator />

          {/* Response input */}
          <label className="block mb-2">Response in a polite manner:</label>
          <Textarea placeholder="Type your response here..." />
        </CardContent>

        <CardFooter className="flex justify-center gap-2">
          <Button variant="default">Submit</Button>
          <Button variant="secondary" className="hidden">
            Retry
          </Button>
          <Button variant="outline" className="hidden">
            Next
          </Button>
        </CardFooter>
      </Card>

      {/* Feedback panel */}
      <div className="mt-6">
        <Alert>
          <AlertTitle>🌟 95/100. Excellent work!</AlertTitle>
          <AlertDescription>Your response was clear and polished.</AlertDescription>
        </Alert>

        <div className="mt-4 space-y-2">
          <p>Corrected Sentence:</p>
          <p>"Let's meet tomorrow to discuss the project."</p>

          <p className="mt-2">Fixes:</p>
          <ul className="list-disc list-inside">
            <li>"Lets" → "Let's"</li>
          </ul>

          <p>Suggested Alternatives</p>
          <ul className="list-disc list-inside space-y-1">
            <li>"I'd be happy to meet tomorrow to talk about the project."</li>
            <li>"Tomorrow works well for me. Let's discuss the details then."</li>
            <li>"Sure, let's meet tomorrow to go over the project."</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default function PracticePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Suspense fallback={<SkeletonCard />}>
        <FetchExercise />
      </Suspense>
    </div>
  );
}
