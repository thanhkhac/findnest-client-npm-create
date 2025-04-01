<!-- src/views/PostView.vue -->
<template>
  <div>

    <div v-if="isLoading" class="loading-container">
      <a-spin tip="Đang tải dữ liệu..." />
    </div>

    <div v-else>
      <post-detail :post-data="post" />
      <comment-section :post-id="postId" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import PostDetail from '@/components/PostDetail.vue';
  import PostService from '@/api/services/postService'
  import CommentSection from '@/components/CommentSection.vue'

  const post = ref<any>(null);
  const isLoading = ref(true);

  const route = useRoute();
  const postId = route.params.id;

  const fetchPostData = async () => {
    try {
      isLoading.value = true;
      const response = await PostService.getPost(postId);
      post.value = response.data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu bài đăng:', error);

    } finally {
      isLoading.value = false;
    }
  };


  fetchPostData();
</script>

<style scoped>
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>