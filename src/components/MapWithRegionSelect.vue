<!-- MapWithRegionSelect.vue -->
<template>
  <RegionInput
    ref="regionInput"
    :default-data="{
      provinceCode: formData.provinceCode,
      districtCode: formData.districtCode,
      wardCode: formData.wardCode,
    }"
    class="d-flex mb-3"
    @live-update="handleRegionUpdate"
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

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import OsmMap from './OsmMap.vue';
  import RegionInput from '@/components/modals/RegionInput.vue';

  // Define interfaces for type safety
  interface MapData {
    provinceCode: string | null;
    districtCode: string | null;
    wardCode: string | null;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
  }

  interface RegionUpdate {
    province: string | null;
    district: string | null;
    ward: string | null;
  }

  interface Coordinates {
    latitude: number;
    longitude: number;
  }

  // Define props with types
  const props = defineProps<{
    initialData?: Partial<MapData>;
  }>();

  // Define emits with types
  const emit = defineEmits<{
    (e: 'update:data', value: MapData): void;
  }>();

  // Initialize formData with default values
  const formData = ref<MapData>({
    provinceCode: props.initialData?.provinceCode ?? null,
    districtCode: props.initialData?.districtCode ?? null,
    wardCode: props.initialData?.wardCode,
    latitude: props.initialData?.latitude ?? null,
    longitude: props.initialData?.longitude ?? null,
    address: props.initialData?.address ?? null,
  });

  // Reference to RegionInput component
  const regionInput = ref<InstanceType<typeof RegionInput> | null>(null);

  // Watch formData changes and emit updates
  watch(
    formData,
    (newValue: MapData) => {
      emit('update:data', newValue);
    },
    { deep: true }
  );

  watch(
    () => props.initialData,
    (newValue) => {
      formData.value = {
        provinceCode: newValue?.provinceCode ?? null,
        districtCode: newValue?.districtCode ?? null,
        wardCode: newValue?.wardCode ?? null,
        latitude: newValue?.latitude ?? null,
        longitude: newValue?.longitude ?? null,
        address: newValue?.address ?? null,
      };
    },
    { deep: true, immediate: true }
  );

  watch(formData, (newValue) => {
    console.log('formData updated:', newValue);
  }, { deep: true });

  // Handle region updates from RegionInput
  const handleRegionUpdate = ({ province, district, ward }: RegionUpdate): void => {
    formData.value.provinceCode = province;
    formData.value.districtCode = district;
    formData.value.wardCode = ward;
    emit('update:data', formData.value);
  };

  // Handle coordinate updates from OsmMap
  const handleCoordinatesUpdate = (coords: Coordinates): void => {
    formData.value.latitude = coords.latitude;
    formData.value.longitude = coords.longitude;
    emit('update:data', formData.value);
  };
</script>

<style scoped>
  /* Keep your existing styles here */
</style>