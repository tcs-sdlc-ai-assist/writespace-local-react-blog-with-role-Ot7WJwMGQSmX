import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getAvatar } from './Avatar.jsx';
import { getCurrentUser } from '../utils/auth.js';

const ACCENT_COLORS = [
  'border-indigo-500',
  'border-violet-500',
  'border-pink-500',
  'border-teal-500',
];

/**
 * Truncate content to a given max length and append ellipsis if needed.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - Maximum character length.
 * @returns {string} Truncated text.
 */
function truncate(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
}

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
 * Blog post preview card component for list views.
 * Displays title, excerpt, date, author with avatar, accent border, and edit link for owner/admin.
 * @param {{ post: { id: string, title: string, content: string, createdAt: string, authorId: string, authorName: string }, index: number }} props
 * @returns {JSX.Element}
 */
function BlogCard({ post, index }) {
  const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const currentUser = getCurrentUser();

  const canEdit =
    currentUser &&
    (currentUser.role === 'admin' || currentUser.userId === post.authorId);

  const authorRole =
    post.authorId === 'admin' ? 'admin' : 'user';

  return (
    <div
      className={`relative flex flex-col rounded-lg bg-white shadow-md border-l-4 ${accentColor} transition hover:shadow-lg`}
    >
      <Link to={`/blog/${post.id}`} className="flex flex-1 flex-col p-5">
        <h2 className="mb-2 text-lg font-bold text-slate-900 line-clamp-2">
          {post.title}
        </h2>
        <p className="mb-4 flex-1 text-sm text-slate-500">
          {truncate(post.content, 120)}
        </p>
        <div className="mt-auto flex items-center gap-2">
          {getAvatar(authorRole)}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-700">
              {post.authorName}
            </p>
            <p className="text-xs text-slate-400">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </Link>
      {canEdit && (
        <Link
          to={`/edit/${post.id}`}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-indigo-100 hover:text-indigo-600"
          aria-label="Edit post"
        >
          ✏️
        </Link>
      )}
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number,
};

BlogCard.defaultProps = {
  index: 0,
};

export default BlogCard;