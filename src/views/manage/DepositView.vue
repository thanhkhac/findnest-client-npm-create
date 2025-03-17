<script setup lang="ts">
  import { ref } from 'vue'

  // State để quản lý dữ liệu
  const currentBalance = ref(2500000) // Số dư hiện tại mặc định
  const depositAmount = ref('') // Số tiền nạp
  const qrCodeUrl = ref('') // URL mã QR

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

  // Hàm tạo mã QR (giả lập, bạn có thể tích hợp API thực tế)
  const generateQRCode = () => {
    const amount = parseInt(depositAmount.value.replace(/[^0-9]/g, '')) || 0
    if (amount > 0 && amount <= 100000000) {
      // Giả lập URL mã QR (thay bằng API tạo QR thực tế)
      qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Nap%20tien%20${amount}VND`
    } else {
      alert('Vui lòng nhập số tiền hợp lệ (tối đa 100,000,000 VNĐ)!')
      qrCodeUrl.value = ''
    }
  }

  // Hàm reset sau khi nạp
  const reset = () => {
    depositAmount.value = ''
    qrCodeUrl.value = ''
    // Cập nhật số dư (giả lập)
    currentBalance.value += parseInt(depositAmount.value.replace(/[^0-9]/g, '')) || 0
  }
</script>

<template>
  <div class="container mt-4">
    <div class="card p-4 shadow-sm mx-auto" style="max-width: 800px">
      <h2 class="text-center mb-4">Nạp tiền</h2>

      <div class="card bg-danger text-white text-center mb-4 p-3">
        <h6 class="mb-0">Số dư hiện tại</h6>
        <h4 class="mb-0">{{ currentBalance.toLocaleString() }} VNĐ</h4>
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

<style scoped>
  /* Thêm style tùy chỉnh nếu cần */
  .card {
    border: none;
    border-radius: 10px;
  }

  .img-thumbnail {
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    .card {
      padding: 15px;
    }

    .img-thumbnail {
      width: 120px;
      height: 120px;
    }
  }
</style>