<template>
  <div class="container mt-4">
    <a-card title="Thông Tin Phòng" class="room-info-card">
      <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical">
        <!-- Tiêu đề -->
        <a-form-item label="Tiêu đề" name="title">
          <a-input v-model:value="formData.title" placeholder="Nhập tiêu đề" size="large" />
        </a-form-item>

        <!-- Giá & Thương lượng -->
        <a-row :gutter="[16, 16]">
          <a-col :span="12">
            <a-form-item label="Giá (VND)" name="price">
              <a-input-number
                v-model:value="formData.price"
                :min="1"
                :formatter="(value: number | string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value: string) => value.replace(/\$\s?|(,*)/g, '')"
                style="width: 100%"
                size="large"
                :disabled="formData.isNegotiatedPrice"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Có thể thương lượng">
              <a-switch v-model:checked="formData.isNegotiatedPrice" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Phòng ngủ & Phòng tắm -->
        <a-row :gutter="[16, 16]">
          <a-col :span="12">
            <a-form-item label="Số phòng ngủ" name="bedRoomCount">
              <a-input-number v-model:value="formData.bedRoomCount" :min="0" style="width: 100%" size="large" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Số phòng tắm" name="bathRoomCount">
              <a-input-number v-model:value="formData.bathRoomCount" :min="0" style="width: 100%" size="large" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Diện tích -->
        <a-form-item label="Diện tích (m²)" name="area">
          <a-input-number v-model:value="formData.area" :min="1" style="width: 100%" size="large" />
        </a-form-item>

        <!-- Mô tả -->
        <a-form-item label="Mô tả">
          <a-textarea v-model:value="formData.description" :rows="4" placeholder="Nhập mô tả chi tiết về phòng..."
                      show-count />
        </a-form-item>

        <!-- Upload Ảnh -->
        <a-row :gutter="[16, 16]">
          <a-col :span="12">
            <a-form-item label="Ảnh Thumbnail" name="thumbnail">
              <a-upload :before-upload="handleThumbnailUpload" :show-upload-list="false" accept="image/*">
                <a-button size="large">
                  <upload-outlined />
                  Tải ảnh lên
                </a-button>
              </a-upload>
              <div v-if="thumbnailPreview" class="image-preview">
                <img :src="thumbnailPreview" alt="Thumbnail" />
                <a-button type="link" danger @click="removeThumbnail">Xóa ảnh</a-button>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Ảnh 360">
              <a-upload :before-upload="handleImage360Upload" :show-upload-list="false" accept="image/*">
                <a-button size="large">
                  <upload-outlined />
                  Tải ảnh 360 lên
                </a-button>
              </a-upload>
              <div v-if="image360Preview" class="image-preview">
                <img :src="image360Preview" alt="360 Image" />
                <a-button type="link" danger @click="removeImage360">Xóa ảnh</a-button>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<!-- src/components/OtherInputPost.vue -->
<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { UploadOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'

  interface FormData {
    title: string;
    price: number;
    isNegotiatedPrice: boolean;
    bedRoomCount: number;
    bathRoomCount: number;
    area: number;
    description: string;
    thumbnail: File | null;
    image360: File | null;
  }


  const formData = ref<FormData>({
    title: 'Cho thuê phòng trọ',
    price: 1000,
    isNegotiatedPrice: false,
    bedRoomCount: 1,
    bathRoomCount: 1,
    area: 15,
    description: '',
    thumbnail: null,
    image360: null
  })

  const thumbnailPreview = computed(() => formData.value.thumbnail ? URL.createObjectURL(formData.value.thumbnail) : null)
  const image360Preview = computed(() => formData.value.image360 ? URL.createObjectURL(formData.value.image360) : null)

  const formRef = ref()

  const rules = {
    title: [{ required: true, message: 'Vui lòng nhập tiêu đề!', trigger: 'blur' }],
    price: [{ required: true, message: 'Vui lòng nhập giá hợp lệ!', trigger: 'blur', type: 'number', min: 0 }],
    area: [{ required: true, message: 'Vui lòng nhập diện tích hợp lệ!', trigger: 'blur', type: 'number', min: 0 }],
    bedRoomCount: [{ type: 'number', min: 0, message: 'Số phòng ngủ không được âm!', trigger: 'blur' }],
    bathRoomCount: [{ type: 'number', min: 0, message: 'Số phòng tắm không được âm!', trigger: 'blur' }],
    thumbnail: [{ required: true, message: 'Vui lòng tải lên ảnh Thumbnail!', trigger: 'change' }]
  }

  const handleThumbnailUpload = (file: File): boolean => {
    formData.value.thumbnail = file
    formRef.value?.validate(['thumbnail'])
    return false
  }

  const handleImage360Upload = (file: File): boolean => {
    formData.value.image360 = file
    return false
  }


  const removeThumbnail = () => {
    formData.value.thumbnail = null
    formRef.value?.validate(['thumbnail'])
    message.success('Ảnh Thumbnail đã được xóa!')
  }

  const removeImage360 = () => {
    formData.value.image360 = null
    message.success('Ảnh 360 đã được xóa!')
  }

  const emit = defineEmits(['update-validated-data'])

  const validateForm = () => {
    formRef.value.validate().then((valid: any) => {
      if (valid) {
        emit('update-validated-data', formData.value)
        message.error('Thông tin hợp lệ!')
      } else {
        message.error('Vui lòng kiểm tra lại thông tin!')
      }
    }).catch(() => {
      message.error('Có lỗi xảy ra!')
    })
  }
  defineExpose({ validateForm })
</script>

<style scoped>
  .room-info-card {
    max-width: 800px;
    margin: 0 auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
  }

  .image-preview {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  .image-preview img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 6px;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .text-center {
    margin-top: 24px;
  }
</style>
