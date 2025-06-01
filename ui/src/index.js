import React from 'react';
import ReactDOM from 'react-dom/client'; // Note: import from react-dom/client for React 18
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
