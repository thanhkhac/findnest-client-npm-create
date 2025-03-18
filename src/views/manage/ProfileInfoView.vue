<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useAuth } from '@/composables/useAuth'
  import userManageService from '@/api/services/userManageService'
  import { BASE_URL } from '@/api'
  import { message } from 'ant-design-vue'

  const { user, fetchUser } = useAuth()

  const localFullname = ref('')
  const localPhone = ref('')
  const localZalo = ref('')
  const localAvatarUrl = ref('')
  const localUsername = ref('')
  const localBalance = ref(0)
  const avatarFile = ref<File | null>(null)

  onMounted(async () => {
    if (!user.value) {
      await fetchUser()
    }
    localFullname.value = user.value?.fullName || ''
    localPhone.value = user.value?.contactPhoneNumber || ''
    localZalo.value = user.value?.zalo || ''
    localAvatarUrl.value = BASE_URL + user.value?.avatar || ''
    localUsername.value = user.value?.userName || ''
    localBalance.value = user.value?.balance || 0
  })

  const selectAvatar = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      avatarFile.value = input.files[0]
      localAvatarUrl.value = URL.createObjectURL(avatarFile.value)
    }
  }

  const updateAvatar = async () => {
    if (!avatarFile.value) return alert('Vui lòng chọn ảnh trước!')
    try {
      const formData = new FormData()
      formData.append('avatarFile', avatarFile.value)
      await userManageService.updateAvatar(formData)
      message.success('Cập nhật avatar thành công!')
    } catch (error) {
      message.error('Cập nhật avatar thất bại, vui lòng thử lại!')
    }
  }

  const updateProfile = async () => {
    try {
      const contactInfoData = {
        fullName: localFullname.value,
        contactPhoneNumber: localPhone.value,
        zalo: localZalo.value
      }
      await userManageService.updateContactInfo(contactInfoData)
      message.success('Cập nhật thông tin thành công!')
    } catch (error) {
      message.error('Cập nhật thông tin thất bại, vui lòng thử lại!')
    }
  }
</script>

<template>
  <div class="container mt-4">
    <div class="card shadow-sm p-4 mx-auto" style="max-width: 800px">
      <h2 class="text-center mb-4">Thay đổi thông tin cá nhân</h2>

      <div class="mb-3 form-floating">
        <input :value="localUsername" type="text" class="form-control" id="usernameInput" disabled />
        <label for="usernameInput">Tên đăng nhập</label>
      </div>

      <div class="mb-3 form-floating">
        <input :value="localBalance.toLocaleString('vi-VN') + ' VNĐ'" type="text" class="form-control" id="balanceInput" disabled />
        <label for="balanceInput">Số dư</label>
      </div>

      <div class="text-center mb-3">
        <div class="position-relative d-inline-block">
          <img :src="localAvatarUrl" alt="User Avatar" class="rounded-circle border avatar-img" v-if="localAvatarUrl" />
          <div v-else class="avatar-placeholder rounded-circle">Không có avatar</div>
        </div>

        <div class="mt-2">
          <label for="avatarInput" class="btn btn-primary btn-sm">
            Chọn ảnh
            <input type="file" id="avatarInput" @change="selectAvatar" hidden accept="image/*" />
          </label>
          <button @click="updateAvatar" class="btn btn-danger btn-sm ms-2">Cập nhật</button>
        </div>
      </div>

      <div class="mb-3 form-floating">
        <input v-model="localPhone" type="text" class="form-control" id="phoneInput" />
        <label for="phoneInput">Số điện thoại</label>
      </div>

      <div class="mb-3 form-floating">
        <input v-model="localZalo" type="text" class="form-control" id="zaloInput" />
        <label for="zaloInput">Zalo</label>
      </div>

      <div class="mb-3 form-floating">
        <input v-model="localFullname" type="text" class="form-control" id="fullnameInput" />
        <label for="fullnameInput">Họ và tên</label>
      </div>

      <button @click="updateProfile" class="btn btn-danger w-100">Cập nhật Thông tin</button>
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