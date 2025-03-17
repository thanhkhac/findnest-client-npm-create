<!-- src/components/ChangePasswordView.vue -->
<script setup lang="ts">
  import { ref } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import axios from 'axios';

  // Định nghĩa interface cho form data
  interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  // Khởi tạo form data
  const formState = ref<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Ref cho form để validate
  const formRef = ref();

  // Rules validation
  const rules = {
    currentPassword: [
      { required: true, message: 'Vui lòng nhập mật khẩu hiện tại', trigger: 'blur' },
    ],
    newPassword: [
      { required: true, message: 'Vui lòng nhập mật khẩu mới', trigger: 'blur' },
      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' },
    ],
    confirmPassword: [
      { required: true, message: 'Vui lòng xác nhận mật khẩu', trigger: 'blur' },
      {
        validator: (_: any, value: string) =>
          value === formState.value.newPassword
            ? Promise.resolve()
            : Promise.reject('Mật khẩu xác nhận không khớp'),
        trigger: 'blur',
      },
    ],
  };

  // Xử lý submit form
  const onSubmit = async () => {
    try {
      await formRef.value.validate();

      const payload = {
        currentPassword: formState.value.currentPassword,
        newPassword: formState.value.newPassword,
      };

      // Gọi API
      const response = await axios.post('/api/change-password', payload);

      if (response.data.success) {
        message.success('Đổi mật khẩu thành công!');
        formRef.value.resetFields(); // Reset form sau khi thành công
      } else {
        message.error(response.data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.message || 'Lỗi server');
      } else if (error.fields) {
        message.error('Vui lòng kiểm tra lại thông tin');
      } else {
        message.error('Đã có lỗi xảy ra');
      }
    }
  };

  // Reset form
  const onReset = () => {
    formRef.value.resetFields();
  };
</script>

<template>
  <a-card title="Thay đổi mật khẩu">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      @finish="onSubmit"
    >
      <a-form-item label="Mật khẩu hiện tại" name="currentPassword">
        <a-input-password v-model:value="formState.currentPassword" placeholder="Nhập mật khẩu hiện tại" />
      </a-form-item>

      <a-form-item label="Mật khẩu mới" name="newPassword">
        <a-input-password v-model:value="formState.newPassword" placeholder="Nhập mật khẩu mới" />
      </a-form-item>

      <a-form-item label="Xác nhận mật khẩu" name="confirmPassword">
        <a-input-password v-model:value="formState.confirmPassword" placeholder="Xác nhận mật khẩu" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading">
          Đổi mật khẩu
        </a-button>
        <a-button style="margin-left: 10px" @click="onReset">
          Reset
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<style scoped>
  /* Tùy chỉnh style nếu cần */
  .ant-card {
    max-width: 500px;
    margin: 0 auto;
  }
</style>