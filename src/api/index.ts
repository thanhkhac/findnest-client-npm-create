/*
 * File: index.ts
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import router from '@/router/index.js';

const BASE_URL = 'https://103.9.77.15';

const apiClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 20000, // Timeout 20s
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Hàm thêm subscriber khi refresh token
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Hàm thông báo token mới cho tất cả subscriber
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Kiểm tra và thêm token vào request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi từ API
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    // Xử lý lỗi 401
    if (refreshToken && accessToken && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;


      if (!refreshToken) {
        console.warn('Không còn refresh token');
        await handleLogout();
        return Promise.reject(error);
      }

      // Thêm request vào hàng đợi ngay lập tức
      const retryOriginalRequest = new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          resolve(apiClient(originalRequest));
        });
      });

      // Chỉ chạy refresh token nếu chưa refreshing
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await axios.post(`${BASE_URL}/api/authentication/refresh`, {
            refreshToken,
            accessToken,
          });
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

          if (!newAccessToken || !newRefreshToken) {
            throw new Error('Invalid refresh token response');
          }

          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          console.log('Refresh token thành công');

          isRefreshing = false;
          onRefreshed(newAccessToken);
        } catch (refreshError) {
          console.error('Refresh token thất bại:', refreshError);
          isRefreshing = false;
          refreshSubscribers = []; // Xóa các subscriber
          await handleLogout();
          return Promise.reject(refreshError);
        }
      }

      return retryOriginalRequest; // Trả về promise để retry request gốc
    }

    return Promise.reject(error); // Reject các lỗi khác
  }
);

// Hàm logout
const handleLogout = async (redirectUrl = '/login'): Promise<void> => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  await router.push(redirectUrl);
  window.location.reload();
};

export { apiClient, BASE_URL };
export default apiClient;