<template>
  <ul class="list-group">
    <li v-for="item in items" :key="item" class="list-group-item">{{ item }}</li>
  </ul>
</template>

<script setup>
defineProps(['items']);
</script>
