import { describe, it, expect, beforeEach } from 'vitest';
import {
  getPosts,
  savePosts,
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
} from './storage.js';

describe('storage.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns parsed posts array from localStorage', () => {
      const mockPosts = [
        {
          id: 'post-1',
          title: 'Test Post',
          content: 'Test content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-1',
          authorName: 'Test User',
        },
        {
          id: 'post-2',
          title: 'Another Post',
          content: 'More content',
          createdAt: '2024-06-02T00:00:00.000Z',
          authorId: 'admin',
          authorName: 'Admin',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      const posts = getPosts();
      expect(posts).toEqual(mockPosts);
      expect(posts).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');

      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('uses the correct localStorage key "writespace_posts"', () => {
      const mockPosts = [{ id: '1', title: 'T', content: 'C', createdAt: '', authorId: '', authorName: '' }];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));
      localStorage.setItem('other_key', JSON.stringify([{ id: 'wrong' }]));

      const posts = getPosts();
      expect(posts).toEqual(mockPosts);
    });
  });

  describe('savePosts', () => {
    it('saves posts array to localStorage as JSON', () => {
      const mockPosts = [
        {
          id: 'post-1',
          title: 'Test Post',
          content: 'Test content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-1',
          authorName: 'Test User',
        },
      ];

      savePosts(mockPosts);

      const stored = localStorage.getItem('writespace_posts');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual(mockPosts);
    });

    it('overwrites existing posts in localStorage', () => {
      const initialPosts = [{ id: '1', title: 'Old', content: '', createdAt: '', authorId: '', authorName: '' }];
      savePosts(initialPosts);

      const newPosts = [{ id: '2', title: 'New', content: '', createdAt: '', authorId: '', authorName: '' }];
      savePosts(newPosts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(newPosts);
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('2');
    });

    it('saves an empty array correctly', () => {
      savePosts([]);

      const stored = localStorage.getItem('writespace_posts');
      expect(stored).toBe('[]');
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when no users exist in localStorage', () => {
      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('returns parsed users array from localStorage', () => {
      const mockUsers = [
        {
          id: 'user-1',
          displayName: 'John Doe',
          username: 'johndoe',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const users = getUsers();
      expect(users).toEqual(mockUsers);
      expect(users).toHaveLength(1);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_users', 'corrupted data here');

      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('uses the correct localStorage key "writespace_users"', () => {
      const mockUsers = [{ id: 'u1', displayName: 'A', username: 'a', password: 'p', role: 'user', createdAt: '' }];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const users = getUsers();
      expect(users).toEqual(mockUsers);
    });
  });

  describe('saveUsers', () => {
    it('saves users array to localStorage as JSON', () => {
      const mockUsers = [
        {
          id: 'user-1',
          displayName: 'Jane',
          username: 'jane',
          password: 'secret',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];

      saveUsers(mockUsers);

      const stored = localStorage.getItem('writespace_users');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual(mockUsers);
    });

    it('overwrites existing users in localStorage', () => {
      const initialUsers = [{ id: '1', displayName: 'Old', username: 'old', password: 'p', role: 'user', createdAt: '' }];
      saveUsers(initialUsers);

      const newUsers = [
        { id: '2', displayName: 'New', username: 'new', password: 'p', role: 'admin', createdAt: '' },
        { id: '3', displayName: 'Another', username: 'another', password: 'p', role: 'user', createdAt: '' },
      ];
      saveUsers(newUsers);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(newUsers);
      expect(stored).toHaveLength(2);
    });

    it('saves an empty array correctly', () => {
      saveUsers([]);

      const stored = localStorage.getItem('writespace_users');
      expect(stored).toBe('[]');
    });
  });

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns parsed session object from localStorage', () => {
      const mockSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      const session = getSession();
      expect(session).toEqual(mockSession);
    });

    it('returns null when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_session', '{{broken json');

      const session = getSession();
      expect(session).toBeNull();
    });

    it('uses the correct localStorage key "writespace_session"', () => {
      const mockSession = {
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      const session = getSession();
      expect(session).toEqual(mockSession);
      expect(session.userId).toBe('user-1');
    });
  });

  describe('saveSession', () => {
    it('saves session object to localStorage as JSON', () => {
      const mockSession = {
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };

      saveSession(mockSession);

      const stored = localStorage.getItem('writespace_session');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual(mockSession);
    });

    it('overwrites existing session in localStorage', () => {
      const firstSession = {
        userId: 'user-1',
        username: 'first',
        displayName: 'First',
        role: 'user',
      };
      saveSession(firstSession);

      const secondSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      saveSession(secondSession);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(secondSession);
      expect(stored.userId).toBe('admin');
    });
  });

  describe('clearSession', () => {
    it('removes the session from localStorage', () => {
      const mockSession = {
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      clearSession();

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('does not affect other localStorage keys', () => {
      const mockPosts = [{ id: '1', title: 'T', content: 'C', createdAt: '', authorId: '', authorName: '' }];
      const mockUsers = [{ id: 'u1', displayName: 'A', username: 'a', password: 'p', role: 'user', createdAt: '' }];
      const mockSession = { userId: 'u1', username: 'a', displayName: 'A', role: 'user' };

      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      clearSession();

      expect(localStorage.getItem('writespace_session')).toBeNull();
      expect(JSON.parse(localStorage.getItem('writespace_posts'))).toEqual(mockPosts);
      expect(JSON.parse(localStorage.getItem('writespace_users'))).toEqual(mockUsers);
    });
  });

  describe('round-trip serialization', () => {
    it('posts survive a save and retrieve cycle', () => {
      const mockPosts = [
        {
          id: 'post-abc',
          title: 'Round Trip',
          content: 'Content with special chars: <>&"\'',
          createdAt: '2024-12-25T12:00:00.000Z',
          authorId: 'user-xyz',
          authorName: 'Santa',
        },
      ];

      savePosts(mockPosts);
      const retrieved = getPosts();

      expect(retrieved).toEqual(mockPosts);
      expect(retrieved[0].content).toBe('Content with special chars: <>&"\'');
    });

    it('users survive a save and retrieve cycle', () => {
      const mockUsers = [
        {
          id: 'user-round',
          displayName: 'Round Trip User',
          username: 'roundtrip',
          password: 'p@$$w0rd!',
          role: 'admin',
          createdAt: '2024-01-15T08:30:00.000Z',
        },
      ];

      saveUsers(mockUsers);
      const retrieved = getUsers();

      expect(retrieved).toEqual(mockUsers);
      expect(retrieved[0].password).toBe('p@$$w0rd!');
    });

    it('session survives a save and retrieve cycle', () => {
      const mockSession = {
        userId: 'user-sess',
        username: 'sessionuser',
        displayName: 'Session User',
        role: 'user',
      };

      saveSession(mockSession);
      const retrieved = getSession();

      expect(retrieved).toEqual(mockSession);
    });
  });
});