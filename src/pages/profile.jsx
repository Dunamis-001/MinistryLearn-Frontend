import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import api from '../services/api'


const schema = Yup.object({
  username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required')
})


export default function Profile() {
  const { user, loadProfile } = useAuth()
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setLoading(true)
      // Update profile endpoint would need to be implemented
      await api.put('/auth/profile', values)
      await loadProfile()
      setStatus('Profile updated successfully')
    } catch (error) {
      setStatus('Failed to update profile')
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your account information and preferences.
        </p>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
            </div>
            <div className="card-body">
              <Formik
                initialValues={{
                  username: user?.username || '',
                  email: user?.email || ''
                }}
                validationSchema={schema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, status }) => (
                  <Form className="space-y-6">
                    {status && (
                      <div className={`p-4 rounded-md ${
                        status.includes('success')
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {status}
                      </div>
                    )}


                    <div>
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        className="form-input"
                      />
                      <ErrorMessage name="username" component="div" className="text-red-600 text-sm mt-1" />
                    </div>


                    <div>
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className="form-input"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                    </div>


                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="btn-primary"
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>


        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
            </div>
            <div className="card-body">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Member since</dt>
                  <dd className="text-sm text-gray-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Roles</dt>
                  <dd className="text-sm text-gray-900">
                    {user?.roles?.join(', ') || 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="text-sm text-gray-900">{user?.id || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
