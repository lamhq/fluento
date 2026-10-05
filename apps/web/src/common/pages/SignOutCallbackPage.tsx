import { Link, Navigate } from 'react-router';

import { useAuth } from '../../auth';
import { DEFAULT_ROUTE } from '../../routes';

export default function SignOutCallbackPage() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <Navigate to={DEFAULT_ROUTE} />;
  }

  return (
    <>
      <p>You have been signed out.</p>
      <p>
        To sign in again, choose the <strong>Sign In</strong> button below.
      </p>
      <p>
        Or return to &nbsp;
        <Link to={DEFAULT_ROUTE}>practice page</Link>.
      </p>
      <p>
        <button onClick={auth.signIn}>sign in</button>
      </p>
    </>
  );
}
