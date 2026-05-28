# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2024-06-01

### Added

- **Public Landing Page** — Hero section with gradient background, feature highlights (Write & Publish, Community Driven, Secure & Private), latest posts preview, and footer with navigation links.
- **User Authentication** — Login and registration system with session persistence via localStorage. Hard-coded admin account (`admin` / `admin`) for initial access.
- **Role-Based Access Control** — Admin and regular user roles with route protection using `ProtectedRoute` component. Unauthenticated users are redirected to `/login`; non-admin users are redirected to `/blogs` when accessing admin routes.
- **Blog CRUD Operations** — Create, read, edit, and delete blog posts. Users can manage their own posts; admins can manage all posts. Posts are stored in localStorage under the `writespace_posts` key.
- **Admin Dashboard** — Platform overview page at `/admin` with stat cards (total posts, total users, admin count, user count), quick-action buttons, and a list of the five most recent posts with edit and delete controls.
- **User Management** — Admin-only page at `/admin/users` to create new users with role selection (user or admin) and delete existing users. Hard-coded admin account and the currently logged-in admin cannot be deleted.
- **localStorage Persistence** — All data (posts, users, sessions) persisted client-side using localStorage with JSON serialization. No backend required.
- **Responsive Tailwind UI** — Mobile-first layout built with Tailwind CSS 3. Hamburger navigation menu for small screens. Responsive grid layouts for blog cards, stat cards, and user management.
- **Component Library** — Reusable components including `Avatar` (role-based), `BlogCard` (post preview), `Navbar` (authenticated navigation), `PublicNavbar` (public navigation), `StatCard` (dashboard metrics), `UserRow` (user management row), and `ProtectedRoute` (route guard).
- **Client-Side Routing** — React Router v6 with public routes (`/`, `/login`, `/register`), protected routes (`/blogs`, `/write`, `/edit/:id`, `/blog/:id`), admin-only routes (`/admin`, `/admin/users`), and a catch-all redirect to `/`.
- **Vercel Deployment Configuration** — `vercel.json` with SPA rewrites so all routes are handled by `index.html`.
- **Testing Setup** — Vitest with React Testing Library for unit and integration tests. Tests for authentication utilities, localStorage storage utilities, and route integration.