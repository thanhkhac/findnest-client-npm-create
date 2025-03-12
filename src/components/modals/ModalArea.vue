<!--Area.vue-->
<script setup>
import { reactive, ref, watch } from 'vue'

const visible = ref(false);
const state = reactive({
  minArea: 0,
  maxArea: 1000
});

const openModal = () => (visible.value = true);
const closeModal = () => (visible.value = false);

const reset = () => {
  state.minArea = 0;
  state.maxArea = 1000;
};

const save = () => {
  console.log("Min Area:", state.minArea);
  console.log("Max Area:", state.maxArea);
  closeModal();
};

// Cập nhật giá trị khi chọn preset
const presetRanges = [
  [10, 20],
  [20, 30],
  [30, 50],
  [50, 100],
  [100, 200],
  [200, 500]
];


watch(state, () => {
  emit('update', {
    minArea: state.minArea,
    maxArea: state.maxArea,
  })
}, );


const setAreaRange = (preset) => {
  state.minArea = preset[0];
  state.maxArea = preset[1];
};



const emit = defineEmits(['update'])

</script>

<template>
  <div>
    <a-button type="default" @click="openModal">Diện tích</a-button>

    <a-modal v-model:open="visible" title="Nhập khoảng diện tích" @cancel="save">
      <div class="mb-3">
        <label>Diện tích</label>
        <a-slider
          :value="[state.minArea, state.maxArea]"
          @update:value="([min, max]) => { state.minArea = min; state.maxArea = max; }"
          range
          :min="0"
          :max="1000"
          :step="5"
          tooltip-placement="top"
          :tooltip-formatter="(value) => value + ' m²'"
        />
      </div>

      <!-- Lựa chọn sẵn -->
      <div class="d-flex flex-wrap gap-2">
        <a-button
          v-for="(preset, index) in presetRanges"
          :key="index"
          @click="setAreaRange(preset)"
        >
          {{ preset[0] }} - {{ preset[1] }} m²
        </a-button>
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
