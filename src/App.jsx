import { useEffect, useState, lazy } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ConfigProvider } from 'antd';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import gsap from 'gsap';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import MyUserProvider from './context';
import { ObjectContext } from './context';
// import AppRoutes from "./hsmodules/routes";
import { darkTheme, lightTheme } from './ui/styled/theme';
import ActionLoader from './components/action-loader/Action-Loader';
import PopUpComplaintFormComponent from './components/complaint-form/ComplaintForm';
import GlobalComplaintResponse from './components/complaint-form/GlobalComplaintResponse';
import useModuleState from './hooks/useModuleState';
import { queryClient } from './lib/queryClient';
import { setupSocketQuerySync } from './lib/socketQuerySync';

const AppRoutes = lazy(() => import('./hsmodules/routes'));

function App() {
  const {
    state,
    setState,
    showActionLoader,
    hideActionLoader,
    toggleSideMenu,
  } = useModuleState();

  useEffect(() => {
    gsap.to('body', 0, { css: { visibility: 'visible' } });

    // Setup socket-query synchronization
    setupSocketQuerySync();
  }, []);

  const [theme] = useState('light');

  // Ant Design theme configuration
  const antdTheme = {
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 4,
      fontSize: 14,
    },
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={antdTheme}>
          <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <ObjectContext.Provider
                value={{
                  state,
                  setState,
                  showActionLoader,
                  hideActionLoader,
                  toggleSideMenu,
                }}
              >
                <MyUserProvider>
                  <ActionLoader />
                  <PopUpComplaintFormComponent />
                  {state.ComplaintModule.complaintId && (
                    <GlobalComplaintResponse />
                  )}
                  <Router>
                    <AppRoutes />
                  </Router>
                </MyUserProvider>
              </ObjectContext.Provider>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </LocalizationProvider>
          </ThemeProvider>
          {/* React Query DevTools - Only shows in development */}
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </ConfigProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
