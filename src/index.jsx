import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorBoundary from './ErrorBoundary';
import './index.css';
import App from './App';
import { GlobalStyle } from './ui/styled/global';
import './utils/chartSetup';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <GlobalStyle />
    {/*  <React.StrictMode> */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    {/*    </React.StrictMode> */}
  </>,
);
