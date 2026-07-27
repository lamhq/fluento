import './style.css';

import { Outlet } from 'react-router';

import { useAuth } from '../../auth';
import SignOutButton from '../../components/SignOutButton';
import { HOME_ROUTE, PROTECTED_ROUTE } from '../../routes';

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="main-layout">
      <nav className="main-layout-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <h1>Fluento</h1>
          </div>
          <ul className="nav-links">
            <li>
              <a href={HOME_ROUTE}>Home</a>
            </li>

            <li>
              <a href={PROTECTED_ROUTE}>Protected</a>
            </li>
            {isAuthenticated && (
              <li>
                <SignOutButton />
              </li>
            )}
          </ul>
        </div>
      </nav>
      <main className="main-layout-content">
        <Outlet />
      </main>
    </div>
  );
}
