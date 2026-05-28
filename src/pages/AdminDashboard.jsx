import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import StatCard from '../components/StatCard.jsx';
import { getAvatar } from '../components/Avatar.jsx';
import { getPosts, savePosts, getUsers } from '../utils/storage.js';
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
 * Truncate content to a given max length and append ellipsis if needed.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - Maximum character length.
 * @returns {string} Truncated text.
 */
function truncate(text, maxLength = 80) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
}

/**
 * Admin-only dashboard page.
 * Displays four stat cards (total posts, total users, admin count, user count) using StatCard component.
 * Quick-action buttons for writing new post and managing users.
 * Recent 5 posts list with edit/delete controls.
 * Non-admins redirected to /blogs via ProtectedRoute.
 * @returns {JSX.Element}
 */
function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    try {
      const allPosts = getPosts();
      const sorted = [...allPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sorted);

      const allUsers = getUsers();
      setUsers(allUsers);
    } catch (e) {
      setPosts([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const userCount = users.filter((u) => u.role === 'user').length;

  const recentPosts = posts.slice(0, 5);

  /**
   * Handle delete action for a post. Confirms with user, removes post, and updates state.
   * @param {string} postId - The ID of the post to delete.
   */
  function handleDelete(postId) {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    try {
      const allPosts = getPosts();
      const updated = allPosts.filter((p) => p.id !== postId);
      savePosts(updated);

      const sorted = [...updated].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sorted);
    } catch (e) {
      // silently fail
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-slate-500">Loading dashboard…</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Overview of your WriteSpace platform.
              </p>
            </div>

            {/* Stat Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Posts"
                value={totalPosts}
                icon="📝"
                bgColor="bg-indigo-100 text-indigo-600"
              />
              <StatCard
                title="Total Users"
                value={totalUsers}
                icon="👥"
                bgColor="bg-violet-100 text-violet-600"
              />
              <StatCard
                title="Admins"
                value={adminCount}
                icon="👑"
                bgColor="bg-pink-100 text-pink-600"
              />
              <StatCard
                title="Users"
                value={userCount}
                icon="📖"
                bgColor="bg-teal-100 text-teal-600"
              />
            </div>

            {/* Quick Actions */}
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <Link
                to="/write"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                ✍️ Write New Post
              </Link>
              <Link
                to="/admin/users"
                className="inline-flex items-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                👥 Manage Users
              </Link>
            </div>

            {/* Recent Posts */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Recent Posts</h2>
                <Link
                  to="/blogs"
                  className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                >
                  View All →
                </Link>
              </div>

              {recentPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <span className="mb-3 text-4xl">📝</span>
                  <p className="mb-1 text-sm font-medium text-slate-700">No posts yet</p>
                  <p className="text-xs text-slate-400">
                    Create the first post to get started.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentPosts.map((post) => {
                    const authorRole = post.authorId === 'admin' ? 'admin' : 'user';

                    return (
                      <div
                        key={post.id}
                        className="flex flex-col gap-3 rounded-lg border border-slate-100 p-4 transition hover:border-slate-200 hover:shadow-sm sm:flex-row sm:items-center sm:gap-4"
                      >
                        <div className="flex flex-1 items-start gap-3 min-w-0">
                          {getAvatar(authorRole)}
                          <div className="min-w-0 flex-1">
                            <Link
                              to={`/blog/${post.id}`}
                              className="block truncate text-sm font-medium text-slate-900 transition hover:text-indigo-600"
                            >
                              {post.title}
                            </Link>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {post.authorName} · {formatDate(post.createdAt)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                              {truncate(post.content, 80)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            to={`/edit/${post.id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-indigo-100 hover:text-indigo-600"
                            aria-label={`Edit post ${post.title}`}
                          >
                            ✏️
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(post.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-pink-100 hover:text-pink-600"
                            aria-label={`Delete post ${post.title}`}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;