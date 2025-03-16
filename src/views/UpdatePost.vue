<!-- src/views/UpdatePost.vue -->
<template>
  <div>
    <a-steps :current="currentStep">
      <a-step title="Chọn vị trí" />
      <a-step title="Tải ảnh" />
      <a-step title="Nhập thông tin" />
    </a-steps>

    <div class="form-content mt-4">
      <div v-show="currentStep === 0">
        <map-with-region-select :initial-data="mapInitialData" @update:data="handleMapDataUpdate" />
      </div>

      <div v-show="currentStep === 1">
        <upload-images :images="formData.images" @update="handleImageUpdate" />
      </div>

      <div v-show="currentStep === 2">
        <other-input-post ref="otherInputPostRef" :initial-data="formData" @update-validated-data="handleOtherInputData" />
      </div>
    </div>

    <div class="mt-4">
      <a-button v-if="currentStep > 0" @click="prevStep">Quay lại</a-button>
      <a-button type="primary" class="ml-2" @click="nextStep">
        {{ currentStep < 2 ? 'Tiếp theo' : 'Cập nhật' }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import MapWithRegionSelect from '@/components/MapWithRegionSelect.vue';
  import UploadImages from '@/components/UploadImages.vue';
  import OtherInputPost from '@/components/OtherInputPost.vue';
  import postService from '@/api/services/postService';

  // State cho các bước
  const currentStep = ref(0);

  // Định nghĩa interface cho dữ liệu form
  interface PostFormData {
    id?: string;
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
    thumbnail: File | string | null;
    image360: File | string | null;
  }

  interface ImageItem {
    id?: string;
    path: string;
    file?: File;
    order: number;
  }

  // Khởi tạo formData với dữ liệu mặc định
  const formData = ref<PostFormData>({
    id: '',
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
    image360: null,
  });

  // Dữ liệu ban đầu cho Map component
  const mapInitialData = ref({
    wardCode: '',
    latitude: null,
    longitude: null,
    address: '',
  });

  const otherInputPostRef = ref();

  // Hàm nạp dữ liệu ban đầu từ server hoặc dữ liệu mẫu
  const loadPostData = async (postId: string) => {
    try {
      const response = await postService.getPost(postId);
      console.log(response.data);
      const postData = response.data;

      // Gán dữ liệu vào formData
      formData.value = {
        id: postData.id,
        title: postData.title,
        price: postData.price,
        isNegotiatedPrice: postData.isNegotiatedPrice,
        address: postData.address,
        area: postData.area,
        description: postData.description,
        latitude: postData.latitude,
        longitude: postData.longitude,
        wardCode: postData.ward.code, // Lấy từ ward
        bedRoomCount: postData.bedRoomCount,
        bathRoomCount: postData.bathRoomCount,
        images: postData.images.map((img: any) => ({
          id: img.id,
          path: img.path,
          order: img.order,
        })),
        thumbnail: postData.thumbnail, // Lưu đường dẫn, không phải File
        image360: postData.image360, // Lưu đường dẫn, không phải File
      };

      // Gán dữ liệu ban đầu cho Map
      mapInitialData.value = {
        wardCode: postData.ward.code,
        latitude: postData.latitude,
        longitude: postData.longitude,
        address: postData.address,
      };
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu bài đăng:', error);
      message.error('Không thể tải dữ liệu bài đăng!');
    }
  };

  // Xử lý cập nhật ảnh
  const handleImageUpdate = (updatedImages: ImageItem[]) => {
    formData.value.images = updatedImages;
    console.log('Danh sách ảnh cập nhật:', formData.value.images);
  };

  // Xử lý dữ liệu từ Map
  const handleMapDataUpdate = (data: any) => {
    formData.value.wardCode = data.wardCode;
    formData.value.latitude = data.latitude;
    formData.value.longitude = data.longitude;
    formData.value.address = data.address;
  };

  // Xử lý dữ liệu từ OtherInputPost
  const handleOtherInputData = (data: any) => {
    Object.assign(formData.value, data);
    console.log('Dữ liệu gửi:', formData.value);
  };

  // Chuyển bước tiếp theo hoặc cập nhật
  const nextStep = async () => {
    if (currentStep.value === 0) {
      if (!formData.value.wardCode) {
        message.error('Vui lòng chọn khu vực!');
        return;
      }
      if (!formData.value.address) {
        message.error('Vui lòng nhập địa chỉ!');
        return;
      }
    }

    if (currentStep.value === 1) {
      if (formData.value.images.length === 0) {
        message.error('Vui lòng tải ảnh lên');
        return;
      }
    }

    if (currentStep.value < 2) {
      currentStep.value++;
    } else {
      try {
        otherInputPostRef.value.validateForm();

        const formDataToSend = new FormData();
        for (const key in formData.value) {
          const value = formData.value[key as keyof PostFormData];
          if (key === 'images' && Array.isArray(value)) {
            value.forEach((image, index) => {
              if (image.file) {
                // Nếu là ảnh mới (có file)
                formDataToSend.append(`images[${index}].file`, image.file);
                formDataToSend.append(`images[${index}].order`, image.order.toString());
              } else if (image.id) {
                // Nếu là ảnh cũ (có id)
                formDataToSend.append(`images[${index}].id`, image.id);
                formDataToSend.append(`images[${index}].order`, image.order.toString());
              }
            });
          } else if (value instanceof File) {
            formDataToSend.append(key, value); // Gửi file nếu là thumbnail hoặc image360 mới
          } else if (value !== null && value !== undefined) {
            formDataToSend.append(key, String(value)); // Gửi các giá trị khác dưới dạng string
          }
        }

        await postService.updatePost(formData.value.id!, formDataToSend); // Gọi API update
        message.success('Cập nhật bài đăng thành công!');
      } catch (e) {
        console.error('Lỗi khi cập nhật:', e);
        message.error('Cập nhật bài đăng thất bại!');
      }
    }
  };

  // Quay lại bước trước
  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  };

  // Tải dữ liệu khi component được mount
  onMounted(() => {
    const postId = '76c3bc33-9978-4e93-ba2d-72e59d69d4b4';
    loadPostData(postId);
  });
</script>