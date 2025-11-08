import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'


export default function CourseDetail() {
  const { courseId } = useParams()
  const { user, hasRole } = useAuth()
  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)


  useEffect(() => {
    loadCourseData()
  }, [courseId])


  const loadCourseData = async () => {
    try {
      const [courseRes, enrollmentRes, modulesRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        user ? api.get('/enrollments').catch(() => ({ data: { items: [] } })) : Promise.resolve({ data: { items: [] } }),
        api.get(`/courses/${courseId}/modules`).catch(() => ({ data: [] }))
      ])
     
      setCourse(courseRes.data)
      setModules(modulesRes.data || [])
     
      if (user) {
        const userEnrollment = enrollmentRes.data.items?.find(e => e.course_id == courseId)
        setEnrollment(userEnrollment)
      }
    } catch (error) {
      console.error('Failed to load course data:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleEnroll = async () => {
    if (!user) {
      window.location.href = '/login'
      return
    }


    try {
      setEnrolling(true)
      await api.post(`/courses/${courseId}/enroll`)
      await loadCourseData() // Reload to get updated enrollment
    } catch (error) {
      console.error('Enrollment failed:', error)
    } finally {
      setEnrolling(false)
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }


  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
          <Link to="/catalog" className="btn-primary mt-4">Back to Catalog</Link>
        </div>
      </div>
    )
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Course Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link to="/catalog" className="text-primary-600 hover:text-primary-500">
            ← Back to Catalog
          </Link>
          {(hasRole('Admin') || hasRole('Instructor')) && (
            <Link to={`/courses/${courseId}/edit`} className="btn-secondary">
              Edit Course
            </Link>
          )}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{course.description}</p>
           
            <div className="flex flex-wrap gap-4 mb-6">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                course.difficulty === 'Beginner'
                  ? 'bg-green-100 text-green-800'
                  : course.difficulty === 'Intermediate'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {course.difficulty}
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                {course.category}
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
                {course.campus}
              </span>
            </div>
          </div>


          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-body">
                {course.thumbnail_url && (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
               
                {/* Show enrollment options only for Learners */}
                {!hasRole('Admin') && !hasRole('Instructor') ? (
                  enrollment ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Progress</h3>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{enrollment.progress}% Complete</p>
                      </div>
                     
                      <Link
                        to={`/learn/${courseId}`}
                        className="btn-primary w-full text-center"
                      >
                        {enrollment.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ready to start?</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enroll in this course to begin your learning journey.
                      </p>
                      <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="btn-primary w-full"
                      >
                        {enrolling ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {hasRole('Admin') 
                        ? 'As an admin, you can view and edit this course.'
                        : 'As an instructor, you can view and edit this course. Changes require admin approval.'}
                    </p>
                    <Link
                      to={`/learn/${courseId}`}
                      className="btn-primary w-full text-center"
                    >
                      View Course Content
                    </Link>
                    {course.approved === false && (
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          ⚠️ This course is pending approval
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Course Modules and Lessons - Show for Instructors/Admins */}
      {(hasRole('Admin') || hasRole('Instructor')) && modules.length > 0 && (
        <div className="mb-8">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Structure</h2>
            </div>
            <div className="card-body">
              <div className="space-y-6">
                {modules.map((module, moduleIdx) => (
                  <div key={module.id} className="border-l-4 border-primary-500 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Module {moduleIdx + 1}: {module.title}
                    </h3>
                    {module.lessons && module.lessons.length > 0 ? (
                      <ul className="space-y-2 ml-4">
                        {module.lessons.map((lesson, lessonIdx) => (
                          <li key={lesson.id} className="text-gray-700 dark:text-gray-300">
                            <Link
                              to={`/learn/${courseId}`}
                              className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline"
                            >
                              Lesson {lessonIdx + 1}: {lesson.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">No lessons yet</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to={`/learn/${courseId}`}
                  className="btn-primary inline-flex items-center"
                >
                  View All Lessons →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Overview</h2>
            </div>
            <div className="card-body">
              <div className="prose max-w-none">
                <p className="text-gray-700 dark:text-gray-300">
                  {course.description || "This course provides comprehensive training in ministry fundamentals. You'll learn essential concepts, practical applications, and best practices for effective ministry work."}
                </p>
               
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-4">What you'll learn:</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Core ministry principles and values</li>
                  <li>Effective communication strategies</li>
                  <li>Building relationships and community</li>
                  <li>Practical ministry applications</li>
                  <li>Leadership development</li>
                </ul>


                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-4">Course Requirements:</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Basic understanding of ministry concepts</li>
                  <li>Commitment to complete all modules</li>
                  <li>Active participation in discussions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>


        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Course Details</h3>
            </div>
            <div className="card-body">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="text-sm text-gray-900">4-6 weeks</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Effort</dt>
                  <dd className="text-sm text-gray-900">2-3 hours per week</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Language</dt>
                  <dd className="text-sm text-gray-900">English</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Prerequisites</dt>
                  <dd className="text-sm text-gray-900">None</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Certificate</dt>
                  <dd className="text-sm text-gray-900">Yes, upon completion</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
