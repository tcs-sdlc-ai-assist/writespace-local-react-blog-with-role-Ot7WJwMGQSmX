import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App.jsx';
import { saveSession, clearSession } from './utils/storage.js';

describe('App.jsx routing', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('public routes', () => {
    it('renders the landing page at /', () => {
      window.history.pushState({}, '', '/');
      render(<App />);

      expect(screen.getByText('✍️ WriteSpace')).toBeInTheDocument();
      expect(screen.getByText(/A modern blogging platform/i)).toBeInTheDocument();
    });

    it('renders the login page at /login', () => {
      window.history.pushState({}, '', '/login');
      render(<App />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your WriteSpace account')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders the register page at /register', () => {
      window.history.pushState({}, '', '/register');
      render(<App />);

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText('Join WriteSpace and start writing today')).toBeInTheDocument();
      expect(screen.getByLabelText('Display Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });
  });

  describe('protected routes redirect unauthenticated users to /login', () => {
    it('redirects /blogs to /login when not authenticated', () => {
      window.history.pushState({}, '', '/blogs');
      render(<App />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your WriteSpace account')).toBeInTheDocument();
    });

    it('redirects /write to /login when not authenticated', () => {
      window.history.pushState({}, '', '/write');
      render(<App />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('redirects /edit/:id to /login when not authenticated', () => {
      window.history.pushState({}, '', '/edit/some-id');
      render(<App />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('redirects /blog/:id to /login when not authenticated', () => {
      window.history.pushState({}, '', '/blog/some-id');
      render(<App />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
  });

  describe('admin-only routes redirect non-admin users to /blogs', () => {
    it('redirects /admin to /blogs for regular users', () => {
      saveSession({
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      window.history.pushState({}, '', '/admin');
      render(<App />);

      expect(screen.getByText('All Blogs')).toBeInTheDocument();
    });

    it('redirects /admin/users to /blogs for regular users', () => {
      saveSession({
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      window.history.pushState({}, '', '/admin/users');
      render(<App />);

      expect(screen.getByText('All Blogs')).toBeInTheDocument();
    });

    it('redirects /admin to /login for unauthenticated users', () => {
      window.history.pushState({}, '', '/admin');
      render(<App />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('redirects /admin/users to /login for unauthenticated users', () => {
      window.history.pushState({}, '', '/admin/users');
      render(<App />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
  });

  describe('authenticated user access', () => {
    it('renders /blogs page for authenticated regular user', () => {
      saveSession({
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      window.history.pushState({}, '', '/blogs');
      render(<App />);

      expect(screen.getByText('All Blogs')).toBeInTheDocument();
      expect(screen.getByText('✍️ Write Post')).toBeInTheDocument();
    });

    it('renders /write page for authenticated regular user', () => {
      saveSession({
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      window.history.pushState({}, '', '/write');
      render(<App />);

      expect(screen.getByText('Write a New Post')).toBeInTheDocument();
    });

    it('renders /admin page for authenticated admin user', () => {
      saveSession({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      window.history.pushState({}, '', '/admin');
      render(<App />);

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Overview of your WriteSpace platform.')).toBeInTheDocument();
    });

    it('renders /admin/users page for authenticated admin user', () => {
      saveSession({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      window.history.pushState({}, '', '/admin/users');
      render(<App />);

      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Create New User')).toBeInTheDocument();
    });

    it('shows user display name in navbar for authenticated user', () => {
      saveSession({
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      window.history.pushState({}, '', '/blogs');
      render(<App />);

      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('shows admin display name in navbar for authenticated admin', () => {
      saveSession({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      window.history.pushState({}, '', '/blogs');
      render(<App />);

      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('shows Users link in navbar for admin users', () => {
      saveSession({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      window.history.pushState({}, '', '/blogs');
      render(<App />);

      const usersLinks = screen.getAllByText('Users');
      expect(usersLinks.length).toBeGreaterThan(0);
    });

    it('does not show Users link in navbar for regular users', () => {
      saveSession({
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      window.history.pushState({}, '', '/blogs');
      render(<App />);

      expect(screen.queryByText('Users')).not.toBeInTheDocument();
    });
  });

  describe('catch-all route', () => {
    it('redirects unknown routes to / (landing page)', () => {
      window.history.pushState({}, '', '/some/unknown/route');
      render(<App />);

      expect(screen.getByText(/A modern blogging platform/i)).toBeInTheDocument();
    });
  });
});