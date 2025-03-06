<template>
  <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="fileModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="fileModalLabel">Tải lên file</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input type="file" class="form-control" @change="handleFile" />
          <small v-if="file">{{ file.name }}</small>
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

const props = defineProps(['modalId', 'initialFile']);
const emit = defineEmits(['submit']);
const file = ref(null);

watch(() => props.initialFile, (newVal) => {
  if (newVal && !file.value) {
    file.value = newVal;
  }
}, { immediate: true });

const handleFile = (e) => {
  file.value = e.target.files[0];
};

const submit = () => {
  emit('submit', { file: file.value });
};
</script>
