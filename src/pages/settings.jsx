import { useState } from 'react'
import { useAuth } from '../context/AuthContext'


export default function Settings() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    courseUpdates: true,
    announcements: true
  })


  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences.
        </p>
      </div>


      <div className="space-y-8">
        {/* Notification Settings */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive email updates about your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>


              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Course Updates</h3>
                  <p className="text-sm text-gray-500">Get notified about course progress and deadlines</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.courseUpdates}
                    onChange={(e) => handleNotificationChange('courseUpdates', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>


              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Announcements</h3>
                  <p className="text-sm text-gray-500">Receive system-wide announcements</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.announcements}
                    onChange={(e) => handleNotificationChange('announcements', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>


        {/* Privacy Settings */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Profile Visibility</h3>
                <p className="text-sm text-gray-500 mb-3">Control who can see your profile information</p>
                <select className="form-input w-auto">
                  <option value="public">Public</option>
                  <option value="course-members">Course Members Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>
        </div>


        {/* Account Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Account Actions</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Export Data</h3>
                <p className="text-sm text-gray-500 mb-3">Download a copy of your data</p>
                <button className="btn-secondary">
                  Export My Data
                </button>
              </div>
             
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-red-900">Danger Zone</h3>
                <p className="text-sm text-gray-500 mb-3">Permanently delete your account</p>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
