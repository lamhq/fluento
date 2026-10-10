import { Link, Navigate } from 'react-router';

import { useAuth } from '../../auth';
import { DEFAULT_ROUTE } from '../../routes';
import { LAST_ROUTE_KEY } from '../constants';

export default function SignInCallbackPage() {
  const auth = useAuth();

  if (auth.error) {
    return (
      <>
        <p>{auth.error.message}</p>
        <Link to={DEFAULT_ROUTE}>Return</Link>
      </>
    );
  }

  if (auth.isAuthenticated) {
    // Redirect user to saved route (before sign-in) or default page.
    const route = window.localStorage.getItem(LAST_ROUTE_KEY) ?? DEFAULT_ROUTE;
    return <Navigate to={route} />;
  }

  return <p>Getting access token...</p>;
}
