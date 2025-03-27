<template>
  <div class="row justify-content-center border border-1 rounded-3 p-4">
    <div class="col-md-4">
      <h1>Đăng ký</h1>
      <section>
        <a-form ref="registerForm" :model="newUser" :rules="rules" @submit.prevent="handleRegister">
          <hr />
          <a-form-item name="fullName">
            <a-input v-model:value="newUser.fullName" class="form-control" placeholder="Họ và tên" type="text" />
          </a-form-item>
          <a-form-item name="userName">
            <a-input v-model:value="newUser.userName" class="form-control" placeholder="Tên đăng nhập" type="text" />
          </a-form-item>
          <a-form-item name="email">
            <a-input v-model:value="newUser.email" class="form-control" placeholder="Email" type="email" />
          </a-form-item>
          <a-form-item name="password">
            <a-input v-model:value="newUser.password" class="form-control" placeholder="Mật khẩu" type="password" />
          </a-form-item>
          <!-- Thêm switch tại đây -->
          <div class="mb-3">
            <label class="form-label fw-bold">Đăng ký với tư cách:</label>
            <div class="d-flex align-items-center">
              <a-switch v-model:checked="isLandlord"
              un-checked-children="Người thuê"
              checked-children="Chủ trọ"/>
            </div>
          </div>
          <div class="mb-3">
            <a-button size="large" type="primary" html-type="submit" class="w-100 btn btn-lg btn-danger rounded-pill fw-bold">
              Đăng ký
            </a-button>
          </div>
        </a-form>
      </section>
      <section>
        <hr />
        <div>
          <p>
            <button class="btn border border-1 w-100">
              <i class="fab fa-google" aria-hidden="true" />
              Đăng ký với Google
            </button>
          </p>
        </div>
      </section>
    </div>
    <div class="col-md-4">
      <img src="@/assets/image/Login.jpg" class="w-100 d-none d-md-block" />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import authService from '@/api/services/authService.ts'
  const isLandlord = ref(false);

  const newUser = ref({
    fullName: '',
    userName: '',
    password: '',
    email: ''
  });

  const rules = {
    fullName: [{ required: true, message: 'Họ và tên không được để trống', trigger: 'blur' }],
    userName: [{ required: true, message: 'Tên đăng nhập không được để trống', trigger: 'blur' }],
    email: [
      { required: true, message: 'Email không được để trống', trigger: 'blur' },
      { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
    ],
    password: [{ required: true, message: 'Mật khẩu không được để trống', trigger: 'blur' }]
  };

  const router = useRouter();
  const registerForm = ref(null);

  const handleRegister = async () => {
    try {
      await authService.register(newUser.value);
      message.success('Đăng ký thành công!');
      await router.push('/login');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);

      if (error.response && error.response.data) {
        const { message: errorMessage, errors } = error.response.data;

        if (errors) {
          Object.keys(errors).forEach((key) => {
            if (key === 'PasswordTooShort') {
              message.error('Mật khẩu phải có ít nhất 8 ký tự.');
            } else if (key === 'PasswordRequiresDigit') {
              message.error('Mật khẩu phải chứa ít nhất một chữ số (0-9).');
            } else if (key === 'DuplicateEmail') {
              message.error('Email đã được sử dụng.');
            } else if (key === 'DuplicateUserName') {
              message.error('Username đã được sử dụng.');
            } else {
              message.error(errors[key].join('\n'));
            }
          });
        } else {
          message.error(errorMessage || 'Đăng ký thất bại, vui lòng thử lại!');
        }
      } else {
        message.error('Đăng ký thất bại, vui lòng thử lại!');
      }
    }
  };

</script>

<style scoped>
  /* Add any additional styles if needed */
</style>
