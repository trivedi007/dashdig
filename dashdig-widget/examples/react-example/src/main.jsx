/**
 * React Application Entry Point
 * 
 * This file initializes the React application and mounts it to the DOM.
 * It imports the main App component and renders it in strict mode for
 * better development warnings and future React features.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// Create root element and render the application
// StrictMode helps identify potential problems in the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

