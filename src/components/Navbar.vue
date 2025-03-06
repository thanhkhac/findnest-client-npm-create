<script setup>
import { RouterLink } from 'vue-router'
</script>

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
            <a class="nav-link text-dark my-hover-underline">Đăng tin</a>
          </li>
          <li class="nav-item">
            <RouterLink to="/search" class="nav-link text-dark my-hover-underline">Tìm kiếm</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

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
