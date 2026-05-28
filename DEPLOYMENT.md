# Deployment Guide

This document covers deploying the WriteSpace application to [Vercel](https://vercel.com/).

## Prerequisites

- A [Vercel](https://vercel.com/) account (free tier is sufficient)
- A Git repository hosted on GitHub, GitLab, or Bitbucket
- Node.js v18 or later (for local builds and testing)

## Build Configuration

### Build Command

```bash
npm run build
```

This runs `vite build` under the hood, producing an optimized production bundle.

### Output Directory

```
dist
```

Vite outputs the production build to the `dist/` directory by default. Vercel auto-detects this when the Vite framework preset is selected.

### Install Command

```bash
npm install
```

Vercel runs this automatically before the build step.

## SPA Rewrites

WriteSpace is a single-page application using React Router v6 for client-side routing. All routes must be served by `index.html` so that React Router can handle them in the browser.

The included `vercel.json` at the project root configures this:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures that navigating directly to any route (e.g., `/blogs`, `/admin`, `/blog/some-id`) returns `index.html` instead of a 404 error.

## Environment Variables

WriteSpace does **not** require any environment variables. All data is persisted client-side using the browser's `localStorage`. There is no backend, no database connection string, and no API keys to configure.

If you extend the application with external services in the future, add environment variables in the Vercel Dashboard under **Settings → Environment Variables** and access them in code via `import.meta.env.VITE_*`.

> **Note:** Only variables prefixed with `VITE_` are exposed to the client-side bundle by Vite. Never expose secrets in client-side environment variables.

## Deploying to Vercel

### Option 1: Import from Git (Recommended)

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to the [Vercel Dashboard](https://vercel.com/new) and click **Add New → Project**.
3. Select your repository and import it.
4. Vercel auto-detects the Vite framework and pre-fills the build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**.
6. Wait for the build to complete. Vercel provides a unique URL for your deployment (e.g., `https://writespace-xxxxx.vercel.app`).

### Option 2: Vercel CLI

1. Install the Vercel CLI globally:

   ```bash
   npm install -g vercel
   ```

2. From the project root, run:

   ```bash
   vercel
   ```

3. Follow the prompts to link your project and deploy.

4. For production deployments:

   ```bash
   vercel --prod
   ```

## CI/CD Auto-Deploy from GitHub

When you import a GitHub repository into Vercel, continuous deployment is enabled automatically:

- **Production deploys** are triggered on every push to the `main` (or `master`) branch.
- **Preview deploys** are triggered on every push to any other branch and on every pull request.

### How It Works

1. You push a commit or merge a pull request to `main`.
2. Vercel receives a webhook from GitHub.
3. Vercel runs `npm install` followed by `npm run build`.
4. If the build succeeds, the new version is deployed to production.
5. If the build fails, the previous production deployment remains active.

### Preview Deployments

Every pull request automatically receives a unique preview URL. This allows you to:

- Review changes before merging to `main`.
- Share preview links with collaborators for feedback.
- Run manual QA on the deployed preview.

Preview URLs follow the pattern: `https://writespace-<hash>-<scope>.vercel.app`

### Branch Protection (Optional)

For additional safety, configure branch protection rules in GitHub:

1. Go to **Settings → Branches** in your GitHub repository.
2. Add a rule for the `main` branch.
3. Enable **Require status checks to pass before merging**.
4. Select the Vercel deployment check to ensure builds pass before merges.

## Verifying the Deployment

After deployment, verify the following:

1. **Landing page** loads at the root URL (`/`).
2. **Client-side routing** works — navigate to `/login`, `/register`, and use the browser back button.
3. **Direct URL access** works — paste `/blogs` or `/admin` directly into the browser address bar (this confirms the SPA rewrites are active).
4. **Default admin login** works — sign in with username `admin` and password `admin`.
5. **Post creation and persistence** works — create a blog post and refresh the page to confirm localStorage persistence.

## Troubleshooting

### 404 on Direct Route Access

If navigating directly to a route like `/blogs` returns a 404:

- Verify that `vercel.json` exists at the project root.
- Confirm it contains the SPA rewrite rule shown above.
- Redeploy after adding or modifying `vercel.json`.

### Build Failures

If the build fails on Vercel:

1. Check the build logs in the Vercel Dashboard under **Deployments → [deployment] → Build Logs**.
2. Run `npm run build` locally to reproduce the error.
3. Ensure all dependencies are listed in `package.json` (not installed globally).
4. Verify Node.js version compatibility — Vercel uses Node.js 18.x by default.

### Blank Page After Deploy

If the deployed site shows a blank page:

- Open the browser developer console and check for JavaScript errors.
- Verify that `index.html` references `/src/main.jsx` with `type="module"`.
- Ensure the Vite build completed without errors.

## Custom Domain (Optional)

To use a custom domain with your Vercel deployment:

1. Go to your project in the Vercel Dashboard.
2. Navigate to **Settings → Domains**.
3. Add your custom domain (e.g., `writespace.example.com`).
4. Update your domain's DNS records as instructed by Vercel.
5. Vercel automatically provisions an SSL certificate for your domain.

## Project Structure Reference

```
writespace/
├── vercel.json          # SPA rewrites configuration
├── package.json         # Dependencies and build scripts
├── vite.config.js       # Vite build configuration
├── index.html           # HTML entry point
├── dist/                # Production build output (git-ignored)
└── src/                 # Application source code
```