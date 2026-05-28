import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { getPosts } from '../utils/storage.js';
import { isAuthenticated } from '../utils/auth.js';

/**
 * Authenticated blog listing page.
 * Displays all posts from localStorage in a responsive grid using BlogCard components.
 * Posts are sorted newest first.
 * Admin sees edit on all posts; user sees edit only on own posts (handled by BlogCard).
 * Shows empty state with CTA to write first post if no posts exist.
 * @returns {JSX.Element}
 */
function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const allPosts = getPosts();
      const sorted = [...allPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sorted);
    } catch (e) {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">All Blogs</h1>
          <Link
            to="/write"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            ✍️ Write Post
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-slate-500">Loading posts…</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white py-20 shadow-md">
            <span className="mb-4 text-5xl">📝</span>
            <h2 className="mb-2 text-lg font-bold text-slate-900">No posts yet</h2>
            <p className="mb-6 text-sm text-slate-500">
              Be the first to share your thoughts with the community!
            </p>
            <Link
              to="/write"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Write Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;