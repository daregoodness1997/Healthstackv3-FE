/**
 * Authentication Utilities
 * Centralized authentication helpers for token management and session handling
 */

import client from '../feathers';
import secureStorage, {
  isTokenExpired,
  isTokenExpiringSoon,
} from './secureStorage';
import { clearCsrfToken } from './csrfProtection';

/**
 * Perform complete logout
 * Clears all authentication data and logs user activity
 * @param {Object} user - Current user object
 * @returns {Promise<void>}
 */
export const performLogout = async (user) => {
  try {
    // Log the logout activity
    if (user) {
      const logObj = {
        user: user,
        facility: user.currentEmployee?.facilityDetail,
        type: 'logout',
      };
      await client.service('logins').create(logObj);

      // Update user online status
      const onlineObj = {
        lastLogin: new Date(),
        online: false,
      };
      await client.service('users').patch(user._id, onlineObj);
    }

    // Clear all local storage
    secureStorage.clearAll();

    // Clear CSRF token
    clearCsrfToken();

    // Logout from Feathers
    await client.logout();
  } catch (error) {
    console.error('Error during logout:', error);
    // Force local cleanup even if server call fails
    secureStorage.clearAll();
    clearCsrfToken();
  }
};

/**
 * Check if user session is valid
 * @returns {boolean} True if authenticated with valid token
 */
export const isAuthenticated = () => {
  const token = secureStorage.getToken();
  if (!token) return false;

  return !isTokenExpired(token);
};

/**
 * Refresh access token
 * TODO: Implement when backend supports token refresh endpoint
 * @returns {Promise<boolean>} True if refresh successful
 */
export const refreshAccessToken = async () => {
  try {
    console.log('Token refresh not yet implemented on backend');
    // When backend supports refresh tokens:
    // const response = await client.service('authentication').create({
    //   strategy: 'jwt-refresh',
    //   refreshToken: secureStorage.getRefreshToken(),
    // });
    // secureStorage.setToken(response.accessToken);
    // return true;
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

/**
 * Setup automatic token refresh
 * Checks token expiration and refreshes when needed
 * @returns {Function} Cleanup function to stop the interval
 */
export const setupTokenRefresh = () => {
  const checkInterval = setInterval(async () => {
    const token = secureStorage.getToken();

    if (!token || isTokenExpired(token)) {
      console.log('Token expired, clearing session');
      clearInterval(checkInterval);
      await performLogout(null);
      window.location.href = '/';
      return;
    }

    if (isTokenExpiringSoon(token)) {
      console.log('Token expiring soon, attempting refresh');
      const refreshed = await refreshAccessToken();

      if (!refreshed) {
        console.log('Token refresh failed, user needs to re-login');
        // Don't force logout yet, let token expire naturally
        // This gives user time to save work
      }
    }
  }, 60000); // Check every minute

  return () => clearInterval(checkInterval);
};

/**
 * Force re-authentication check
 * Useful after sensitive operations or coming back from background
 * @returns {Promise<Object|null>} User object or null if invalid
 */
export const revalidateAuth = async () => {
  try {
    const token = secureStorage.getToken();

    if (!token || isTokenExpired(token)) {
      await performLogout(null);
      return null;
    }

    const resp = await client.reAuthenticate();
    const user = {
      ...resp.user,
      currentEmployee: { ...resp.user.employeeData[0] },
    };

    secureStorage.setUser(user);
    return user;
  } catch (error) {
    console.error('Re-authentication failed:', error);
    await performLogout(null);
    return null;
  }
};

/**
 * Login with credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication response with user data
 */
export const login = async (email, password) => {
  const response = await client.authenticate({
    strategy: 'local',
    email,
    password,
  });

  // Store authentication data
  const user = {
    ...response.user,
    currentEmployee: { ...response.user.employeeData[0] },
  };

  secureStorage.setUser(user);

  // TODO: Store CSRF token when backend implements it
  // if (response.csrfToken) {
  //   setCsrfToken(response.csrfToken);
  // }

  return response;
};

export default {
  performLogout,
  isAuthenticated,
  refreshAccessToken,
  setupTokenRefresh,
  revalidateAuth,
  login,
};
