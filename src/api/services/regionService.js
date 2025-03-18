/*
 * File: regionService.js
 */
import apiClient from '@/api/index.ts';

const RegionService = {
  getProvinces() {
    return apiClient.get('/region/province');
  },

  getDistricts(provinceCode) {
    return apiClient.get(`/region/district/${provinceCode}`);
  },

  getWards(districtCode) {
    return apiClient.get(`/region/ward/${districtCode}`);
  },

  getFullAddress(code) {
    return apiClient.get(`/region/fullname/${code}`);
  }

};

export default RegionService;
