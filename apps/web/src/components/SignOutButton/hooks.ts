import { useAuth } from '../../auth';
import { SIGN_OUT_REDIRECT_ROUTE } from '../../routes';
import { getAbsoluteURL } from '../../utils';

export function useSignOut() {
  const auth = useAuth();

  return () =>
    void auth.signoutRedirect({
      extraQueryParams: {
        client_id: auth.settings.client_id,
        logout_uri: getAbsoluteURL(SIGN_OUT_REDIRECT_ROUTE),
        post_logout_redirect_uri: getAbsoluteURL(SIGN_OUT_REDIRECT_ROUTE),
      },
    });
}
