import { useState, useRef, useEffect } from 'react'
import api from '../services/api'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your MinistryLearn assistant. How can I help you today? I can answer questions about courses, enrollment, certifications, and more!"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // Call AI API endpoint
      console.log('Sending chat message:', userMessage)
      const response = await api.post('/ai/chat', {
        message: userMessage,
        conversation_history: messages.slice(-5).map(msg => ({
          role: msg.role,
          content: msg.content
        })) // Last 5 messages for context
      })

      console.log('Chat API response:', response.data)
      console.log('Response status:', response.data.status)
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response || "I'm sorry, I couldn't process that request. Please try again."
      }])
    } catch (error) {
      console.error('Chat error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      // Fallback response if API is not available
      const fallbackResponse = generateFallbackResponse(userMessage)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fallbackResponse
      }])
    } finally {
      setLoading(false)
    }
  }

  const generateFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('course') || lowerMessage.includes('enroll')) {
      return "To enroll in a course, go to the Course Catalog and click 'Enroll' on any course you're interested in. You can filter courses by campus, category, or difficulty level."
    }
    
    if (lowerMessage.includes('certificate') || lowerMessage.includes('certification')) {
      return "Certifications are awarded when you complete a course. You can view your certifications in the Certifications section of your dashboard."
    }
    
    if (lowerMessage.includes('dashboard') || lowerMessage.includes('progress')) {
      return "Your dashboard shows your enrolled courses, progress, and certifications. Navigate to Dashboard from the main menu to view your learning journey."
    }
    
    if (lowerMessage.includes('instructor') || lowerMessage.includes('teacher')) {
      return "Instructors create and manage courses. If you're an instructor, you can access the Instructor Dashboard to create courses, grade submissions, and manage your content."
    }
    
    if (lowerMessage.includes('admin') || lowerMessage.includes('administrator')) {
      return "Admins manage the platform, approve courses, send announcements, and oversee user management. Access the Admin Dashboard for administrative functions."
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I can help you with questions about courses, enrollment, certifications, dashboards, and platform features. What would you like to know?"
    }
    
    return "I understand you're asking about: '" + message + "'. For specific help, you can browse the Course Catalog, check your Dashboard for progress, or contact support for detailed assistance."
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all duration-300 hover:scale-110"
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">MinistryLearn Assistant</h3>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-white/80"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

