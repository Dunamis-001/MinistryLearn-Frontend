import { Link } from 'react-router-dom'
import { Clock, Users, BookOpen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function CourseCard({ course, showEnrollButton = true }) {
  const { hasRole } = useAuth()
  const isAdminOrInstructor = hasRole('Admin') || hasRole('Instructor')
  return (
    <div className="card hover:shadow-md transition-all duration-300 group overflow-hidden text-gray-900 dark:text-gray-100">
      {course.thumbnail_url && (
        <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden">
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-48 object-cover rounded-t-xl group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}
      
      <div className="space-y-3 px-6 pb-6">
        <div>
          <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
            {course.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg">
            <BookOpen className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{course.modules_count || 0} modules</span>
          </div>
          <div className="flex items-center space-x-1 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg">
            <Users className="h-4 w-4 text-secondary-600 dark:text-secondary-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{course.enrollments_count || 0} enrolled</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
              course.difficulty === 'Beginner' 
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700'
                : course.difficulty === 'Intermediate'
                ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/50 dark:to-amber-900/50 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700'
                : 'bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700'
            }`}>
              {course.difficulty}
            </span>
            {course.category && (
              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-700">
                {course.category}
              </span>
            )}
          </div>
          
          {showEnrollButton && (
            <Link
              to={`/courses/${course.id}`}
              className="btn-primary text-xs px-4 py-2 whitespace-nowrap flex-shrink-0"
            >
              {isAdminOrInstructor ? 'View Course →' : 'View Details →'}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}


