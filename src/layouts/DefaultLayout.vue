<script setup>
import Navbar from '@/components/Navbar.vue'
import { FloatButton } from 'ant-design-vue';
import { MessageOutlined } from '@ant-design/icons-vue';

const goToFacebook = () => {
  window.open('https://www.facebook.com/profile.php?id=61573035180828', '_blank');
};


</script>
<template>
  <header>
    <Navbar />
  </header>

  <div class="container">
    <main role="main"  class="pb-3 m-xxl-5">
      <RouterView />
    </main>
  </div>


  <a-tooltip title="Liên hệ chúng tôi ngay">
    <a-float-button
      type="primary"
      @click="goToFacebook"
      style="right: 20px; bottom: 20px; background-color: #0084ff"
    >
      <template #icon>
        <MessageOutlined />
      </template>
    </a-float-button>
  </a-tooltip>

</template>
