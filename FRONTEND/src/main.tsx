// src/main.tsx 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "./AuthContext";

// 1. Import the inject function
import { inject } from '@vercel/analytics'; 

// 2. Call the inject function BEFORE rendering the app
// This initializes the analytics tracking globally.
inject(); 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)