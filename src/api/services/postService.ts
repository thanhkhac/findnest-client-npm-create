// @ts-ignore
import { apiClient } from '../index.js';

export default {
  getPost(id:any) {
    return apiClient.get(`/post/${id}`);
  },

  getPosts(params:any) {
    return apiClient.get('/post', { params });
  },

  deletePost(id:any) {
    return apiClient.delete(`/post/${id}`);
  },

  createPost(body:any) {
    return apiClient.post(`/post`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
};