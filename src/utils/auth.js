import { getUsers, saveUsers, getSession, saveSession, clearSession } from './storage.js';

/**
 * Attempt to log in with the given credentials.
 * Checks hard-coded admin account first, then localStorage users.
 * @param {string} username
 * @param {string} password
 * @returns {{userId: string, username: string, displayName: string, role: string} | null} session object or null on failure
 */
export function login(username, password) {
  try {
    if (!username || !password) {
      return null;
    }

    // Hard-coded admin account
    if (username === 'admin' && password === 'admin') {
      const session = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      saveSession(session);
      return session;
    }

    // Check localStorage users
    const users = getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return null;
    }

    const session = {
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    };
    saveSession(session);
    return session;
  } catch (e) {
    return null;
  }
}

/**
 * Log out the current user by clearing the session.
 */
export function logout() {
  clearSession();
}

/**
 * Register a new user with the given details.
 * Validates that all fields are provided, username is unique, and username is not 'admin'.
 * @param {string} displayName
 * @param {string} username
 * @param {string} password
 * @returns {{userId: string, username: string, displayName: string, role: string} | null} session object or null on failure
 */
export function register(displayName, username, password) {
  try {
    if (!displayName || !username || !password) {
      return null;
    }

    if (username === 'admin') {
      return null;
    }

    const users = getUsers();
    const existing = users.find((u) => u.username === username);

    if (existing) {
      return null;
    }

    const newUser = {
      id: generateId(),
      displayName,
      username,
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const session = {
      userId: newUser.id,
      username: newUser.username,
      displayName: newUser.displayName,
      role: newUser.role,
    };
    saveSession(session);
    return session;
  } catch (e) {
    return null;
  }
}

/**
 * Check if a user is currently authenticated.
 * @returns {boolean}
 */
export function isAuthenticated() {
  const session = getSession();
  return session !== null;
}

/**
 * Get the current user's session data.
 * @returns {{userId: string, username: string, displayName: string, role: string} | null}
 */
export function getCurrentUser() {
  return getSession();
}

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