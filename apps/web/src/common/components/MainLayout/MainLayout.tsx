import { useState } from 'react';
import { NavLink } from 'react-router';
import { Outlet } from 'react-router';

import { useAuth } from '../../../auth';
import SignOutButton from '../../../common/components/SignOutButton';
import {
  DATA_FETCHING_ROUTE,
  DATA_MUTATION_ROUTE,
  HOME_ROUTE,
  PRACTICE_ROUTE,
  PROTECTED_ROUTE,
} from '../../../routes';
import ErrorBoundary from '../ErrorBoundary';

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">Fluento</h1>
            </div>
            <ul className="hidden md:flex gap-8 items-center">
              <li>
                <NavLink
                  to={HOME_ROUTE}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={PROTECTED_ROUTE}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Protected Page
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={DATA_FETCHING_ROUTE}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Data Fetching
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={DATA_MUTATION_ROUTE}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Data Mutation
                </NavLink>
              </li>
              {isAuthenticated && (
                <li>
                  <SignOutButton />
                </li>
              )}
            </ul>
            {/* Mobile menu button */}
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200">
              <ul className="flex flex-col gap-3 pt-4">
                <li>
                  <NavLink
                    to={HOME_ROUTE}
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={PROTECTED_ROUTE}
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  >
                    Protected Page
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={DATA_FETCHING_ROUTE}
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  >
                    Data Fetching
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={DATA_MUTATION_ROUTE}
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  >
                    Data Mutation
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={PRACTICE_ROUTE}
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  >
                    Practice Page
                  </NavLink>
                </li>
                {isAuthenticated && (
                  <li className="pt-2 border-t border-gray-200">
                    <SignOutButton />
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto p-2 md:p-4 lg:p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
