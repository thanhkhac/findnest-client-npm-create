<!-- src/components/MapView.vue -->
<template>
  <div class="map-container">
    <div ref="mapRef" class="map" :style="{ height: mapHeight }"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import L from 'leaflet';

  // Props để nhận tọa độ và chiều cao bản đồ
  const props = defineProps<{
    latitude: number;
    longitude: number;
    height?: string; // Chiều cao tùy chọn, mặc định là 400px
    address?: string; // Địa chỉ để hiển thị trong popup
  }>();

  // Ref để tham chiếu đến phần tử DOM của bản đồ
  const mapRef = ref<HTMLElement | null>(null);
  let map: L.Map | null = null;

  // Chiều cao mặc định nếu không truyền vào
  const mapHeight = props.height || '400px';

  // Khởi tạo bản đồ khi component được mount
  onMounted(() => {
    if (mapRef.value) {
      // Khởi tạo bản đồ với tọa độ từ props
      map = L.map(mapRef.value).setView([props.latitude, props.longitude], 13);

      // Thêm lớp tile từ OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Thêm marker với popup hiển thị địa chỉ (nếu có)
      L.marker([props.latitude, props.longitude])
        .addTo(map)
        .bindPopup(props.address || 'Vị trí bài đăng')
        .openPopup();
    }
  });

  // Hủy bản đồ khi component bị unmount để tránh lỗi bộ nhớ
  onUnmounted(() => {
    if (map) {
      map.remove();
      map = null;
    }
  });
</script>

<style scoped>
  .map-container {
    width: 100%;
  }

  .map {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
</style>