import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap';
import Antd from 'ant-design-vue';
import "leaflet/dist/leaflet.css";


import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(Antd);
app.use(createPinia())
app.use(router)

router.afterEach((to) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', 'G-7W3SMN53WZ', {
      'page_path': to.path,
    });
  }
});

app.mount('#app')
