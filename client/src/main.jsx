import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Register service worker + auto-reload when a new build is deployed.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Give the page a moment to render before we allow a SW-driven reload.
    // Without this guard, on mobile (especially when reopening the PWA from
    // the home screen) a waiting SW can activate mid-boot, fire
    // `controllerchange`, and reload the page before first paint — the user
    // perceives this as the app hanging on a blank screen.
    let bootSettled = false;
    setTimeout(() => { bootSettled = true; }, 4000);

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Check for updates every time the tab gains focus or is reopened.
        const checkForUpdate = () => registration.update().catch(() => {});
        window.addEventListener('focus', checkForUpdate);
        // Also poll every 30 minutes for users who keep the PWA open.
        setInterval(checkForUpdate, 30 * 60 * 1000);

        // When a new SW finishes installing while an old one controls the page,
        // tell it to activate immediately.
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage('SKIP_WAITING');
            }
          });
        });
      })
      .catch(() => {});

    // After the new SW takes control, reload once so the user sees the latest build.
    // Skip the reload during initial boot (prevents blank-screen hangs on mobile)
    // and when the tab is hidden (avoids interrupting background playback).
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloaded) return;
      if (!bootSettled) return;
      if (document.visibilityState !== 'visible') return;
      reloaded = true;
      window.location.reload();
    });
  });
}
