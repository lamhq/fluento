import { Button } from '@/components/ui/button';

import { useAuth } from '../../../auth';

export default function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <Button type="button" variant="outline" size="sm" onClick={signOut}>
      Sign Out
    </Button>
  );
}
