<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import RegionService from '@/api/services/regionService.js';

const props = defineProps({
  defaultData: Object, // Nhận dữ liệu từ SearchBar
});

const region = {
  code: null,
  name: '',
  fullName: 'Tất cả',
  codeName: '',
}

// State
const provinces = ref([region]);
const districts = ref([region]);
const wards = ref([region]);

const selectedProvince = ref(null);
const selectedDistrict = ref(null);
const selectedWard = ref(null);

// Lấy danh sách tỉnh/thành phố
const fetchProvinces = async () => {
  try {
    const response = await RegionService.getProvinces();
    provinces.value = [region, ...response.data];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
  }
};

// Lấy danh sách quận/huyện theo tỉnh
const fetchDistricts = async (provinceCode) => {
  if (!provinceCode) {
    districts.value = [region];
    return;
  }
  try {
    const response = await RegionService.getDistricts(provinceCode);
    districts.value = [region, ...response.data];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách quận/huyện:', error);
  }
};

// Lấy danh sách xã/phường theo quận/huyện
const fetchWards = async (districtCode) => {
  if (!districtCode) {
    wards.value = [region];
    return;
  }
  try {
    const response = await RegionService.getWards(districtCode);
    wards.value = [region, ...response.data];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách xã/phường:', error);
  }
};

// Reset khi thay đổi tỉnh/quận
watch(selectedProvince, async (newProvince) => {
  selectedDistrict.value = null;
  selectedWard.value = null;
  await fetchDistricts(newProvince);
});

watch(selectedDistrict, async (newDistrict) => {
  selectedWard.value = null;
  await fetchWards(newDistrict);
});

// Khi trang load, nhận dữ liệu từ SearchBar
onMounted(async () => {
  await fetchProvinces();

  // Nếu có dữ liệu từ URL -> Gán vào selectedProvince/District/Ward
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

const reset = () => {
  selectedProvince.value = region.code;
  selectedDistrict.value = region.code;
  selectedWard.value = region.code;
  emit('update', { province: null, district: null, ward: null });
}

const submit = () => {
  emit('update', {
    province: selectedProvince.value,
    district: selectedDistrict.value,
    ward: selectedWard.value
  });
}

watch([selectedProvince, selectedDistrict, selectedWard], async ([newProvince, newDistrict, newWard]) => {
  emit('update', {
    province: selectedProvince.value,
    district: selectedDistrict.value,
    ward: selectedWard.value
  });
});



defineExpose({ submit,reset });

const emit = defineEmits(['update']);
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
    <a-select v-model:value="selectedDistrict" placeholder="Quận/huyện" class="w-100" :disabled="!districts.length">
      <a-select-option v-for="district in districts" :key="district.code" :value="district.code">
        {{ district.fullName }}
      </a-select-option>
    </a-select>

    <!-- Chọn Xã/Phường -->
    <a-select v-model:value="selectedWard" placeholder="Xã/phường" class="w-100" :disabled="!wards.length">
      <a-select-option v-for="ward in wards" :key="ward.code" :value="ward.code">
        {{ ward.fullName }}
      </a-select-option>
    </a-select>
  </div>
</template>
