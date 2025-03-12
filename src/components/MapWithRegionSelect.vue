<script setup>
  import { ref } from 'vue'
  import OsmMap from './OsmMap.vue';
  import RegionInput from '@/components/modals/RegionInput.vue'       // Đường dẫn đến OsmMap

  const emit = defineEmits(['update:data']);

  // State lưu trữ dữ liệu từ RegionInput và OsmMap
  const formData = ref({
    provinceCode: null,
    districtCode: null,
    wardCode: null,
    latitude: null,
    longitude: null,
    address:null
  });

  // Xử lý khi RegionInput emit dữ liệu
  const handleRegionUpdate = ({ province, district, ward }) => {
    formData.value.provinceCode = province;
    formData.value.districtCode = district;
    formData.value.wardCode = ward;
    emit('update:data', formData.value);
  };

  // Xử lý khi OsmMap emit tọa độ
  const handleCoordinatesUpdate = (coords) => {
    formData.value.latitude = coords.latitude;
    formData.value.longitude = coords.longitude;
    emit('update:data', formData.value);
  };

  // const mapSrc = computed(() => {
  //   if (!formData.value.latitude || !formData.value.longitude) {
  //     return "https://maps.google.com/maps?q=0,0&hl=es&z=10&output=embed"; // URL mặc định
  //   }
  //   return `https://maps.google.com/maps?q=${formData.value.latitude},${formData.value.longitude}&hl=es&z=14&output=embed`;
  // });

  // Ref để truy cập RegionInput
  const regionInput = ref(null);
</script>

<template>
    <!-- Region Input -->
    <RegionInput
      ref="regionInput"
      :default-data="{
        provinceCode: formData.provinceCode,
        districtCode: formData.districtCode,
        wardCode: formData.wardCode
      }"
      class="d-flex mb-3"
      @update="handleRegionUpdate"
    />

    <!-- OSM Map -->
    <osm-map
      :province-code="formData.provinceCode"
      :district-code="formData.districtCode"
      :ward-code="formData.wardCode"
      @update:coordinates="handleCoordinatesUpdate"
    />
    <input v-model="formData.address" type="text" autocomplete="address" class="form-control mt-3" placeholder="Địa chỉ cụ thể (Nếu có)">
<!--    <iframe-->
<!--      class="w-100"-->
<!--      style="height: 500px"-->
<!--      :src="mapSrc">-->
<!--    </iframe>-->
</template>

<style scoped>

</style>