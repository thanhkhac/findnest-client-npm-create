import { apiClient } from '@/api/index'

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
  updateAvatar(data: FormData): Promise<any> {
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
  updateContactInfo(data: ContactInfoData): Promise<any> {
    return apiClient.put('/user/manage/contact-info', data).catch((error) => {
      const apiError = error.response?.data as ApiErrorResponse
      throw new Error('Không thể cập nhật thông tin liên hệ, vui lòng thử lại sau')
    })
  },
  
  updatePassword(data: PasswordData): Promise<any> {
    return apiClient.put('/user/manage/password', data).catch((error) => {
      const apiError = error.response?.data as ApiErrorResponse
      throw new Error('Không thể cập nhật mật khẩu, vui lòng thử lại sau')
    })
  },

  depositMoney(money: number): Promise<any> {
    return apiClient.post('/payment/payment/qrcode', { money })
      .then(response => response.data) // Trả về dữ liệu từ API
      .catch((error) => {
        console.error('Lỗi API:', error.response?.data || error.message)
        throw new Error(error.response?.data?.message || 'Không thể thực hiện giao dịch, vui lòng thử lại sau')
      })
  },

}