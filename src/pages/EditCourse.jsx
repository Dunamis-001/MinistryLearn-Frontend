import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function EditCourse() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const isAdmin = hasRole('Admin')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner',
    campus: '',
    thumbnail_url: '',
    published: false
  })
  const [loading, setLoading] = useState(false)
  const [loadingCourse, setLoadingCourse] = useState(true)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)

  const categories = ['Bible Study', 'Leadership', 'Evangelism', 'Worship', 'Discipleship']
  const campuses = ['Main Campus', 'North Campus', 'South Campus', 'Online']
  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`)
      const course = response.data
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || '',
        difficulty: course.difficulty || 'Beginner',
        campus: course.campus || '',
        thumbnail_url: course.thumbnail_url || '',
        published: course.published || false
      })
    } catch (err) {
      setError('Failed to load course. Please try again.')
      console.error(err)
    } finally {
      setLoadingCourse(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.put(`/courses/${courseId}`, formData)
      if (isAdmin) {
        alert('Course updated successfully! Changes have been automatically approved.')
      } else {
        alert('Course updated successfully! Your changes will be reviewed by an admin before being published.')
      }
      navigate(`/courses/${courseId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (loadingCourse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link to={`/courses/${courseId}`} className="text-primary-600 hover:text-primary-500">
            ← Back to Course
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Course</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {isAdmin 
            ? 'Update course details. Your changes will be automatically approved.'
            : 'Update course details. Your changes will require admin approval before being published.'}
        </p>
      </div>

      {/* Approval Notice */}
      {!isAdmin && (
        <div className="card mb-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">⚠️ Approval Required</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              As an instructor, any changes you make to this course will require admin approval before being published. 
              The course will be marked as pending approval until an admin reviews and approves your changes.
            </p>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {step}
                </div>
                <div className="mt-2 text-xs text-center text-gray-600 dark:text-gray-400">
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Details'}
                  {step === 3 && 'Review'}
                </div>
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Step 1: Basic Information</h2>
              
              <div>
                <label className="form-label">Course Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Introduction to Biblical Studies"
                  required
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.title.length}/200 characters
                </p>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input"
                  rows={5}
                  placeholder="Provide a detailed description of your course..."
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              <div>
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Course Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Step 2: Course Details</h2>
              
              <div>
                <label className="form-label">Difficulty Level *</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Campus Location *</label>
                <select
                  name="campus"
                  value={formData.campus}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select a campus</option>
                  {campuses.map(camp => (
                    <option key={camp} value={camp}>{camp}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Thumbnail URL</label>
                <input
                  type="url"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Optional: URL to course thumbnail image
                </p>
                {formData.thumbnail_url && (
                  <div className="mt-2">
                    <img
                      src={formData.thumbnail_url}
                      alt="Thumbnail preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              {isAdmin && (
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.published}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="form-label mb-0">Publish Course</span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Published courses are visible to all learners
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Step 3: Review & Submit</h2>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Course Title</h3>
                  <p className="text-gray-700 dark:text-gray-300">{formData.title || 'Not provided'}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {formData.description || 'Not provided'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Category</h3>
                    <p className="text-gray-700 dark:text-gray-300">{formData.category || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Difficulty</h3>
                    <p className="text-gray-700 dark:text-gray-300">{formData.difficulty}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Campus</h3>
                    <p className="text-gray-700 dark:text-gray-300">{formData.campus || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Published</h3>
                    <p className="text-gray-700 dark:text-gray-300">{formData.published ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {!isAdmin && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> Your changes will be submitted for admin approval. 
                    The course will remain in its current state until an admin reviews and approves your changes.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Course'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

