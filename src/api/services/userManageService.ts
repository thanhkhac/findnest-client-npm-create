/*
 * File: userManageService.ts
 */
import { apiClient } from '@/api/index'
import { PostListResponse } from '@/types/post'

// Định nghĩa interface cho response lỗi
interface ApiErrorResponse {
  status: string
  statusCode: number
  errorCode: string
}


interface ContactInfoData {
  fullName?: string
  contactPhoneNumber?: string
  zalo?: string
  facebook?: string
}

interface PasswordData {
  oldPassword: string
  newPassword: string
}

export default {

  // PUT /api/user/manage/avatar
  async updateAvatar(data: FormData): Promise<any> {
    return apiClient.put('/user/manage/avatar', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).catch((error) => {
      const apiError = error.response?.data as ApiErrorResponse
      throw new Error('Không thể cập nhật avatar, vui lòng thử lại sau')
    })
  },

  // PUT /api/user/manage/contact-info
  async updateContactInfo(data: ContactInfoData): Promise<any> {
    return apiClient.put('/user/manage/contact-info', data).catch((error) => {
      const apiError = error.response?.data as ApiErrorResponse
      throw new Error('Không thể cập nhật thông tin liên hệ, vui lòng thử lại sau')
    })
  },

  async updatePassword(data: PasswordData): Promise<any> {
    return apiClient.put('/user/manage/password', data).catch((error) => {
      const apiError = error.response?.data as ApiErrorResponse
      throw new Error('Không thể cập nhật mật khẩu, vui lòng thử lại sau')
    })
  },

  async depositMoney(money: number): Promise<any> {
    return apiClient.post('/payment/payment/qrcode', { money })
      .then(response => response.data) // Trả về dữ liệu từ API
      .catch((error) => {
        console.error('Lỗi API:', error.response?.data || error.message)
        throw new Error(error.response?.data?.message || 'Không thể thực hiện giao dịch, vui lòng thử lại sau')
      })
  },

  getOwnerPosts(params: any): Promise<PostListResponse> {
    return apiClient.get('/user/manage/post', { params }).then(response => {
      const pagination = response.headers["x-pagination"]
        ? JSON.parse(response.headers["x-pagination"])
        : null;

      return {
        data: response.data,
        pagination
      };
    });
  },

}