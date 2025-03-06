<template>
  <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="rangeModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="rangeModalLabel">Nhập khoảng số</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col">
              <input v-model.number="range.min" type="number" class="form-control" placeholder="Min" />
            </div>
            <div class="col">
              <input v-model.number="range.max" type="number" class="form-control" placeholder="Max" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          <button type="button" class="btn btn-primary" @click="submit">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['modalId', 'initialRange']);
const emit = defineEmits(['submit']);
const range = ref({ min: 0, max: 100 });

watch(() => props.initialRange, (newVal) => {
  if (newVal && range.value.min === 0 && range.value.max === 100) {
    range.value = { min: newVal.min || 0, max: newVal.max || 100 };
  }
}, { immediate: true, deep: true });

const submit = () => {
  emit('submit', { range: { ...range.value } });
};
</script>
