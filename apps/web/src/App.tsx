import type { ComponentType } from 'react';
import { Route, Routes } from 'react-router';

import { requireAuth } from './auth';
import { LAST_ROUTE_KEY } from './constants';
import Home from './pages/HomePage';
import SignInRedirectPage from './pages/SignInRedirectPage';
import SignOutRedirectPage from './pages/SignOutRedirectPage';
import { SIGN_IN_REDIRECT_ROUTE, SIGN_OUT_REDIRECT_ROUTE } from './routes';

const withAuth = (comp: ComponentType) => {
  return requireAuth(comp, {
    OnRedirecting: () => <p>Redirecting...</p>,
    onBeforeSignin: () => {
      // save the current route for going back after signin
      window.localStorage.setItem(LAST_ROUTE_KEY, window.location.pathname);
    },
  });
};
const ProtectedHomePage = withAuth(Home);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedHomePage />} />
      <Route path={SIGN_IN_REDIRECT_ROUTE} element={<SignInRedirectPage />} />
      <Route path={SIGN_OUT_REDIRECT_ROUTE} element={<SignOutRedirectPage />} />
    </Routes>
  );
}
