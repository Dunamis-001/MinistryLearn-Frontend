import { Link } from 'react-router-dom'
import { Clock, Users, BookOpen } from 'lucide-react'

export default function CourseCard({ course, showEnrollButton = true }) {
  return (
    <div className="card hover:shadow-md transition-all duration-300 group overflow-hidden">
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
          <h3 className="text-lg font-display font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {course.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1 bg-purple-50 px-2 py-1 rounded-lg">
            <BookOpen className="h-4 w-4 text-primary-600" />
            <span className="font-medium">{course.modules_count || 0} modules</span>
          </div>
          <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-lg">
            <Users className="h-4 w-4 text-secondary-600" />
            <span className="font-medium">{course.enrollments_count || 0} enrolled</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
              course.difficulty === 'Beginner' 
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                : course.difficulty === 'Intermediate'
                ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200'
                : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
            }`}>
              {course.difficulty}
            </span>
            {course.category && (
              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                {course.category}
              </span>
            )}
          </div>
          
          {showEnrollButton && (
            <Link
              to={`/courses/${course.id}`}
              className="btn-primary text-sm"
            >
              View Details →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}


