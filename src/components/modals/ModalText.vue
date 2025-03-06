<template>
  <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="textModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="textModalLabel">Nhập Text</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input v-model="text" type="text" class="form-control" placeholder="Nhập text..." />
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

const props = defineProps(['modalId', 'initialText']);
const emit = defineEmits(['submit']);
const text = ref('');

// Đồng bộ với initialText khi modal mở
watch(() => props.initialText, (newVal) => {
  if (newVal !== undefined && text.value === '') {
    text.value = newVal || '';
  }
}, { immediate: true });

const submit = () => {
  emit('submit', { text: text.value });
};
</script>
