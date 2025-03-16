/*
 * File: UploadImages.vue
 */

<script setup lang="ts">
  import { ref, watch, defineProps, defineEmits, onMounted } from 'vue'
  import draggable from 'vuedraggable'
  import { message } from 'ant-design-vue'
  import { UploadOutlined } from '@ant-design/icons-vue'


  interface ImageItem {
    id?: string | null
    path: string
    file?: File
    order: number
  }

  const props = defineProps<{ images: ImageItem[] }>()
  const emit = defineEmits(['update'])

  const imageToReturn = ref<ImageItem[]>([])
  onMounted(() => {
    imageToReturn.value = props.images.map((img, index) => ({
      id: img.id,
      path: img.path,
      file: undefined,
      order: index + 1
    }))

  })

  watch(
    imageToReturn,
    () => {
      emit('update', imageToReturn.value)
    },
    { deep: true }
  )


  const MAX_IMAGES = 10 // Giới hạn số ảnh
  const handleUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files) return

    const selectedFiles = Array.from(input.files)
    if (imageToReturn.value.length + selectedFiles.length > MAX_IMAGES) {
      message.error(`Bạn chỉ có thể tải lên tối đa ${MAX_IMAGES} ảnh.`)
      return
    }

    selectedFiles.forEach((file) => {
      const url = URL.createObjectURL(file)
      imageToReturn.value.push({
        id: null,
        path: url,
        file,
        order: imageToReturn.value.length + 1
      })
    })

    input.value = ''
    message.success('Ảnh đã được thêm vào danh sách!')
  }

  const removeImage = (index: number) => {
    const image = imageToReturn.value[index]

    if (image.file) {
      URL.revokeObjectURL(image.path)
    }

    imageToReturn.value.splice(index, 1)
    message.success('Ảnh đã được xóa!')
    updateOrder();
  }

  const updateOrder = () => {
    imageToReturn.value.forEach((image, index) => {
      image.order = index + 1
    })
  }


</script>


<template>
  <div class="mt-3" style="min-height: 500px">

    <input  id="fileInput" type="file" multiple accept="image/*" class="d-none" @change="handleUpload" />
    <label for="fileInput" class="btn  btn-danger">
        <UploadOutlined /> Tải ảnh
    </label>
    <draggable
      v-model="imageToReturn"
      item-key="id"
      class="row"
      @end="updateOrder"
    >
      <template #item="{ element, index }">
        <div class="col-3 image-item">
          <div class="card shadow-sm">
            <img :src="element.path" class="card-img-top image-preview"  alt=""/>
            <div class="card-body text-center">
              <span class="badge bg-secondary">{{ element.order }}</span>
              <a-button  type="ghost" size="small" class="ms-2 mt-2 text-danger border" @click="removeImage(index)">
                Xóa
              </a-button>
            </div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped>
  .image-item {
    padding: 10px;
  }

  .card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.2s;
  }

  .card:hover {
    transform: scale(1.05);
  }

  .image-preview {
    height: 15vw;
    object-fit: cover;
    border-radius: 10px 10px 0 0;
  }

</style>

