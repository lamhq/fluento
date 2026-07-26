import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './App';
import { AuthProvider } from './auth';
import { SIGN_IN_REDIRECT_ROUTE } from './routes';
import { getAbsoluteURL } from './utils';

// #region Auth
const oidcAuthority = import.meta.env.VITE_OIDC_AUTHORITY;
if (!oidcAuthority)
  throw new Error('Missing required environment variable: VITE_OIDC_AUTHORITY');

const oidcClientId = import.meta.env.VITE_OIDC_CLIENT_ID;
if (!oidcClientId)
  throw new Error('Missing required environment variable: VITE_OIDC_CLIENT_ID');
// #endregion

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <AuthProvider
        oidcAuthority={oidcAuthority}
        oidcClientId={oidcClientId}
        redirectUri={getAbsoluteURL(SIGN_IN_REDIRECT_ROUTE)}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </StrictMode>,
  );
}
