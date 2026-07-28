import { useAuth } from '../../auth';

export default function SignOutButton() {
  const { signOut } = useAuth();

  return <button onClick={signOut}>Sign Out</button>;
}
