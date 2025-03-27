<template>
  <nav
    class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3"
  >
    <div class="container">
      <a class="navbar-brand fw-bold fs-2 text-danger">FindNest</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target=".navbar-collapse"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
        <ul class="navbar-nav flex-grow-1">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link text-dark my-hover-underline">Trang chủ</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link text-dark my-hover-underline">Liên hệ</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/post/create" class="nav-link text-dark my-hover-underline">Đăng bài</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/roommate/post/create" class="nav-link text-dark my-hover-underline">Đăng tin tìm bạn</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/roommate" class="nav-link text-dark my-hover-underline">Tìm bạn cùng phòng</RouterLink>
          </li>
<!--          <li class="nav-item">-->
<!--            <RouterLink to="/search" class="nav-link text-dark my-hover-underline">Tìm kiếm</RouterLink>-->
<!--          </li>-->
        </ul>
        <ul class="navbar-nav">
          <li v-if="user" class="nav-item">
            <router-link to="/profile" class="nav-link text-dark my-hover-underline">{{ user.fullName }}</router-link>
            <span class="mx-2 ">
               Số dư: {{ user.balance !== undefined ? `${Number(user.balance).toLocaleString()} VNĐ` : 'N/A' }}
            </span>
          </li>
          <li v-if="user" class="nav-item">
            <button class="btn btn-outline-danger" @click="handleLogout">Đăng xuất</button>
          </li>
          <li v-else class="nav-item">
            <router-link to="/login" class="nav-link text-dark my-hover-underline">Đăng nhập</router-link>
            <router-link to="/register" class="nav-link text-dark my-hover-underline">Đăng ký</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>


<script setup>
  import { RouterLink } from 'vue-router'
  import { useAuth } from '@/composables/useAuth'
  import { onMounted } from 'vue'

  const { user, logout, fetchUser } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  onMounted(() => {
    fetchUser()
  })

</script>

<style scoped>
  .my-hover-underline {
    position: relative;
    text-decoration: none;
    display: inline-block;
  }

  .my-hover-underline:after {
    display: block;
    content: '';
    border-bottom: solid 3px #dc3545;
    transform: scaleX(0);
    transition: transform 250ms ease-in-out;
    transform-origin: 100% 50%;
  }

  .my-hover-underline:hover:after {
    transform: scaleX(1);
    transform-origin: 0 50%;
  }
</style>
