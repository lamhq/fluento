import { useAuth } from '../../../auth';

export default function ProtectedPage() {
  const auth = useAuth();

  return (
    <section>
      <h1>Protected Page</h1>
      <p>This page is only accessible to authenticated users.</p>
      <div>
        <h2>User Information</h2>
        {auth.user ? (
          <div>
            <p>
              <strong>Name:</strong> {auth.user.profile.name ?? 'N/A'}
            </p>
            <p>
              <strong>Email:</strong> {auth.user.profile.email ?? 'N/A'}
            </p>
          </div>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>
    </section>
  );
}
