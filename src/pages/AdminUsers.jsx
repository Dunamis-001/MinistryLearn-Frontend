import { useState, useEffect } from 'react'
import api from '../services/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      // This endpoint would need to be created in the backend
      // For now, showing a placeholder
      setUsers([])
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage platform users and their roles
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <p className="text-gray-500 dark:text-gray-400">
            User management functionality will be available once the backend endpoint is implemented.
            This page will allow you to view, edit, and manage user accounts and roles.
          </p>
        </div>
      </div>
    </div>
  )
}

