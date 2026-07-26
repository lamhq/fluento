import { Navigate } from 'react-router';

import { useAuth } from '../../auth';
import SignedOutView from '../../components/SignedOutView';
import { HOME_ROUTE } from '../../routes';

export default function SignOutRedirectPage() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <Navigate to={HOME_ROUTE} />;
  }

  const signIn = () => void auth.signinRedirect();

  return <SignedOutView onSignIn={signIn} homeRoute={HOME_ROUTE} />;
}
