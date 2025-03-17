/* * File: SearchBar.vue */
<script setup>
import { onMounted, ref, watch } from 'vue'
import ModalPrice from '@/components/modals/ModalPrice.vue'
import ModalArea from '@/components/modals/ModalArea.vue'
import RegionInput from '@/components/modals/RegionInput.vue'

const props = defineProps({
  defaultData: Object,
})

const emit = defineEmits(['update', 'search'])

const searchBarData = ref({
  isAllPrice: false,
  minArea: null,
  maxArea: null,
  minPrice: null,
  maxPrice: null,
  wardCode: null,
  districtCode: null,
  provinceCode: null,
})

const handleRegionUpdate = ({ province, district, ward }) => {
  searchBarData.value.provinceCode = province
  searchBarData.value.districtCode = district
  searchBarData.value.wardCode = ward
}

const handleAreaUpdate = ({ minArea, maxArea }) => {
  searchBarData.value.minArea = minArea
  searchBarData.value.maxArea = maxArea
}

const handlePriceUpdate = ({ isNegotiatedPrice, isAllPrice, minPrice, maxPrice }) => {
  searchBarData.value.isNegotiatedPrice = isNegotiatedPrice
  searchBarData.value.isAllPrice = isAllPrice
  searchBarData.value.minPrice = minPrice
  searchBarData.value.maxPrice = maxPrice
}

// watch(
//   searchBarData,
//   () => {
//     emit('update', searchBarData.value)
//   },
//   { deep: true }
// )

watch(
  () => props.defaultData,
  (newVal) => {
    Object.assign(searchBarData.value, newVal)
  },
  { deep: true, immediate: true },
)

const regionInput = ref(null)

const submit = () => {
  regionInput.value.submit()
  emit('update', searchBarData.value)
}
</script>

<template>
  <div class="bg-dark bg-opacity-50 p-2 rounded mb-2 d-flex">
    <RegionInput
      ref="regionInput"
      :default-data="searchBarData"
      class="d-flex flex-grow-1"
      @update="handleRegionUpdate"
    ></RegionInput>
    <a-button type="primary" @click="submit">Tìm kiếm</a-button>
  </div>

  <div class="search-bar mb-4 d-flex">
    <div class="d-flex w-auto justify-content-start gap-2 bg-dark bg-opacity-50 p-2 rounded">
      <ModalPrice @update="handlePriceUpdate" />
      <ModalArea @update="handleAreaUpdate" />
    </div>
  </div>
</template>
