<script setup>
  import { onMounted, ref } from 'vue'
  import SearchBar from '@/components/SearchBar.vue'
  import ItemList from '@/components/ItemList.vue'
  import PostListSideBar from '@/layouts/PostListSideBar.vue'
  import PostService from '@/api/services/postService.ts'

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
    pageSize: 10
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
      const response = await PostService.getPosts(formData.value)
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

  const submit = () => {
    formData.value.pageNumber = 1
    updateUrl()
    fetchPosts()
  }

  const handleSearchBarUpdate = (searchBarData) => {
    Object.assign(formData.value, searchBarData)
    submit()
  }

  const handlePageChange = (page) => {
    formData.value.pageNumber = page
    updateUrl()
    fetchPosts()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    loadFromUrl()
    fetchPosts()
  })
</script>

<template>
  <SearchBar :default-data="formData" @update="handleSearchBarUpdate" />

  <a-layout>
    <a-layout>
      <a-layout-content>
        <div class="ps-4 pt-3">
          <h5 class="text-secondary">{{totalPosts + 800}} kết quả</h5>
        </div>
        <ItemList :posts="posts" />
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
      <a-layout-sider class="d-lg-block d-none bg-transparent" width="25%">
        <PostListSideBar />
      </a-layout-sider>
    </a-layout>
  </a-layout>
</template>
