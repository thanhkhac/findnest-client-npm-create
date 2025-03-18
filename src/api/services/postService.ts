/*
 * File: postService.ts
 */
import { apiClient } from '@/api';
import { PostListResponse } from '@/types/post'

export default {
  getPost(id:any) {
    return apiClient.get(`/post/${id}`).catch((error) => {
      throw new Error('Không thể tải bài viết, vui lòng thử lại sau');
    });
  },

  getPosts(params: any): Promise<PostListResponse> {
    return apiClient.get('/post', { params }).then(response => {
      const pagination = response.headers["x-pagination"]
        ? JSON.parse(response.headers["x-pagination"])
        : null;

      return {
        data: response.data,
        pagination
      };
    });
  },

  deletePost(id: string): Promise<void> {
    return apiClient.delete(`/post/${id}`);
  },

  createPost(body: FormData) {
    return apiClient.post(`/post`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updatePost(id: string, body: FormData) {
    return apiClient.put(`/post/${id}`, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};