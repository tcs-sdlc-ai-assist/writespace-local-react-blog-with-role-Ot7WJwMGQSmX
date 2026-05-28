import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getAvatar } from '../components/Avatar.jsx';
import { getPosts, savePosts } from '../utils/storage.js';
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
 * Full blog post reader page.
 * Displays title, author with avatar, date, and full content.
 * Admin sees edit/delete buttons on all posts; user sees edit/delete only on own posts.
 * Delete uses window.confirm and redirects to /blogs.
 * Handles invalid/missing ID with 'Post not found' message.
 * @returns {JSX.Element}
 */
function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const currentUser = getCurrentUser();

  useEffect(() => {
    try {
      const allPosts = getPosts();
      const found = allPosts.find((p) => p.id === id);
      if (found) {
        setPost(found);
      } else {
        setNotFound(true);
      }
    } catch (e) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const canEdit =
    currentUser &&
    post &&
    (currentUser.role === 'admin' || currentUser.userId === post.authorId);

  /**
   * Handle delete action. Confirms with user, removes post, and redirects.
   */
  function handleDelete() {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    try {
      const allPosts = getPosts();
      const updated = allPosts.filter((p) => p.id !== post.id);
      savePosts(updated);
      navigate('/blogs', { replace: true });
    } catch (e) {
      // silently fail
    }
  }

  const authorRole = post && post.authorId === 'admin' ? 'admin' : 'user';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-slate-500">Loading post…</p>
          </div>
        ) : notFound || !post ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white py-20 shadow-md">
            <span className="mb-4 text-5xl">🔍</span>
            <h2 className="mb-2 text-lg font-bold text-slate-900">Post not found</h2>
            <p className="mb-6 text-sm text-slate-500">
              The post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Back to All Blogs
            </Link>
          </div>
        ) : (
          <article className="rounded-lg bg-white p-6 shadow-md sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {post.title}
              </h1>
              {canEdit && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/edit/${post.id}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-indigo-100 hover:text-indigo-600"
                    aria-label="Edit post"
                  >
                    ✏️
                  </Link>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-pink-100 hover:text-pink-600"
                    aria-label="Delete post"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>

            <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-6">
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

            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {post.content}
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <Link
                to="/blogs"
                className="inline-flex items-center text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
              >
                ← Back to All Blogs
              </Link>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}

export default ReadBlog;