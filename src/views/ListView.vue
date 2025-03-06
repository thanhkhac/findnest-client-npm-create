<template>
  <div class="container my-4">
    <SearchBar @update-form="updateForm" :initial-data="formData" />
    <ItemList :items="items" />
    <Pagination :current-page="currentPage" @update-page="updatePage" />
    <button class="btn btn-primary mt-3" @click="submitForm">Submit Form</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Pagination from '@/components/Pagination.vue'
import ItemList from '@/components/ItemList.vue'
import SearchBar from '@/components/SearchBar.vue'

const formData = ref({
  text: '',
  range: { min: 0, max: 100 },
  file: null,
  custom: '',
  page: 1,
});

const items = ref([]);
const currentPage = ref(1);

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  formData.value.text = urlParams.get('text') || '';
  formData.value.range.min = Number(urlParams.get('min')) || 0;
  formData.value.range.max = Number(urlParams.get('max')) || 100;
  formData.value.custom = urlParams.get('custom') || '';
  formData.value.page = Number(urlParams.get('page')) || 1;
  currentPage.value = formData.value.page;
  fetchList();
});

const updateForm = (data) => {
  Object.assign(formData.value, data);
  updateUrl();
};

const updatePage = (page) => {
  formData.value.page = page;
  currentPage.value = page;
  fetchList();
  updateUrl();
};

const fetchList = () => {
  items.value = Array(10).fill().map((_, i) => `Item ${i + 1 + (currentPage.value - 1) * 10}`);
};

const submitForm = () => {
  console.log('Form submitted:', formData.value);
};

const updateUrl = () => {
  const params = new URLSearchParams({
    text: formData.value.text,
    min: formData.value.range.min,
    max: formData.value.range.max,
    custom: formData.value.custom,
    page: formData.value.page,
  }).toString();
  window.history.pushState({}, '', `?${params}`);
};
</script>
