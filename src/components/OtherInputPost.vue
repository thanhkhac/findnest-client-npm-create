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
          <a-textarea v-model:value="formData.description" :rows="4" placeholder="Nhập mô tả chi tiết về phòng..." show-count />
        </a-form-item>

        <!-- Upload Ảnh -->
        <a-row :gutter="[16, 16]">
          <a-col :span="12">
            <a-form-item label="Ảnh Thumbnail">
              <a-upload :before-upload="handleThumbnailUpload" :show-upload-list="false" accept="image/*">
                <a-button size="large"><upload-outlined /> Tải ảnh lên</a-button>
              </a-upload>
              <div v-if="formData.thumbnail" class="image-preview">
                <img :src="formData.thumbnail" alt="Thumbnail" />
                <a-button type="link" danger @click="removeThumbnail">Xóa ảnh</a-button>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Ảnh 360">
              <a-upload :before-upload="handleImage360Upload" :show-upload-list="false" accept="image/*">
                <a-button size="large"><upload-outlined /> Tải ảnh 360 lên</a-button>
              </a-upload>
              <div v-if="formData.image360" class="image-preview">
                <img :src="formData.image360" alt="360 Image" />
                <a-button type="link" danger @click="removeImage360">Xóa ảnh</a-button>
              </div>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Nút Lưu -->
        <a-form-item>
          <div class="text-center">
            <a-button type="primary" size="large" :loading="loading" @click="submitForm">Lưu Thông Tin</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';

  interface FormData {
    title: string;
    price: number | null;
    isNegotiatedPrice: boolean;
    bedRoomCount: number | null;
    bathRoomCount: number | null;
    area: number | null;
    description: string;
    thumbnail: string | null;
    image360: string | null;
  }

  const formData = ref<FormData>({
    title: '',
    price: null,
    isNegotiatedPrice: false,
    bedRoomCount: null,
    bathRoomCount: null,
    area: null,
    description: '',
    thumbnail: null,
    image360: null,
  });

  const formRef = ref();
  const loading = ref(false);

  // Định nghĩa rules validation
  const rules = {
    title: [{ required: true, message: 'Vui lòng nhập tiêu đề!', trigger: 'blur' }],
    price: [{ required: true, message: 'Vui lòng nhập giá hợp lệ!', trigger: 'blur', type: 'number', min: 1 }],
    area: [{ required: true, message: 'Vui lòng nhập diện tích hợp lệ!', trigger: 'blur', type: 'number', min: 1 }],
    bedRoomCount: [{ type: 'number', min: 0, message: 'Số phòng ngủ không được âm!', trigger: 'blur' }],
    bathRoomCount: [{ type: 'number', min: 0, message: 'Số phòng tắm không được âm!', trigger: 'blur' }],
  };

  const handleThumbnailUpload = (file: File): boolean => {
    formData.value.thumbnail = URL.createObjectURL(file);
    return false;
  };

  const handleImage360Upload = (file: File): boolean => {
    formData.value.image360 = URL.createObjectURL(file);
    return false;
  };

  const removeThumbnail = () => {
    formData.value.thumbnail = null;
    message.success('Ảnh Thumbnail đã được xóa!');
  };

  const removeImage360 = () => {
    formData.value.image360 = null;
    message.success('Ảnh 360 đã được xóa!');
  };

  const submitForm = async () => {
    try {
      await formRef.value.validate();
      loading.value = true;
      console.log('Dữ liệu gửi:', formData.value);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả lập API call
      message.success('Thông tin đã được lưu thành công!');
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin nhập!');
    } finally {
      loading.value = false;
    }
  };
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
    align-items: center;
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
