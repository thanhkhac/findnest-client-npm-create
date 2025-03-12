import apiClient from '../index';

  const AuthService = {
    login(credentials) {
      return apiClient.post('/authentication/login', credentials);
    },
    register(userData) {
      return apiClient.post('/authentication/register', userData);
    },
    fetchUser() {
      return apiClient.get('/user/manage/info');
    },
  };

  export default AuthService;