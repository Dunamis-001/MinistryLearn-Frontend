import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes'
import Header from './components/Header'
import Chatbot from './components/Chatbot'
import './styles/globals.css'

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 text-gray-900 dark:text-gray-100">
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">
            <AppRoutes />
          </main>
          <Chatbot />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App