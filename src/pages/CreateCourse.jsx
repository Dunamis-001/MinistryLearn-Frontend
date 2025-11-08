import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function CreateCourse() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner',
    campus: '',
    thumbnail_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)

  const categories = ['Ministry', 'Leadership', 'Outreach', 'Bible Study', 'Worship', 'Evangelism']
  const campuses = ['Main Campus', 'North Campus', 'South Campus', 'Online']
  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/courses', formData)
      alert('Course created successfully! It will be reviewed by an admin before being published.')
      navigate(`/courses/${response.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course. Please try again.')
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Course</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Follow the steps below to create your course. All courses require admin approval before being published.
        </p>
      </div>

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

      {/* Course Creation Process Info */}
      <div className="card mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Course Creation Process</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li><strong>Step 1 - Basic Information:</strong> Enter course title, description, and select category</li>
            <li><strong>Step 2 - Course Details:</strong> Set difficulty level, campus location, and upload thumbnail</li>
            <li><strong>Step 3 - Review & Submit:</strong> Review all information and submit for admin approval</li>
            <li><strong>Admin Review:</strong> Your course will be reviewed by an admin before being published</li>
            <li><strong>After Approval:</strong> Once approved, you can add modules, lessons, videos, quizzes, and study materials</li>
          </ol>
        </div>
      </div>

      {/* Supported Formats */}
      <div className="card mb-8 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Supported Content Formats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Videos</h4>
              <p className="text-gray-600 dark:text-gray-400">YouTube, Vimeo URLs, or direct video links</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Quizzes</h4>
              <p className="text-gray-600 dark:text-gray-400">Multiple choice, true/false, and short answer questions</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Study Materials</h4>
              <p className="text-gray-600 dark:text-gray-400">PDFs, documents, links, and text resources</p>
            </div>
          </div>
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
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> After submission, your course will be reviewed by an admin. 
                  Once approved, you can add modules, lessons, videos, quizzes, and study materials.
                </p>
              </div>
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
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

