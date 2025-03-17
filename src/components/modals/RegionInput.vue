<!-- src/components/RegionInput.vue -->
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import RegionService from '@/api/services/regionService'

// Định nghĩa interface cho region
interface Region {
  code: string | null
  name: string
  fullName: string
  codeName: string
}

// Định nghĩa interface cho props
interface DefaultData {
  provinceCode?: string | null
  districtCode?: string | null
  wardCode?: string | null
}

// Props
const props = defineProps<{
  defaultData?: DefaultData
}>()

// Emits
const emit = defineEmits<{
  (
    e: 'update',
    value: { province: string | null; district: string | null; ward: string | null },
  ): void
  (
    e: 'live-update',
    value: { province: string | null; district: string | null; ward: string | null },
  ): void
}>()

// Dữ liệu mặc định cho region
const region: Region = {
  code: null,
  name: '',
  fullName: 'Tất cả',
  codeName: '',
}

// State
const provinces = ref<Region[]>([region])
const districts = ref<Region[]>([region])
const wards = ref<Region[]>([region])

const selectedProvince = ref<string | null>(null)
const selectedDistrict = ref<string | null>(null)
const selectedWard = ref<string | null>(null)

// Định nghĩa các hàm fetch trước khi sử dụng
const fetchProvinces = async (): Promise<void> => {
  try {
    const response = await RegionService.getProvinces()
    provinces.value = [region, ...response.data]
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error)
  }
}

const fetchDistricts = async (provinceCode: string | null): Promise<void> => {
  if (!provinceCode) {
    districts.value = [region]
    return
  }
  try {
    const response = await RegionService.getDistricts(provinceCode)
    districts.value = [region, ...response.data]
  } catch (error) {
    console.error('Lỗi khi lấy danh sách quận/huyện:', error)
  }
}

const fetchWards = async (districtCode: string | null): Promise<void> => {
  if (!districtCode) {
    wards.value = [region]
    return
  }
  try {
    const response = await RegionService.getWards(districtCode)
    wards.value = [region, ...response.data]
  } catch (error) {
    console.error('Lỗi khi lấy danh sách xã/phường:', error)
  }
}

//Watch props.defaultData sau khi các hàm được định nghĩa
watch(
  () => props.defaultData,
  async (newVal) => {
    if (!newVal) return

    // Cập nhật province nếu thay đổi
    if (newVal.provinceCode !== selectedProvince.value) {
      selectedProvince.value = newVal.provinceCode || null
      await fetchDistricts(selectedProvince.value)
    }

    // Cập nhật district nếu thay đổi
    if (newVal.districtCode !== selectedDistrict.value) {
      selectedDistrict.value = newVal.districtCode || null
      await fetchWards(selectedDistrict.value)
    }

    // Cập nhật ward nếu thay đổi
    if (newVal.wardCode !== selectedWard.value) {
      selectedWard.value = newVal.wardCode || null
    }
  },
  { deep: true, immediate: true },
)

// Reset khi thay đổi tỉnh/quận
watch(selectedProvince, async (newProvince: string | null) => {
  selectedDistrict.value = null
  selectedWard.value = null
  await fetchDistricts(newProvince)
})

watch(selectedDistrict, async (newDistrict: string | null) => {
  selectedWard.value = null
  await fetchWards(newDistrict)
})

onMounted(async () => {
  await fetchProvinces();

  // Nếu có dữ liệu từ props.defaultData -> Gán vào selectedProvince/District/Ward
  if (props.defaultData?.provinceCode) {
    selectedProvince.value = props.defaultData.provinceCode;
    await fetchDistricts(selectedProvince.value);
  }
  if (props.defaultData?.districtCode) {
    selectedDistrict.value = props.defaultData.districtCode;
    await fetchWards(selectedDistrict.value);
  }
  if (props.defaultData?.wardCode) {
    selectedWard.value = props.defaultData.wardCode;
  }
});

// Hàm reset
const reset = (): void => {
  selectedProvince.value = region.code
  selectedDistrict.value = region.code
  selectedWard.value = region.code
  emit('update', { province: null, district: null, ward: null })
}

// Hàm submit
const submit = (): void => {
  emit('update', {
    province: selectedProvince.value,
    district: selectedDistrict.value,
    ward: selectedWard.value,
  })
}

watch([selectedProvince, selectedDistrict, selectedWard], () => {
  emit('live-update', {
    province: selectedProvince.value,
    district: selectedDistrict.value,
    ward: selectedWard.value,
  })
})

// Expose các hàm
defineExpose({ submit, reset })
</script>

<template>
  <div>
    <!-- Chọn Tỉnh/Thành phố -->
    <a-select v-model:value="selectedProvince" placeholder="Tỉnh/thành phố" class="w-100">
      <a-select-option v-for="province in provinces" :key="province.code" :value="province.code">
        {{ province.fullName }}
      </a-select-option>
    </a-select>

    <!-- Chọn Quận/Huyện -->
    <a-select
      v-model:value="selectedDistrict"
      placeholder="Quận/huyện"
      class="w-100"
      :disabled="!districts.length"
    >
      <a-select-option v-for="district in districts" :key="district.code" :value="district.code">
        {{ district.fullName }}
      </a-select-option>
    </a-select>

    <!-- Chọn Xã/Phường -->
    <a-select
      v-model:value="selectedWard"
      placeholder="Xã/phường"
      class="w-100"
      :disabled="!wards.length"
    >
      <a-select-option v-for="ward in wards" :key="ward.code" :value="ward.code">
        {{ ward.fullName }}
      </a-select-option>
    </a-select>
  </div>
</template>