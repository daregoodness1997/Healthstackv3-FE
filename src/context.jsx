import { createContext, useEffect, useState } from 'react';
//import {useNavigate} from "react-router-dom";
import client from './feathers';
import secureStorage, {
  isTokenExpired,
  isTokenExpiringSoon,
} from './utils/secureStorage';

export default function MyUserProvider({ children }) {
  //const [data, setData] = useState(null)
  const [user, setUser] = useState(null);
  const [authenticatingUser, setAuthenticatingUser] = useState(true);

  //const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Check if token exists and is valid
        const token = secureStorage.getToken();

        if (!token) {
          console.log('No token found, user needs to login');
          setAuthenticatingUser(false);
          return;
        }

        // Check if token is expired
        if (isTokenExpired(token)) {
          console.log('Token expired, clearing storage');
          secureStorage.clearAll();
          setAuthenticatingUser(false);
          return;
        }

        // Try to get user from localStorage first for instant loading
        const storedUser = secureStorage.getUser();
        if (storedUser) {
          console.log('Restored user from localStorage');
          setUser(storedUser);
        }

        // Attempt to re-authenticate with the backend
        try {
          const resp = await client.reAuthenticate();
          console.log('Successfully re-authenticated with backend');

          const authenticatedUser = {
            ...resp.user,
            currentEmployee: { ...resp.user.employeeData[0] },
          };

          // Update stored user data with fresh data from backend
          secureStorage.setUser(authenticatedUser);
          setUser(authenticatedUser);
        } catch (reAuthError) {
          console.error('Re-authentication failed:', reAuthError);

          // If we have stored user data and token is still valid, continue with stored data
          if (storedUser && !isTokenExpired(token)) {
            console.log('Using stored user data as fallback');
            // User is already set from localStorage above
          } else {
            // Token or stored data is invalid, clear everything
            console.log('Clearing invalid session');
            secureStorage.clearAll();
            setUser(null);
          }
        }

        // Set up token expiration check interval
        const checkInterval = setInterval(() => {
          const currentToken = secureStorage.getToken();
          if (!currentToken || isTokenExpired(currentToken)) {
            console.log('Token expired during session, logging out');
            clearInterval(checkInterval);
            secureStorage.clearAll();
            setUser(null);
            window.location.href = '/';
          } else if (isTokenExpiringSoon(currentToken)) {
            console.log('Token expiring soon, should refresh');
            // TODO: Implement token refresh when backend supports it
            // refreshAccessToken();
          }
        }, 60000); // Check every minute

        setAuthenticatingUser(false);

        // Cleanup interval on unmount
        return () => clearInterval(checkInterval);
      } catch (error) {
        console.error('Authentication error:', error);
        secureStorage.clearAll();
        setUser(null);
        setAuthenticatingUser(false);
      }
    })();
  }, []);

  const { Provider } = UserContext;

  return (
    <Provider value={{ user, setUser, authenticatingUser }}>
      {children}
    </Provider>
  );
}

// Create contexts with default values to prevent undefined errors
export const UserContext = createContext({
  user: null,
  setUser: () => {},
  authenticatingUser: true,
});

export const ObjectContext = createContext({
  state: {
    actionLoader: { open: false, message: '' },
    ComplaintModule: { complaintId: null },
    ClientModule: {},
    coordinates: { latitude: null, longitude: null },
  },
  setState: () => {},
  showActionLoader: () => {},
  hideActionLoader: () => {},
  toggleSideMenu: () => {},
});

export const MessageContext = createContext({});
