<!-- src/components/CommentItem.vue -->
<template>
  <div class="comment-item" :class="{ 'reply': comment.parentId }">
    <div class="comment-header">
      <img :src="avatarUrl" class="avatar" />
      <div class="user-info">
        <span class="username">{{ comment.createdBy?.fullName }}</span>
        <span class="timestamp">{{ formatDate(comment.createdAt) }}</span>
      </div>
    </div>
    <div class="comment-content">{{ comment.content }}</div>

    <!-- Reply button and count -->
    <div class="comment-actions">
      <a-button type="link" @click="showReplyForm = !showReplyForm">
        Trả lời ({{ comment.replyCount }})
      </a-button>
    </div>

    <!-- Reply form -->
    <a-form v-if="showReplyForm && isAuthenticated" @submit.prevent="submitReply" class="reply-form">
      <a-textarea
        v-model:value="replyContent"
        placeholder="Viết câu trả lời..."
        :rows="3"
        :maxlength="1000"
      />
      <a-button type="primary" html-type="submit" :loading="isReplying" class="reply-btn">
        Gửi
      </a-button>
    </a-form>

    <!-- Nested replies -->
    <div class="replies" v-if="comment.replies && comment.replies.length > 0">
      <comment-item
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :post-id="postId"
        @reply="emitReply"
        @update="emitUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useAuth } from '@/composables/useAuth';
  import CommentService from '@/api/services/commentService';
  import { BASE_URL } from '@/api'

  // Define props với type chính xác
  interface Comment {
    id: string;
    postId: string;
    parentId?: string | null;
    content: string;
    createdBy: {
      fullName: string;
      avatar?: string | null;
    };
    createdAt: string;
    replyCount: number;
    replies: Comment[];
  }

  const props = defineProps<{
    comment: Comment;
    postId: string;
  }>();

  const avatarUrl = computed(() => {
    if (!props.comment.createdBy) {
      return 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';
    }
    return props.comment.createdBy.avatar
      ? `${BASE_URL}${props.comment.createdBy.avatar}`
      : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';
  });


  // Define emits
  const emit = defineEmits<{
    (e: 'reply', id: string): void;
    (e: 'update'): void;
  }>();

  // Custom emit functions
  const emitReply = (id: string) => emit('reply', id);
  const emitUpdate = () => emit('update');

  const { isAuthenticated } = useAuth();
  const showReplyForm = ref(false);
  const replyContent = ref('');
  const isReplying = ref(false);

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  // Submit reply
  const submitReply = async () => {
    if (!replyContent.value.trim()) return;

    try {
      isReplying.value = true;
      await CommentService.createComment({
        postId: props.postId,
        content: replyContent.value,
        parentId: props.comment.id
      });
      replyContent.value = '';
      showReplyForm.value = false;
      emitUpdate();
    } catch (error) {
      console.error('Lỗi khi gửi trả lời:', error);
    } finally {
      isReplying.value = false;
    }
  };
</script>

<style scoped>
  .comment-item {
    padding: 10px;
    border-bottom: 1px solid #f0f0f0;
  }

  .reply {
    margin-left: 40px;
  }

  .comment-header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .user-info {
    display: flex;
    flex-direction: column;
  }

  .username {
    font-weight: bold;
  }

  .timestamp {
    font-size: 12px;
    color: #888;
  }

  .comment-content {
    margin: 5px 0;
  }

  .comment-actions {
    margin-top: 5px;
  }

  .reply-form {
    margin-top: 10px;
  }

  .reply-btn {
    margin-top: 5px;
  }

  .replies {
    margin-top: 10px;
  }
</style>