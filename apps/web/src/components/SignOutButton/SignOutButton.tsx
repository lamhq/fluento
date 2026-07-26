import { useSignOut } from './hooks';

export default function SignOutButton() {
  const signOut = useSignOut();

  return <button onClick={signOut}>Sign Out</button>;
}
