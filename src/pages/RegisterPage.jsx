import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, isAuthenticated, getCurrentUser } from '../utils/auth.js';
import { getUsers } from '../utils/storage.js';
import PublicNavbar from '../components/PublicNavbar.jsx';

/**
 * Registration page component.
 * Form with display name, username, password, and confirm password fields.
 * Validates all required, password match, and unique username (not in writespace_users or 'admin').
 * On success, saves user to localStorage via auth.js register(), writes session, and redirects to /blogs.
 * Already-authenticated users are redirected to their role-appropriate home.
 * Link to login page.
 * @returns {JSX.Element}
 */
function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      if (user && user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    }
  }, [navigate]);

  /**
   * Handle form submission for registration.
   * @param {React.FormEvent} e - Form event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password;
    const trimmedConfirmPassword = confirmPassword;

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword || !trimmedConfirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (trimmedUsername === 'admin') {
      setError('Username "admin" is reserved. Please choose another.');
      return;
    }

    try {
      const users = getUsers();
      const existing = users.find((u) => u.username === trimmedUsername);
      if (existing) {
        setError('Username is already taken. Please choose another.');
        return;
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const session = register(trimmedDisplayName, trimmedUsername, trimmedPassword);

      if (!session) {
        setError('Registration failed. Please try a different username.');
        setLoading(false);
        return;
      }

      navigate('/blogs', { replace: true });
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <PublicNavbar />

      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-white p-6 shadow-md sm:p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
              <p className="mt-1 text-sm text-slate-500">
                Join WriteSpace and start writing today
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-pink-50 px-4 py-3 text-sm text-pink-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="displayName"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${
                  loading
                    ? 'cursor-not-allowed bg-indigo-400'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-600 transition hover:text-indigo-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;