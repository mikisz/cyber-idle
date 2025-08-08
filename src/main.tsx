import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Register the service worker without using the Vite PWA helper
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
