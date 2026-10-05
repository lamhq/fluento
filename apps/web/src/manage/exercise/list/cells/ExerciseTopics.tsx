import { Badge } from '@/components/ui/badge';

export default function ExerciseTopics({ topics }: { topics: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {topics.slice(0, 2).map((topic) => (
        <Badge key={topic} variant="outline" className="text-xs">
          {topic}
        </Badge>
      ))}
      {topics.length > 2 && (
        <Badge variant="outline" className="text-xs">
          +{topics.length - 2}
        </Badge>
      )}
    </div>
  );
}
