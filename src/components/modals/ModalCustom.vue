<template>
  <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="customModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="customModalLabel">Tùy chỉnh</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input v-model="custom" type="text" class="form-control" placeholder="Nhập tùy chỉnh..." />
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

const props = defineProps(['modalId', 'initialCustom']);
const emit = defineEmits(['submit']);
const custom = ref('');

watch(() => props.initialCustom, (newVal) => {
  if (newVal !== undefined && custom.value === '') {
    custom.value = newVal || '';
  }
}, { immediate: true });

const submit = () => {
  emit('submit', { custom: custom.value });
};
</script>
