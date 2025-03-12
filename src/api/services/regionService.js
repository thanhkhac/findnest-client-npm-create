import api from '@/api/index.js';

const RegionService = {
  getProvinces() {
    return api.get('/region/province');
  },

  getDistricts(provinceCode) {
    return api.get(`/region/district/${provinceCode}`);
  },

  getWards(districtCode) {
    return api.get(`/region/ward/${districtCode}`);
  }
};

export default RegionService;
