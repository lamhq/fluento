import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ResetFiltersButtonProps {
  isFiltered: boolean;
  onResetFilters: () => void;
}

export default function ResetFiltersButton({
  isFiltered,
  onResetFilters,
}: ResetFiltersButtonProps) {
  if (!isFiltered) return null;

  return (
    <Button variant="ghost" onClick={onResetFilters} className="h-8 px-2">
      <span>Reset</span>
      <X size={12} className="ms-2" />
    </Button>
  );
}
