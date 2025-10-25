import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const access = localStorage.getItem('access')
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh')
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh', {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          })
          
          const newAccessToken = response.data.access_token
          localStorage.setItem('access', newAccessToken)
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed, clear tokens but don't redirect automatically
          localStorage.removeItem('access')
          localStorage.removeItem('refresh')
          return Promise.reject(error)
        }
      } else {
        // No refresh token, clear tokens but don't redirect automatically
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api