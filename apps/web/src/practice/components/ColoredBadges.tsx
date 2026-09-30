import { Badge } from '@/components/ui/badge';

const badgeColors = [
  'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
  'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
  'border-rose-200 bg-rose-100 text-rose-800 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-200',
  'border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-200',
  'border-cyan-200 bg-cyan-100 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
];

interface ColoredBadgesProps {
  values: string[];
}

export default function ColoredBadges({ values }: ColoredBadgesProps) {
  return (
    <>
      {values.map((value, index) => (
        <Badge
          key={`${value}-${String(index)}`}
          className={`${badgeColors[index % badgeColors.length]} text-sm`}
        >
          {value}
        </Badge>
      ))}
    </>
  );
}
