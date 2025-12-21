import secureAxios from './secureHttp';
import secureStorage from './secureStorage';
import { getApiUrl } from './env';

// Export the secure axios instance for general API calls
// This automatically handles token injection and authentication
const api = secureAxios;

// Export the base URL for API calls
export const baseuRL = getApiUrl();

// Export the token getter function
export const getToken = () => secureStorage.getToken();

// Export token - Note: Components should use getToken() for the latest value
// This export is for backward compatibility with existing code
export const token = secureStorage.getToken();

export default api;
