import apiClient from '../index';

export default {
  getUser(id) {
    return apiClient.get(`/users/${id}`);
  },
  updateUser(id, data) {
    return apiClient.put(`/users/${id}`, data);
  },
  deleteUser(id) {
    return apiClient.delete(`/users/${id}`);
  },
};
