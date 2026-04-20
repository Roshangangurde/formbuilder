import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/errorboundary/ErrorBoundary.jsx'

if (import.meta.env.PROD && !import.meta.env.VITE_BASE_URL) {
  throw new Error('VITE_BASE_URL is not set. Set it in your Vercel environment variables.')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
