<!-- src/views/PostView.vue -->
<template>
  <div>
    <!-- Hiển thị loading khi đang tải dữ liệu -->
    <div v-if="isLoading" class="loading-container">
      <a-spin tip="Đang tải dữ liệu..." />
    </div>
    <!-- Hiển thị PostDetail khi dữ liệu đã tải xong -->
    <post-detail v-else :post-data="post" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router'; // Dùng useRoute để lấy params từ URL
  import axios from 'axios';
  import PostDetail from '@/components/PostDetail.vue';
  import PostService from '@/api/services/postService.ts'

  // Khai báo biến reactive
  const post = ref<any>(null); // Dữ liệu bài đăng từ API
  const isLoading = ref(true); // Trạng thái loading

  // Lấy id từ URL
  const route = useRoute();
  const postId = route.params.id; // Lấy id từ params (ví dụ: /detail/76c3bc33-9978-4e93-ba2d-72e59d69d4b4)

  // Hàm gọi API
  const fetchPostData = async () => {
    try {
      isLoading.value = true; // Bật loading
      const response = await PostService.getPost(postId); // Gọi API
      post.value = response.data; // Gán dữ liệu từ API vào post
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu bài đăng:', error);
      // Có thể thêm thông báo lỗi cho người dùng ở đây
    } finally {
      isLoading.value = false; // Tắt loading dù thành công hay thất bại
    }
  };

  // Gọi API khi component được mount
  fetchPostData();
</script>

<style scoped>
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Chiếm toàn bộ chiều cao màn hình */
  }
</style>