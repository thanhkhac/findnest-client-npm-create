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
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await apiClient.post('/authentication/refresh', { refreshToken })
      localStorage.setItem('accessToken', response.data.accessToken)
      apiClient.defaults.headers.Authorization = `Bearer ${response.data.accessToken}`
      return apiClient(originalRequest)
    }
    return Promise.reject(error)
  },
)
export { apiClient, BASE_URL }
export default apiClient
