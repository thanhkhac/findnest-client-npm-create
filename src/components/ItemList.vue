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
    case 1:
      return '#ff4d4f'
    case 2:
      return '#fa8c16'
    case 3:
      return '#fadb14'
    default:
      return '#d9d9d9'
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
      item-layout="vertical"
      bordered
      :grid="{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
        xl: 2,
        xxl: 2,
      }"
    >
      <template #renderItem="{ item }">
        <a-list-item class="p-0">
          <a-card
            :bordered="true"
            :style="{
              borderColor: getBorderColor(item.planPriority),
            }"
          >
            <template #title>
              <div>
                <router-link
                  :to="`/post/detail/${item.id}`"
                  :style="{
                    color: getBorderColor(item.planPriority),
                    fontWeight: 'bold',
                    textDecoration: 'none',
                  }"
                >
                  {{ item.title }}
                </router-link>
                <div class="rating">
                  <Rate :value="item.rating || 4.5" allow-half disabled class="custom-rate" />
                </div>
              </div>
            </template>

            <template #extra>
              <a-tag :color="getBorderColor(item.planPriority)">
                {{
                  item.planPriority == 1
                    ? 'VIP 1'
                    : item.planPriority == 2
                      ? 'VIP 2'
                      : item.planPriority == 3
                        ? 'VIP 3'
                        : 'Tin thường'
                }}
              </a-tag>
            </template>

            <div class="image-container">
              <a-image
                :src="BASE_URL + item.thumbnail"
                class="main-image"
                style="height: 200px; object-fit: cover"
              />
            </div>

            <p>
              <span
                class="text"
                :style="{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'inline-block',
                  maxWidth: '100%',
                }"
              >
                <strong>Địa chỉ:</strong> {{ item.regionAddress || 'Hà Nội' }}
              </span>
            </p>
            <p>
              <strong>Giá:</strong>
              {{ item.price }}
              <strong>Diện tích:</strong>
              {{ item.area }}m²
            </p>
            <p>
              <strong>Phòng ngủ:</strong>
              {{ item.bedRoomCount }}
              -
              <strong>Phòng tắm:</strong>
              {{ item.bathRoomCount }}
            </p>
            <a-divider />

            <div class="d-md-flex justify-content-between">
              <a-flex gap="small" align="center">
                <a-avatar size="large" :src="getImageUrl(item.createdUser?.avatar)" />
                <a-flex vertical>
                  <a-typography-text strong>{{ item.createdUser?.fullName }}</a-typography-text>
                  <a-typography-text type="secondary">{{ item.createdAt }}</a-typography-text>
                </a-flex>
              </a-flex>

              <div>
                <div>
                  <a-typography-text
                    copyable
                    style="border: #888888 1px solid; border-radius: 5px; padding: 5px"
                  >
                    {{ item.createdUser?.contactPhoneNumber }}
                  </a-typography-text>
                </div>
                <div class="mt-1">
                  <a-button style="background-color: #0077cc; color: white">Zalo</a-button>
                </div>
              </div>
            </div>
          </a-card>
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

.image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.main-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

/* Đảm bảo các cột hiển thị đẹp trên màn hình lớn */
@media (min-width: 768px) {
  .ant-list-item {
    padding: 8px;
  }
}
</style>
