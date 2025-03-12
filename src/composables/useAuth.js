import { ref, onMounted } from 'vue'
import AuthService from '@/api/services/auth'

export function useAuth() {
  const user = ref(null)

  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials)
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      await fetchUser() // Fetch user info after login
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      user.value = null
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const fetchUser = async () => {
    const token = localStorage.getItem('accessToken'); // Kiểm tra token trước khi fetch
    if (!token) {
      console.warn('No accessToken found, skipping fetchUser()');
      return;
    }

    try {
      const response = await AuthService.fetchUser();
      user.value = response.data;
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  };

  onMounted(() => {
    if (localStorage.getItem('accessToken')) {
      fetchUser(); // Chỉ gọi nếu có accessToken
    }
  });

  return {
    user,
    login,
    logout,
    fetchUser
  }
}