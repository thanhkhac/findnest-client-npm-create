import {api} from '../index.js';

export default {
  // Lấy chi tiết một bài viết
  getPost(id) {
    return api.get(`/post/${id}`);
  },

  // Lấy danh sách bài viết với bộ lọc
  getPosts(params) {
    return api.get('/post', { params });
  },

  // Xóa một bài viết (nếu đây là xóa bài post, không phải user)
  deletePost(id) {
    return api.delete(`/post/${id}`);
  },
};
