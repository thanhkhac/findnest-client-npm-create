<template>
  <div class="search-bar mb-4">
    <div class="btn-group">
      <button class="btn btn-outline-primary" @click="openModal('textModal')">Text</button>
      <button class="btn btn-outline-primary" @click="openModal('rangeModal')">Range</button>
      <button class="btn btn-outline-primary" @click="openModal('fileModal')">File</button>
      <button class="btn btn-outline-primary" @click="openModal('customModal')">Custom</button>
    </div>

    <ModalText ref="textModal" modal-id="textModal" :initial-text="initialData.text" @submit="submitModal" />
    <ModalRange ref="rangeModal" modal-id="rangeModal" :initial-range="initialData.range" @submit="submitModal" />
    <ModalFile ref="fileModal" modal-id="fileModal" :initial-file="initialData.file" @submit="submitModal" />
    <ModalCustom ref="customModal" modal-id="customModal" :initial-custom="initialData.custom" @submit="submitModal" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Modal } from 'bootstrap';
import ModalText from '@/components/modals/ModalText.vue'
import ModalRange from '@/components/modals/ModalRange.vue'
import ModalFile from '@/components/modals/ModalFile.vue'
import ModalCustom from '@/components/modals/ModalCustom.vue'

const emit = defineEmits(['update-form']);
defineProps(['initialData']);
const textModal = ref(null);
const rangeModal = ref(null);
const fileModal = ref(null);
const customModal = ref(null);

const modals = ref({});

onMounted(() => {
  modals.value.textModal = new Modal(document.getElementById('textModal'));
  modals.value.rangeModal = new Modal(document.getElementById('rangeModal'));
  modals.value.fileModal = new Modal(document.getElementById('fileModal'));
  modals.value.customModal = new Modal(document.getElementById('customModal'));
});

const openModal = (modalId) => {
  modals.value[modalId].show();
};

const submitModal = (data) => {
  emit('update-form', data);
  modals.value[Object.keys(data)[0] + 'Modal'].hide(); // Ẩn modal tương ứng
};
</script>
