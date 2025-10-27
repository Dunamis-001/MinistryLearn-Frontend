import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes'
import Header from './components/Header'
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Header />
          <main>
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App