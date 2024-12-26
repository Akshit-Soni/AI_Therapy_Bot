import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Initialize Firebase and render app
let hasInitialized = false;

function renderApp() {
  if (hasInitialized) return;
  hasInitialized = true;

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Wait for Firebase Auth to initialize
onAuthStateChanged(auth, () => {
  renderApp();
}, (error) => {
  console.error('Firebase Auth initialization error:', error);
  renderApp(); // Render app even if auth fails
});

// Fallback render in case auth takes too long
setTimeout(renderApp, 1000);


