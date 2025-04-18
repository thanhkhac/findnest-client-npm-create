<script setup>
import { onMounted, ref } from 'vue'
import PostUserManageItem from '@/components/PostUserManageItem.vue'
import userManageService from '@/api/services/userManageService.js'
import postService from '@/api/services/postService.js'
import { message } from 'ant-design-vue'

const formData = ref({
  isNegotiatedPrice: false,
  isAllPrice: true,
  minArea: null,
  maxArea: null,
  minLat: null,
  minLon: null,
  maxLat: null,
  maxLon: null,
  wardCode: null,
  districtCode: null,
  provinceCode: null,
  pageNumber: 1,
  pageSize: 10,
})

const posts = ref([])
const totalPosts = ref(0)
const totalPages = ref(0)

const updateUrl = () => {
  const params = new URLSearchParams()
  Object.keys(formData.value).forEach((key) => {
    const value = formData.value[key]
    if (value !== null && value !== undefined && value !== '') {
      params.set(key, value.toString())
    }
  })
  window.history.pushState({}, '', `?${params.toString()}`)
}

const loadFromUrl = () => {
  const params = new URLSearchParams(window.location.search)

  params.forEach((value, key) => {
    if (key in formData.value) {
      if (['provinceCode', 'districtCode', 'wardCode'].includes(key)) {
        formData.value[key] = value
      } else if (typeof formData.value[key] === 'boolean') {
        formData.value[key] = value === 'true'
      } else if (typeof formData.value[key] === 'number' || formData.value[key] === null) {
        formData.value[key] = value ? Number(value) : null
      } else {
        formData.value[key] = value
      }
    }
  })
}

const fetchPosts = async () => {
  try {
    const response = await userManageService.getOwnerPosts(formData.value)
    posts.value = response.data

    const pagination = response.pagination
    if (pagination) {
      formData.value.pageNumber = pagination.CurrentPage
      formData.value.pageSize = pagination.PageSize
      totalPosts.value = pagination.TotalCount
      totalPages.value = pagination.TotalPages
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error)
  }
}

const handlePageChange = (page) => {
  formData.value.pageNumber = page
  updateUrl()
  fetchPosts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleDelete = async (postId) => {
  try {
    await postService.deletePost(postId)
    message.success('Xóa bài viết thành công!')
    await fetchPosts()
  } catch (error) {
    console.error('Lỗi khi xóa bài viết:', error)
    message.error('Không thể xóa bài viết!')
  }
}

onMounted(() => {
  loadFromUrl()
  fetchPosts()
})
</script>

<template>
  <a-layout>
    <a-layout>
      <a-layout-content>
        <PostUserManageItem :posts="posts" @delete-post="handleDelete" />
        <div class="d-flex justify-content-center">
          <a-pagination
            :current="formData.pageNumber"
            :total="totalPosts"
            :page-size="formData.pageSize"
            :show-size-changer="false"
            @change="handlePageChange"
          />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
/* Có thể giữ nguyên hoặc thêm style nếu cần */
</style>
