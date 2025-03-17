<script setup lang="ts">
  import { ref } from 'vue'

  // Định nghĩa props
  interface Props {
    username?: string
    fullname?: string
    phone?: string
    balance?: number
    avatarUrl?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    username: 'nguyenvan_a',
    fullname: 'Nguyễn Văn A',
    phone: '0382293846',
    balance: 2500000,
    avatarUrl: 'https://i.pravatar.cc/150?u=nguyenvana'
  })

  // Dữ liệu phản hồi (reactive)
  const localFullname = ref(props.fullname)
  const localPhone = ref(props.phone)
  const localAvatarUrl = ref(props.avatarUrl)

  // Xử lý avatar
  const changeAvatar = () => {
    const newAvatar = prompt('Nhập URL avatar mới:')
    if (newAvatar) localAvatarUrl.value = newAvatar
  }

  const removeAvatar = () => {
    if (confirm('Bạn có chắc muốn xóa avatar?')) {
      localAvatarUrl.value = ''
    }
  }

  // Cập nhật thông tin
  const updateProfile = () => {
    alert(`Thông tin đã cập nhật:\nHọ và tên: ${localFullname.value}\nSố điện thoại: ${localPhone.value}`)
  }
</script>

<template>
  <div class="container mt-4">
    <div class="card shadow-sm p-4 mx-auto" style="max-width: 800px">
      <h2 class="text-center mb-4">Thay đổi thông tin cá nhân</h2>

      <!-- Avatar -->
      <div class="text-center mb-3">
        <div class="position-relative d-inline-block">
          <img :src="localAvatarUrl" alt="User Avatar" class="rounded-circle border avatar-img" v-if="localAvatarUrl" />
          <div v-else class="avatar-placeholder rounded-circle">Không có avatar</div>
        </div>

        <div class="mt-2">
          <button @click="changeAvatar" class="btn btn-primary btn-sm">Thay đổi Avatar</button>
          <button @click="removeAvatar" class="btn btn-outline-danger btn-sm ms-2">Xóa Avatar</button>
        </div>
      </div>

      <!-- Form -->
      <div class="mb-3 form-floating">
        <input v-model="localPhone" type="text" class="form-control" id="phoneInput" placeholder="Nhập số điện thoại" />
        <label for="phoneInput">Số điện thoại</label>
      </div>

      <div class="mb-3 form-floating">
        <input v-model="localFullname" type="text" class="form-control" id="fullnameInput" placeholder="Nhập họ và tên" />
        <label for="fullnameInput">Họ và tên</label>
      </div>

      <button @click="updateProfile" class="btn btn-danger w-100">Cập nhật</button>
    </div>
  </div>
</template>

<style scoped>
  .avatar-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 4px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }



  .avatar-placeholder {
    width: 100px;
    height: 100px;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
    font-size: 14px;
  }
</style>
