import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import './i18n';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for offline-first PWA caching
if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('New content available for LearnGap AI, refreshing in background...');
    },
    onOfflineReady() {
      console.log('LearnGap AI is ready to work completely offline.');
    },
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
