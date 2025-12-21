/**
 * Secure HTTP Client
 *
 * SECURITY: This replaces direct axios usage with Bearer tokens from localStorage.
 * All authenticated requests should go through Feathers client instead of axios.
 *
 * This utility is for:
 * 1. File uploads that can't use Feathers
 * 2. External API calls (non-backend)
 * 3. Migration path from axios to Feathers
 */

import axios from 'axios';
import secureStorage from './secureStorage';
import { getApiUrl } from './env';

/**
 * Create axios instance with automatic token injection
 * DEPRECATED: Use Feathers client for backend calls instead
 */
const createSecureAxiosInstance = () => {
  const instance = axios.create({
    baseURL: getApiUrl(),
    timeout: 30000,
  });

  // Request interceptor - automatically add token
  instance.interceptors.request.use(
    (config) => {
      const token = secureStorage.getToken();

      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor - handle token expiration
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        console.error('Authentication failed - token may be expired');
        // Clear storage and redirect to login
        secureStorage.clearAll();
        window.location.href = '/';
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

/**
 * Singleton instance
 */
const secureAxios = createSecureAxiosInstance();

/**
 * Get authorization headers for fetch/axios
 * @deprecated Use Feathers client instead
 * @returns {Object} Headers with Authorization
 */
export const getAuthHeaders = () => {
  const token = secureStorage.getToken();

  if (!token) {
    console.warn('No authentication token available');
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Make authenticated POST request with multipart/form-data
 * Use this for file uploads
 * @param {string} url - Upload URL
 * @param {FormData} formData - Form data with files
 * @returns {Promise} Axios response
 */
export const uploadFile = async (url, formData) => {
  const token = secureStorage.getToken();

  if (!token) {
    throw new Error('Not authenticated - no token available');
  }

  return axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Make authenticated GET request
 * @deprecated Use Feathers client service.find() instead
 */
export const authenticatedGet = (url, config = {}) => {
  console.warn('DEPRECATED: Use Feathers client instead of authenticatedGet');
  return secureAxios.get(url, config);
};

/**
 * Make authenticated POST request
 * @deprecated Use Feathers client service.create() instead
 */
export const authenticatedPost = (url, data, config = {}) => {
  console.warn('DEPRECATED: Use Feathers client instead of authenticatedPost');
  return secureAxios.post(url, data, config);
};

/**
 * Make authenticated PUT request
 * @deprecated Use Feathers client service.update() instead
 */
export const authenticatedPut = (url, data, config = {}) => {
  console.warn('DEPRECATED: Use Feathers client instead of authenticatedPut');
  return secureAxios.put(url, data, config);
};

/**
 * Make authenticated PATCH request
 * @deprecated Use Feathers client service.patch() instead
 */
export const authenticatedPatch = (url, data, config = {}) => {
  console.warn('DEPRECATED: Use Feathers client instead of authenticatedPatch');
  return secureAxios.patch(url, data, config);
};

/**
 * Make authenticated DELETE request
 * @deprecated Use Feathers client service.remove() instead
 */
export const authenticatedDelete = (url, config = {}) => {
  console.warn(
    'DEPRECATED: Use Feathers client instead of authenticatedDelete',
  );
  return secureAxios.delete(url, config);
};

export default secureAxios;
