import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Award, Users, TrendingUp, CheckCircle, ArrowRight, ChevronDown, ChevronUp, Clock, Star, GraduationCap, Sparkles, Target } from 'lucide-react'
import api from '../services/api'

export default function Landing() {
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [courses, setCourses] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const coursesRes = await api.get('/courses?published=true')
      const allCourses = coursesRes.data.items || []
      setCourses(allCourses)
    } catch (error) {
      console.error('Failed to load courses:', error)
    } finally {
      setLoadingCourses(false)
    }
  }

  // Helper function to find course by title
  const findCourseByTitle = (title) => {
    return courses.find(c => c.title === title)
  }

  const faqs = [
    {
      question: "Is MinistryLearn free to use?",
      answer: "Yes! MinistryLearn is completely free. Create an account and start learning immediately. All courses, lessons, and certifications are available at no cost."
    },
    {
      question: "How long does it take to complete a course?",
      answer: "Course duration varies depending on the course. Most courses can be completed in 2-4 weeks if you dedicate a few hours per week. You can learn at your own pace and access materials anytime."
    },
    {
      question: "Do I need any prerequisites to enroll?",
      answer: "Most courses are designed for all levels. Beginner courses require no prior knowledge, while intermediate and advanced courses may have recommended prerequisites listed in the course description."
    },
    {
      question: "Are the certifications recognized?",
      answer: "Yes! Upon successful completion of a course, you'll receive a verifiable digital certificate that you can share on your profile, resume, or social media. Certificates demonstrate your commitment to ministry excellence."
    },
    {
      question: "Can I access courses on mobile devices?",
      answer: "Absolutely! MinistryLearn is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. Learn anywhere, anytime."
    },
    {
      question: "What if I need help or have questions?",
      answer: "We're here to help! You can reach out through the support chat feature, contact your course instructor, or check our FAQ section for common questions."
    }
  ]

  const learningPaths = [
    {
      title: "New to Ministry?",
      description: "Start your journey with foundational courses",
      courses: ["Introduction to Biblical Studies", "Discipleship and Spiritual Growth"],
      icon: "🎯",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Want to Lead?",
      description: "Develop leadership skills for effective ministry",
      courses: ["Christian Leadership Fundamentals", "Building Effective Teams"],
      icon: "👥",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Deepen Your Faith?",
      description: "Explore advanced spiritual growth courses",
      courses: ["Discipleship and Spiritual Growth", "Prayer and Meditation"],
      icon: "✨",
      color: "from-purple-500 to-pink-600"
    }
  ]

  // Calculate category counts from actual courses
  const getCategoryCount = (categoryName) => {
    return courses.filter(course => course.category === categoryName).length
  }

  const categories = [
    { name: "Bible Study", icon: BookOpen, description: "Deep dive into Scripture", count: getCategoryCount("Bible Study") },
    { name: "Leadership", icon: Users, description: "Lead with excellence", count: getCategoryCount("Leadership") },
    { name: "Evangelism", icon: Target, description: "Share the Gospel effectively", count: getCategoryCount("Evangelism") },
    { name: "Worship", icon: Sparkles, description: "Lead meaningful worship", count: getCategoryCount("Worship") },
    { name: "Discipleship", icon: GraduationCap, description: "Grow in faith", count: getCategoryCount("Discipleship") }
  ]

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
            <p className="text-xl md:text-2xl mb-6 text-white/95 font-medium">
              Transform Your Ministry with Professional Training & Certifications
            </p>
            <p className="text-lg md:text-xl mb-10 text-white/90 max-w-3xl mx-auto">
              Join a community of ministry leaders, volunteers, and believers committed to growing in faith and serving effectively. Access comprehensive courses, earn certifications, and take your ministry to the next level.
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

      {/* Course Categories */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Explore Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Categories</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find courses that match your ministry goals and interests
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, idx) => (
              <Link
                key={idx}
                to={`/catalog?category=${encodeURIComponent(category.name)}`}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{category.description}</p>
                <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                  {category.count} course{category.count !== 1 ? 's' : ''}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
              What You'll <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Learn</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Practical skills and knowledge to transform your ministry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Biblical Knowledge", items: ["Understand Scripture deeply", "Learn proper interpretation methods", "Apply biblical principles"] },
              { title: "Leadership Skills", items: ["Develop servant leadership", "Build effective teams", "Lead with integrity"] },
              { title: "Ministry Excellence", items: ["Plan impactful programs", "Engage your community", "Grow your ministry"] },
              { title: "Spiritual Growth", items: ["Deepen your faith", "Develop spiritual disciplines", "Build accountability"] },
              { title: "Practical Tools", items: ["Worship leading techniques", "Evangelism strategies", "Discipleship methods"] },
              { title: "Certification", items: ["Earn verifiable credentials", "Showcase your achievements", "Advance your ministry"] }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-3">
                    <CheckCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                </div>
                <ul className="space-y-2">
                  {item.items.map((listItem, itemIdx) => (
                    <li key={itemIdx} className="flex items-start text-gray-600 dark:text-gray-400">
                      <Star className="w-5 h-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{listItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-24 bg-gradient-to-b from-primary-50/30 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Learning Path</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Not sure where to start? Follow these recommended paths based on your goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {learningPaths.map((path, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${path.color} rounded-xl flex items-center justify-center mb-6 text-3xl`}>
                  {path.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{path.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{path.description}</p>
                <div className="space-y-3">
                  {path.courses.map((courseName, courseIdx) => {
                    const course = findCourseByTitle(courseName)
                    if (course) {
                      return (
                        <Link
                          key={courseIdx}
                          to={`/courses/${course.id}`}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                        >
                          <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {courseName}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                        </Link>
                      )
                    }
                    return (
                      <div key={courseIdx} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{courseName}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-primary-50/30 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">MinistryLearn</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive learning platform designed for ministry excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3 text-center">Structured Learning</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Organized courses with modules, lessons, videos, and assessments for comprehensive training.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group">
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3 text-center">Certifications</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Earn verifiable digital certifications upon course completion with automated tracking.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group">
              <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3 text-center">Role-Based Access</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Tailored experiences for learners, instructors, and administrators with appropriate tools.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group">
              <div className="bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3 text-center">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Monitor your learning journey with detailed progress tracking, streaks, and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about MinistryLearn
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                    {faq.question}
                  </span>
                  {expandedFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
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
            Start your learning journey today - it's completely free! Join our community of ministry leaders and volunteers committed to growing in faith and serving effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 text-lg">
              Get Started Free →
            </Link>
            <Link to="/catalog" className="border-2 border-white/80 text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200 text-lg">
              Browse Courses
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-6 text-white/80 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>Learn at Your Pace</span>
            </div>
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              <span>Earn Certificates</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}