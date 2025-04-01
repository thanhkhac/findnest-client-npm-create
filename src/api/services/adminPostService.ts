/*
 * File: adminPostService.ts
 */

import { apiClient } from '@/api'
import { PostListResponse } from '@/types/post'

export default {

  deletePost(id: string): Promise<void> {
    return apiClient.delete(`/admin/post/${id}`)
  },

  getPosts(params: any): Promise<PostListResponse> {
    return apiClient.get('/admin/post', { params }).then(response => {
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