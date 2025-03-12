import axios from 'axios';

const BASE_URL = 'http://103.9.77.15:8080';

const api = axios.create({
  baseURL: BASE_URL + '/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { api, BASE_URL }; // Xuất cả API chính và URL ảnh
export default api;
