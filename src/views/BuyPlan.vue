<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { BASE_URL } from '@/api'
import { message } from 'ant-design-vue'
import postService from '@/api/services/postService'
import planService from '@/api/services/planService'
import { Plan, PurchaseHistory } from '@/types/plan'

// Định nghĩa interface
interface Post {
  id: string
  title: string
  price: string | number
  area: number
  regionAddress: string
  thumbnail: string
}

// Biến state
const route = useRoute()
const postId = route.params.id as string
const post = ref<Post>({} as Post)
const plans = ref<Plan[]>([])
const purchaseHistory = ref<PurchaseHistory[]>([])
const loading = ref<boolean>(false)
const historyLoading = ref<boolean>(false)

// Biến modal
const visibleModal = ref<boolean>(false)
const selectedPlan = ref<Plan | null>(null)

const getBorderColor = (priority: number): string => {
  switch (priority) {
    case 1:
      return '#ff4d4f'
    case 2:
      return '#fa8c16'
    case 3:
      return '#fadb14'
    default:
      return '#555555'
  }
}

// Fetch plans
const fetchPlans = async (): Promise<void> => {
  loading.value = true
  try {
    const response = await planService.getPlans()
    plans.value = response.data
  } catch (error: any) {
    message.error(error.message)
  } finally {
    loading.value = false
  }
}

// Fetch bài đăng
const fetchPost = async (): Promise<void> => {
  try {
    const response = await postService.getPost(postId)
    const postData = response.data
    post.value = {
      id: postData.id,
      title: postData.title,
      price: postData.price,
      area: postData.area,
      regionAddress: `${postData.address}, ${postData.ward.fullName}, ${postData.district.fullName}, ${postData.province.fullName}`,
      thumbnail: postData.thumbnail,
    }
  } catch (error: any) {
    message.error(error.message)
  }
}

// Fetch lịch sử mua gói
const fetchPurchaseHistory = async (): Promise<void> => {
  historyLoading.value = true
  try {
    const response = await planService.getPurchaseHistory(postId)
    purchaseHistory.value = response.data
  } catch (error: any) {
    message.error(error.message)
  } finally {
    historyLoading.value = false
  }
}

// Mở modal
const showBuyModal = (planId: number): void => {
  const plan = plans.value.find((p) => p.id === planId)
  if (!plan) {
    message.error('Không tìm thấy plan')
    return
  }
  selectedPlan.value = plan
  visibleModal.value = true
}

// Xác nhận mua
const confirmBuyPlan = async (): Promise<void> => {
  if (!selectedPlan.value) return

  try {
    await planService.buyPlan(postId, selectedPlan.value.id)
    message.success(`Đã mua thành công plan ${selectedPlan.value.id} cho bài đăng ${postId}`)
    visibleModal.value = false
    await fetchPurchaseHistory()

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error: any) {
    message.error(error.message)
  }
}

onMounted(() => {
  fetchPost()
  fetchPlans()
  fetchPurchaseHistory()
})

// Format ngày
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('vi-VN')
}
</script>

<template>
  <div class="container buy-plan-page">
    <div class="card p-3 mb-4">
      <h5 class="card-title">Thông tin bài đăng</h5>
      <div class="d-flex align-items-center flex-column flex-md-row">
        <img :src="BASE_URL + post.thumbnail" class="thumbnail mb-3 mb-md-0" alt="Thumbnail" />
        <div class="ms-md-3 text-center text-md-start">
          <h6>{{ post.title }}</h6>
          <p class="text-muted mb-0">
            {{ Number(post.price).toLocaleString() }} VNĐ - {{ post.area }}m² -
            {{ post.regionAddress }}
          </p>
        </div>
      </div>
    </div>

    <div class="card p-3 mb-4">
      <h5 class="card-title">Chọn gói ưu tiên</h5>
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary"></div>
      </div>
      <div v-else class="row">
        <div class="col-12 col-md-4 mb-3" v-for="plan in plans" :key="plan.id">
          <div class="card plan-card" :style="{ borderColor: getBorderColor(plan.priorityLevel) }">
            <div class="card-header text-center">
              <strong :style="{ color: getBorderColor(plan.priorityLevel) }">
                Độ ưu tiên {{ plan.priorityLevel }}
              </strong>
            </div>
            <div class="card-body">
              <p>Thời gian: {{ plan.duration }} ngày</p>
              <p>Giá: {{ plan.price.toLocaleString() }} VNĐ</p>
              <button class="btn btn-warning w-100" @click="showBuyModal(plan.id)">
                Chọn gói này
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-3">
      <h5 class="card-title">Lịch sử mua gói</h5>
      <div v-if="historyLoading" class="text-center">
        <div class="spinner-border text-primary"></div>
      </div>
      <div v-else-if="purchaseHistory.length === 0" class="text-center text-muted">
        Chưa có lịch sử mua gói
      </div>
      <table v-else class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Gói</th>
            <th>Độ ưu tiên</th>
            <th>Thời gian</th>
            <th>Giá</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="history in purchaseHistory" :key="history.id">
            <td>{{ history.id.slice(0, 8) }}...</td>
            <td>{{ history.planId }}</td>
            <td>{{ history.plan.priorityLevel }}</td>
            <td>{{ history.plan.duration }} ngày</td>
            <td>{{ history.plan.price.toLocaleString() }} VNĐ</td>
            <td>{{ formatDate(history.startDate) }}</td>
            <td>{{ formatDate(history.endDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <a-modal
      v-model:open="visibleModal"
      title="Xác nhận mua gói"
      okText="Xác nhận"
      cancelText="Hủy"
      @ok="confirmBuyPlan"
    >
      <div v-if="selectedPlan">
        <p>
          Bạn có chắc chắn muốn mua gói này cho bài đăng "<strong>{{ post.title }}</strong
          >"?
        </p>
        <p>
          Độ ưu tiên: <strong>{{ selectedPlan.priorityLevel }}</strong>
        </p>
        <p>
          Thời gian: <strong>{{ selectedPlan.duration }}</strong> ngày
        </p>
        <p>
          Giá: <strong>{{ selectedPlan.price.toLocaleString() }}</strong> VNĐ
        </p>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.buy-plan-page {
  max-width: 1200px;
  margin: auto;
  padding: 15px;
}

.thumbnail {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 5px;
}

.plan-card {
  border-width: 2px;
  border-radius: 10px;
  transition: transform 0.2s;
}

.plan-card:hover {
  transform: translateY(-5px);
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.btn-warning {
  background-color: #fa8c16;
  border-color: #fa8c16;
  color: white;
}

.btn-warning:hover {
  background-color: #e07b13;
  border-color: #e07b13;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .thumbnail {
    width: 100%;
    height: auto;
    max-width: 200px;
  }

  .d-flex {
    flex-direction: column;
    text-align: center;
  }

  .ms-md-3 {
    margin-left: 0 !important;
    margin-top: 10px;
  }

  .table {
    font-size: 14px;
  }

  .table th,
  .table td {
    padding: 8px;
  }
}

@media (max-width: 575px) {
  .buy-plan-page {
    padding: 10px;
  }

  .card {
    padding: 10px !important;
  }
}
</style>
