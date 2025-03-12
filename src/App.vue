<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#dc3545',
      },
    }"
  >
    <RouterView />
  </a-config-provider>
</template>
