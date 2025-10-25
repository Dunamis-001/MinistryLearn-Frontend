import { Routes, Route } from 'react-router-dom'
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
import { PrivateRoute } from './PrivateRoute'

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
            <DashboardLearner />
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
