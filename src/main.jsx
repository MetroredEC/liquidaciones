import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './app/App';
import './index.css';

// Mounts the React application into the #root element.  The
// HashRouter provides client‑side routing capabilities with hash-based
// URLs, which works better with relative base paths for GitHub Pages.
// The App component defines the high level layout and route definitions.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);