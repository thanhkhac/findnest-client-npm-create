<!-- src/components/Image360View.vue -->
<template>
  <div class="image-360-container">
    <div v-if="image360Path" ref="viewer" class="viewer"></div>
    <div v-else class="no-image text-center p-5">Không có ảnh 360</div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { Viewer } from '@photo-sphere-viewer/core';
  import '@photo-sphere-viewer/core/index.css'; // Import CSS của Photo Sphere Viewer

  // Define props
  const props = defineProps<{
    image360Path: string | null; // Đường dẫn ảnh 360
    baseUrl: string; // URL cơ sở
  }>();

  // Ref để gắn viewer
  const viewer = ref<HTMLElement | null>(null);
  let photoSphereViewer: Viewer | null = null;

  // Khởi tạo viewer khi component được mount
  onMounted(() => {
    if (props.image360Path && viewer.value) {
      photoSphereViewer = new Viewer({
        container: viewer.value,
        panorama: `${props.baseUrl}${props.image360Path}`,
        navbar: ['zoom', 'move', 'fullscreen'], // Thanh điều hướng với zoom, di chuyển, fullscreen
        size: {
          width: '100%',
          height: '500px',
        },
      });
    }
  });

  // Hủy viewer khi component bị unmount
  onUnmounted(() => {
    if (photoSphereViewer) {
      photoSphereViewer.destroy();
      photoSphereViewer = null;
    }
  });
</script>

<style scoped>
  .image-360-container {
    width: 100%;
  }

  .viewer {
    width: 100%;
    height: 500px;
    border-radius: 8px;
  }

  .no-image {
    font-size: 1rem;
    color: #999;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 991px) {
    .viewer,
    .no-image {
      height: 300px;
    }
  }

  @media (max-width: 767px) {
    .viewer,
    .no-image {
      height: 200px;
    }
  }
</style>