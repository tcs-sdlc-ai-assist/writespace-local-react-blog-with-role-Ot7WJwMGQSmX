import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, logout } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

/**
 * Authenticated navigation bar component.
 * Shows WriteSpace brand, role-based links, user avatar with display name, and logout button.
 * Mobile hamburger menu for responsive design.
 * @returns {JSX.Element}
 */
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const currentUser = authenticated ? getCurrentUser() : null;

  const isAdmin = currentUser && currentUser.role === 'admin';

  /**
   * Handle logout action. Clears session and redirects to login.
   */
  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="relative bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link to="/blogs" className="flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-600">✍️ WriteSpace</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 sm:flex">
          <Link
            to="/blogs"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            All Blogs
          </Link>
          <Link
            to="/write"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Write
          </Link>
          {isAdmin && (
            <Link
              to="/admin/users"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              Users
            </Link>
          )}

          {currentUser && (
            <div className="flex items-center gap-3 ml-2">
              <div className="flex items-center gap-2">
                {getAvatar(isAdmin ? 'admin' : 'user')}
                <span className="text-sm font-medium text-slate-700">
                  {currentUser.displayName}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-pink-600"
              >
                Logout
              </button>
            </div>
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
          <div className="flex flex-col gap-2">
            {currentUser && (
              <div className="flex items-center gap-2 py-2">
                {getAvatar(isAdmin ? 'admin' : 'user')}
                <span className="text-sm font-medium text-slate-700">
                  {currentUser.displayName}
                </span>
              </div>
            )}
            <Link
              to="/blogs"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Blogs
            </Link>
            <Link
              to="/write"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Write
            </Link>
            {isAdmin && (
              <Link
                to="/admin/users"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Users
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-pink-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;