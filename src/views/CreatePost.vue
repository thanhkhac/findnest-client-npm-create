<template>

  <div class="container">
    <map-with-region-select/>
  </div>


</template>
<script setup lang="ts">
  import MapWithRegionSelect from '@/components/MapWithRegionSelect.vue'
  import { ref } from 'vue'

  const formData = ref({
    title: '',
    price: null,
    isNegotiatedPrice: false,
    address: '',
    area: null,
    description: '',
    latitude: null,
    longitude: null,
    wardCode: '',
    bedRoomCount: null,
    bathRoomCount: null,
    images: [],
    thumbnail: null,
    image360: null,
  });


</script>