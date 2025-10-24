import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import api from '../services/api'


export default function AssessmentAttempt() {
  const { assessmentId } = useParams()
  const [assessment, setAssessment] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)


  useEffect(() => {
    loadAssessment()
  }, [assessmentId])


  const loadAssessment = async () => {
    try {
      const [assessmentRes, questionsRes] = await Promise.all([
        api.get(`/assessments/${assessmentId}`),
        api.get(`/assessments/${assessmentId}/questions`)
      ])
     
      setAssessment(assessmentRes.data)
      setQuestions(questionsRes.data)
    } catch (error) {
      console.error('Failed to load assessment:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleSubmit = async (values) => {
    try {
      setSubmitting(true)
      await api.post(`/assessments/${assessmentId}/submit`, {
        answers: values
      })
      // Redirect to results or dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setSubmitting(false)
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }


  if (!assessment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Assessment not found</h1>
        </div>
      </div>
    )
  }


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <div className="card-header">
          <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
          <p className="text-gray-600 mt-2">
            Total Points: {assessment.total_points} | Type: {assessment.type}
          </p>
          {assessment.due_at && (
            <p className="text-sm text-gray-500 mt-1">
              Due: {new Date(assessment.due_at).toLocaleDateString()}
            </p>
          )}
        </div>
       
        <div className="card-body">
          <Formik
            initialValues={{}}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className="space-y-8">
                {questions.map((question, index) => (
                  <div key={question.id} className="border-b border-gray-200 pb-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Question {index + 1} ({question.points} points)
                      </h3>
                      <p className="text-gray-700 mt-2">{question.prompt}</p>
                    </div>


                    {question.type === 'mcq' ? (
                      <div className="space-y-2">
                        {question.options?.map((option) => (
                          <label key={option.id} className="flex items-center">
                            <Field
                              type="radio"
                              name={`question_${question.id}`}
                              value={option.id}
                              className="mr-3"
                            />
                            <span className="text-gray-700">{option.text}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <Field
                        as="textarea"
                        name={`question_${question.id}`}
                        placeholder="Your answer..."
                        className="form-input w-full h-24"
                      />
                    )}
                  </div>
                ))}


                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                  >
                    {submitting ? 'Submitting...' : 'Submit Assessment'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
