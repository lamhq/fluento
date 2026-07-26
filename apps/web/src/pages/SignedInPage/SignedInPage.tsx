import { Navigate } from 'react-router';

import { useAuth } from '../../auth';
import AuthErrorView from '../../components/AuthErrorView';
import { LAST_ROUTE_KEY } from '../../constants';
import { HOME_ROUTE } from '../../routes';

export default function SignInRedirectPage() {
  const auth = useAuth();

  if (auth.error) {
    return (
      <AuthErrorView errorMessage={auth.error.message} homeRoute={HOME_ROUTE} />
    );
  }

  if (auth.isAuthenticated) {
    // Redirect user to saved route (before sign-in) or home.
    const route = window.localStorage.getItem(LAST_ROUTE_KEY) ?? HOME_ROUTE;
    return <Navigate to={route} />;
  }

  return <p>Getting access token...</p>;
}
