/*
 * File: authService.ts
 */
import apiClient from '@/api/index';

const AuthService = {
  login(credentials: any) {
    return apiClient.post<any>('/authentication/login', credentials);
  },
  register(userData: any) {
    return apiClient.post<any>('/authentication/register', userData);
  },
  fetchUser() {
    return apiClient.get<any>('/user/manage/info');
  },
};

export default AuthService;
