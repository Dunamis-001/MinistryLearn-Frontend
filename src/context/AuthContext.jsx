import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

  async function login(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('access', res.data.access_token)
      localStorage.setItem('refresh', res.data.refresh_token)
      setRoles(res.data.roles || [])
      await loadProfile()
      return res.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  async function register({ email, username, password }) {
    try {
      await api.post('/auth/register', { email, username, password })
      return await login(email, password)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  async function loadProfile() {
    const token = localStorage.getItem('access')
    if (!token) {
      setUser(null)
      setRoles([])
      return
    }

    try {
      const res = await api.get('/auth/profile')
      setUser(res.data)
      setRoles(res.data.roles || [])
    } catch (error) {
      // If unauthorized, clear tokens and stop retrying
      if (error.response?.status === 401) {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
      }
      setUser(null)
      setRoles([])
    }
  }

  function logout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
    setRoles([])
    window.location.href = '/login'
  }

  function hasRole(role) {
    return roles.includes(role)
  }

  function hasAnyRole(roleList) {
    return roleList.some(role => roles.includes(role))
  }

  useEffect(() => {
    loadProfile().finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      roles, 
      loading,
      login, 
      register, 
      logout, 
      loadProfile,
      hasRole,
      hasAnyRole
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}