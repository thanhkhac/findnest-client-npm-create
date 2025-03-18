<script setup>
import { ref } from 'vue'

const priceFilter = ref(null)
const areaFilter = ref(null)

const priceOptions = [
  { label: 'Dưới 1 triệu', minPrice: 0, maxPrice: 1000000 },
  { label: 'Từ 1 - 2 triệu', minPrice: 1000000, maxPrice: 2000000 },
  { label: 'Từ 2 - 3 triệu', minPrice: 2000000, maxPrice: 3000000 },
  { label: 'Từ 3 - 5 triệu', minPrice: 3000000, maxPrice: 5000000 },
  { label: 'Từ 5 - 7 triệu', minPrice: 5000000, maxPrice: 7000000 },
  { label: 'Từ 7 - 10 triệu', minPrice: 7000000, maxPrice: 10000000 },
  { label: 'Từ 10 - 15 triệu', minPrice: 10000000, maxPrice: 15000000 },
  { label: 'Trên 15 triệu', minPrice: 15000000, maxPrice: null }, // maxPrice = null tức là không giới hạn
]

const areaOptions = [
  { label: 'Dưới 20 m²', minArea: 0, maxArea: 20 },
  { label: 'Từ 20 - 30m²', minArea: 20, maxArea: 30 },
  { label: 'Từ 30 - 50m²', minArea: 30, maxArea: 50 },
  { label: 'Từ 50 - 70m²', minArea: 50, maxArea: 70 },
  { label: 'Từ 70 - 90m²', minArea: 70, maxArea: 90 },
  { label: 'Trên 90m²', minArea: 90, maxArea: null },
]
</script>

<template>
  <div class="filter-container d-flex flex-column ">
    <a-card title="📌 Xem theo khoảng giá">
      <a-radio-group v-model:value="priceFilter" button-style="solid" class="filter-group">
        <a-radio-button
          v-for="option in priceOptions"
          :key="option.label"
          :value="{ minPrice: option.minPrice, maxPrice: option.maxPrice }"
        >
          {{ option.label }}
        </a-radio-button>
      </a-radio-group>
    </a-card>

    <a-card title="📌 Xem theo diện tích">
      <a-menu v-model:selected-keys="areaFilter" mode="inline" class="filter-menu">
        <a-menu-item
          v-for="option in areaOptions"
          :key="option.label"
          :value="{ minArea: option.minArea, maxArea: option.maxArea }"
        >
          {{ option.label }}
        </a-menu-item>
      </a-menu>
    </a-card>
  </div>
</template>

<style scoped>
.filter-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-menu {
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
