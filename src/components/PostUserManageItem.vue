<script setup>
  import { Rate } from 'ant-design-vue'
  import { BASE_URL } from '../api/index.ts'

  defineProps({
    posts: {
      type: Array,
      default: () => [],
    },
  })

  const getBorderColor = (type) => {
    switch (type) {
      case 1: return '#ff4d4f'
      case 2: return '#fa8c16'
      case 3: return '#fadb14'
      default: return '#555555'
    }
  }

  const getImageUrl = (imagePath) => {
    if (imagePath.startsWith('http')) return imagePath
    return `${BASE_URL}${imagePath}`
  }
</script>

<template>
  <div class="post-list">
    <a-list
      :data-source="posts"
      item-layout="horizontal"
      bordered
    >
      <template #renderItem="{ item }">
        <a-list-item class="post-item">
          <a-flex align="center" justify="space-between" class="w-100">
            <!-- Left section: Thumbnail and basic info -->
            <a-flex gap="middle" align="center">
              <a-image
                :src="BASE_URL + item.thumbnail"
                class="thumbnail"
                style="width: 80px; height: 60px; object-fit: cover"
              />
              <a-flex vertical>
                <router-link
                  :to="`/post/detail/${item.id}`"
                  :style="{ color: getBorderColor(item.planPriority) }"
                >
                  {{ item.title }}
                </router-link>
                <a-typography-text type="secondary">
                  {{ item.price }} - {{ item.area }}m² - {{ item.regionAddress || 'Hà Nội' }}
                </a-typography-text>
              </a-flex>
            </a-flex>

            <!-- Right section: Actions -->
            <a-flex gap="small">
              <router-link
                :to="`/post/update/${item.id}`"
                :style="{ color: getBorderColor(item.planPriority) }"
              >
                <a-button  size="small">Sửa</a-button>
              </router-link>
              <a-button type="primary" danger size="small">Xóa</a-button>
              <router-link
                :to="`/user/post/buy-plan/${item.id}`"
              >
                <a-button type="dashed" size="small">Mua gói</a-button>
              </router-link>
            </a-flex>
          </a-flex>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
  .post-list {
    padding: 16px;
    margin: 0 auto;
  }

  .post-item {
    padding: 8px 16px;
  }

  .thumbnail {
    border-radius: 4px;
  }

  .w-100 {
    width: 100%;
  }

  /* Hover effect for list items */
  .post-item:hover {
    background-color: #f5f5f5;
  }
</style>