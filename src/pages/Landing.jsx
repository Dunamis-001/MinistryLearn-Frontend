import { Link } from 'react-router-dom'
import { BookOpen, Award, Users, TrendingUp } from 'lucide-react'

export default function Landing() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-accent-500 to-secondary-500 text-white overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 drop-shadow-2xl">
              MinistryLearn
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/95 font-medium">
              Transform Your Ministry with Professional Training & Certifications
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/catalog" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 text-lg">
                Browse Catalog →
              </Link>
              <Link to="/register" className="border-2 border-white/80 text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm hover:bg-white hover:text-primary-600 transition-all duration-200 text-lg">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">MinistryLearn</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive learning platform designed for ministry excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 group">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-3 text-center">Structured Learning</h3>
              <p className="text-gray-600 text-center">
                Organized courses with modules, lessons, and assessments for comprehensive training.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-pink-100 group">
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-3 text-center">Certifications</h3>
              <p className="text-gray-600 text-center">
                Earn verifiable certifications upon course completion with automated tracking.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-teal-100 group">
              <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-3 text-center">Role-Based Access</h3>
              <p className="text-gray-600 text-center">
                Tailored experiences for learners, instructors, and administrators.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 group">
              <div className="bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-3 text-center">Track Progress</h3>
              <p className="text-gray-600 text-center">
                Monitor your learning journey with detailed progress tracking and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-accent-500 to-secondary-500 py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-white/95 mb-10 max-w-2xl mx-auto">
            Join thousands of ministry volunteers and staff already learning with MinistryLearn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 text-lg">
              Get Started Today →
            </Link>
            <Link to="/catalog" className="border-2 border-white/80 text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200 text-lg">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}