import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function CreateAnnouncement() {
  const { user, hasRole } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    audience: hasRole('Admin') ? 'all' : 'course',
    course_id: '',
    role_name: ''
  })
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isAdmin = hasRole('Admin')

  useEffect(() => {
    if (!isAdmin) {
      loadCourses()
    }
  }, [isAdmin])

  const loadCourses = async () => {
    try {
      const response = await api.get('/instructor/courses')
      setCourses(response.data.items || [])
    } catch (error) {
      console.error('Failed to load courses:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/announcements', {
        ...formData,
        course_id: formData.audience === 'course' ? parseInt(formData.course_id) : null,
        role_name: formData.audience === 'role' ? formData.role_name : null
      })
      alert('Announcement created successfully!')
      navigate(isAdmin ? '/admin' : '/instructor')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create announcement. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Announcement</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {isAdmin 
            ? 'Send a platform-wide announcement to all users'
            : 'Send an announcement to your course students'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body space-y-6">
          <div>
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Announcement title"
              required
            />
          </div>

          <div>
            <label className="form-label">Message *</label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              className="form-input"
              rows={8}
              placeholder="Enter your announcement message..."
              required
            />
          </div>

          {isAdmin && (
            <div>
              <label className="form-label">Audience *</label>
              <select
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="all">All Users</option>
                <option value="role">Specific Role</option>
                <option value="course">Specific Course</option>
              </select>
            </div>
          )}

          {formData.audience === 'course' && (
            <div>
              <label className="form-label">Course *</label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
          )}

          {formData.audience === 'role' && (
            <div>
              <label className="form-label">Role *</label>
              <select
                name="role_name"
                value={formData.role_name}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select a role</option>
                <option value="Learner">Learners</option>
                <option value="Instructor">Instructors</option>
                <option value="Admin">Admins</option>
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Announcement'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
