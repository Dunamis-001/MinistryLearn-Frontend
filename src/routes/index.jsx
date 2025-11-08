import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import DashboardLearner from '../pages/DashboardLearner'
import DashboardInstructor from '../pages/DashboardInstructor'
import DashboardAdmin from '../pages/DashboardAdmin'
import Catalog from '../pages/Catalog'
import CourseDetail from '../pages/CourseDetail'
import Learn from '../pages/Learn'
import AssessmentAttempt from '../pages/AssessmentAttempt'
import Certifications from '../pages/Certifications'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import CreateCourse from '../pages/CreateCourse'
import EditCourse from '../pages/EditCourse'
import Submissions from '../pages/Submissions'
import InstructorCourses from '../pages/InstructorCourses'
import CreateAnnouncement from '../pages/CreateAnnouncement'
import AdminUsers from '../pages/AdminUsers'
import AdminAnalytics from '../pages/AdminAnalytics'
import { PrivateRoute } from './PrivateRoute'
import { useAuth } from '../context/AuthContext'

// Component to redirect admins/instructors away from learner dashboard
function DashboardRedirect() {
  const { hasRole } = useAuth()
  if (hasRole('Admin')) {
    return <Navigate to="/admin" replace />
  }
  if (hasRole('Instructor')) {
    return <Navigate to="/instructor" replace />
  }
  return <DashboardLearner />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute roles={['Learner', 'Instructor', 'Admin']}>
            <DashboardRedirect />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/instructor" 
        element={
          <PrivateRoute roles={['Instructor', 'Admin']}>
            <DashboardInstructor />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <PrivateRoute roles={['Admin']}>
            <DashboardAdmin />
          </PrivateRoute>
        } 
      />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/courses/:courseId" element={<CourseDetail />} />
      <Route 
        path="/courses/new" 
        element={
          <PrivateRoute roles={['Instructor', 'Admin']}>
            <CreateCourse />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/courses/:courseId/edit" 
        element={
          <PrivateRoute roles={['Instructor', 'Admin']}>
            <EditCourse />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/instructor/courses" 
        element={
          <PrivateRoute roles={['Instructor', 'Admin']}>
            <InstructorCourses />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/submissions" 
        element={
          <PrivateRoute roles={['Instructor', 'Admin']}>
            <Submissions />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/announcements/new" 
        element={
          <PrivateRoute roles={['Instructor', 'Admin']}>
            <CreateAnnouncement />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <PrivateRoute roles={['Admin']}>
            <AdminUsers />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/analytics" 
        element={
          <PrivateRoute roles={['Admin']}>
            <AdminAnalytics />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/learn/:courseId" 
        element={
          <PrivateRoute roles={['Learner', 'Instructor', 'Admin']}>
            <Learn />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/assessments/:assessmentId" 
        element={
          <PrivateRoute roles={['Learner', 'Instructor', 'Admin']}>
            <AssessmentAttempt />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/certifications" 
        element={
          <PrivateRoute roles={['Learner', 'Instructor', 'Admin']}>
            <Certifications />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute roles={['Learner', 'Instructor', 'Admin']}>
            <Profile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <PrivateRoute roles={['Learner', 'Instructor', 'Admin']}>
            <Settings />
          </PrivateRoute>
        } 
      />
    </Routes>
  )
}
