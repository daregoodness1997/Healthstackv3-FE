import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';

import { GetUserLocation } from '../components/hooks/getUserLocation';

import { UserContext, ObjectContext } from '../context';
import Dashboard from './Dashboard/Dashboard';
import { isAuthenticated } from '../utils/authUtils';

const PrivateOutlet = () => {
  const objectContext = useContext(ObjectContext) as any;
  const userContext = useContext(UserContext) as any;

  // Ensure contexts are available
  if (!objectContext || !userContext) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const { state, setState } = objectContext;
  const { user, authenticatingUser } = userContext;

  const { longitude, latitude } = GetUserLocation();

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      coordinates: {
        latitude,
        longitude,
      },
    }));
  }, [longitude, latitude, setState]);

  // Show loading spinner while checking authentication
  if (authenticatingUser) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Spin size="large" />
        <div style={{ color: '#8c8c8c' }}>Authenticating...</div>
      </div>
    );
  }

  // Enhanced security check: Verify both user context and token validity
  const isAuthorized = user && isAuthenticated();

  return isAuthorized ? <Dashboard /> : <Navigate to="/" />;
};

export default PrivateOutlet;
