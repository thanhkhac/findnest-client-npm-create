/*
 * File: useAuth.ts
 */
import { ref, onMounted, computed } from 'vue'
import AuthService from '@/api/services/authService'

// Define the User interface based on the provided structure
interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  balance: number;
  isBanned: boolean;
  avatar: string;
  contactPhoneNumber: string;
  zalo: string | null;
  facebook: string | null;
  paymentCode: string;
  roles: string[];
}

// Define credentials interface for login
interface Credentials {
  [key: string]: any; // You might want to specify exact fields like username/password
}

// Define response interfaces
interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

interface UserResponse {
  data: User;
}

export function useAuth() {
  const user = ref<User | null>(null)
  const userRoles = computed(() => user.value?.roles || []);
  const isAuthenticated = computed(() => !!user.value && !!localStorage.getItem('accessToken'));

  const login = async (credentials: Credentials): Promise<LoginResponse> => {
    try {
      const response = await AuthService.login(credentials) as LoginResponse
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      await fetchUser()
      return response
    } catch (error : any) {
      console.error('Login error:', error)
      throw new Error('Sai tài khoản hoặc mật khẩu')
    }
  }

  const logout = async (): Promise<void> => {
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      user.value = null
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const fetchUser = async (): Promise<void> => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      console.warn('No accessToken found, skipping fetchUser()')
      return
    }

    try {
      const response = await AuthService.fetchUser() as UserResponse
      user.value = response.data
    } catch (error) {
      console.error('Fetch user error:', error)
    }
  }

  onMounted(() => {
    if (localStorage.getItem('accessToken')) {
      fetchUser()
    }
  })

  return {
    user,
    isAuthenticated,
    userRoles,
    login,
    logout,
    fetchUser
  };
}