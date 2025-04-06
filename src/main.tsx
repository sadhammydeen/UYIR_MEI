import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { initializePageEffects } from './lib/page-effects'

// Initialize 3D effects for all pages
initializePageEffects();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
