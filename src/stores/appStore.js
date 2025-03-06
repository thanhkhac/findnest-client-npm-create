import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  // Trạng thái tìm kiếm từ các modal
  const searchFilters = ref({
    text: '',
    range: { min: null, max: null },
    file: null, // Lưu tên file hoặc thông tin file
    list: '',
  });

  // Trạng thái phân trang
  const pagination = ref({
    currentPage: 1,
    pageSize: 10,
    totalItems: 50, // Giả lập
  });

  // Cập nhật filter
  function updateFilter(filterName, value) {
    searchFilters.value[filterName] = value;
  }

  // Cập nhật trang
  function setPage(page) {
    pagination.value.currentPage = page;
  }

  // Gửi form
  function submitForm() {
    const formData = {
      filters: { ...searchFilters.value },
      pagination: { ...pagination.value },
    };
    console.log('Form submitted:', formData);
    // Gửi API: axios.post('/api/search', formData);
  }

  return {
    searchFilters,
    pagination,
    updateFilter,
    setPage,
    submitForm,
  };
});
