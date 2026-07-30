import { useAuth } from '../../../auth';

export default function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <button
      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
      onClick={signOut}
    >
      Sign Out
    </button>
  );
}
