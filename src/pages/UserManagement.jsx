import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import UserRow from '../components/UserRow.jsx';
import { getUsers, saveUsers } from '../utils/storage.js';
import { getCurrentUser } from '../utils/auth.js';

/**
 * Generate a simple unique ID.
 * @returns {string}
 */
function generateId() {
  return (
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).substring(2, 9)
  );
}

/**
 * Admin-only user management page.
 * Displays a create user form at the top and a list of all users below.
 * Hard-coded admin account is always shown but cannot be deleted.
 * Admin cannot delete their own account.
 * Validates required fields and unique username on create.
 * Uses UserRow component for each user entry.
 * @returns {JSX.Element}
 */
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    try {
      const allUsers = getUsers();
      setUsers(allUsers);
    } catch (e) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Hard-coded admin user object for display purposes.
   */
  const hardCodedAdmin = {
    id: 'admin',
    displayName: 'Admin',
    username: 'admin',
    role: 'admin',
    createdAt: new Date('2024-01-01').toISOString(),
  };

  /**
   * All users including the hard-coded admin, sorted newest first.
   */
  const allDisplayUsers = [
    hardCodedAdmin,
    ...[...users].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  ];

  /**
   * Handle create user form submission.
   * Validates required fields, unique username, and reserved 'admin' username.
   * @param {React.FormEvent} e - Form event.
   */
  function handleCreateUser(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password;

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (trimmedUsername === 'admin') {
      setError('Username "admin" is reserved. Please choose another.');
      return;
    }

    const existing = users.find((u) => u.username === trimmedUsername);
    if (existing) {
      setError('Username is already taken. Please choose another.');
      return;
    }

    setFormLoading(true);

    try {
      const newUser = {
        id: generateId(),
        displayName: trimmedDisplayName,
        username: trimmedUsername,
        password: trimmedPassword,
        role: role,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      setUsers(updatedUsers);

      setDisplayName('');
      setUsername('');
      setPassword('');
      setRole('user');
      setSuccess(`User "${trimmedDisplayName}" created successfully.`);
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setFormLoading(false);
    }
  }

  /**
   * Handle delete action for a user.
   * Confirms with user, removes from localStorage, and updates state.
   * @param {string} userId - The ID of the user to delete.
   */
  function handleDeleteUser(userId) {
    if (userId === 'admin') return;
    if (currentUser && currentUser.userId === userId) return;

    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      const updatedUsers = users.filter((u) => u.id !== userId);
      saveUsers(updatedUsers);
      setUsers(updatedUsers);
      setSuccess('User deleted successfully.');
      setError('');
    } catch (e) {
      // silently fail
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            User Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage users on your WriteSpace platform.
          </p>
        </div>

        {/* Create User Form */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md sm:p-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Create New User</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-pink-50 px-4 py-3 text-sm text-pink-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-600">
              {success}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
                  placeholder="Enter display name"
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
                  htmlFor="role"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={formLoading}
                className={`rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition ${
                  formLoading
                    ? 'cursor-not-allowed bg-indigo-400'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {formLoading ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              All Users ({allDisplayUsers.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-slate-500">Loading users…</p>
            </div>
          ) : allDisplayUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="mb-3 text-4xl">👥</span>
              <p className="mb-1 text-sm font-medium text-slate-700">No users found</p>
              <p className="text-xs text-slate-400">
                Create a user using the form above.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allDisplayUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserManagement;