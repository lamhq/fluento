import { Route, Routes } from 'react-router';

import { requireAuth } from './auth';
import PracticePage from './comm/pages/PracticePage';
import ErrorBoundary from './common/components/ErrorBoundary';
import MainLayout from './common/components/MainLayout';
import SignInCallbackPage from './common/pages/SignInCallbackPage';
import SignOutCallbackPage from './common/pages/SignOutCallbackPage';
import DataFetchingPage from './demo/pages/DataFetchingPage';
import DataMutationPage from './demo/pages/DataMutationPage';
import HomePage from './demo/pages/HomePage';
import ProtectedPage from './demo/pages/ProtectedPage';
import {
  DATA_FETCHING_ROUTE,
  DATA_MUTATION_ROUTE,
  HOME_ROUTE,
  PRACTICE_ROUTE,
  PROTECTED_ROUTE,
  SIGN_IN_REDIRECT_ROUTE,
  SIGN_OUT_REDIRECT_ROUTE,
} from './routes';

const ProtectedPageWithAuth = requireAuth(ProtectedPage);

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={HOME_ROUTE} element={<HomePage />} />
          <Route path={DATA_FETCHING_ROUTE} element={<DataFetchingPage />} />
          <Route path={DATA_MUTATION_ROUTE} element={<DataMutationPage />} />
          <Route path={PROTECTED_ROUTE} element={<ProtectedPageWithAuth />} />
          <Route path={PRACTICE_ROUTE} element={<PracticePage />} />
        </Route>
        <Route path={SIGN_IN_REDIRECT_ROUTE} element={<SignInCallbackPage />} />
        <Route path={SIGN_OUT_REDIRECT_ROUTE} element={<SignOutCallbackPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
