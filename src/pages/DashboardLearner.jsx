import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Joyride from 'react-joyride'

export default function DashboardLearner() {
  const { user, hasRole } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [certifications, setCertifications] = useState([])
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [upcomingAssessments, setUpcomingAssessments] = useState([])
  const [bookmarkedCourses, setBookmarkedCourses] = useState([])
  const [achievements, setAchievements] = useState([])
  const [learningStreak, setLearningStreak] = useState(0)
  const [weeklyStats, setWeeklyStats] = useState({
    hoursStudied: 0,
    lessonsCompleted: 0,
    achievementsEarned: 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [runTour, setRunTour] = useState(false)

  useEffect(() => {
    loadDashboardData()
    checkTourStatus()
  }, [])

  const checkTourStatus = () => {
    const hasSeenTour = localStorage.getItem('learnerDashboardTour')
    if (!hasSeenTour) {
      setTimeout(() => setRunTour(true), 500)
    }
  }

  const loadDashboardData = async () => {
    try {
      const [enrollmentsRes, certificationsRes, coursesRes, announcementsRes] = await Promise.all([
        api.get('/enrollments'),
        api.get('/certifications'),
        api.get('/courses'),
        api.get('/announcements?audience=all')
      ])
      
      const enrollmentsData = enrollmentsRes.data.items || []
      const coursesData = coursesRes.data.items || []
      
      setEnrollments(enrollmentsData)
      setCertifications(certificationsRes.data || [])
      setAnnouncements(announcementsRes.data.items || [])
      
      // Get AI-powered recommended courses - Only for learners
      if (!hasRole('Instructor') && !hasRole('Admin')) {
        try {
          const recommendationsRes = await api.get('/ai/recommendations')
          const aiRecommended = recommendationsRes.data.recommendations || []
          if (aiRecommended.length > 0) {
            setRecommendedCourses(aiRecommended.slice(0, 6))
          } else {
            // Fallback to simple recommendations
            const enrolledIds = new Set(enrollmentsData.map(e => e.course_id))
            const recommended = coursesData.filter(c => !enrolledIds.has(c.id)).slice(0, 3)
            setRecommendedCourses(recommended)
          }
        } catch (err) {
          // Silently handle errors - don't show recommendations if API fails
          if (err.response?.status !== 403) {
            console.log('AI recommendations not available, using fallback')
            // Fallback to simple recommendations
            const enrolledIds = new Set(enrollmentsData.map(e => e.course_id))
            const recommended = coursesData.filter(c => !enrolledIds.has(c.id)).slice(0, 3)
            setRecommendedCourses(recommended)
          }
        }
      }
      
      // Calculate learning streak (mock for now)
      const streak = calculateLearningStreak(enrollmentsData)
      setLearningStreak(streak)
      
      // Get upcoming assessments (mock for now)
      setUpcomingAssessments(getUpcomingAssessments(enrollmentsData))
      
      // Get achievements (mock for now) - pass streak
      const achievementsData = getAchievements(enrollmentsData, certificationsRes.data || [], streak)
      setAchievements(achievementsData)
      
      // Calculate weekly stats (mock for now)
      setWeeklyStats(calculateWeeklyStats(enrollmentsData, achievementsData))
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateLearningStreak = (enrollments) => {
    // Mock calculation - in real app, track daily activity
    return Math.floor(Math.random() * 7) + 1
  }

  const getUpcomingAssessments = (enrollments) => {
    // Mock data - in real app, fetch from assessments endpoint
    return [
      { id: 1, title: 'Biblical Studies Quiz', course: 'Introduction to Biblical Studies', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
      { id: 2, title: 'Leadership Assessment', course: 'Christian Leadership Fundamentals', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }
    ]
  }

  const getAchievements = (enrollments, certifications, streak) => {
    const achievements = []
    if (enrollments.length > 0) achievements.push({ id: 1, name: 'First Steps', icon: '🎯', description: 'Enrolled in your first course' })
    if (enrollments.some(e => e.status === 'completed')) achievements.push({ id: 2, name: 'Course Master', icon: '🏆', description: 'Completed your first course' })
    if (certifications.length > 0) achievements.push({ id: 3, name: 'Certified', icon: '⭐', description: 'Earned your first certification' })
    if (streak >= 7) achievements.push({ id: 4, name: 'Week Warrior', icon: '🔥', description: '7 day learning streak' })
    return achievements
  }

  const calculateWeeklyStats = (enrollments, achievements) => {
    // Mock calculation
    const completedLessons = enrollments.reduce((sum, e) => sum + (e.progress || 0), 0)
    return {
      hoursStudied: Math.floor(completedLessons / 10),
      lessonsCompleted: Math.floor(completedLessons / 5),
      achievementsEarned: achievements.length
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }

    setIsSearching(true)
    try {
      // Search courses
      const coursesRes = await api.get(`/courses?search=${encodeURIComponent(searchQuery)}`)
      const courses = coursesRes.data.items || []

      // Search lessons (would need a lessons search endpoint)
      // For now, we'll search within enrolled courses
      const lessonsResults = []
      for (const enrollment of enrollments) {
        try {
          const modulesRes = await api.get(`/courses/${enrollment.course_id}/modules`)
          for (const module of modulesRes.data || []) {
            const lessonsRes = await api.get(`/modules/${module.id}/lessons`)
            const matchingLessons = (lessonsRes.data || []).filter(lesson => 
              lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (lesson.content && lesson.content.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            lessonsResults.push(...matchingLessons.map(lesson => ({
              ...lesson,
              courseTitle: enrollment.course?.title || 'Unknown Course',
              moduleTitle: module.title
            })))
          }
        } catch (err) {
          console.error(`Error searching lessons in course ${enrollment.course_id}:`, err)
        }
      }

      setSearchResults({
        courses,
        lessons: lessonsResults
      })
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults({ courses: [], lessons: [] })
    } finally {
      setIsSearching(false)
    }
  }

  const getLastAccessedCourse = () => {
    if (enrollments.length === 0) return null
    // Sort by updated_at or last accessed timestamp
    return enrollments.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))[0]
  }

  const lastCourse = getLastAccessedCourse()

  const joyrideSteps = [
    {
      target: '.stats-section',
      content: 'Here you can see your learning statistics at a glance - enrolled courses, certifications, courses in progress, and your learning streak.',
      placement: 'bottom'
    },
    {
      target: '.search-section',
      content: 'Use the search bar to quickly find courses, lessons, or study materials.',
      placement: 'bottom'
    },
    {
      target: '.continue-learning-section',
      content: 'Quick access to your last accessed course. Click "Resume" to pick up where you left off.',
      placement: 'bottom'
    },
    {
      target: '.my-courses-section',
      content: 'All your enrolled courses are displayed here with progress bars. Click "Continue Learning" to resume any course.',
      placement: 'top'
    },
    {
      target: '.recommended-section',
      content: 'Discover new courses recommended for you based on your learning history and interests.',
      placement: 'top'
    },
    {
      target: '.achievements-section',
      content: 'Track your achievements and milestones as you progress through your learning journey.',
      placement: 'top'
    }
  ]

  const handleJoyrideCallback = (data) => {
    const { status } = data
    if (status === 'finished' || status === 'skipped') {
      localStorage.setItem('learnerDashboardTour', 'true')
      setRunTour(false)
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
      <Joyride
        steps={joyrideSteps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#000080',
            textColor: '#111827',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            arrowColor: '#000080',
            backgroundColor: '#ffffff',
            beaconSize: 36,
            zIndex: 10000
          },
          tooltip: {
            borderRadius: 8,
            fontSize: 14
          },
          buttonNext: {
            backgroundColor: '#000080',
            color: '#ffffff',
            borderRadius: 6,
            padding: '8px 16px'
          },
          buttonBack: {
            color: '#000080',
            marginRight: 10
          },
          buttonSkip: {
            color: '#6b7280'
          }
        }}
      />

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Continue your learning journey and track your progress.
            </p>
          </div>
          <button
            onClick={() => setRunTour(true)}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Take Tour
          </button>
        </div>
      </div>

      {/* Quick Search */}
      <div className="mb-6 search-section">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search courses, lessons, or materials..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (!e.target.value.trim()) {
                setSearchResults(null)
              }
            }}
            className="w-full px-4 py-3 pl-10 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
          <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 top-2 px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Search Results */}
        {searchResults && (
          <div className="mt-4 card">
            <div className="card-body">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Search Results for "{searchQuery}"
              </h3>
              
              {searchResults.courses.length === 0 && searchResults.lessons.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No results found.</p>
              ) : (
                <div className="space-y-6">
                  {searchResults.courses.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                        Courses ({searchResults.courses.length})
                      </h4>
                      <div className="space-y-2">
                        {searchResults.courses.map(course => (
                          <Link
                            key={course.id}
                            to={`/courses/${course.id}`}
                            className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="font-medium text-gray-900 dark:text-white">{course.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.description}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.lessons.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                        Lessons ({searchResults.lessons.length})
                      </h4>
                      <div className="space-y-2">
                        {searchResults.lessons.map(lesson => (
                          <Link
                            key={lesson.id}
                            to={`/learn/${lesson.course_id || enrollments.find(e => e.course?.title === lesson.courseTitle)?.course_id}`}
                            className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="font-medium text-gray-900 dark:text-white">{lesson.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {lesson.courseTitle} • {lesson.moduleTitle}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 stats-section">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Enrolled Courses</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{enrollments.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Certifications</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{certifications.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {enrollments.filter(e => e.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-md flex items-center justify-center">
                  <span className="text-xl">🔥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Learning Streak</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{learningStreak} days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning & Upcoming Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Continue Learning */}
        {lastCourse && (
          <div className="card continue-learning-section">
            <div className="card-body">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Continue Learning</h2>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {lastCourse.course?.title || 'Course Title'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {lastCourse.course?.description?.substring(0, 100) || 'Continue where you left off...'}
                  </p>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{lastCourse.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${lastCourse.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/learn/${lastCourse.course_id}`}
                  className="ml-4 btn-primary whitespace-nowrap"
                >
                  Resume
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Assessments */}
        {upcomingAssessments.length > 0 && (
          <div className="card">
            <div className="card-body">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Assessments</h2>
              <div className="space-y-3">
                {upcomingAssessments.map((assessment) => (
                  <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{assessment.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{assessment.course}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {Math.ceil((assessment.dueDate - new Date()) / (1000 * 60 * 60 * 24))} days left
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Summary & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Summary */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">This Week's Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{weeklyStats.hoursStudied}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hours Studied</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{weeklyStats.lessonsCompleted}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{weeklyStats.achievementsEarned}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="card achievements-section">
            <div className="card-body">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Achievements</h2>
              <div className="space-y-2">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-2xl mr-3">{achievement.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{achievement.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="card mb-8">
          <div className="card-body">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Announcements</h2>
            <div className="space-y-3">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border-l-4 border-primary-600">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{announcement.body}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* My Courses */}
      <div className="mb-8 my-courses-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h2>
          <Link to="/catalog" className="btn-primary">
            Browse More Courses
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No courses yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by browsing our course catalog.</p>
            <div className="mt-6">
              <Link to="/catalog" className="btn-primary">
                Browse Courses
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="card">
                <div className="card-body">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {enrollment.course?.title || 'Course Title'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {enrollment.course?.description || 'Course description...'}
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{enrollment.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      enrollment.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : enrollment.status === 'active'
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}>
                      {enrollment.status}
                    </span>
                    <Link
                      to={`/learn/${enrollment.course_id}`}
                      className="btn-primary text-sm"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI-Powered Recommended Courses - Only show for learners */}
      {!hasRole('Instructor') && !hasRole('Admin') && recommendedCourses.length > 0 && (
        <div className="mb-8 recommended-section">
          <div className="flex items-center space-x-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended for You</h2>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
              ✨ AI-Powered
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <div key={course.id} className="card">
                <div className="card-body">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      course.difficulty === 'Beginner'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : course.difficulty === 'Intermediate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {course.difficulty}
                    </span>
                    <Link
                      to={`/courses/${course.id}`}
                      className="btn-primary text-sm"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.slice(0, 3).map((cert) => (
              <div key={cert.id} className="card">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {cert.certification_rule?.name || 'Certification'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Issued {new Date(cert.issued_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link to="/certifications" className="btn-secondary text-sm">
                    View All Certifications
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
