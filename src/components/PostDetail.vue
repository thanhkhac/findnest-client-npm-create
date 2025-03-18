<!-- src/components/PostDetail.vue -->
<template>
  <div class="post-detail-container container">
    <!-- Header -->
    <header class="post-header card mb-4">
      <div class="header-overlay"></div>
      <div class="header-content card-body">
        <h1 class="post-title card-title">{{ postData.title }}</h1>
        <div class="status-tags mb-2">
          <span :class="['badge', postData.isApproved ? 'bg-success' : 'bg-danger', 'animated-tag']">
            {{ postData.isApproved ? 'Đã duyệt' : 'Chưa duyệt' }}
          </span>
          <span :class="['badge', postData.isHidden ? 'bg-secondary' : 'bg-primary', 'animated-tag', 'ms-2']">
            {{ postData.isHidden ? 'Ẩn' : 'Hiển thị' }}
          </span>
        </div>
        <p class="post-address card-text">
          <environment-outlined /> {{ fullAddress }}
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <div class="row main-content">
      <!-- Left Column: Images, Description & Map -->
      <div class="col-lg-8 col-12">
        <!-- Image Gallery -->
        <div class="card image-gallery-card mb-4">
          <ul class="nav nav-tabs" id="imageTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="images-tab" data-bs-toggle="tab" data-bs-target="#images" type="button" role="tab" aria-controls="images" aria-selected="true">Hình ảnh</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="thumbnail-tab" data-bs-toggle="tab" data-bs-target="#thumbnail" type="button" role="tab" aria-controls="thumbnail" aria-selected="false">Thumbnail</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="image360-tab" data-bs-toggle="tab" data-bs-target="#image360" type="button" role="tab" aria-controls="image360" aria-selected="false">Ảnh 360</button>
            </li>
          </ul>
          <div class="tab-content" id="imageTabContent">
            <div class="tab-pane fade show active" id="images" role="tabpanel" aria-labelledby="images-tab">
              <div id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                  <div v-for="(image, index) in postData.images" :key="image.id" :class="['carousel-item', { active: index === 0 }]">
                    <img :src="BASE_URL + image.path" class="d-block w-100" alt="Post Image" />
                  </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon bg-danger" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
                  <span class="carousel-control-next-icon bg-danger"  aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
            </div>
            <div class="tab-pane fade" id="thumbnail" role="tabpanel" aria-labelledby="thumbnail-tab">
              <img :src="thumbnailUrl" class="d-block w-100 single-image" alt="Thumbnail" />
            </div>
            <div class="tab-pane fade" id="image360" role="tabpanel" aria-labelledby="image360-tab">
              <image-360-view :image360-path="postData.image360" :base-url="BASE_URL" />
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="card description-card mb-4">
          <div class="card-body">
            <h3 class="card-title">Mô tả</h3>
            <p class="card-text description-text">{{ postData.description || 'Không có mô tả' }}</p>
          </div>
        </div>

        <!-- Map -->
        <div class="card map-card">
          <div class="card-body">
            <h3 class="card-title">Vị trí trên bản đồ</h3>
            <map-view
              :latitude="postData.latitude"
              :longitude="postData.longitude"
              :address="fullAddress"
              height="400px"
            />
          </div>
        </div>
      </div>

      <!-- Right Column: Details & Contact -->
      <div class="col-lg-4 col-12">
        <!-- Room Info -->
        <div class="card info-card mb-4">
          <div class="card-body">
            <h3 class="card-title info-title">Thông tin phòng</h3>
            <div class="info-item d-flex align-items-center mb-3">
              <span class="label fw-bold">Giá:</span>
              <span v-if="!postData.isNegotiatedPrice" class="value ms-2">{{ formatPrice(postData.price) }} VND</span>
              <span v-if="postData.isNegotiatedPrice" class="negotiable ms-2">Có thể thương lượng</span>
            </div>
            <div class="info-item d-flex align-items-center mb-3">
              <span class="label fw-bold">Diện tích:</span>
              <span class="value ms-2">{{ postData.area }} m²</span>
            </div>
            <div class="info-item d-flex align-items-center mb-3">
              <span class="label fw-bold">Phòng ngủ:</span>
              <span class="value ms-2">{{ postData.bedRoomCount }}</span>
            </div>
            <div class="info-item d-flex align-items-center mb-3">
              <span class="label fw-bold">Phòng tắm:</span>
              <span class="value ms-2">{{ postData.bathRoomCount }}</span>
            </div>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="card contact-card mb-4">
          <div class="card-body text-center">
            <h3 class="card-title contact-title">Liên hệ</h3>
            <img :src="BASE_URL + postData.createdUser.avatar" class="contact-avatar rounded-circle mb-3" alt="Avatar" />
            <p class="contact-name fw-bold">{{ postData.createdUser.fullName }}</p>
            <p v-if="postData.createdUser.contactPhoneNumber" class="contact-detail">
              <phone-outlined /> {{ postData.createdUser.contactPhoneNumber }}
            </p>
            <p v-if="postData.createdUser.zalo" class="contact-detail">
              <message-outlined /> Zalo: {{ postData.createdUser.zalo }}
            </p>
            <p v-if="postData.createdUser.facebook" class="contact-detail">
              <facebook-outlined /> {{ postData.createdUser.facebook }}
            </p>
            <p v-else-if="!postData.createdUser.contactPhoneNumber" class="no-contact text-muted">
              Không có thông tin liên hệ
            </p>
          </div>
        </div>

        <!-- Plans -->
        <div class="card plan-card">
          <div class="card-body">
            <h3 class="card-title plan-title">Gói dịch vụ</h3>
            <div class="table-responsive">
              <table class="table table-striped table-sm">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Ưu tiên</th>
                  <th>Thời gian (ngày)</th>
                  <th>Giá</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="plan in postData.plans" :key="plan.id">
                  <td>{{ plan.id }}</td>
                  <td>{{ plan.priorityLevel }}</td>
                  <td>{{ plan.duration }}</td>
                  <td class="price-cell">{{ formatPrice(plan.price) }} VND</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import {
    EnvironmentOutlined,
    PhoneOutlined,
    MessageOutlined,
    FacebookOutlined,
  } from '@ant-design/icons-vue';
  import { BASE_URL } from '@/api';
  import MapView from './MapView.vue';
  import Image360View from './Image360View.vue'; // Import component ảnh 360

  const props = defineProps<{
    postData: {
      id: string;
      title: string;
      price: number;
      isNegotiatedPrice: boolean;
      address: string;
      area: number;
      description: string;
      latitude: number;
      longitude: number;
      thumbnail: string;
      isHidden: boolean;
      isApproved: boolean;
      ward: { code: string; fullName: string };
      district: { code: string; fullName: string };
      province: { code: string; fullName: string };
      bedRoomCount: number;
      bathRoomCount: number;
      image360: string | null;
      images: { id: string; path: string; order: number }[];
      createdUser: {
        id: string;
        fullName: string;
        avatar: string;
        contactPhoneNumber: string | null;
        zalo: string | null;
        facebook: string | null;
      };
      plans: { id: number; priorityLevel: number; duration: number; price: number }[];
    };
  }>();

  // Tính toán địa chỉ đầy đủ
  const fullAddress = computed(() => {
    return `${props.postData.address}, ${props.postData.ward?.fullName}, ${props.postData.district?.fullName}, ${props.postData.province?.fullName}`;
  });

  // URL cho ảnh thumbnail
  const thumbnailUrl = computed(() => BASE_URL + props.postData.thumbnail);
  const image360 = computed(() => BASE_URL + props.postData.image360);

  // Định dạng giá tiền
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
</script>

