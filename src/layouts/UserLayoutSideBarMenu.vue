/* * File: UserLayoutSideBar.vue */
<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    theme="light"
    mode="inline"
    :inline-collapsed="collapsed"
  >
    <a-menu-item key="1">
      <home-outlined />
      <span>Tài khoản</span>
      <router-link to="/profile" />
    </a-menu-item>

    <a-menu-item key="2">
      <money-collect-outlined />
      <span>Nạp tiền</span>
      <router-link to="/deposit" />
    </a-menu-item>

    <a-menu-item key="3">
      <money-collect-outlined />
      <span>Bài đăng của tôi</span>
      <router-link to="/user/post" />
    </a-menu-item>

    <a-sub-menu key="sub1">
      <template #title>
        <span>
          <setting-outlined />
          <span>Tài khoản</span>
        </span>
      </template>
      <a-menu-item key="3">
        <money-collect-outlined />
        <span>Đổi mật khẩu</span>
        <router-link to="/user/password" />
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script setup>
import { ref } from 'vue'
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  MoneyCollectOutlined,
} from '@ant-design/icons-vue'

defineProps({
  collapsed: Boolean,
})

const selectedKeys = ref(['1'])
</script>

<style scoped>
/* Tùy chỉnh style nếu cần */
</style>
