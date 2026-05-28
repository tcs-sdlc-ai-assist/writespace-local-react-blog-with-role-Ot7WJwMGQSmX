import { describe, it, expect, beforeEach } from 'vitest';
import {
  login,
  logout,
  register,
  isAuthenticated,
  getCurrentUser,
} from './auth.js';
import {
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
} from './storage.js';

describe('auth.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('login', () => {
    it('logs in with hard-coded admin credentials and returns admin session', () => {
      const session = login('admin', 'admin');

      expect(session).not.toBeNull();
      expect(session.userId).toBe('admin');
      expect(session.username).toBe('admin');
      expect(session.displayName).toBe('Admin');
      expect(session.role).toBe('admin');
    });

    it('saves session to localStorage on successful admin login', () => {
      login('admin', 'admin');

      const stored = getSession();
      expect(stored).not.toBeNull();
      expect(stored.userId).toBe('admin');
      expect(stored.role).toBe('admin');
    });

    it('logs in with a registered user from localStorage', () => {
      const mockUsers = [
        {
          id: 'user-1',
          displayName: 'John Doe',
          username: 'johndoe',
          password: 'secret123',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      saveUsers(mockUsers);

      const session = login('johndoe', 'secret123');

      expect(session).not.toBeNull();
      expect(session.userId).toBe('user-1');
      expect(session.username).toBe('johndoe');
      expect(session.displayName).toBe('John Doe');
      expect(session.role).toBe('user');
    });

    it('saves session to localStorage on successful user login', () => {
      const mockUsers = [
        {
          id: 'user-2',
          displayName: 'Jane',
          username: 'jane',
          password: 'pass',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      saveUsers(mockUsers);

      login('jane', 'pass');

      const stored = getSession();
      expect(stored).not.toBeNull();
      expect(stored.userId).toBe('user-2');
      expect(stored.username).toBe('jane');
    });

    it('returns null for invalid username', () => {
      const session = login('nonexistent', 'password');

      expect(session).toBeNull();
    });

    it('returns null for invalid password with valid username', () => {
      const mockUsers = [
        {
          id: 'user-1',
          displayName: 'John',
          username: 'johndoe',
          password: 'correct',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      saveUsers(mockUsers);

      const session = login('johndoe', 'wrong');

      expect(session).toBeNull();
    });

    it('returns null for wrong admin password', () => {
      const session = login('admin', 'wrongpassword');

      expect(session).toBeNull();
    });

    it('returns null when username is empty', () => {
      const session = login('', 'password');

      expect(session).toBeNull();
    });

    it('returns null when password is empty', () => {
      const session = login('admin', '');

      expect(session).toBeNull();
    });

    it('returns null when both username and password are empty', () => {
      const session = login('', '');

      expect(session).toBeNull();
    });

    it('does not save session on failed login', () => {
      login('invalid', 'invalid');

      const stored = getSession();
      expect(stored).toBeNull();
    });

    it('logs in with a registered admin user from localStorage', () => {
      const mockUsers = [
        {
          id: 'admin-2',
          displayName: 'Second Admin',
          username: 'admin2',
          password: 'adminpass',
          role: 'admin',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      saveUsers(mockUsers);

      const session = login('admin2', 'adminpass');

      expect(session).not.toBeNull();
      expect(session.userId).toBe('admin-2');
      expect(session.role).toBe('admin');
    });
  });

  describe('logout', () => {
    it('clears the session from localStorage', () => {
      login('admin', 'admin');
      expect(getSession()).not.toBeNull();

      logout();

      expect(getSession()).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => logout()).not.toThrow();
    });

    it('does not affect users or posts in localStorage', () => {
      const mockUsers = [
        {
          id: 'user-1',
          displayName: 'John',
          username: 'john',
          password: 'pass',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      saveUsers(mockUsers);
      login('admin', 'admin');

      logout();

      const users = getUsers();
      expect(users).toEqual(mockUsers);
      expect(getSession()).toBeNull();
    });
  });

  describe('register', () => {
    it('registers a new user with unique username and returns session', () => {
      const session = register('New User', 'newuser', 'password123');

      expect(session).not.toBeNull();
      expect(session.username).toBe('newuser');
      expect(session.displayName).toBe('New User');
      expect(session.role).toBe('user');
      expect(session.userId).toBeDefined();
    });

    it('saves the new user to localStorage', () => {
      register('New User', 'newuser', 'password123');

      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe('newuser');
      expect(users[0].displayName).toBe('New User');
      expect(users[0].password).toBe('password123');
      expect(users[0].role).toBe('user');
      expect(users[0].createdAt).toBeDefined();
    });

    it('saves session to localStorage on successful registration', () => {
      register('New User', 'newuser', 'password123');

      const stored = getSession();
      expect(stored).not.toBeNull();
      expect(stored.username).toBe('newuser');
      expect(stored.displayName).toBe('New User');
      expect(stored.role).toBe('user');
    });

    it('returns null when registering with duplicate username', () => {
      register('First User', 'duplicate', 'pass1');

      const session = register('Second User', 'duplicate', 'pass2');

      expect(session).toBeNull();
    });

    it('does not add duplicate user to localStorage', () => {
      register('First User', 'duplicate', 'pass1');
      register('Second User', 'duplicate', 'pass2');

      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].displayName).toBe('First User');
    });

    it('returns null when registering with reserved username "admin"', () => {
      const session = register('Fake Admin', 'admin', 'password');

      expect(session).toBeNull();
    });

    it('does not save user with reserved username "admin" to localStorage', () => {
      register('Fake Admin', 'admin', 'password');

      const users = getUsers();
      expect(users).toHaveLength(0);
    });

    it('returns null when displayName is empty', () => {
      const session = register('', 'username', 'password');

      expect(session).toBeNull();
    });

    it('returns null when username is empty', () => {
      const session = register('Display Name', '', 'password');

      expect(session).toBeNull();
    });

    it('returns null when password is empty', () => {
      const session = register('Display Name', 'username', '');

      expect(session).toBeNull();
    });

    it('appends new user to existing users in localStorage', () => {
      const existingUsers = [
        {
          id: 'existing-1',
          displayName: 'Existing',
          username: 'existing',
          password: 'pass',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      saveUsers(existingUsers);

      register('New User', 'newuser', 'password');

      const users = getUsers();
      expect(users).toHaveLength(2);
      expect(users[0].username).toBe('existing');
      expect(users[1].username).toBe('newuser');
    });

    it('always registers new users with role "user"', () => {
      const session = register('Some User', 'someuser', 'pass');

      expect(session.role).toBe('user');

      const users = getUsers();
      expect(users[0].role).toBe('user');
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when no session exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true after successful login', () => {
      login('admin', 'admin');

      expect(isAuthenticated()).toBe(true);
    });

    it('returns true after successful registration', () => {
      register('New User', 'newuser', 'password');

      expect(isAuthenticated()).toBe(true);
    });

    it('returns false after logout', () => {
      login('admin', 'admin');
      expect(isAuthenticated()).toBe(true);

      logout();

      expect(isAuthenticated()).toBe(false);
    });

    it('returns true when session is manually set in localStorage', () => {
      saveSession({
        userId: 'manual',
        username: 'manual',
        displayName: 'Manual',
        role: 'user',
      });

      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('getCurrentUser', () => {
    it('returns null when no session exists', () => {
      expect(getCurrentUser()).toBeNull();
    });

    it('returns session data after admin login', () => {
      login('admin', 'admin');

      const user = getCurrentUser();
      expect(user).not.toBeNull();
      expect(user.userId).toBe('admin');
      expect(user.username).toBe('admin');
      expect(user.displayName).toBe('Admin');
      expect(user.role).toBe('admin');
    });

    it('returns session data after user registration', () => {
      register('Test User', 'testuser', 'pass');

      const user = getCurrentUser();
      expect(user).not.toBeNull();
      expect(user.username).toBe('testuser');
      expect(user.displayName).toBe('Test User');
      expect(user.role).toBe('user');
    });

    it('returns session data after regular user login', () => {
      const mockUsers = [
        {
          id: 'user-abc',
          displayName: 'Alice',
          username: 'alice',
          password: 'alicepass',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      saveUsers(mockUsers);

      login('alice', 'alicepass');

      const user = getCurrentUser();
      expect(user).not.toBeNull();
      expect(user.userId).toBe('user-abc');
      expect(user.displayName).toBe('Alice');
    });

    it('returns null after logout', () => {
      login('admin', 'admin');
      expect(getCurrentUser()).not.toBeNull();

      logout();

      expect(getCurrentUser()).toBeNull();
    });

    it('returns the most recent session after multiple logins', () => {
      const mockUsers = [
        {
          id: 'user-1',
          displayName: 'User One',
          username: 'user1',
          password: 'pass1',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      saveUsers(mockUsers);

      login('admin', 'admin');
      login('user1', 'pass1');

      const user = getCurrentUser();
      expect(user.userId).toBe('user-1');
      expect(user.username).toBe('user1');
    });
  });
});