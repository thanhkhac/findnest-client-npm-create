import apiClient from '../index';

export default {
  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },
  register(userData) {
    return apiClient.post('/auth/register', userData);
  },
  logout() {
    return apiClient.post('/auth/logout');
  },
};
