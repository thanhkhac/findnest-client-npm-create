/*
 * File: planService.ts
 */
// @ts-ignore
import { apiClient } from '@/api/index.ts'

interface ApiErrorResponse {
  status: string
  statusCode: number
  message: string
  errorCode: string
  errors: {
    [key: string]: string[]
  }
}

export default {
  getPlans(): Promise<any> {
    return apiClient.get('/plan').catch(() => {
      throw new Error('Không thể tải danh sách gói tin, vui lòng thử lại sau')
    })
  },
  getPurchaseHistory(postId: string): Promise<any> {
    return apiClient.get(`/post/${postId}/plans`).catch(() => {
      throw new Error('Không thể tải lịch sử mua gói, vui lòng thử lại sau')
    })
  },
  buyPlan(postId: string, planId: number): Promise<any> {
    return apiClient.post(`/post/${postId}/plans`, { planId }).catch((error) => {
      const apiError = error.response?.data as ApiErrorResponse
      if (apiError.errorCode === 'INSUFFICIENT_FUNDS') {
        throw new Error('Tài khoản không đủ tiền, vui lòng nạp thêm');
      }
      throw new Error('Có lỗi xảy ra, vui lòng thử lại sau');
    })
  },
}