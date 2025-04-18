<script setup lang="ts">
  import { ref } from 'vue'
  import paymentService from '@/api/services/userManageService'
  import { message } from 'ant-design-vue'
  import { useAuth } from '@/composables/useAuth'

  // State
  const { user, fetchUser } = useAuth() // Lấy thông tin user từ useAuth
  const depositAmount = ref<string>('') // Số tiền nạp
  const qrCodeUrl = ref<string>('') // URL mã QR

  // Hàm xử lý khi nhập số tiền
  const handleDepositInput = (event: Event) => {
    const input = (event.target as HTMLInputElement).value
    const amount = parseInt(input.replace(/[^0-9]/g, '')) || 0
    if (amount > 100000000) {
      depositAmount.value = '100000000'
    } else {
      depositAmount.value = amount.toLocaleString()
    }
  }

  // Hàm tạo mã QR
  const generateQRCode = async () => {
    const amount = parseInt(depositAmount.value.replace(/[^0-9]/g, '')) || 0
    if (amount < 20000 || amount > 100000000) {
      message.error('Vui lòng nhập số tiền hợp lệ (tối thiểu 20,000 VNĐ và tối đa 100,000,000 VNĐ)!')
      return
    }

    try {
      const response = await paymentService.depositMoney(amount)
      qrCodeUrl.value = response.url // API trả về URL mã QR
    } catch (error) {
      message.error('Không thể tạo mã QR, vui lòng thử lại!')
    }
  }

  // Hàm reset sau khi nạp
  const reset = async () => {
    depositAmount.value = ''
    qrCodeUrl.value = ''
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
</script>

<template>
  <div class="container mt-4">
    <div class="card p-4 shadow-sm mx-auto" style="max-width: 800px">
      <h2 class="text-center mb-4">Nạp tiền</h2>

      <div class="card bg-danger text-white text-center mb-4 p-3">
        <h6 class="mb-0">Số dư hiện tại</h6>
        <h4 class="mb-0">
          {{ user?.balance !== undefined ? Number(user.balance).toLocaleString() : '0' }} VNĐ
        </h4>
      </div>

      <div class="mb-3">
        <label for="depositAmount" class="form-label">Số tiền nạp (tối đa 100,000,000 VNĐ)</label>
        <input
          id="depositAmount"
          v-model="depositAmount"
          type="text"
          class="form-control"
          placeholder="Nhập số tiền"
          @input="handleDepositInput"
        />
        <small class="text-muted">* Do chi phí hệ thống, số tiền nạp tối thiểu là 20,000 VNĐ.</small>
      </div>

      <button @click="generateQRCode" class="btn btn-primary w-100 mb-3" :disabled="!depositAmount">
        Tạo mã QR
      </button>

      <div v-if="qrCodeUrl" class="text-center">
        <div class="mb-3">
          <img :src="qrCodeUrl" alt="QR Code" class="img-thumbnail" style="width: 150px; height: 150px;" />
        </div>
        <p class="mb-2">Quét mã QR để nạp tiền: {{ depositAmount }} VNĐ</p>
        <button @click="reset" class="btn btn-success w-100">Hoàn tất nạp tiền</button>
      </div>
    </div>
  </div>
</template>