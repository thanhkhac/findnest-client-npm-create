import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

const apiClient = axios.create({
  baseURL: BASE_URL + '/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

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

    // Nếu lỗi 401 và chưa từng retry, thực hiện refresh token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        console.warn('No refresh token available, logging out...')
        handleLogout()
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(`${BASE_URL}/api/authentication/refresh`, { refreshToken })

        const newAccessToken = response.data.accessToken
        localStorage.setItem('accessToken', newAccessToken)

        // Cập nhật token mới vào request bị lỗi
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return apiClient(originalRequest) // Gửi lại request ban đầu
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError)
        handleLogout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

const handleLogout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.href = '/login' // Redirect về trang login
}

export { apiClient, BASE_URL }
export default apiClient
