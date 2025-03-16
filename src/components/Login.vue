<template>
      <div class="row justify-content-center border border-1 rounded-3 p-4">
        <div class="col-md-4">
          <h1>Đăng nhập</h1>
          <section>
            <a-form
              ref="loginForm"
              :model="credentials"
              :rules="rules"
              @submit.prevent="handleLogin"
            >
              <hr />
              <a-form-item name="username">
                <a-input
                  v-model:value="credentials.username"
                  class="form-control"
                  placeholder="Email hoặc Tên đăng nhập"
                  type="text"
                  autocomplete="username"
                />
              </a-form-item>
              <a-form-item name="password">
                <a-input
                  v-model:value="credentials.password"
                  class="form-control"
                  placeholder="Mật khẩu"
                  type="password"
                  autocomplete="current-password"
                />
              </a-form-item>
              <div class="mb-3">
                <a-button
                  size="large"
                  type="primary"
                  html-type="submit"
                  class="w-100 btn btn-lg btn-danger rounded-pill fw-bold"
                >
                  Đăng nhập
                </a-button>
              </div>
              <div class="checkbox mb-3 d-flex align-content-end justify-content-between">
                <a class="text-danger">
                  Quên mật khẩu?
                </a>
              </div>
            </a-form>
          </section>
          <section>
            <hr />
            <div>
              <p>
                <button class="btn border border-1 w-100">
                  <i class="fab fa-google" aria-hidden="true" />
                  Đăng nhập với Google
                </button>
              </p>
            </div>
          </section>
        </div>
        <div class="col-md-4">
          <img src="https://findnest.site/image/Login.jpg" class="w-100 d-none d-md-block">
        </div>
      </div>
    </template>

    <script setup>
    import { ref, nextTick } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuth } from '@/composables/useAuth';

    const credentials = ref({
      username: '',
      password: ''
    });

    const rules = {
      username: [
        { required: true, message: 'Email hoặc Tên đăng nhập không được để trống', trigger: 'blur' },
      ],
      password: [
        { required: true, message: 'Mật khẩu không được để trống', trigger: 'blur' },
      ],
    };

    const { login } = useAuth();
    const router = useRouter();
    const loginForm = ref(null);

    const handleLogin = async () => {
      try {
        await nextTick();
        await loginForm.value.validate();
        await login(credentials.value);
        window.location.href = '/';
      } catch (error) {
        console.error('Login failed:', error);
      }
    };
    </script>

    <style scoped>
    /* Add any additional styles if needed */
    </style>