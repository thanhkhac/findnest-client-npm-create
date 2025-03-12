import {apiClient} from '../index.js';

export default {
  // Lấy chi tiết một bài viết
  getPost(id) {
    return apiClient.get(`/post/${id}`);
  },

  // Lấy danh sách bài viết với bộ lọc
  getPosts(params) {
    return apiClient.get('/post', { params });
  },

  // Xóa một bài viết (nếu đây là xóa bài post, không phải user)
  deletePost(id) {
    return apiClient.delete(`/post/${id}`);
  },
};
