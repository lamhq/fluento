import { Link, Navigate } from 'react-router';

import { useAuth } from '../../../auth';
import { HOME_ROUTE } from '../../../routes';

export default function SignOutCallbackPage() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <Navigate to={HOME_ROUTE} />;
  }

  return (
    <>
      <p>You have been signed out.</p>
      <p>
        To sign in again, choose the <strong>Sign In</strong> button below.
      </p>
      <p>
        Or return to &nbsp;
        <Link to={HOME_ROUTE}>home page</Link>.
      </p>
      <p>
        <button onClick={auth.signIn}>sign in</button>
      </p>
    </>
  );
}
