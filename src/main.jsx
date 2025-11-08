import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

// Initialize dark mode - check system preference first, then localStorage
function initDarkMode() {
  try {
    const storedPreference = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (storedPreference === 'true' || (storedPreference === null && prefersDark)) {
      document.documentElement.classList.add('dark')
      if (document.body) {
        document.body.classList.add('dark')
      }
    } else {
      document.documentElement.classList.remove('dark')
      if (document.body) {
        document.body.classList.remove('dark')
      }
    }
  } catch (e) {
    console.error('Error initializing dark mode:', e)
  }
}

// Initialize immediately to prevent flash
initDarkMode()

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  try {
    if (!localStorage.getItem('darkMode')) {
      if (e.matches) {
        document.documentElement.classList.add('dark')
        if (document.body) {
          document.body.classList.add('dark')
        }
      } else {
        document.documentElement.classList.remove('dark')
        if (document.body) {
          document.body.classList.remove('dark')
        }
      }
    }
  } catch (err) {
    console.error('Error handling dark mode change:', err)
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)