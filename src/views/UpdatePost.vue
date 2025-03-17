<!-- src/views/UpdatePost.vue -->
<template>
  <div>
    <a-steps :current="currentStep">
      <a-step title="Chọn vị trí" />
      <a-step title="Tải ảnh" />
      <a-step title="Nhập thông tin" />
    </a-steps>

    <div v-if="!isLoading" class="form-content mt-4">
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
    <div v-if="isLoading" >
      <div class="vh-100">
        <a-spin />
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
  import { useRoute } from 'vue-router'

  const isLoading = ref(true);
  const currentStep = ref(0);

  // Interface cho dữ liệu gửi đi
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

  // Interface cho dữ liệu từ API
  interface PostApiResponse {
    id: string;
    title: string;
    price: number | null;
    isNegotiatedPrice: boolean;
    address: string;
    area: number | null;
    description: string;
    latitude: number | null;
    longitude: number | null;
    province: {
      code: string;
    };
    district: {
      code: string;
    };
    ward: {
      code: string;
    };
    bedRoomCount: number | null;
    bathRoomCount: number | null;
    images: {
      id: string;
      path: string;
      order: number;
    }[];
    thumbnail: string | null;
    image360: string | null;
  }

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

  const mapInitialData = ref({
    provinceCode: '',
    districtCode: '',
    wardCode: '',
    latitude: null,
    longitude: null,
    address: '',
  });

  const otherInputPostRef = ref();

  const loadPostData = async (postId: string) => {
    try {
      const response = await postService.getPost(postId);
      const postData: PostApiResponse = response.data;

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
        wardCode: postData.ward.code,
        bedRoomCount: postData.bedRoomCount,
        bathRoomCount: postData.bathRoomCount,
        images: postData.images.map((img) => ({
          id: img.id,
          path: 'http://localhost:8080' + img.path,
          order: img.order,
        })),
        thumbnail: postData.thumbnail,
        image360: postData.image360,
      };

      mapInitialData.value = {
        provinceCode: postData.province.code, // Thêm provinceCode
        districtCode: postData.district.code, // Thêm districtCode
        wardCode: postData.ward.code,
        latitude: postData.latitude,
        longitude: postData.longitude,
        address: postData.address,
      };
      isLoading.value = false;
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu bài đăng:', error);
      message.error('Không thể tải dữ liệu bài đăng!');
      isLoading.value = false;
    }
  };

  const handleImageUpdate = (updatedImages: ImageItem[]) => {
    formData.value.images = updatedImages;
    console.log('Danh sách ảnh cập nhật:', formData.value.images);
  };

  const handleMapDataUpdate = (data: any) => {
    formData.value.wardCode = data.wardCode;
    formData.value.latitude = data.latitude;
    formData.value.longitude = data.longitude;
    formData.value.address = data.address;
  };

  const handleOtherInputData = (data: any) => {
    Object.assign(formData.value, data);
    console.log('Dữ liệu gửi:', formData.value);
  };

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
        await otherInputPostRef.value.validateForm();

        const formDataToSend = new FormData();
        for (const key in formData.value) {
          const value = formData.value[key as keyof PostFormData];
          if (key === 'images' && Array.isArray(value)) {
            value.forEach((image, index) => {
              if (image.file) {
                formDataToSend.append(`images[${index}].file`, image.file);
                formDataToSend.append(`images[${index}].order`, image.order.toString());
              } else if (image.id) {
                formDataToSend.append(`images[${index}].id`, image.id);
                formDataToSend.append(`images[${index}].order`, image.order.toString());
              }
            });
          } else if (value instanceof File) {
            formDataToSend.append(key, value);
          } else if (value !== null && value !== undefined) {
            formDataToSend.append(key, String(value));
          }
        }

        await postService.updatePost(formData.value.id!, formDataToSend);
        message.success('Cập nhật bài đăng thành công!');
      } catch (e) {
        console.error('Lỗi khi cập nhật:', e);
        message.error('Cập nhật bài đăng thất bại!');
      }
    }
  };

  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  };

  onMounted(() => {
    const route = useRoute();
    const postId = route.params.id;
    loadPostData(postId);
  });
</script>