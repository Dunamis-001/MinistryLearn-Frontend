import { useState, useEffect } from 'react'
import api from '../services/api'

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      // This endpoint would need to be created in the backend
      // For now, showing placeholder data
      setStats({
        totalUsers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        completionRate: 0
      })
    } catch (error) {
      console.error('Failed to load analytics:', error)
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View platform statistics and insights
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <p className="text-gray-500 dark:text-gray-400">
            Analytics functionality will be available once the backend endpoint is implemented.
            This page will show platform statistics, user engagement metrics, course performance, and more.
          </p>
        </div>
      </div>
    </div>
  )
}

