import { useState, useEffect } from 'react'
import { Sparkles, Loader2, Edit2, Save, X, Plus, Trash2, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function QuizGenerator({ lessonId, lessonContent, currentAssessmentId, onQuizSaved }) {
  const { hasRole } = useAuth()
  
  // Only show for instructors and admins
  if (!hasRole('Instructor') && !hasRole('Admin')) {
    return null
  }
  
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePermanently, setDeletePermanently] = useState(false)
  const [questions, setQuestions] = useState(null)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [numQuestions, setNumQuestions] = useState(5)
  const [assessmentTitle, setAssessmentTitle] = useState('')

  useEffect(() => {
    if (currentAssessmentId) {
      loadExistingAssessment()
    }
  }, [currentAssessmentId])

  const loadExistingAssessment = async () => {
    try {
      const response = await api.get(`/assessments/${currentAssessmentId}`)
      const assessment = response.data
      setAssessmentTitle(assessment.title || 'Quiz')
      
      // Load questions for this assessment
      // Note: You may need to add an endpoint to get questions with options
      // For now, we'll just show that an assessment exists
    } catch (err) {
      console.error('Failed to load assessment:', err)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setError('')
    setSuccess('')
    setQuestions(null)

    try {
      const response = await api.post('/ai/generate-quiz', {
        lesson_id: lessonId,
        num_questions: numQuestions
      })

      // Normalize questions format
      const normalizedQuestions = response.data.questions.map(q => ({
        question: q.question || '',
        options: q.options || [],
        correct_answer: typeof q.correct_answer === 'string' 
          ? q.options?.indexOf(q.correct_answer) ?? 0
          : q.correct_answer ?? 0
      }))
      
      setQuestions(normalizedQuestions)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate quiz. Please try again.')
      console.error('Quiz generation error:', err)
    } finally {
      setGenerating(false)
    }
  }

  const handleEditQuestion = (index) => {
    setEditingQuestion(index)
  }

  const handleSaveQuestion = (index, updatedQuestion) => {
    const updated = [...questions]
    updated[index] = updatedQuestion
    setQuestions(updated)
    setEditingQuestion(null)
  }

  const handleDeleteQuestion = (index) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updated = questions.filter((_, i) => i !== index)
      setQuestions(updated)
    }
  }

  const handleAddOption = (questionIndex) => {
    const updated = [...questions]
    if (!updated[questionIndex].options) {
      updated[questionIndex].options = []
    }
    updated[questionIndex].options.push('New option')
    setQuestions(updated)
  }

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const updated = [...questions]
    updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex)
    // Adjust correct_answer if needed
    if (updated[questionIndex].correct_answer >= optionIndex) {
      updated[questionIndex].correct_answer = Math.max(0, updated[questionIndex].correct_answer - 1)
    }
    setQuestions(updated)
  }

  const handleSaveQuiz = async () => {
    if (!questions || questions.length === 0) {
      setError('Please generate questions first')
      return
    }

    // Validate all questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question || q.question.trim() === '') {
        setError(`Question ${i + 1} is empty`)
        return
      }
      if (!q.options || q.options.length < 2) {
        setError(`Question ${i + 1} needs at least 2 options`)
        return
      }
      if (q.correct_answer < 0 || q.correct_answer >= q.options.length) {
        setError(`Question ${i + 1} has invalid correct answer`)
        return
      }
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.post('/ai/save-quiz', {
        lesson_id: lessonId,
        questions: questions,
        assessment_title: assessmentTitle || 'Quiz',
        update_existing: !!currentAssessmentId,
        assessment_id: currentAssessmentId
      })

      setSuccess('Quiz saved successfully! It is now available for learners.')
      if (onQuizSaved) {
        onQuizSaved(response.data.assessment_id)
      }
      
      // Reload page after 2 seconds to show updated lesson
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quiz. Please try again.')
      console.error('Save quiz error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleUnpublishQuiz = async () => {
    if (!currentAssessmentId) {
      setError('No quiz to unpublish')
      return
    }

    setDeleting(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.post('/ai/unpublish-quiz', {
        lesson_id: lessonId,
        delete_assessment: deletePermanently
      })

      setSuccess(response.data.message)
      setShowDeleteConfirm(false)
      setDeletePermanently(false)
      
      if (onQuizSaved) {
        onQuizSaved(null) // Pass null to indicate quiz was removed
      }
      
      // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unpublish quiz. Please try again.')
      console.error('Unpublish quiz error:', err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="card mb-6">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Quiz Generator
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {currentAssessmentId && (
              <>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                  Quiz Published
                </span>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleting}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Unpublish/Delete Quiz"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Generate quiz questions automatically from lesson content using AI. Edit and customize before publishing.
        </p>

        {currentAssessmentId && !showDeleteConfirm && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              ℹ️ This lesson already has a published quiz. Generating new questions will replace the existing quiz.
            </p>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                  Unpublish Quiz?
                </h4>
                <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                  This will remove the quiz from this lesson. Learners will no longer be able to access it.
                </p>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deletePermanently}
                      onChange={(e) => setDeletePermanently(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-red-800 dark:text-red-300">
                      Also permanently delete the quiz (cannot be recovered)
                    </span>
                  </label>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleUnpublishQuiz}
                    disabled={deleting}
                    className="btn-primary bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Unpublishing...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Confirm Unpublish</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeletePermanently(false)
                    }}
                    disabled={deleting}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Assessment Title:
            </label>
            <input
              type="text"
              value={assessmentTitle}
              onChange={(e) => setAssessmentTitle(e.target.value)}
              placeholder="Enter quiz title..."
              className="form-input w-full"
              disabled={generating || saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Number of questions:
            </label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="form-input w-full"
              disabled={generating || saving || questions}
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
          </div>
        )}

        {!questions && (
          <button
            onClick={handleGenerate}
            disabled={generating || !lessonId}
            className="btn-primary flex items-center justify-center space-x-2 w-full"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Quiz</span>
              </>
            )}
          </button>
        )}

        {questions && questions.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Generated Questions ({questions.length}):
              </h4>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-secondary text-sm"
              >
                Regenerate All
              </button>
            </div>
            
            {questions.map((q, idx) => (
              <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                {editingQuestion === idx ? (
                  <QuestionEditor
                    question={q}
                    index={idx}
                    onSave={(updated) => handleSaveQuestion(idx, updated)}
                    onCancel={() => setEditingQuestion(null)}
                    onDelete={() => handleDeleteQuestion(idx)}
                    onAddOption={() => handleAddOption(idx)}
                    onDeleteOption={(optIdx) => handleDeleteOption(idx, optIdx)}
                  />
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white flex-1">
                        {idx + 1}. {q.question}
                      </p>
                      <button
                        onClick={() => handleEditQuestion(idx)}
                        className="ml-2 p-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                        title="Edit question"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <ul className="space-y-1 ml-4">
                      {q.options?.map((option, optIdx) => (
                        <li
                          key={optIdx}
                          className={`text-sm ${
                            optIdx === q.correct_answer
                              ? 'text-green-600 dark:text-green-400 font-semibold'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}. {option}
                          {optIdx === q.correct_answer && ' ✓'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            
            <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSaveQuiz}
                disabled={saving || !assessmentTitle.trim()}
                className="btn-primary flex items-center space-x-2 flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{currentAssessmentId ? 'Update & Publish Quiz' : 'Save & Publish Quiz'}</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setQuestions(null)}
                disabled={saving}
                className="btn-secondary"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function QuestionEditor({ question, index, onSave, onCancel, onDelete, onAddOption, onDeleteOption }) {
  const [editedQuestion, setEditedQuestion] = useState({ ...question })

  const handleSave = () => {
    if (!editedQuestion.question.trim()) {
      alert('Question text is required')
      return
    }
    if (editedQuestion.options.length < 2) {
      alert('At least 2 options are required')
      return
    }
    if (editedQuestion.correct_answer < 0 || editedQuestion.correct_answer >= editedQuestion.options.length) {
      alert('Please select a valid correct answer')
      return
    }
    onSave(editedQuestion)
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Question:
        </label>
        <textarea
          value={editedQuestion.question}
          onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
          className="form-input w-full"
          rows={2}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Options:
        </label>
        <div className="space-y-2">
          {editedQuestion.options.map((option, optIdx) => (
            <div key={optIdx} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`correct-${index}`}
                checked={optIdx === editedQuestion.correct_answer}
                onChange={() => setEditedQuestion({ ...editedQuestion, correct_answer: optIdx })}
                className="text-primary-600"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...editedQuestion.options]
                  newOptions[optIdx] = e.target.value
                  setEditedQuestion({ ...editedQuestion, options: newOptions })
                }}
                className="form-input flex-1"
                placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
              />
              {editedQuestion.options.length > 2 && (
                <button
                  onClick={() => onDeleteOption(optIdx)}
                  className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  title="Delete option"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={onAddOption}
            className="btn-secondary text-sm flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Option</span>
          </button>
        </div>
      </div>
      
      <div className="flex space-x-2 pt-2">
        <button onClick={handleSave} className="btn-primary text-sm flex items-center space-x-1">
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        <button onClick={onCancel} className="btn-secondary text-sm flex items-center space-x-1">
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
        <button onClick={onDelete} className="btn-secondary text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}
