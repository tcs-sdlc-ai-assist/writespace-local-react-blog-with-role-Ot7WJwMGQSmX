import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, isAuthenticated, getCurrentUser } from '../utils/auth.js';
import PublicNavbar from '../components/PublicNavbar.jsx';

/**
 * Login page component.
 * Form with username and password fields.
 * Checks hard-coded admin credentials first, then localStorage users via auth.js login().
 * On success, writes session and redirects (admin to /admin, user to /blogs).
 * Shows inline error on failure.
 * Already-authenticated users are redirected to their role-appropriate home.
 * Link to registration page.
 * @returns {JSX.Element}
 */
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
   * Handle form submission for login.
   * @param {React.FormEvent} e - Form event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      const session = login(username.trim(), password);

      if (!session) {
        setError('Invalid username or password.');
        setLoading(false);
        return;
      }

      if (session.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
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
              <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
              <p className="mt-1 text-sm text-slate-500">
                Sign in to your WriteSpace account
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
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoComplete="current-password"
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
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-indigo-600 transition hover:text-indigo-700"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;