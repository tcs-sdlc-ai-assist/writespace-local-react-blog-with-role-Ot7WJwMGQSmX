import React from 'react';
import PropTypes from 'prop-types';
import { getAvatar } from './Avatar.jsx';
import { getCurrentUser } from '../utils/auth.js';

/**
 * Format an ISO date string to a human-readable format.
 * @param {string} isoDate - ISO date string.
 * @returns {string} Formatted date string.
 */
function formatDate(isoDate) {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return '';
  }
}

/**
 * User table row / card component for admin user management.
 * Displays avatar, display name, username, role badge pill, created date, and delete button.
 * Disables delete for hard-coded admin and for the currently logged-in admin's own account.
 * @param {{ user: { id: string, displayName: string, username: string, role: string, createdAt: string }, onDelete: (id: string) => void }} props
 * @returns {JSX.Element}
 */
function UserRow({ user, onDelete }) {
  const currentUser = getCurrentUser();

  const isHardCodedAdmin = user.username === 'admin';
  const isSelf = currentUser && currentUser.userId === user.id;
  const deleteDisabled = isHardCodedAdmin || isSelf;

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-md sm:flex-row sm:items-center sm:gap-4 sm:p-5">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getAvatar(user.role === 'admin' ? 'admin' : 'user')}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">
            {user.displayName}
          </p>
          <p className="truncate text-xs text-slate-400">
            @{user.username}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            user.role === 'admin'
              ? 'bg-violet-100 text-violet-700'
              : 'bg-indigo-100 text-indigo-700'
          }`}
        >
          {user.role === 'admin' ? 'Admin' : 'User'}
        </span>

        <span className="text-xs text-slate-400 whitespace-nowrap">
          {formatDate(user.createdAt)}
        </span>

        <button
          type="button"
          onClick={() => onDelete(user.id)}
          disabled={deleteDisabled}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
            deleteDisabled
              ? 'cursor-not-allowed bg-slate-50 text-slate-300'
              : 'bg-slate-100 text-slate-500 hover:bg-pink-100 hover:text-pink-600'
          }`}
          aria-label={`Delete user ${user.displayName}`}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;