<style scoped>
  /* Giữ nguyên style cũ, chỉ thêm một số điều chỉnh nếu cần */
  .post-detail-container {
    padding: 30px 0;
  }

  /* Header */
  .post-header {
    position: relative;
    background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat;
    color: white;
    border: none;
  }

  .header-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0.25rem;
  }

  .header-content {
    position: relative;
    z-index: 1;
  }

  .post-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .animated-tag {
    transition: transform 0.3s ease;
  }

  .animated-tag:hover {
    transform: scale(1.05);
  }

  .post-address {
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* Image Gallery */
  .image-gallery-card {
    overflow: hidden;
  }

  .nav-tabs .nav-link {
    color: var(--my-brand-color);
  }

  .nav-tabs .nav-link.active {
    background-color: #f8f9fa;
    color: var(--my-brand-color);
    border-bottom: none;
  }

  .carousel-item img {
    height: 500px;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  .carousel-item:hover img {
    transform: scale(1.05);
  }

  .single-image {
    height: 500px;
    object-fit: contain;
  }

  /* Description */
  .description-card .card-title {
    color: var(--my-brand-color);
  }

  .description-text {
    font-size: 1rem;
    line-height: 1.6;
    color: #595959;
  }

  /* Map */
  .map-card .card-title {
    color: var(--my-brand-color);
  }

  /* Room Info */
  .info-card .card-title {
    color: var(--my-brand-color);
  }

  .info-item {
    font-size: 1rem;
  }

  .label {
    min-width: 100px;
  }

  .value {
    color: #595959;
  }

  .negotiable {
    color: #52c41a;
    font-size: 0.9rem;
  }

  /* Contact */
  .contact-card .card-title {
    color: var(--my-brand-color);
  }

  .contact-avatar {
    width: 80px;
    height: 80px;
    border: 3px solid #1890ff;
    object-fit: cover;
  }

  .contact-name {
    font-size: 1.2rem;
  }

  .contact-detail {
    font-size: 0.9rem;
    color: #595959;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .no-contact {
    font-style: italic;
  }

  /* Plans */
  .plan-card .card-title {
    color: var(--my-brand-color);
  }

  .price-cell {
    color: #fa541c;
    font-weight: 600;
  }

  @media (max-width: 991px) {
    .post-title {
      font-size: 2rem;
    }

    .carousel-item img,
    .single-image {
      height: 300px;
    }
  }

  @media (max-width: 767px) {
    .post-title {
      font-size: 1.5rem;
    }

    .post-address {
      font-size: 0.9rem;
    }

    .carousel-item img,
    .single-image {
      height: 200px;
    }
  }
</style>