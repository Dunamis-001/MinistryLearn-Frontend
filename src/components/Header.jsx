import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { user, logout, hasRole } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-500 dark:from-primary-800 dark:via-accent-700 dark:to-secondary-700 shadow-lg border-b-2 border-primary-400 dark:border-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Logo 
                className="h-[68px] w-[68px] text-white group-hover:scale-110 transition-transform duration-200" 
                useImage={true}
                imageSrc="/logo.png"
              />
              <span className="text-xl font-display font-bold text-white drop-shadow-lg">MinistryLearn</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/catalog" className="text-white/90 hover:text-white hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              Catalog
            </Link>
            {user && (
              <>
                {/* Only show Dashboard for Learners */}
                {!hasRole('Instructor') && !hasRole('Admin') && (
                  <Link to="/dashboard" className="text-white/90 hover:text-white hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                    Dashboard
                  </Link>
                )}
                {hasRole('Instructor') && (
                  <Link to="/instructor" className="text-white/90 hover:text-white hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                    Instructor
                  </Link>
                )}
                {hasRole('Admin') && (
                  <Link to="/admin" className="text-white/90 hover:text-white hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                    Admin
                  </Link>
                )}
                <Link to="/certifications" className="text-white/90 hover:text-white hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Certifications
                </Link>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-white/90 font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  Welcome, {user.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-white hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-primary-600 hover:bg-white/90 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}