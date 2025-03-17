<!--
 * File: OtherInputPost.vue
 -->
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
              <a-input-number
                v-model:value="formData.bedRoomCount"
                :min="0"
                style="width: 100%"
                size="large"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Số phòng tắm" name="bathRoomCount">
              <a-input-number
                v-model:value="formData.bathRoomCount"
                :min="0"
                style="width: 100%"
                size="large"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Diện tích -->
        <a-form-item label="Diện tích (m²)" name="area">
          <a-input-number v-model:value="formData.area" :min="1" style="width: 100%" size="large" />
        </a-form-item>

        <!-- Mô tả -->
        <a-form-item label="Mô tả">
          <a-textarea
            v-model:value="formData.description"
            :rows="4"
            placeholder="Nhập mô tả chi tiết về phòng..."
            show-count
            @change="console.log('Description changed:', formData.description)"
          />
        </a-form-item>

        <!-- Upload Ảnh -->
        <a-row :gutter="[16, 16]">
          <a-col :span="12">
            <a-form-item label="Ảnh Thumbnail" name="thumbnail">
              <a-upload
                :before-upload="handleThumbnailUpload"
                :show-upload-list="false"
                accept="image/*"
              >
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
              <a-upload
                :before-upload="handleImage360Upload"
                :show-upload-list="false"
                accept="image/*"
              >
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

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import { BASE_URL } from '@/api';

  // Định nghĩa interface cụ thể cho initialData với các thuộc tính cần thiết
  interface InitialData {
    title?: string;
    price?: number | null;
    isNegotiatedPrice?: boolean;
    bedRoomCount?: number | null;
    bathRoomCount?: number | null;
    area?: number | null;
    description?: string | null;
    thumbnail?: string | null;
    image360?: string | null;
  }

  const props = defineProps<{
    initialData?: InitialData;
  }>();

  // Định nghĩa interface cho formData
  interface FormData {
    title: string;
    price: number | null;
    isNegotiatedPrice: boolean;
    bedRoomCount: number | null;
    bathRoomCount: number | null;
    area: number | null;
    description: string;
    thumbnail: File | string | null;
    image360: File | string | null;
  }

  // Khởi tạo formData với giá trị mặc định
  const formData = ref<FormData>({
    title: 'Cho thuê phòng trọ',
    price: 1_000_000,
    isNegotiatedPrice: false,
    bedRoomCount: 1,
    bathRoomCount: 1,
    area: 15,
    description: '',
    thumbnail: null,
    image360: null,
  });

  // Tham chiếu tới form để validate
  const formRef = ref();

  // Quy tắc validate
  const rules = {
    title: [{ required: true, message: 'Vui lòng nhập tiêu đề!', trigger: 'blur' }],
    price: [{ required: true, message: 'Vui lòng nhập giá hợp lệ!', trigger: 'blur', type: 'number', min: 0 }],
    area: [{ required: true, message: 'Vui lòng nhập diện tích hợp lệ!', trigger: 'blur', type: 'number', min: 0 }],
    bedRoomCount: [{ type: 'number', min: 0, message: 'Số phòng ngủ không được âm!', trigger: 'blur' }],
    bathRoomCount: [{ type: 'number', min: 0, message: 'Số phòng tắm không được âm!', trigger: 'blur' }],
    thumbnail: [{ required: true, message: 'Vui lòng tải lên ảnh Thumbnail!', trigger: 'change' }],
  };

  // Preview cho ảnh thumbnail và ảnh 360
  const thumbnailPreview = computed(() =>
    formData.value.thumbnail instanceof File
      ? URL.createObjectURL(formData.value.thumbnail)
      : typeof formData.value.thumbnail === 'string'
        ? BASE_URL + formData.value.thumbnail
        : null
  );

  const image360Preview = computed(() =>
    formData.value.image360 instanceof File
      ? URL.createObjectURL(formData.value.image360)
      : typeof formData.value.image360 === 'string'
        ? BASE_URL + formData.value.image360
        : null
  );

  // Xử lý upload ảnh thumbnail
  const handleThumbnailUpload = (file: File): boolean => {
    formData.value.thumbnail = file;
    formRef.value?.validate(['thumbnail']);
    return false; // Ngăn upload tự động
  };

  // Xử lý upload ảnh 360
  const handleImage360Upload = (file: File): boolean => {
    formData.value.image360 = file;
    return false; // Ngăn upload tự động
  };

  // Xóa ảnh thumbnail
  const removeThumbnail = () => {
    formData.value.thumbnail = null;
    formRef.value?.validate(['thumbnail']);
    message.success('Ảnh Thumbnail đã được xóa!');
  };

  // Xóa ảnh 360
  const removeImage360 = () => {
    formData.value.image360 = null;
    message.success('Ảnh 360 đã được xóa!');
  };

  // Emit dữ liệu đã được validate
  const emit = defineEmits(['update-validated-data']);

  const validateForm = () => {
    return new Promise<void>((resolve, reject) => {
      formRef.value
        .validate()
        .then(() => {
          emit('update-validated-data', formData.value);
          message.success('Thông tin hợp lệ!');
          resolve();
        })
        .catch(() => {
          message.error('Vui lòng kiểm tra lại thông tin!');
          reject(new Error('Validation failed'));
        });
    });
  };

  // Khởi tạo dữ liệu từ initialData với các thuộc tính cần thiết
  watch(
    () => props.initialData,
    (newInitialData) => {
      if (newInitialData) {
        formData.value = {
          title: newInitialData.title ?? formData.value.title,
          price: newInitialData.price ?? formData.value.price,
          isNegotiatedPrice: newInitialData.isNegotiatedPrice ?? formData.value.isNegotiatedPrice,
          bedRoomCount: newInitialData.bedRoomCount ?? formData.value.bedRoomCount,
          bathRoomCount: newInitialData.bathRoomCount ?? formData.value.bathRoomCount,
          area: newInitialData.area ?? formData.value.area,
          description: newInitialData.description ?? formData.value.description,
          thumbnail: newInitialData.thumbnail ?? formData.value.thumbnail,
          image360: newInitialData.image360 ?? formData.value.image360,
        };
      }
    },
    { immediate: true }
  );

  // Định nghĩa phương thức validateForm để component cha có thể gọi
  defineExpose({ validateForm });
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