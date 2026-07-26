import { useAuth } from '../../auth';
import { SIGN_OUT_REDIRECT_ROUTE } from '../../routes';
import { getAbsoluteURL } from '../../utils';

export default function SignOutButton() {
  const auth = useAuth();
  const signOut = () =>
    // call the end session endpoint and redirect user to sign out page
    void auth.signoutRedirect({
      extraQueryParams: {
        client_id: auth.settings.client_id,

        // if using Amazon Cognito, use `logout_uri` to redirect after signing out
        logout_uri: getAbsoluteURL(SIGN_OUT_REDIRECT_ROUTE),

        // if using Keycloak, use `post_logout_redirect_uri` to redirect after signing out
        post_logout_redirect_uri: getAbsoluteURL(SIGN_OUT_REDIRECT_ROUTE),
      },
    });
  return <button onClick={signOut}>Sign Out</button>;
}
