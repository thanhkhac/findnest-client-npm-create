<!-- src/views/CreatePost.vue -->
<template>
  <div>
    <a-steps :current="currentStep">
      <a-step title="Chọn vị trí" />
      <a-step title="Tải ảnh" />
      <a-step title="Nhập thông tin" />
    </a-steps>

    <div class="form-content mt-4">
      <div v-show="currentStep === 0">
        <map-with-region-select @update:data="handleMapDataUpdate" />
      </div>

      <div v-show="currentStep === 1">
        <upload-images :images="formData.images" @update="handleImageUpdate" />
      </div>

      <div v-show="currentStep === 2">
        <other-input-post @update-validated-data="handleOtherInputData" ref="otherInputPostRef" />
      </div>
    </div>

    <div class="mt-4">
      <a-button v-if="currentStep > 0" @click="prevStep">Quay lại</a-button>
      <a-button type="primary" @click="nextStep" class="ml-2">
        {{ currentStep < 2 ? 'Tiếp theo' : 'Hoàn tất' }}
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
  import postService from '@/api/services/postService'

  const currentStep = ref(0)

  interface PostFormData {
    title: string;
    price: number | null;
    isNegotiatedPrice: boolean;
    address: string;
    area: number | null;
    description: string;
    latitude: number | null;
    longitude: number | null;
    wardCode: string;
    bedRoomCount: number | null;
    bathRoomCount: number | null;
    images: ImageItem[];
    thumbnail: File | null;
    image360: File | null;
  }

  interface ImageItem {
    id?: string;
    path: string;
    file?: File;
    order: number;
  }

  const formData = ref<PostFormData>({
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

  const otherInputPostRef = ref()

  const handleImageUpdate = (updatedImages: any) => {
    formData.value.images = updatedImages
    console.log('Danh sách ảnh cập nhật:', formData.value.images)
  }

  const handleMapDataUpdate = (data: any) => {
    formData.value.wardCode = data.wardCode
    formData.value.latitude = data.latitude
    formData.value.longitude = data.longitude
    formData.value.address = data.address
  }

  const handleOtherInputData = (data: any) => {
    Object.assign(formData.value, data)
    console.log('Dữ liệu gửi:', formData.value)
  }

  const nextStep = async () => {
    if (currentStep.value === 0) {
      if (!formData.value.wardCode) {
        message.error('Vui lòng chọn khu vực!')
        return
      }
      if (!formData.value.address) {
        message.error('Vui lòng nhập địa chỉ!')
        return
      }
    }

    if (currentStep.value === 1) {
      if (formData.value.images.length === 0) {
        message.error('Vui lòng tải ảnh lên')
        return
      }
    }

    if (currentStep.value < 2) {
      currentStep.value++
    } else {
      try {
        otherInputPostRef.value.validateForm()

        const formDataToSend = new FormData()
        for (const key in formData.value) {
          const value = formData.value[key as keyof PostFormData]
          if (key === 'images' && Array.isArray(value)) {
            value.forEach((image, index) => {
              if (image.file) {
                formDataToSend.append(`images[${index}].file`, image.file)
                formDataToSend.append(`images[${index}].order`, image.order.toString())
              } else if (image.id) {
                formDataToSend.append(`images[${index}].id`, image.id)
                formDataToSend.append(`images[${index}].order`, image.order.toString())
              }
            })
          } else if (value instanceof File) {
            formDataToSend.append(key, value) // Nếu là File, giữ nguyên
          } else if (value !== null && value !== undefined) {
            formDataToSend.append(key, String(value)) // Ép kiểu số, boolean, string về string
          }
        }


        await postService.createPost(formDataToSend)
        message.success('Đăng tin thành công!')
      } catch (e) {
        console.error(e)
      }
    }
  }

  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }
</script>