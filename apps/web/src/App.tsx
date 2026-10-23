import { Route, Routes, useLocation } from 'react-router';

import { requireAuth } from './auth';
import PageLayout from './common/components/PageLayout';
import SignInCallbackPage from './common/pages/SignInCallbackPage';
import SignOutCallbackPage from './common/pages/SignOutCallbackPage';
import { ErrorBoundary } from './error-new';
import ExerciseListPage from './manage/exercise/list/ExerciseListPage';
import PracticePage from './practice/pages/PracticePage';
import {
  DEFAULT_ROUTE,
  MANAGE_EXERCISE_LIST_ROUTE,
  PRACTICE_ROUTE,
  SIGN_IN_REDIRECT_ROUTE,
  SIGN_OUT_REDIRECT_ROUTE,
} from './routes';

const ExerciseListPageWithAuth = requireAuth(ExerciseListPage);

export default function App() {
  const location = useLocation();
  return (
    <ErrorBoundary resetKeys={[location.pathname]}>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path={DEFAULT_ROUTE} element={<PracticePage />} />
          <Route path={PRACTICE_ROUTE} element={<PracticePage />} />
          <Route
            path={MANAGE_EXERCISE_LIST_ROUTE}
            element={<ExerciseListPageWithAuth />}
          />
        </Route>
        <Route path={SIGN_IN_REDIRECT_ROUTE} element={<SignInCallbackPage />} />
        <Route path={SIGN_OUT_REDIRECT_ROUTE} element={<SignOutCallbackPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
