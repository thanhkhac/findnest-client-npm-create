/* * File: UserLayout.vue */
<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      breakpoint="lg"
      :width="200"
      theme="light"
      class="sidebar"
    >
      <router-link to="/" class="logo">
        <h2 v-if="!collapsed" class="fw-bold">FindNest</h2>
        <h2 v-else>F</h2>
      </router-link>
      <UserLayoutSideBarMenu :collapsed="collapsed" />
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="header d-flex justify-content-between">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="toggleSidebar" />
        <menu-fold-outlined v-else class="trigger" @click="toggleSidebar" />
        <div v-if="user" class="user-info ms-auto d-flex align-items-center">
          <span class="me-3">Xin chào, {{ user.fullName }}</span>
          <span class="balance text-success fw-bold">
            {{ user.balance !== undefined ? `${Number(user.balance).toLocaleString()} VNĐ` : 'N/A' }}
          </span>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <div class="content-wrapper">
          <RouterView />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import UserLayoutSideBarMenu from './UserLayoutSideBarMenu.vue'
import { useAuth } from '@/composables/useAuth'

const collapsed = ref(false)

const { user, fetchUser } = useAuth()


onMounted(() => {
  fetchUser() // Lấy thông tin người dùng khi component được mount
})

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}
</script>

<style scoped>
.header {
  background-color: white;
}

.trigger {
  font-size: 18px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 64px;
  color: var(--my-brand-color);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  font-weight: bolder;
}

.content {
  margin: 24px 16px 0;
}

.content-wrapper {
  padding: 24px;
  background: #fff;
  min-height: 360px;
}

.footer {
  text-align: center;
}
</style>
