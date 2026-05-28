import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar.jsx';
import { getPosts } from '../utils/storage.js';
import { isAuthenticated } from '../utils/auth.js';

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
function truncate(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
}

const FEATURES = [
  {
    icon: '✍️',
    title: 'Write & Publish',
    description:
      'Create beautiful blog posts with our intuitive editor. Share your thoughts with the world in just a few clicks.',
    bgColor: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: '👥',
    title: 'Community Driven',
    description:
      'Join a growing community of writers and readers. Discover new perspectives and connect with like-minded people.',
    bgColor: 'bg-violet-100 text-violet-600',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description:
      'Your content is yours. Role-based access control ensures only you can edit your posts, with admin oversight for safety.',
    bgColor: 'bg-pink-100 text-pink-600',
  },
];

/**
 * Public landing page component.
 * Features hero section with gradient background, features section, latest posts preview, and footer.
 * @returns {JSX.Element}
 */
function LandingPage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  useEffect(() => {
    try {
      const allPosts = getPosts();
      const sorted = [...allPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLatestPosts(sorted.slice(0, 3));
    } catch (e) {
      setLatestPosts([]);
    }
  }, []);

  /**
   * Handle click on a post preview card.
   * Redirects to login if not authenticated, otherwise navigates to the blog post.
   * @param {string} postId - The ID of the post.
   */
  function handlePostClick(postId) {
    if (authenticated) {
      navigate(`/blog/${postId}`);
    } else {
      navigate('/login');
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 px-4 py-20 text-center sm:py-28 lg:py-36">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            ✍️ WriteSpace
          </h1>
          <p className="mb-8 text-lg text-white/90 sm:text-xl">
            A modern blogging platform where your ideas find their space. Write, share, and discover stories that matter.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition hover:bg-slate-100 hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center rounded-lg border-2 border-white/80 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Why WriteSpace?
          </h2>
          <p className="text-sm text-slate-500 sm:text-base">
            Everything you need to start your writing journey.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition hover:shadow-lg"
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${feature.bgColor}`}
              >
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Posts Preview */}
      {latestPosts.length > 0 && (
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                Latest Posts
              </h2>
              <p className="text-sm text-slate-500 sm:text-base">
                See what our community has been writing about.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => handlePostClick(post.id)}
                  className="flex flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 text-left transition hover:shadow-lg hover:border-indigo-300"
                >
                  <h3 className="mb-2 text-lg font-bold text-slate-900 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm text-slate-500">
                    {truncate(post.content, 100)}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">
                      {post.authorName}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-slate-500 transition hover:text-indigo-600"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-slate-500 transition hover:text-indigo-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-slate-500 transition hover:text-indigo-600"
            >
              Register
            </Link>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} WriteSpace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;