<!-- src/components/CommentSection.vue -->
<template>
  <div class="comment-section">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <a-spin tip="Đang tải bình luận..." />
    </div>

    <!-- Comment list -->
    <div v-else>
      <!-- Comment form for top-level comments -->
      <a-form v-if="isAuthenticated" @submit.prevent="submitComment">
        <a-textarea
          v-model:value="newComment"
          placeholder="Viết bình luận của bạn..."
          :rows="4"
          :maxlength="1000"
        />
        <a-button type="primary" html-type="submit" :loading="isSubmitting" class="submit-btn">
          Đăng bình luận
        </a-button>
      </a-form>

      <!-- Comment list -->
      <div class="comment-list" v-if="comments.length > 0">
        <comment-item
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :post-id="postId"
          @reply="handleReply"
          @update="fetchComments"
        />
      </div>
      <div v-else class="no-comments">
        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useAuth } from '@/composables/useAuth'; // Giả định có composable để check auth
  import axios from 'axios';
  import CommentItem from './CommentItem.vue';
  import CommentService from '@/api/services/commentService';

  // Props
  const props = defineProps<{
    postId: string;
  }>();

  // States
  const comments = ref<any[]>([]);
  const isLoading = ref(true);
  const newComment = ref('');
  const isSubmitting = ref(false);

  // Auth state
  const { isAuthenticated } = useAuth(); // Giả định có hàm check auth

  // Fetch comments
  const fetchComments = async () => {
    try {
      isLoading.value = true;
      const response = await CommentService.getPostComments(props.postId);
      comments.value = response.data;
    } catch (error) {
      console.error('Lỗi khi tải bình luận:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Submit new comment
  const submitComment = async () => {
    if (!newComment.value.trim()) return;

    try {
      isSubmitting.value = true;
      await CommentService.createComment({
        postId: props.postId,
        content: newComment.value,
        parentId: null
      });
      newComment.value = '';
      await fetchComments();
    } catch (error) {
      console.error('Lỗi khi đăng bình luận:', error);
    } finally {
      isSubmitting.value = false;
    }
  };

  // Handle reply from child component
  const handleReply = async (parentId: string) => {
    await fetchComments(); // Refresh comments after reply
  };

  // Load initial comments
  fetchComments();
</script>

<style scoped>
  .comment-section {
    margin-top: 20px;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    padding: 20px;
  }

  .submit-btn {
    margin-top: 10px;
  }

  .comment-list {
    margin-top: 20px;
  }

  .no-comments {
    text-align: center;
    color: #888;
    padding: 20px;
  }
</style>