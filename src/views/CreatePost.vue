<template>
  <div >
    <!-- Steps -->
    <a-steps :current="currentStep">
      <a-step title="Chọn vị trí" />
      <a-step title="Tải ảnh" />
      <a-step title="Nhập thông tin" />
    </a-steps>

    <div class="form-content mt-4">
      <!-- Bước 1: Chọn vị trí -->
      <div v-if="currentStep === 0">
        <map-with-region-select v-model:latitude="formData.latitude" v-model:longitude="formData.longitude" />
      </div>

      <!-- Bước 2: Tải ảnh -->
      <div v-if="currentStep === 1">
        <upload-images :images="formData.images" @update="handleImageUpdate" />
      </div>

      <!-- Bước 3: Nhập thông tin -->
      <div v-if="currentStep === 2">
        <OtherInputPost></OtherInputPost>
      </div>
    </div>

    <!-- Nút điều hướng -->
    <div class="mt-4">
      <a-button v-if="currentStep > 0" @click="prevStep">Quay lại</a-button>
      <a-button type="primary" @click="nextStep" class="ml-2">
        {{ currentStep < 2 ? "Tiếp theo" : "Hoàn tất" }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { message } from 'ant-design-vue'
  import MapWithRegionSelect from '@/components/MapWithRegionSelect.vue'
  import UploadImages from '@/components/UploadImages.vue'
  import OtherInputPost from '@/components/OtherInputPost.vue'

  const currentStep = ref(0)

  const formData = ref({
    title: '',
    price: null,
    isNegotiatedPrice: false,
    address: '',
    area: null,
    description: '',
    latitude: null,
    longitude: null,
    wardCode: '',
    bedRoomCount: null,
    bathRoomCount: null,
    images: [],
    thumbnail: null,
    image360: null
  })

  // Cập nhật danh sách ảnh
  const handleImageUpdate = (updatedImages: any) => {
    formData.value.images = updatedImages
    console.log('Danh sách ảnh cập nhật:', formData.value.images)
  }

  // Điều hướng bước
  const nextStep = () => {
    if (currentStep.value < 2) {
      currentStep.value++
    } else {
      message.success('Đăng tin thành công!')
      console.log('Dữ liệu gửi:', formData.value)
    }
  }

  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }
</script>

<style scoped>

</style>
