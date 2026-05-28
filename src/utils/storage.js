const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';
const SESSION_KEY = 'writespace_session';

/**
 * Retrieve all posts from localStorage.
 * @returns {Array<{id: string, title: string, content: string, createdAt: string, authorId: string, authorName: string}>}
 */
export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    return [];
  }
}

/**
 * Save posts array to localStorage.
 * @param {Array<{id: string, title: string, content: string, createdAt: string, authorId: string, authorName: string}>} posts
 */
export function savePosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    // silently fail
  }
}

/**
 * Retrieve all users from localStorage.
 * @returns {Array<{id: string, displayName: string, username: string, password: string, role: string, createdAt: string}>}
 */
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    return [];
  }
}

/**
 * Save users array to localStorage.
 * @param {Array<{id: string, displayName: string, username: string, password: string, role: string, createdAt: string}>} users
 */
export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    // silently fail
  }
}

/**
 * Retrieve the current session from localStorage.
 * @returns {{userId: string, username: string, displayName: string, role: string} | null}
 */
export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Save session object to localStorage.
 * @param {{userId: string, username: string, displayName: string, role: string}} session
 */
export function saveSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    // silently fail
  }
}

/**
 * Clear the current session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    // silently fail
  }
}