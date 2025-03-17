import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 20000, // Giảm timeout xuống 10s, tùy chỉnh nếu cần
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let refreshSubscribers = []

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      const accessToken = localStorage.getItem('accessToken')

      if (!refreshToken) {
        console.warn('Không còn token')
        handleLogout()
        return Promise.reject(error)
      }

      if (!isRefreshing) {
        isRefreshing = true
        try {
          const response = await axios.post(`${BASE_URL}/api/authentication/refresh`, { refreshToken, accessToken })
          const newAccessToken = response.data?.accessToken
          const newRefreshToken = response.data?.refreshToken
          if (!newAccessToken || !newRefreshToken) throw new Error('Invalid refresh token response')

          localStorage.setItem('accessToken', newAccessToken)
          localStorage.setItem('refreshToken', newRefreshToken)
          console.log('Refresh token thành công')

          isRefreshing = false
          refreshSubscribers.forEach((cb) => cb(newAccessToken))
          refreshSubscribers = []
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError)
          isRefreshing = false
          refreshSubscribers = []
          handleLogout()
          return Promise.reject(refreshError)
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(apiClient(originalRequest))
        })
      })
    }
    return Promise.reject(error)
  }
)

const handleLogout = (redirectUrl = '/login') => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.href = redirectUrl
}

export { apiClient, BASE_URL }
export default apiClient