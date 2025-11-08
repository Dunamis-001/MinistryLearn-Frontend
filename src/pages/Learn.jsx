import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import QuizGenerator from '../components/QuizGenerator'


export default function Learn() {
  const { courseId } = useParams()
  const { hasRole } = useAuth()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [currentModule, setCurrentModule] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [lessons, setLessons] = useState([])
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
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
      const lessonsData = response.data || []
      setLessons(lessonsData)
      if (lessonsData.length > 0) {
        setCurrentLesson(lessonsData[0])
        setCurrentLessonIndex(0)
      } else {
        setCurrentLesson(null)
        setCurrentLessonIndex(0)
      }
    } catch (error) {
      console.error('Failed to load lessons:', error)
      setLessons([])
      setCurrentLesson(null)
    }
  }

  const goToNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      const nextIndex = currentLessonIndex + 1
      setCurrentLessonIndex(nextIndex)
      setCurrentLesson(lessons[nextIndex])
    }
  }

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevIndex = currentLessonIndex - 1
      setCurrentLessonIndex(prevIndex)
      setCurrentLesson(lessons[prevIndex])
    }
  }

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`
    }
    return null
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
            <div className="space-y-6">
              {/* Lesson Header */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{currentLesson.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Lesson {currentLessonIndex + 1} of {lessons.length} • {currentModule?.title}
                  </p>
                </div>
              </div>

              {/* Video Section */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Video Lesson</h3>
                </div>
                <div className="card-body">
                  {currentLesson.video_url ? (
                    getYouTubeEmbedUrl(currentLesson.video_url) ? (
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          src={getYouTubeEmbedUrl(currentLesson.video_url)}
                          title={currentLesson.title}
                          className="w-full h-96 rounded-lg"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-400">
                          Video URL: <a href={currentLesson.video_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">{currentLesson.video_url}</a>
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                      <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Video Not Available</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
                        This lesson does not have a video. Please refer to the lesson content and study materials below.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Lesson Content */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Lesson Content</h3>
                </div>
                <div className="card-body">
                  {currentLesson.content ? (
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <ReactMarkdown
                        components={{
                          h1: ({...props}) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4" {...props} />,
                          h2: ({...props}) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2" {...props} />,
                          h3: ({...props}) => <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3" {...props} />,
                          h4: ({...props}) => <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2" {...props} />,
                          p: ({...props}) => <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" {...props} />,
                          ul: ({...props}) => <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4" {...props} />,
                          ol: ({...props}) => <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4" {...props} />,
                          li: ({...props}) => <li className="text-gray-700 dark:text-gray-300 mb-1" {...props} />,
                          strong: ({...props}) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
                          em: ({...props}) => <em className="italic text-gray-700 dark:text-gray-300" {...props} />,
                          blockquote: ({...props}) => <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4" {...props} />,
                          code: ({inline, ...props}) => inline ? <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200" {...props} /> : <code className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 my-4 overflow-x-auto" {...props} />,
                        }}
                      >
                        {currentLesson.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No content available for this lesson.</p>
                  )}
                </div>
              </div>

                  {/* AI Quiz Generator - Only for Instructors/Admins */}
                  {(hasRole('Instructor') || hasRole('Admin')) && (
                    <QuizGenerator
                      lessonId={currentLesson.id}
                      lessonContent={currentLesson.content || currentLesson.title}
                      currentAssessmentId={currentLesson.assessment_id}
                      onQuizSaved={(assessmentId) => {
                        // Reload lesson data to show updated assessment
                        loadCourseData()
                      }}
                    />
                  )}

              {/* Study Materials */}
              {currentLesson.study_materials && currentLesson.study_materials.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Study Materials</h3>
                  </div>
                  <div className="card-body">
                    <div className="space-y-3">
                      {currentLesson.study_materials.map((material, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          {material.type === 'pdf' && (
                            <div className="flex items-center space-x-3">
                              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <div className="flex-1">
                                <a href={material.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
                                  {material.title}
                                </a>
                                <p className="text-sm text-gray-500 dark:text-gray-400">PDF Document</p>
                              </div>
                            </div>
                          )}
                          {material.type === 'link' && (
                            <div className="flex items-center space-x-3">
                              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                              <div className="flex-1">
                                <a href={material.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
                                  {material.title}
                                </a>
                                <p className="text-sm text-gray-500 dark:text-gray-400">External Link</p>
                              </div>
                            </div>
                          )}
                          {material.type === 'text' && (
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">{material.title}</h4>
                              <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {material.content}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz/Assessment Link - Only show for Learners */}
              {currentLesson.assessment_id && !hasRole('Admin') && !hasRole('Instructor') && (
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Take Quiz</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Complete the assessment for this lesson</p>
                      </div>
                      <Link
                        to={`/assessments/${currentLesson.assessment_id}`}
                        className="btn-primary"
                      >
                        Start Quiz →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="card">
                <div className="card-body">
                  <div className="flex justify-between">
                    <button
                      onClick={goToPreviousLesson}
                      disabled={currentLessonIndex === 0}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous Lesson
                    </button>
                    <button
                      onClick={goToNextLesson}
                      disabled={currentLessonIndex === lessons.length - 1}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Lesson →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No lessons available</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This module doesn't have any lessons yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
