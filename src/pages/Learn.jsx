import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'


export default function Learn() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [currentModule, setCurrentModule] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    loadCourseData()
  }, [courseId])


  const loadCourseData = async () => {
    try {
      const [courseRes, modulesRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/courses/${courseId}/modules`)
      ])
     
      setCourse(courseRes.data)
      setModules(modulesRes.data)
     
      if (modulesRes.data.length > 0) {
        setCurrentModule(modulesRes.data[0])
        // Load first lesson of first module
        loadModuleLessons(modulesRes.data[0].id)
      }
    } catch (error) {
      console.error('Failed to load course data:', error)
    } finally {
      setLoading(false)
    }
  }


  const loadModuleLessons = async (moduleId) => {
    try {
      const response = await api.get(`/modules/${moduleId}/lessons`)
      if (response.data.length > 0) {
        setCurrentLesson(response.data[0])
      }
    } catch (error) {
      console.error('Failed to load lessons:', error)
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">{course?.title}</h3>
            </div>
            <div className="card-body p-0">
              <nav className="space-y-1">
                {modules.map((module) => (
                  <div key={module.id} className="border-b border-gray-200 last:border-b-0">
                    <button
                      onClick={() => {
                        setCurrentModule(module)
                        loadModuleLessons(module.id)
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium ${
                        currentModule?.id === module.id
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {module.title}
                    </button>
                    {currentModule?.id === module.id && (
                      <div className="bg-gray-50">
                        {/* Module lessons would be listed here */}
                        <div className="px-4 py-2 text-xs text-gray-500">
                          {module.lessons?.length || 0} lessons
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>


        {/* Main Content */}
        <div className="lg:col-span-3">
          {currentLesson ? (
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">{currentLesson.title}</h2>
              </div>
              <div className="card-body">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.content || 'Lesson content will appear here...' }} />
                </div>
               
                <div className="mt-8 flex justify-between">
                  <button className="btn-secondary">
                    Previous Lesson
                  </button>
                  <button className="btn-primary">
                    Next Lesson
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No lessons available</h3>
                <p className="mt-1 text-sm text-gray-500">This module doesn't have any lessons yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
