<template>
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center mt-3">
      <!--   Nếu như trang hiện tại là trang đầu tiên, tức không có trang trước, thêm class 'disabled'  -->
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" @click="changePage(currentPage - 1)">Trước</button>
      </li>
      <li class="page-item disabled">
        <span class="page-link">Trang {{ currentPage }}</span>
      </li>
      <li class="page-item">
        <!--   Khi click sẽ gọi hàm changePage     -->
        <button class="page-link" @click="changePage(currentPage + 1)">Sau</button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
//Nhận current page từ component cha
defineProps(['currentPage'])
//Các thông tin được xuất ra để component cha sử dụng
const emit = defineEmits(['update-page'])
//Khi hàm change được chạy, nó sẽ xuất ra sự kiện update-page lên component cha
const changePage = (page) => {
  emit('update-page', page)
}
</script>
