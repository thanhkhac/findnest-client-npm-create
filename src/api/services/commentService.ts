// src/api/services/commentService.ts
import { apiClient } from '@/api';

export default {
  getPostComments(postId: string) {
    return apiClient.get(`/comments/post/${postId}`).catch((error) => {
      throw new Error('Không thể tải bình luận, vui lòng thử lại sau');
    });
  },

  createComment(data: { postId: string; content: string; parentId?: string | null }) {
    return apiClient.post('/comments', data).catch((error) => {
      throw new Error('Không thể đăng bình luận, vui lòng thử lại sau');
    });
  },

  updateComment(id: string, data: { content: string }) {
    return apiClient.put(`/comments/${id}`, data);
  },

  deleteComment(id: string) {
    return apiClient.delete(`/comments/${id}`);
  }
};