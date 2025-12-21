// Secure storage abstraction layer for sensitive data
// This provides a centralized way to manage tokens and user data
// Future: Can be easily migrated to httpOnly cookies when backend supports it

const STORAGE_KEYS = {
  JWT_TOKEN: 'feathers-jwt',
  USER_DATA: 'user',
};

/**
 * Secure storage utility for authentication tokens
 * Currently uses localStorage but abstracted for easy migration to httpOnly cookies
 */
export const secureStorage = {
  /**
   * Get JWT token from storage
   * @returns {string|null} JWT token or null if not found
   */
  getToken: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
    } catch (error) {
      console.error('Error reading token from storage:', error);
      return null;
    }
  },

  /**
   * Set JWT token in storage
   * Note: In production, tokens should be set by backend via httpOnly cookies
   * @param {string} token - JWT token to store
   */
  setToken: (token) => {
    try {
      if (!token) {
        console.warn('Attempted to store empty token');
        return;
      }
      localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  },

  /**
   * Remove JWT token from storage
   */
  removeToken: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  /**
   * Get user data from storage
   * @returns {Object|null} User object or null if not found
   */
  getUser: () => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error reading user data from storage:', error);
      return null;
    }
  },

  /**
   * Set user data in storage
   * @param {Object} user - User object to store
   */
  setUser: (user) => {
    try {
      if (!user) {
        console.warn('Attempted to store empty user data');
        return;
      }
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  },

  /**
   * Remove user data from storage
   */
  removeUser: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  },

  /**
   * Clear all authentication data (logout)
   */
  clearAll: () => {
    try {
      secureStorage.removeToken();
      secureStorage.removeUser();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  /**
   * Check if user is authenticated (has valid token)
   * @returns {boolean} True if token exists
   */
  isAuthenticated: () => {
    const token = secureStorage.getToken();
    return !!token;
  },
};

/**
 * Decode JWT token to check expiration (without verification)
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export const decodeJWT = (token) => {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Check if token is about to expire (within 5 minutes)
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token expires soon
 */
export const isTokenExpiringSoon = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  const fiveMinutes = 5 * 60;
  return decoded.exp - currentTime < fiveMinutes;
};

export default secureStorage;
