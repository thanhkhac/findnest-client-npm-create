<script setup>
import Navbar from '@/components/Navbar.vue'
</script>
<template>
  <header>
    <Navbar />
  </header>

  <div class="container">
    <main role="main"  class="pb-3 mx-md-5">
      <RouterView />
    </main>
  </div>

</template>
