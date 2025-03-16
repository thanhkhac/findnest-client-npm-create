<!--ModalPrice.vue-->
<script setup>
import { reactive, watch, ref, nextTick } from 'vue';

const emit = defineEmits(['update']) // 🔹 Thêm emit event

const visible = ref(false);
const hasUpdated = ref(false);
const state = reactive({
  isAllPrice: true,
  isNegotiable: false,
  minPrice: 0,
  maxPrice: 20_000_000
});

const openModal = () => (visible.value = true);
const closeModal = () => (visible.value = false);

const reset = () => {
  hasUpdated.value = true; // Ngăn watcher chạy
  state.minPrice= 0;
  state.maxPrice= 20_000_000;
  state.isNegotiable = false;

  nextTick(() => {
    state.isAllPrice = true;
    hasUpdated.value = false;
  });
};

const save = () => {
  emit('update', {
    isNegotiatedPrice: state.isNegotiable,
    isAllPrice: state.isAllPrice,
    minPrice: state.minPrice,
    maxPrice: state.maxPrice
  });
  closeModal();
};

watch(
  () => [state.isNegotiable, state.minPrice, state.maxPrice],
  () => {
    if (!hasUpdated.value) {
      state.isAllPrice = false;
      console.log('Updated isAllPrice');
      hasUpdated.value = true; // Đánh dấu đã cập nhật lần đầu tiên
    }
  },
  { deep: true }
);

const updatePriceRange = (newValue) => {
  state.minPrice = newValue[0];
  state.maxPrice = newValue[1];
  console.log('Hello')
};

</script>

<template>
  <div>
    <a-button type="default" @click="openModal">Nhập khoảng giá</a-button>

    <a-modal v-model:open="visible" title="Nhập khoảng giá" @cancel="save">
      <div class="mb-3">
        <a-switch v-model:checked="state.isAllPrice" />
        <span class="ms-2">Mọi giá</span>
      </div>
      <div class="mb-3">
        <a-checkbox v-model:checked="state.isNegotiable">Giá thỏa thuận</a-checkbox>
      </div>

      <div class="mb-3">
        <label>Khoảng giá</label>
        <a-slider
          :value="[state.minPrice, state.maxPrice]"
          range
          :min="0"
          :max="20_000_000"
          :step="500_000"
          tooltip-placement="top"
          :tooltip-formatter="(value) => value.toLocaleString('vi-VN') + ' đ'"
          @update:value="updatePriceRange"
        />
        <div class="text-center mt-2">
          {{ state.minPrice.toLocaleString('vi-VN') }} đ -
          {{ state.maxPrice.toLocaleString('vi-VN') }} đ
        </div>
      </div>
      <template #footer>
        <div class="d-flex justify-content-between gap-2">
          <a-button @click="reset">Đặt lại</a-button>
          <a-button type="primary" @click="save">Lưu</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
