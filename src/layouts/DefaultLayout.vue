<script setup>
import Navbar from '@/components/Navbar.vue'
</script>
<template>
  <header>
    <Navbar />
  </header>

  <div class="container">
    <main role="main" class="pb-3">
      <RouterView />
    </main>
  </div>

  <footer class="border-top footer text-muted">
    <div class="container">
      <p class="m-0">&copy; 2025 FindNest. All rights reserved.</p>
      <p class="m-0">
        Email:
        <a href="mailto:findnest.site@gmail.com" class="text-info">findnest.site@gmail.com</a>
      </p>
      <p>
        Facebook:
        <a
          href="https://www.facebook.com/profile.php?id=61573035180828"
          target="_blank"
          class="text-info"
        >
          facebook.com/FindNest
        </a>
      </p>
    </div>
  </footer>
</template>
