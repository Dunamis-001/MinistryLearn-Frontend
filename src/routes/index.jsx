import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { 
    path: '/dashboard', 
    element: (
      <PrivateRoute roles={['Learner', 'Instructor', 'Admin']}>
        <DashboardLearner />
      </PrivateRoute>
    ) 
  },
  { 
    path: '/instructor', 
    element: (
      <PrivateRoute roles={['Instructor', 'Admin']}>
        <DashboardInstructor />
      </PrivateRoute>
    ) 
  },
  { 
    path: '/admin', 
    element: (
      <PrivateRoute roles={['Admin']}>
        <DashboardAdmin />
      </PrivateRoute>
    ) 
  },
  { path: '/catalog', element: <Catalog /> },
  { path: '/courses/:courseId', element: <CourseDetail /> },
  { 
    path: '/learn/:courseId', 
    element: (
      <PrivateRoute roles={['Learner', 'Instructor', 'Admin']}>
        <Learn />
      </PrivateRoute>
    ) 
  },
  { 
    path: '/assessments/:assessmentId', 
    element: (
      <PrivateRoute roles={['Learner', 'Instructor', 'Admin']}>
        <AssessmentAttempt />
      </PrivateRoute>
    ) 
  },
  { 
    path: '/certifications', 
    element: (
      <PrivateRoute roles={['Learner', 'Instructor', 'Admin']}>
        <Certifications />
      </PrivateRoute>
    ) 
  },
  { 
    path: '/profile', 
    element: (
      <PrivateRoute roles={['Learner', 'Instructor', 'Admin']}>
        <Profile />
      </PrivateRoute>
    ) 
  },
  { 
    path: '/settings', 
    element: (
      <PrivateRoute roles={['Learner', 'Instructor', 'Admin']}>
        <Settings />
      </PrivateRoute>
    ) 
  }
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
