/* * File: MapWithRegionSelect.vue */
<script setup>
  import { ref, watch } from 'vue';
  import OsmMap from './OsmMap.vue';
  import RegionInput from '@/components/modals/RegionInput.vue';

  const emit = defineEmits(['update:data']);

  const props = defineProps({
    initialData: {
      type: Object,
      default: () => ({
        provinceCode: null,
        districtCode: null,
        wardCode: null,
        latitude: null,
        longitude: null,
        address: null,
      }),
    },
  });

  const formData = ref({ ...props.initialData });

  watch(
    formData,
    (newValue) => {
      emit('update:data', newValue);
    },
    { deep: true }
  );

  const handleRegionUpdate = ({ province, district, ward }) => {
    formData.value.provinceCode = province;
    formData.value.districtCode = district;
    formData.value.wardCode = ward;
    emit('update:data', formData.value);
  };

  const handleCoordinatesUpdate = (coords) => {
    formData.value.latitude = coords.latitude;
    formData.value.longitude = coords.longitude;
    emit('update:data', formData.value);
  };

  const regionInput = ref(null);
</script>

<template>
  <RegionInput
    ref="regionInput"
    :default-data="{
      provinceCode: formData.provinceCode,
      districtCode: formData.districtCode,
      wardCode: formData.wardCode,
    }"
    class="d-flex mb-3"
    @update="handleRegionUpdate"
  />

  <osm-map
    :province-code="formData.provinceCode"
    :district-code="formData.districtCode"
    :ward-code="formData.wardCode"
    @update:coordinates="handleCoordinatesUpdate"
  />
  <input
    v-model="formData.address"
    type="text"
    autocomplete="address"
    class="form-control mt-3"
    placeholder="Địa chỉ cụ thể (Nếu có)"
  />
</template>

<style scoped></style>