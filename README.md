# WriteSpace

A modern blogging platform built with React where your ideas find their space. Write, share, and discover stories that matter.

## Features

- **Public Landing Page** — Hero section, feature highlights, and latest posts preview
- **User Authentication** — Login and registration with session persistence via localStorage
- **Role-Based Access Control** — Admin and regular user roles with route protection
- **Blog Management** — Create, read, edit, and delete blog posts
- **Admin Dashboard** — Platform overview with stat cards, recent posts, and quick actions
- **User Management** — Admin-only page to create and delete users
- **Responsive Design** — Mobile-first layout with hamburger navigation menu
- **Hard-Coded Admin Account** — Default admin credentials for initial access

## Tech Stack

- **React 18** — UI library with functional components and hooks
- **React Router v6** — Client-side routing with protected routes
- **Tailwind CSS 3** — Utility-first CSS framework for styling
- **Vite 5** — Fast build tool and development server
- **Vitest** — Unit testing framework
- **React Testing Library** — Component testing utilities
- **PropTypes** — Runtime prop type validation
- **localStorage** — Client-side data persistence (no backend required)

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── vitest.setup.js             # Test setup (localStorage mock)
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment rewrites
├── src/
│   ├── main.jsx                # React DOM entry point
│   ├── App.jsx                 # Root component with route definitions
│   ├── App.test.jsx            # Route integration tests
│   ├── index.css               # Tailwind CSS directives
│   ├── components/
│   │   ├── Avatar.jsx          # Role-based avatar component
│   │   ├── BlogCard.jsx        # Blog post preview card
│   │   ├── Navbar.jsx          # Authenticated navigation bar
│   │   ├── PublicNavbar.jsx    # Public navigation bar
│   │   ├── ProtectedRoute.jsx  # Route guard for auth and role checks
│   │   ├── StatCard.jsx        # Reusable stat card for dashboard
│   │   └── UserRow.jsx         # User row component for user management
│   ├── pages/
│   │   ├── AdminDashboard.jsx  # Admin-only dashboard page
│   │   ├── Home.jsx            # Authenticated blog listing page
│   │   ├── LandingPage.jsx     # Public landing page
│   │   ├── LoginPage.jsx       # Login page
│   │   ├── ReadBlog.jsx        # Full blog post reader page
│   │   ├── RegisterPage.jsx    # Registration page
│   │   ├── UserManagement.jsx  # Admin-only user management page
│   │   └── WriteBlog.jsx       # Blog post creation and editing page
│   └── utils/
│       ├── auth.js             # Authentication logic (login, logout, register)
│       ├── auth.test.js        # Auth utility tests
│       ├── storage.js          # localStorage CRUD operations
│       └── storage.test.js     # Storage utility tests
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (included with Node.js)

### Installation

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Build

Create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Deployment to Vercel

This project is configured for deployment on [Vercel](https://vercel.com/).

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Vercel will auto-detect the Vite framework and configure the build settings:
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
4. Deploy.

The included `vercel.json` configures SPA rewrites so all routes are handled by `index.html`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Default Admin Account

A hard-coded admin account is available for initial access:

| Username | Password | Role  |
|----------|----------|-------|
| `admin`  | `admin`  | Admin |

Admin users have access to the Admin Dashboard (`/admin`) and User Management (`/admin/users`) pages. Regular users created via registration or the admin panel have the `user` role.

## localStorage Schema

All data is persisted in the browser's localStorage using the following keys:

### `writespace_posts`

Array of blog post objects.

```json
[
  {
    "id": "string",
    "title": "string",
    "content": "string",
    "createdAt": "ISO 8601 date string",
    "authorId": "string",
    "authorName": "string"
  }
]
```

### `writespace_users`

Array of registered user objects (does not include the hard-coded admin).

```json
[
  {
    "id": "string",
    "displayName": "string",
    "username": "string",
    "password": "string (plain text)",
    "role": "user | admin",
    "createdAt": "ISO 8601 date string"
  }
]
```

### `writespace_session`

Current authenticated user session object, or absent if logged out.

```json
{
  "userId": "string",
  "username": "string",
  "displayName": "string",
  "role": "user | admin"
}
```

> **Note:** This application stores passwords in plain text in localStorage. This is intended for demonstration and learning purposes only. Do not use this approach in production applications.

## Usage Guide

### As a Regular User

1. **Register** — Navigate to `/register` and create an account with a display name, username, and password.
2. **Login** — Navigate to `/login` and sign in with your credentials.
3. **Browse Posts** — View all blog posts on the `/blogs` page, sorted newest first.
4. **Write a Post** — Click "Write Post" to create a new blog post with a title and content.
5. **Read a Post** — Click any blog card to read the full post.
6. **Edit Your Posts** — Click the edit icon on posts you authored to modify them.
7. **Delete Your Posts** — On the full post view, click the delete icon to remove your post (with confirmation).

### As an Admin

All regular user capabilities, plus:

1. **Admin Dashboard** — Access `/admin` for platform statistics and recent posts overview.
2. **Manage Users** — Access `/admin/users` to create new users (with role selection) and delete existing users.
3. **Edit Any Post** — Admins can edit and delete any user's posts.
4. **Cannot Delete Self** — Admins cannot delete their own account or the hard-coded admin account.

## Routes

| Path            | Access          | Description                     |
|-----------------|-----------------|---------------------------------|
| `/`             | Public          | Landing page                    |
| `/login`        | Public          | Login page                      |
| `/register`     | Public          | Registration page               |
| `/blogs`        | Authenticated   | Blog listing page               |
| `/write`        | Authenticated   | Create new blog post            |
| `/edit/:id`     | Authenticated   | Edit existing blog post         |
| `/blog/:id`     | Authenticated   | Read full blog post             |
| `/admin`        | Admin only      | Admin dashboard                 |
| `/admin/users`  | Admin only      | User management                 |
| `*`             | Public          | Redirects to `/`                |

## License

Private