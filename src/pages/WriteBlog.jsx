import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getPosts, savePosts } from '../utils/storage.js';
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
 * Blog post creation and editing page.
 * Used at '/write' for creating new posts and '/edit/:id' for editing existing posts.
 * All authenticated users can create posts.
 * Editing is restricted: users can only edit their own posts, admins can edit any post.
 * Validates required fields (title and content).
 * Includes character counter below content textarea.
 * Cancel button navigates back without saving.
 * On save, persists post data to localStorage.
 * @returns {JSX.Element}
 */
function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    try {
      const allPosts = getPosts();
      const found = allPosts.find((p) => p.id === id);

      if (!found) {
        setNotFound(true);
        setInitialLoading(false);
        return;
      }

      const canEdit =
        currentUser &&
        (currentUser.role === 'admin' || currentUser.userId === found.authorId);

      if (!canEdit) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(found.title);
      setContent(found.content);
    } catch (e) {
      setNotFound(true);
    } finally {
      setInitialLoading(false);
    }
  }, [id, isEditMode, currentUser, navigate]);

  /**
   * Handle form submission for creating or updating a blog post.
   * @param {React.FormEvent} e - Form event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Please fill in both title and content.');
      return;
    }

    setLoading(true);

    try {
      const allPosts = getPosts();

      if (isEditMode) {
        const postIndex = allPosts.findIndex((p) => p.id === id);

        if (postIndex === -1) {
          setError('Post not found. It may have been deleted.');
          setLoading(false);
          return;
        }

        allPosts[postIndex] = {
          ...allPosts[postIndex],
          title: trimmedTitle,
          content: trimmedContent,
        };

        savePosts(allPosts);
        navigate(`/blog/${id}`, { replace: true });
      } else {
        const newPost = {
          id: generateId(),
          title: trimmedTitle,
          content: trimmedContent,
          createdAt: new Date().toISOString(),
          authorId: currentUser.userId,
          authorName: currentUser.displayName,
        };

        allPosts.push(newPost);
        savePosts(allPosts);
        navigate(`/blog/${newPost.id}`, { replace: true });
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  /**
   * Handle cancel action. Navigates back without saving.
   */
  function handleCancel() {
    if (isEditMode && id) {
      navigate(`/blog/${id}`);
    } else {
      navigate('/blogs');
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {initialLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-slate-500">Loading post…</p>
          </div>
        ) : notFound ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white py-20 shadow-md">
            <span className="mb-4 text-5xl">🔍</span>
            <h2 className="mb-2 text-lg font-bold text-slate-900">Post not found</h2>
            <p className="mb-6 text-sm text-slate-500">
              The post you&apos;re trying to edit doesn&apos;t exist or has been removed.
            </p>
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Back to All Blogs
            </button>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 shadow-md sm:p-8">
            <h1 className="mb-6 text-2xl font-bold text-slate-900">
              {isEditMode ? 'Edit Post' : 'Write a New Post'}
            </h1>

            {error && (
              <div className="mb-4 rounded-lg bg-pink-50 px-4 py-3 text-sm text-pink-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your post title"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here…"
                  rows={12}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                />
                <p className="mt-1 text-xs text-slate-400">
                  {content.length} character{content.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition ${
                    loading
                      ? 'cursor-not-allowed bg-indigo-400'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {loading
                    ? isEditMode
                      ? 'Saving…'
                      : 'Publishing…'
                    : isEditMode
                      ? 'Save Changes'
                      : 'Publish Post'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg px-6 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default WriteBlog;