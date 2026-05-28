import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

/**
 * Public navigation bar for unauthenticated pages.
 * Displays WriteSpace logo/brand, and Login/Get Started buttons.
 * Adapts if user is already authenticated (shows avatar and dashboard link instead).
 * Responsive with mobile hamburger menu.
 * @returns {JSX.Element}
 */
function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const authenticated = isAuthenticated();
  const currentUser = authenticated ? getCurrentUser() : null;

  return (
    <nav className="relative bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-600">✍️ WriteSpace</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 sm:flex">
          {authenticated && currentUser ? (
            <>
              <Link
                to="/blogs"
                className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <Link to="/blogs" className="flex items-center gap-2">
                {getAvatar(currentUser.role === 'admin' ? 'admin' : 'user')}
                <span className="text-sm font-medium text-slate-700">
                  {currentUser.displayName}
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 sm:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-2 sm:hidden">
          {authenticated && currentUser ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 py-2">
                {getAvatar(currentUser.role === 'admin' ? 'admin' : 'user')}
                <span className="text-sm font-medium text-slate-700">
                  {currentUser.displayName}
                </span>
              </div>
              <Link
                to="/blogs"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default PublicNavbar;